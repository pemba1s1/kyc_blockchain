// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Kyc {
  address public admin;
  struct Customer {
      address custAddress;
      string jsonHash;
      string photoHash;
      string citizenship_front_hash;
      string citizenship_back_hash;
      uint d;
      uint n;
      address[] organization;
      bool kycStatus;
  }

  struct Organization {
      string name;
      address ethAddress;
  }

  struct kycRequest{
      address ethAddress;
      uint req_count;
      kycRequestList[] kycrequestlist;
  }
  
  struct kycRequestList{
      uint req_count;
      address Address;
  }
  
  struct kycRequestCust{
      kycRequestList[] kycrequestlist;
      address custAddress;
  }

  constructor()  {
      admin = msg.sender;
  }

  mapping(address => Customer) customers;
  mapping(address => Organization) organizations;
  mapping(address => kycRequest) kycrequestsbyorg;
  mapping(address => kycRequestCust) kycrequestsbycust;

  event orgAdded(string name,address ethAddress);
  event orgRemoved(address ethAddress);
  event customerAdded(address custAddress,bool kycStatus);
  event customerUpdated(address custAddress,bool kycStatus);
  event requestAdded(uint reqid,address ethAddress, address custAddress,bool isAllowed);
  event requestRemoved(uint reqid,address ethAddress);
  event accessGiven(uint reqid,address custAddress,address ethAddress,bool isAllowed);
  event accessRevoked(address custAddress,address ethAddress);
  event kycRemoved(address custAddress,address ethAddress);

// Checks whether the requestor is admin
  modifier isAdmin {
      require(
          admin == msg.sender,
          "Admin only"
      );
      _;
  }

// Checks wheter the org exists or not
  modifier isOrgValid {
      require(
          organizations[msg.sender].ethAddress == msg.sender,
          "Org not exist"    
      );
      _;
  }

//Check if Org has access to the user KYC
  function findOrg(address _custaddress,address ethAddress) internal view returns(bool){
      uint i = 0;
          for(i;i<customers[_custaddress].organization.length;i++){
              if(customers[_custaddress].organization[i]==ethAddress){
                  return true;
              }
          }
          return false;
  }

//Find the index of Org in KYC.organization array
  function findOrgIndex(address _custaddress,address ethAddress) internal view returns(uint){
      uint i = 0;
      for(i;i<customers[_custaddress].organization.length;i++){
            if(customers[_custaddress].organization[i]==ethAddress){
                return i;
            }
    }
  }
  
  function findRequestIndex(address _custaddress,address _ethAddress) internal view returns(uint){
      uint i = 0;
      for(i;i<kycrequestsbycust[_custaddress].kycrequestlist.length;i++){
            if(kycrequestsbycust[_custaddress].kycrequestlist[i].Address==_ethAddress){
                return i;
            }
    }
  }

//Check if request exist 
  function findRequest(address _custaddress) internal view returns(bool){
      uint i=0;
      for(i;i<kycrequestsbyorg[msg.sender].req_count;i++){
          if(kycrequestsbyorg[msg.sender].kycrequestlist[i].Address==_custaddress){
              return true;
          }
      }
      return false;
  }

//Add organization ONLY BY ADMIN
  function addOrg(string memory _name,address _ethAddress) public isAdmin returns(bool) {
      require(organizations[_ethAddress].ethAddress!=_ethAddress,"Org already added");
      organizations[_ethAddress]=Organization(_name,_ethAddress);
      kycrequestsbyorg[_ethAddress].ethAddress=_ethAddress;
      kycrequestsbyorg[_ethAddress].req_count=0;
      emit orgAdded(_name,_ethAddress);
      return true;
  }

//Remove Organization ONLY BY ADMIN 
  function removeOrg(address _ethAddress) public isAdmin returns(bool) {
      require(organizations[_ethAddress].ethAddress==_ethAddress,"Org doesnt exist");
      delete organizations[_ethAddress];
      emit orgRemoved(_ethAddress);
      return true;
  }

