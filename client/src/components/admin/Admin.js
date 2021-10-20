import React, { Component } from "react";
import Kyc from "../../contracts/Kyc.json";
import 'bootstrap/dist/css/bootstrap.min.css'
import NavBar from './NavBar'
import Vieworg from './view_org'
import Removeorg from './remove_org'
import Addorg from './add_org'
import {BrowserRouter as Router,Route,Switch} from 'react-router-dom'
import Container from "react-bootstrap/esm/Container";
import { NotFound } from "../404";
import { ethers } from "ethers";

const provider = new ethers.providers.Web3Provider(window.ethereum)
const signer = provider.getSigner(0)
export default class Admin extends Component {
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
      const kyc = new ethers.Contract(networkData.address,Kyc.abi,provider)
      const kyc1 = new ethers.Contract(networkData.address,Kyc.abi,signer)
      this.setState({kyc1})
      this.setState({kyc});
      await kyc.validAdmin({from:this.state.account}).then(res=>{
        this.setState({validAdmin:res})
          })
      this.setState({loadingadmin:false})
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

  handleSubmit = (event) => {
    event.preventDefault();
    this.setState({loading:true})
    let added=this.state.kyc1.addOrg(this.state.orgName,this.state.ethAddress,{from:this.state.account})
    .then((hash)=>{
      this.setState({loading : false,added:added})
    }).catch(err=>{
      console.log(err.message)
    })
  }

  handleChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
        [name]:value
    })
  }

  viewOrg = (event) => {
    event.preventDefault();
    let orgDetail = this.state.kyc.viewOrg(this.state.address,{from:this.state.account})
    orgDetail.then(result=>{
        this.setState({orgDetail:result});
      } ).catch(err=>{
        console.log(err.message)
      })
      
  }

  removeOrg = (event) =>{
    event.preventDefault();
    this.setState({loading:true})
    let removed = this.state.kyc1.removeOrg(this.state.address,{from:this.state.account})
    .then((hash)=>{
      this.setState({loading : false})
      this.setState({removed})
    }).catch(err=>{
      console.log(err.message)
    })
  }

  
 
  constructor(props){
    super(props);
    this.state={
      validAdmin:'false',
      orgName:'',
      ethAddress:'',
      account:'',
      kyc:{},
      kyc1:{},
      address:'',
      orgDetail:'',
      added: '',
      removed:'',
      loading:'',
      loadingadmin:'true'
    }
  }

  render() {
    const validAdmin = this.state.validAdmin
    let content 
    if(this.state.loadingadmin){
      content = <Container style={{textAlign: "center",paddingTop:"30px"}}><h2>Loading....</h2></Container>
    }else{
      content = validAdmin?
      <>
      <NavBar account={this.state.account}/>
      <Switch>
        <Route exact path="/admin/">
        </Route>
        <Route exact path="/admin/add">
          <Addorg loading={this.state.loading} added={this.state.added} orgName={this.state.orgName} ethAddress={this.state.ethAddress} handleSubmit={this.handleSubmit} handleChange={this.handleChange} />
        </Route>
        <Route exact path='/admin/view'>
          <Vieworg orgDetail={this.state.orgDetail} address={this.state.address} viewOrg={this.viewOrg} handleChange={this.handleChange}/>
        </Route>
        <Route exact path="/admin/remove">
          <Removeorg loading={this.state.loading} removed={this.state.removed} address={this.state.address} removeOrg={this.removeOrg} handleChange={this.handleChange}/>
        </Route>
        <Route path="*">
          <NotFound />
        </Route>
      </Switch>
      </> 
      :
      <Container style={{textAlign: "center",paddingTop:"30px"}}><h2>Only Admin are allowed</h2></Container>
    }
    return ( 
      <Router>
      {content}
      </Router>
    );

    
  }
  
}


