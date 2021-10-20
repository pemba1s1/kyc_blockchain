import React, { Component } from "react";
import Kyc from "../../contracts/Kyc.json";
import NavBar from './NavBar'
import { Container } from "react-bootstrap";
import { BrowserRouter as Router,Switch,Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css'
import Viewdetail from "./viewDetail";
import Viewrequest from "./viewRequest";
import Revoke from "./revoke";
import Vieworg from "./viewOrg";
import { NotFound } from "../404";
import { ethers } from "ethers";

const provider = new ethers.providers.Web3Provider(window.ethereum)
const signer = provider.getSigner(0)

class Customer extends Component {
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
    //Load account
    window.ethereum.on('accountsChanged',this.handleAccountsChanged)
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    this.setState({account : accounts[0]})
    //Network ID
    const networkId = await ethereum.request({ method: 'net_version' })
    const networkData = Kyc.networks[networkId]
    //IF got connection, get data from contracts
    if(networkData){
      this.setState({loadingcust:true})
      const kyc = new ethers.Contract(networkData.address,Kyc.abi,provider)
      const kyc1 = new ethers.Contract(networkData.address,Kyc.abi,signer)
      this.setState({kyc});
      this.setState({kyc1});
      await kyc.validCust({from:this.state.account}).then(res=>{
        this.setState({validCust:res})
      })
      this.setState({loadingcust:false})
      kyc.viewYourKYC({from:this.state.account}).then(res=>{
        this.setState({custDetail:res})
      })
    }else{
      window.alert('KYC contract not deployed on this network')
    }
      

  }
  async loadWeb3() {
    if (window.ethereum) {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  handleAccountsChanged = (accounts) =>{
    this.setState({account : accounts[0]})
    window.location.reload()
  }
  constructor(props){
    super(props);
    this.state={
      account : '',
      validCust:false,
      loadingcust:true,
      custDetail:'',
      kyc:{},
      kyc1:{}
    }
  }

  render() {
    const validCust = this.state.validCust
    let content
    if(this.state.loadingcust){
      content = <Container style={{textAlign: "center",paddingTop:"30px"}}><h2>Loading....</h2></Container>
    }
    else{
      content = validCust ? 
      <>
      <NavBar account={this.state.account} />
      <Switch>
        <Route exact path="/Customer/">
        </Route>
        <Route exact path="/Customer/view">
          <Viewdetail custDetail={this.state.custDetail}/>
        </Route>
        <Route exact path="/Customer/view_request">
          <Viewrequest account={this.state.account} kyc={this.state.kyc} kyc1={this.state.kyc1}/>
        </Route>
        <Route exact path="/Customer/revoke">
          <Revoke  account={this.state.account} kyc1={this.state.kyc1}/>
        </Route>
        <Route exact path="/Customer/view_org">
          <Vieworg custDetail={this.state.custDetail} kyc1={this.state.kyc1} account={this.state.account}/>
        </Route>
        <Route path="*">
          <NotFound />
        </Route>
      </Switch>
      </>
      :
      <Container style={{textAlign: "center",paddingTop:"30px"}}>
        <h2>Customer Address not registered</h2>
        <p>Consider changing account to registered one..</p>
      </Container>
    }
    return (
      <Router>
        {content}
      </Router>
    );
  }
}

export default Customer;