//Return Organization Info if it exists  
  function viewOrg(address _ethAddress)public isAdmin view returns(Organization memory){
      require(organizations[_ethAddress].ethAddress==_ethAddress,"Org doesnt exist");
      return organizations[_ethAddress];
  }

  function getYourOrgDetail() public isOrgValid view returns(Organization memory){
    return organizations[msg.sender];
  }

  function validOrg() public view returns(bool){
    if(organizations[msg.sender].ethAddress==msg.sender){
      return true;
    }
    else{
      return false;
    }
  }
  function validAdmin() public view returns(bool){
    if(admin==msg.sender){
      return true;
    }
    else{
      return false;
    }
  }
  function validCust() public view returns(bool){
    if(customers[msg.sender].custAddress==msg.sender){
      return true;
    }
    else{
      return false;
    }
  }

  function writeKYC(
    address _custaddress,
    string memory _jsonHash,
    string memory _photohash,
    string memory _citizenship_front_hash,
    string memory _citizenship_back_hash,
    bool _kycStatus,
    uint _d,
    uint _n) internal {
      require(bytes(_jsonHash).length > 0);
      require(bytes(_photohash).length > 0);
      require(bytes(_citizenship_back_hash).length > 0);
      require(bytes(_citizenship_front_hash).length > 0);
      customers[_custaddress].custAddress=_custaddress;
      customers[_custaddress].jsonHash=_jsonHash;
      customers[_custaddress].photoHash=_photohash;
      customers[_custaddress].citizenship_front_hash=_citizenship_front_hash;
      customers[_custaddress].citizenship_back_hash=_citizenship_back_hash;
      customers[_custaddress].kycStatus=_kycStatus;
      customers[_custaddress].d=_d;
      customers[_custaddress].n=_n;
      kycrequestsbycust[_custaddress].custAddress=_custaddress;
  }

//Register User KYC by registered Orgs
  function registerKYC(
    address _custaddress,
    string memory _jsonHash,
    string memory _photohash,
    string memory _citizenship_front_hash,
    string memory _citizenship_back_hash,
    bool _kycStatus,
    uint _d,
    uint _n) public isOrgValid returns(bool){
      require(customers[_custaddress].custAddress!=_custaddress,"User already exists");
      writeKYC(_custaddress,_jsonHash,_photohash,_citizenship_front_hash,_citizenship_back_hash,_kycStatus,_d,_n);
      requestKYC(_custaddress);
      emit customerAdded(_custaddress,_kycStatus);
      return true;
  }

//View User KYC by Authorized Orgs  
  function viewKYC(address _custaddress) public view 
  returns(
    bool,
    string memory,
    string memory,
    string memory,
    string memory,
    uint,
    uint)
  {
      require(findOrg(_custaddress,msg.sender),"User hasnt given their consent");
      return(customers[_custaddress].kycStatus,customers[_custaddress].jsonHash,customers[_custaddress].photoHash,customers[_custaddress].citizenship_front_hash,customers[_custaddress].citizenship_back_hash,customers[_custaddress].d,customers[_custaddress].n);
  }
  
  function viewYourKYC() public view returns(Customer memory){
      require(validCust(),'Customer not valid');
      return customers[msg.sender];
  }
  
  function viewRequestCust() public view returns(kycRequestList[] memory){
      require(validCust(),'Customer not valid');
      kycRequestList[] memory ret =  new kycRequestList[](kycrequestsbycust[msg.sender].kycrequestlist.length);
      uint j = 0;
        for (uint i = 0; i < kycrequestsbycust[msg.sender].kycrequestlist.length; i++) {
            ret[j] = kycrequestsbycust[msg.sender].kycrequestlist[i];
            j++;
                
        }
    return (ret);
  }

//Update User KYC by registered and authorized orgs
  function updateKYC(
    address _custaddress,
    string memory _jsonHash,
    string memory _photohash,
    string memory _citizenship_front_hash,
    string memory _citizenship_back_hash,
    bool _kycStatus,
    uint _d,
    uint _n) public isOrgValid returns(bool){
      require(customers[_custaddress].custAddress==_custaddress,"User doesn't exist");
      require(findOrg(_custaddress,msg.sender),"You dont have access to this user");
      writeKYC(_custaddress,_jsonHash,_photohash,_citizenship_front_hash,_citizenship_back_hash,_kycStatus,_d,_n);
      emit customerUpdated(_custaddress,_kycStatus);
      return true;
  }

//Request User KYC by Orgs  
  function requestKYC(address _custaddress) public isOrgValid returns(bool){
      require(customers[_custaddress].custAddress==_custaddress,"Customer doesnt exists");
      require(findOrg(_custaddress,msg.sender)==false,"Already have access");
      require(findRequest(_custaddress)==false,"Request Already Exists");
      kycrequestsbyorg[msg.sender].kycrequestlist.push(kycRequestList(kycrequestsbyorg[msg.sender].req_count,_custaddress));
      kycrequestsbycust[_custaddress].kycrequestlist.push(kycRequestList(kycrequestsbyorg[msg.sender].req_count,msg.sender));
      kycrequestsbyorg[msg.sender].req_count++;
      emit requestAdded(kycrequestsbyorg[msg.sender].req_count-1,msg.sender,_custaddress,false);
      return true;
  }
  
  function deleteRequest(uint _reqcount,address _custaddress,address _ethAddress) internal{
    uint index = findRequestIndex(_custaddress,_ethAddress);
    kycrequestsbyorg[_ethAddress].kycrequestlist[_reqcount]=kycrequestsbyorg[_ethAddress].kycrequestlist[kycrequestsbyorg[_ethAddress].kycrequestlist.length-1];
    kycrequestsbyorg[_ethAddress].kycrequestlist.pop();
    kycrequestsbycust[_custaddress].kycrequestlist[index]=kycrequestsbycust[_custaddress].kycrequestlist[kycrequestsbycust[_custaddress].kycrequestlist.length-1];
    kycrequestsbycust[_custaddress].kycrequestlist.pop();
    if(kycrequestsbyorg[msg.sender].kycrequestlist.length!=_reqcount && kycrequestsbyorg[_ethAddress].req_count>1){
        kycrequestsbyorg[_ethAddress].kycrequestlist[_reqcount].req_count=_reqcount;
        address add = kycrequestsbyorg[_ethAddress].kycrequestlist[_reqcount].Address;
        if(kycrequestsbycust[add].kycrequestlist.length>0){
            index = findRequestIndex(add, _ethAddress);
            kycrequestsbycust[add].kycrequestlist[index].req_count=_reqcount;
        }
        
     }
    kycrequestsbyorg[_ethAddress].req_count--;
    emit requestRemoved(_reqcount,_ethAddress);
  }

