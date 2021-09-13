import React, { Component } from "react";
import Kyc from "../../contracts/Kyc.json";
import Web3 from 'web3'
import NavBar from './NavBar'
import 'bootstrap/dist/css/bootstrap.min.css'
import Container from "react-bootstrap/esm/Container";
import { BrowserRouter as Router,Switch,Route } from "react-router-dom";
import Addkyc from "./addKyc";
import Viewkyc from "./viewKyc";
import Requestkyc from "./requestKyc";
import Updatekyc from "./updateKyc";

class Org extends Component {
  async componentDidMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
    document.title = this.props.title
  }
  async componentWillUnmount(){
    await window.ethereum.removeListener('accountsChanged', this.handleAccountsChanged);
  }


  async loadBlockchainData() {
    //Declare Web3
    const ethereum = window.ethereum
    let web3 = new Web3(window.ethereum)
    //Load account
    window.ethereum.on('accountsChanged',this.handleAccountsChanged)
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    this.setState({account : accounts[0]})
    //Network ID
    const networkId = await ethereum.request({ method: 'net_version' })
    console.log(networkId)
    const networkData = Kyc.networks[networkId]
    //IF got connection, get data from contracts
    if(networkData){
      const kyc = new web3.eth.Contract(Kyc.abi, networkData.address)
      this.setState({kyc});
      let validOrg = await kyc.methods.validOrg().call({from:this.state.account});
      this.setState({validOrg})
      this.setState({loading:false})
    }else{
      window.alert('KYC contract not deployed on this network')
    }
      

  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.request({ method: 'eth_requestAccounts' });
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  handleAccountsChanged = (accounts) =>{
    this.setState({account : accounts[0]})
  }

  constructor(props){
    super(props);
    this.state={
      account : '',
      org :{},
      orgName : '',
      validOrg: false,
      loading:true
    }
  }

  render() {
    console.log(this.state.org)
    const validOrg = this.state.validOrg
    let content
    if(this.state.loading){
      content = <Container style={{textAlign: "center",paddingTop:"30px"}}><h2>Loading....</h2></Container>
    }
    else{
      content = validOrg ? 
      <NavBar account={this.state.account} />:
      <Container style={{textAlign: "center",paddingTop:"30px"}}>
        <h2>Only Organization added by admin are allowed</h2>
        <p>Contact Admin if you want to gain access..</p>
      </Container>
    }
    return (
      <Router>
      <div>
        {content}
      </div>
      

      <Switch>
        <Route exact path="/Organization/add">
          <Addkyc />
        </Route>
        <Route exact path="/Organization/view">
          <Viewkyc />
        </Route>
        <Route exact path="/Organization/request">
          <Requestkyc />
        </Route>
        <Route exact path="/Organization/update">
          <Updatekyc />
        </Route>
      </Switch>
      </Router>
      
      
    );
  }
}

export default Org;
