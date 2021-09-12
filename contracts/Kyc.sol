// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.7.0;
pragma experimental ABIEncoderV2;  

contract Kyc {
  address public admin;
  struct Customer {
      uint uname;
      string name;
      string location;
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
      uint uname;
  }

  constructor() public {
      admin = msg.sender;
  }

  mapping(uint => Customer) customers;
  mapping(address => Organization) organizations;
  mapping(address => kycRequest) kycrequestsbyorg;

  event orgAdded(string name,address ethAddress);
  event orgRemoved(address ethAddress);
  event customerAdded(uint uname,string name,string location,bool kycStatus);
  event customerUpdated(uint uname,string name,string location,bool kycStatus);
  event requestAdded(uint reqid,address ethAddress, uint uname,bool isAllowed);
  event requestRemoved(uint reqid,address ethAddress);
  event accessGiven(uint reqid,uint uname,address ethAddress,bool isAllowed);
  event accessRevoked(uint uname,address ethAddress);

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
  function findOrg(uint _uname,address ethAddress) internal view returns(bool){
      uint i = 0;
          for(i;i<customers[_uname].organization.length;i++){
              if(customers[_uname].organization[i]==ethAddress){
                  return true;
              }
          }
  }

//Find the index of Org in KYC.organization array
  function findOrgIndex(uint _uname,address ethAddress) internal view returns(uint){
      uint i = 0;
      for(i;i<customers[_uname].organization.length;i++){
            if(customers[_uname].organization[i]==ethAddress){
                return i;
            }
    }
  }

//Check if request exist 
  function findRequest(uint _uname) internal view returns(bool){
      uint i=0;
      for(i;i<kycrequestsbyorg[msg.sender].req_count;i++){
          if(kycrequestsbyorg[msg.sender].kycrequestlist[i].uname==_uname){
              return true;
          }
      }
  }

//Add organization ONLY BY ADMIN
  function addOrg(string memory _name,address _ethAddress) public isAdmin returns(string memory) {
      require(organizations[_ethAddress].ethAddress!=_ethAddress,"Org already added");
      organizations[_ethAddress]=Organization(_name,_ethAddress);
      kycrequestsbyorg[_ethAddress].ethAddress=_ethAddress;
      kycrequestsbyorg[_ethAddress].req_count=0;
      emit orgAdded(_name,_ethAddress);
      return ("OK");
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

//Register User KYC by registered Orgs
  function registerKYC(uint _uname , string memory _name, string memory _location,bool _kycStatus) public payable isOrgValid returns(bool){
      require(customers[_uname].uname!=_uname,"User already exists");
      customers[_uname].uname=_uname;
      customers[_uname].name=_name;
      customers[_uname].location=_location;
      customers[_uname].kycStatus=_kycStatus;
      requestKYC(_uname);
      giveAccessKYC(kycrequestsbyorg[msg.sender].req_count -1,_uname,msg.sender,true);
      emit customerAdded(_uname,_name,_location,_kycStatus);
      return true;
  }

//View User KYC by Authorized Orgs  
  function viewKYC(uint _uname) public view returns(uint,string memory,string memory,bool,address[] memory,uint){
      require(findOrg(_uname,msg.sender),"User hasnt given their consent");
      return(customers[_uname].uname,customers[_uname].name,customers[_uname].location,customers[_uname].kycStatus,customers[_uname].organization,customers[_uname].organization.length);
  }

//Update User KYC by registered and authorized orgs
  function updateKYC(uint _uname , string memory _name, string memory _location,bool _kycStatus) public isOrgValid returns(bool){
      require(customers[_uname].uname==_uname,"User doesn't exist");
      require(findOrg(_uname,msg.sender),"You dont have access to this user");
      customers[_uname].uname=_uname;
      customers[_uname].name=_name;
      customers[_uname].location=_location;
      customers[_uname].kycStatus=_kycStatus;
      emit customerUpdated(_uname,_name,_location,_kycStatus);
      return true;
  }

//Remove User KYC by Orgs  
  function removeKYC(uint _uname) public isOrgValid returns (bool){
      require(customers[_uname].uname==_uname,"User doesn't exist");
      require(findOrg(_uname,msg.sender),"You dont have access to this user");
      uint i=findOrgIndex(_uname,msg.sender);
      customers[_uname].organization[i]=customers[_uname].organization[customers[_uname].organization.length-1];
      customers[_uname].organization.pop();
  }

//Request User KYC by Orgs  
  function requestKYC(uint _uname) public isOrgValid returns(bool){
      require(customers[_uname].uname==_uname,"Customer doesnt exists");
      require(findOrg(_uname,msg.sender)==false,"Already have access");
      require(findRequest(_uname)==false,"Request Already Exists");
      kycrequestsbyorg[msg.sender].kycrequestlist.push(kycRequestList(kycrequestsbyorg[msg.sender].req_count,_uname));
      kycrequestsbyorg[msg.sender].req_count++;
      emit requestAdded(kycrequestsbyorg[msg.sender].req_count-1,msg.sender,_uname,false);
      return true;
  }

//Delete User KYC Request By Orgs 
  function deleteRequest(uint _reqcount) public isOrgValid{
      require(kycrequestsbyorg[msg.sender].kycrequestlist[_reqcount].req_count==_reqcount,"Request doesnt exist");
      kycrequestsbyorg[msg.sender].kycrequestlist[_reqcount]=kycrequestsbyorg[msg.sender].kycrequestlist[kycrequestsbyorg[msg.sender].kycrequestlist.length-1];
      kycrequestsbyorg[msg.sender].kycrequestlist.pop();
      if(kycrequestsbyorg[msg.sender].req_count>1){
          kycrequestsbyorg[msg.sender].kycrequestlist[_reqcount].req_count=_reqcount;
      }
      kycrequestsbyorg[msg.sender].req_count--;
      emit requestRemoved(_reqcount,msg.sender);
  }

//View specific request by Orgs
  function viewRequest(uint _reqcount) public isOrgValid view returns(uint, uint){
      require(kycrequestsbyorg[msg.sender].ethAddress==msg.sender,"You are not authorized");
      return(kycrequestsbyorg[msg.sender].kycrequestlist[_reqcount].req_count,kycrequestsbyorg[msg.sender].kycrequestlist[_reqcount].uname);
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
  function giveAccessKYC(uint _reqcount,uint _uname,address _ethAddress,bool _isAllowed) public returns(bool){
      require(kycrequestsbyorg[_ethAddress].kycrequestlist[_reqcount].req_count==_reqcount,"Requests not found");
      if(_isAllowed == true){
          if(findOrg(_uname,msg.sender) == false){
              customers[_uname].organization.push(_ethAddress);
          }
          deleteRequest(_reqcount);
          emit accessGiven(_reqcount,_uname,_ethAddress,_isAllowed);
      }
      
  }

//Revoke User KYC access of Orgs
  function revokeAccessKYC(uint _uname,address _ethAddress) public returns(bool){
      require(customers[_uname].uname==_uname,"User doesn't exist");
      require(findOrg(_uname,_ethAddress),"You dont have access to this user");
      uint i=findOrgIndex(_uname,_ethAddress);
      customers[_uname].organization[i]=customers[_uname].organization[customers[_uname].organization.length-1];
      customers[_uname].organization.pop();
      emit accessRevoked(_uname,_ethAddress);
  }
  
}