//Delete User KYC request by organization
  function deleteRequestOrg(uint _reqcount) public isOrgValid returns(bool){
    require(kycrequestsbyorg[msg.sender].ethAddress==msg.sender,"You dont have authority to delete");
    require(kycrequestsbyorg[msg.sender].kycrequestlist[_reqcount].req_count==_reqcount,"Request doesnt exist");
    address _custaddress = kycrequestsbyorg[msg.sender].kycrequestlist[_reqcount].Address;
    deleteRequest(_reqcount,_custaddress,msg.sender);
    return true;
  }

//Delete User KYC Request after user provides access 
  function deleteRequestCust(uint _reqcount,address _ethAddress) public{
      require(organizations[_ethAddress].ethAddress==_ethAddress,"This particular organizations doesnt exist");
      require(kycrequestsbyorg[_ethAddress].kycrequestlist[_reqcount].Address==msg.sender,"User not valid");
      require(kycrequestsbyorg[_ethAddress].kycrequestlist[_reqcount].req_count==_reqcount,"Request doesnt exist");
      deleteRequest(_reqcount,msg.sender,_ethAddress);
  }



//Return Array of all pending request of the orgs
  function listRequest() public isOrgValid view returns(kycRequestList[] memory){
      kycRequestList[] memory ret =  new kycRequestList[](kycrequestsbyorg[msg.sender].req_count);
      uint j = 0;
        for (uint i = 0; i < kycrequestsbyorg[msg.sender].req_count; i++) {
            ret[j] = kycrequestsbyorg[msg.sender].kycrequestlist[i];
            j++;
                
        }
    return (ret);
  }

//Give User KYC access to Org
  function giveAccessKYC(uint _reqcount,address _ethAddress,bool _isAllowed) public returns(bool){
      require(customers[msg.sender].custAddress==msg.sender,"You dont have authority to give access");
      require(kycrequestsbyorg[_ethAddress].kycrequestlist[_reqcount].Address==msg.sender,"User not valid");
      require(kycrequestsbyorg[_ethAddress].kycrequestlist[_reqcount].req_count==_reqcount,"Requests not found");
      if(_isAllowed == true){
          if(findOrg(msg.sender,_ethAddress) == false){
              customers[msg.sender].organization.push(_ethAddress);
          }
          deleteRequestCust(_reqcount,_ethAddress);
          emit accessGiven(_reqcount,msg.sender,_ethAddress,_isAllowed);
      }
      else{
          deleteRequestCust(_reqcount,_ethAddress);
      }
      return true;
      
  }
  
  function remove(address _custaddress,address _ethAddress) internal {
      uint i=findOrgIndex(_custaddress,_ethAddress);
      customers[_custaddress].organization[i]=customers[_custaddress].organization[customers[_custaddress].organization.length-1];
      customers[_custaddress].organization.pop();
  }

//Revoke User KYC access of Orgs
  function revokeAccessKYC(address _ethAddress) public returns(bool){
      require(customers[msg.sender].custAddress==msg.sender,"You dont have authority to revoke access");
      require(findOrg(msg.sender,_ethAddress),"You dont have access to this user");
      remove(msg.sender,_ethAddress);
      emit accessRevoked(msg.sender,_ethAddress);
      return true;
  }

//Remove User KYC by Orgs  
  function removeKYC(address _custaddress) public isOrgValid returns (bool){
      require(customers[_custaddress].custAddress==_custaddress,"User doesn't exist");
      require(findOrg(_custaddress,msg.sender),"You dont have access to this user");
      remove(_custaddress,msg.sender);
      emit kycRemoved(_custaddress,msg.sender);
      return true;
  }
  
}
