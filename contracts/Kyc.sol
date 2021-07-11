// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.7.0;
pragma experimental ABIEncoderV2;  

contract Kyc {
  address public admin;
  uint public reqno;
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
      uint reqid;
      address ethAddress;
      uint uname;
      bool isAllowed;
  }

  constructor() public {
      admin = msg.sender;
      reqno = 0;
  }

  mapping(uint => Customer) customers;
  mapping(address => Organization) organizations;
  mapping(uint => kycRequest) kycrequests;

// Checks whether the requestor is admin
  modifier isAdmin {
      require(
          admin == msg.sender,
          "Only admin are allowed"
      );
      _;
  }

  modifier isOrgValid {
      require(
          organizations[msg.sender].ethAddress == msg.sender,
          "Unauthenticated organization | Not added by admin"    
      );
      _;
  }
  


  function addOrg(string memory _name,address _ethAddress) public isAdmin returns(bool) {
      require(organizations[_ethAddress].ethAddress!=_ethAddress,"Org already added");
      organizations[_ethAddress]=Organization(_name,_ethAddress);
  }
  
  function removeOrg(address _ethAddress) public isAdmin returns(bool) {
      require(organizations[_ethAddress].ethAddress==_ethAddress,"Org doesnt exist");
      delete organizations[_ethAddress];
  }
  
  function viewOrg(address _ethAddress)public isAdmin view returns(string memory){
      require(organizations[_ethAddress].ethAddress==_ethAddress,"Org doesnt exist");
      return(organizations[_ethAddress].name);
  }
  function registerKYC(uint _uname , string memory _name, string memory _location,bool _kycStatus) public payable isOrgValid returns(bool){
      require(customers[_uname].uname!=_uname,"User already exists");
      customers[_uname].uname=_uname;
      customers[_uname].name=_name;
      customers[_uname].location=_location;
      customers[_uname].kycStatus=_kycStatus;
      requestKYC(_uname);
      giveAccessKYC(reqno,_uname,msg.sender,true);
  }
  
  function viewKYC(uint _reqid,uint _uname) public view returns(uint,string memory,string memory,bool,address[] memory,uint){
      require(kycrequests[_reqid].uname==_uname&&kycrequests[_reqid].reqid==_reqid && kycrequests[_reqid].ethAddress==msg.sender && kycrequests[_reqid].isAllowed==true,"User hasnt given their consent");
      return(customers[_uname].uname,customers[_uname].name,customers[_uname].location,customers[_uname].kycStatus,customers[_uname].organization,customers[_uname].organization.length);
  }
  function updateKYC(uint _uname , string memory _name, string memory _location,bool _kycStatus) public isOrgValid returns(bool){
      require(customers[_uname].uname==_uname,"User doesn't exist");
      customers[_uname].uname=_uname;
      customers[_uname].name=_name;
      customers[_uname].location=_location;
      customers[_uname].kycStatus=_kycStatus;
  }
  
  
  
  function requestKYC(uint _uname) public isOrgValid{
      require(customers[_uname].uname==_uname,"Customer doesnt exists");
      reqno++;
      kycrequests[reqno] = kycRequest(reqno,msg.sender,_uname,false);
  }
  
  function deleteRequest(uint _reqid) public isOrgValid{
      require(kycrequests[_reqid].reqid==_reqid,"Request doesnt exist");
      require(kycrequests[_reqid].ethAddress==msg.sender,"You cannot remove request of other organization");
      delete kycrequests[_reqid];
  }

  function listRequest() public isOrgValid view returns(kycRequest[] memory,uint){
      kycRequest[] memory ret =  new kycRequest[](reqno);
      uint j = 0;
        for (uint i = 1; i <= reqno; i++) {
            if(kycrequests[i].ethAddress==msg.sender){
                ret[j] = kycrequests[i];
                j++;
            }
                
        }
    return (ret,ret.length);
  }

  function giveAccessKYC(uint _reqid,uint _uname,address _ethAddress,bool _isAllowed) public returns(bool){
      require(kycrequests[_reqid].reqid==_reqid,"Requests not found");
      kycrequests[_reqid].isAllowed = _isAllowed;
      if(_isAllowed == true){
          
          uint i = 0;
          bool exist = false;
          for(i;i<customers[_uname].organization.length;i++){
              if(customers[_uname].organization[i]==_ethAddress){
                  exist = true;
              }
          }
          if(exist == false){
              customers[_uname].organization.push(_ethAddress);
          }
      }else{
          uint i = 0;
          for(i;i<customers[_uname].organization.length;i++){
              if(customers[_uname].organization[i]==_ethAddress){
                 
                  customers[_uname].organization[i]=customers[_uname].organization[customers[_uname].organization.length-1];
                  customers[_uname].organization.pop();
              }
          }
      }
      
  }
  
}
