// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.7.0;
pragma experimental ABIEncoderV2;  

contract Kyc {
  address public admin;
  struct Customer {
      address custAddress;
      string jsonHash;
      string photoHash;
      string citizenship_front_hash;
      string citizenship_back_hash;
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
      address custAddress;
  }

  constructor() public {
      admin = msg.sender;
  }

  mapping(address => Customer) customers;
  mapping(address => Organization) organizations;
  mapping(address => kycRequest) kycrequestsbyorg;

  event orgAdded(string name,address ethAddress);
  event orgRemoved(address ethAddress);
  event customerAdded(address custAddress,bool kycStatus);
  event customerUpdated(address custAddress,bool kycStatus);
  event requestAdded(uint reqid,address ethAddress, address custAddress,bool isAllowed);
  event requestRemoved(uint reqid,address ethAddress);
  event accessGiven(uint reqid,address custAddress,address ethAddress,bool isAllowed);
  event accessRevoked(address custAddress,address ethAddress);

// Checks whether the requestor is admin
  modifier isAdmin {
      require(
          admin == msg.sender,
          "Only admin are allowed"
      );
      _;
  }

// Checks wheter the org exists or not
  modifier isOrgValid {
      require(
          organizations[msg.sender].ethAddress == msg.sender,
          "Unauthenticated organization | Not added by admin"    
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

//Check if request exist 
  function findRequest(address _custaddress) internal view returns(bool){
      uint i=0;
      for(i;i<kycrequestsbyorg[msg.sender].req_count;i++){
          if(kycrequestsbyorg[msg.sender].kycrequestlist[i].custAddress==_custaddress){
              return true;
          }
      }
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
  function viewOrg(address _ethAddress)public isAdmin view returns(string memory){
      require(organizations[_ethAddress].ethAddress==_ethAddress,"Org doesnt exist");
      return(organizations[_ethAddress].name);
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

//Register User KYC by registered Orgs
  function registerKYC(address _custaddress,string memory _jsonHash,string memory _photohash,string memory _citizenship_front_hash,string memory _citizenship_back_hash,bool _kycStatus) public payable isOrgValid returns(bool){
      require(customers[_custaddress].custAddress!=_custaddress,"User already exists");
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
      requestKYC(_custaddress);
      emit customerAdded(_custaddress,_kycStatus);
      return true;
  }

//View User KYC by Authorized Orgs  
  function viewKYC(address _custaddress) public view returns(address,string memory,string memory,bool,address[] memory,string memory,string memory){
      require(findOrg(_custaddress,msg.sender),"User hasnt given their consent");
      return(customers[_custaddress].custAddress,customers[_custaddress].jsonHash,customers[_custaddress].photoHash,customers[_custaddress].kycStatus,customers[_custaddress].organization,customers[_custaddress].citizenship_front_hash,customers[_custaddress].citizenship_back_hash);
  }

//Update User KYC by registered and authorized orgs
  function updateKYC(address _custaddress,string memory _jsonHash,string memory _photohash,string memory _citizenship_front_hash,string memory _citizenship_back_hash,bool _kycStatus) public isOrgValid returns(bool){
      require(customers[_custaddress].custAddress==_custaddress,"User doesn't exist");
      require(findOrg(_custaddress,msg.sender),"You dont have access to this user");
      customers[_custaddress].custAddress=_custaddress;
      customers[_custaddress].jsonHash=_jsonHash;
      customers[_custaddress].photoHash=_photohash;
      customers[_custaddress].citizenship_front_hash=_citizenship_front_hash;
      customers[_custaddress].citizenship_back_hash=_citizenship_back_hash;
      customers[_custaddress].kycStatus=_kycStatus;
      emit customerUpdated(_custaddress,_kycStatus);
      return true;
  }

//Remove User KYC by Orgs  
  function removeKYC(address _custaddress) public isOrgValid returns (bool){
      require(customers[_custaddress].custAddress==_custaddress,"User doesn't exist");
      require(findOrg(_custaddress,msg.sender),"You dont have access to this user");
      uint i=findOrgIndex(_custaddress,msg.sender);
      customers[_custaddress].organization[i]=customers[_custaddress].organization[customers[_custaddress].organization.length-1];
      customers[_custaddress].organization.pop();
  }

//Request User KYC by Orgs  
  function requestKYC(address _custaddress) public isOrgValid returns(bool){
      require(customers[_custaddress].custAddress==_custaddress,"Customer doesnt exists");
      require(findOrg(_custaddress,msg.sender)==false,"Already have access");
      require(findRequest(_custaddress)==false,"Request Already Exists");
      kycrequestsbyorg[msg.sender].kycrequestlist.push(kycRequestList(kycrequestsbyorg[msg.sender].req_count,_custaddress));
      kycrequestsbyorg[msg.sender].req_count++;
      emit requestAdded(kycrequestsbyorg[msg.sender].req_count-1,msg.sender,_custaddress,false);
      return true;
  }

//Delete User KYC Request By Orgs 
  function deleteRequest(uint _reqcount,address _ethAddress) public{
      require(organizations[_ethAddress].ethAddress==_ethAddress,"This particular organizations doesnt exist");
      require(kycrequestsbyorg[_ethAddress].kycrequestlist[_reqcount].req_count==_reqcount,"Request doesnt exist");
      kycrequestsbyorg[_ethAddress].kycrequestlist[_reqcount]=kycrequestsbyorg[_ethAddress].kycrequestlist[kycrequestsbyorg[_ethAddress].kycrequestlist.length-1];
      kycrequestsbyorg[_ethAddress].kycrequestlist.pop();
      if(kycrequestsbyorg[_ethAddress].req_count>1){
          kycrequestsbyorg[_ethAddress].kycrequestlist[_reqcount].req_count=_reqcount;
      }
      kycrequestsbyorg[_ethAddress].req_count--;
      emit requestRemoved(_reqcount,_ethAddress);
  }

//View specific request by Orgs
  function viewRequest(uint _reqcount) public isOrgValid view returns(uint, address){
      require(kycrequestsbyorg[msg.sender].ethAddress==msg.sender,"You are not authorized");
      return(kycrequestsbyorg[msg.sender].kycrequestlist[_reqcount].req_count,kycrequestsbyorg[msg.sender].kycrequestlist[_reqcount].custAddress);
  }

//Return Array of all pending request of the orgs
  function listRequest() public isOrgValid view returns(kycRequestList[] memory,uint){
      kycRequestList[] memory ret =  new kycRequestList[](kycrequestsbyorg[msg.sender].req_count);
      uint j = 0;
        for (uint i = 0; i < kycrequestsbyorg[msg.sender].req_count; i++) {
            ret[j] = kycrequestsbyorg[msg.sender].kycrequestlist[i];
            j++;
                
        }
    return (ret,ret.length);
  }

//Give User KYC access to Org
  function giveAccessKYC(uint _reqcount,address _ethAddress,bool _isAllowed) public returns(bool){
      require(customers[msg.sender].custAddress==msg.sender,"You dont have authority to give access");
      require(kycrequestsbyorg[_ethAddress].kycrequestlist[_reqcount].req_count==_reqcount,"Requests not found");
      if(_isAllowed == true){
          if(findOrg(msg.sender,_ethAddress) == false){
              customers[msg.sender].organization.push(_ethAddress);
          }
          deleteRequest(_reqcount,_ethAddress);
          emit accessGiven(_reqcount,msg.sender,_ethAddress,_isAllowed);
      }
      
  }

//Revoke User KYC access of Orgs
  function revokeAccessKYC(address _ethAddress) public returns(bool){
      require(customers[msg.sender].custAddress==msg.sender,"You dont have authority to revoke access");
      require(findOrg(msg.sender,_ethAddress),"You dont have access to this user");
      uint i=findOrgIndex(msg.sender,_ethAddress);
      customers[msg.sender].organization[i]=customers[msg.sender].organization[customers[msg.sender].organization.length-1];
      customers[msg.sender].organization.pop();
      emit accessRevoked(msg.sender,_ethAddress);
  }
  
}
