import React, { Component } from "react";
import Kyc from "../../contracts/Kyc.json";
import Web3 from 'web3'
import NavBar from './NavBar'
import 'bootstrap/dist/css/bootstrap.min.css'

class Org extends Component {
  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadBlockchainData() {
    //Declare Web3
    const web3 = window.web3
    //Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({account : accounts[0]})
    //Network ID
    const networkId = await web3.eth.net.getId()
    const networkData = Kyc.networks[networkId]
    //IF got connection, get data from contracts
    if(networkData){
      const kyc = new web3.eth.Contract(Kyc.abi, networkData.address)
      this.setState({org:kyc});
      let orgName = await kyc.methods.viewOrg().call();
      this.setState({orgName})
    }else{
      window.alert('KYC contract not deployed on this network')
    }
      

  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  constructor(props){
    super(props);
    this.state={
      account : '',
      org :{},
      orgName : '',
    }
  }

  render() {
    console.log(this.state.org)
    const orgName = this.state.orgName
    return (
      <div>{validOrg ? <NavBar account={this.state.account} />:<div>Org not valid</div>}</div>
      
      
    );
  }
}

export default Org;
