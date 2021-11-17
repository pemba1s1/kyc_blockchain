import React, { Component } from "react";
import Kyc from "../../contracts/Kyc.json";
import NavBar from './NavBar'
import 'bootstrap/dist/css/bootstrap.min.css'
import Container from "react-bootstrap/esm/Container";
import { BrowserRouter as Router,Switch,Route } from "react-router-dom";
import Addkyc from "./addKyc";
import Viewkyc from "./viewKyc";
import Requestkyc from "./requestKyc";
import Updatekyc from "./updateKyc";
import Deleterequest from "./deleteRequest";
import Listrequest from "./list_request";
import { NotFound } from "../404";
import { ethers } from "ethers";
import OrgProfile from "../orgProfile";
import { getKey,encrypt } from "../../rsa/Rsa";

const provider = new ethers.providers.Web3Provider(window.ethereum)
const signer = provider.getSigner(0)


const {create} = require('ipfs-http-client')
const ipfs = create({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })

class Org extends Component {
  async componentDidMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
    
    let key = await getKey()
    this.setState({key})
    console.log(this.state.key)
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
      this.setState({kyc});
      this.setState({kyc1});
      await kyc.validOrg({from:this.state.account}).then(res=>{
        this.setState({validOrg:res})
      })
      this.setState({loadingorg:false})
      kyc.getYourOrgDetail({from:this.state.account}).then(res=>{
        this.setState({orgDetail:res})
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


  handleSubmit = async(event) => {
    event.preventDefault()
    this.setState({loading:true})
    let s = await encrypt(JSON.stringify(this.state.data),this.state.key[0],this.state.key[2])
    await ipfs.add(s).then(result=>{
      this.setState({jsonHash:result.cid.toV1().toString()})
      console.log(this.state.jsonHash)
    },error=>{  
      console.log(error)
    })
    await ipfs.add(this.state.p_photo).then(result=>{
      this.setState({photo_hash:result.cid.toV1().toString()})
      console.log(this.state.photo_hash)
    },error=>{
      console.log(error)
    })
    await ipfs.add(this.state.citizenship_front).then(result=>{
      this.setState({citizenship_front_hash:result.cid.toV1().toString()})
    },error=>{
      console.log(error)
    })
    await ipfs.add(this.state.citizenship_back).then(result=>{
      this.setState({citizenship_back_hash:result.cid.toV1().toString()})
    },error=>{
      console.log(error)
    })
    this.state.kyc1.registerKYC(this.state.eth_address,this.state.jsonHash,this.state.photo_hash,this.state.citizenship_front_hash,this.state.citizenship_back_hash,true,this.state.key[1],this.state.key[2],{from:this.state.account})
    .then((res)=>{
      this.setState({loading : false})
      this.setState({added:res})
    }).catch(err=>{
      this.setState({loading : false})
      if(err.message==="MetaMask Tx Signature: User denied transaction signature."){
        this.setState({
          error:true,
          errormsg:err.message
        })
      }
      else{
        this.setState({
          error:true,
          errormsg:err.data.message
        })
      }
    })
  }

  updateKyc = async (event) =>{
    event.preventDefault()
    this.setState({loading:true})
    let s = await encrypt(JSON.stringify(this.state.data),this.state.key[0],this.state.key[2])
    await ipfs.add(s).then(result=>{
      this.setState({jsonHash:result.cid.toV1().toString()})
    },error=>{
      console.log(error)
    })
    await ipfs.add(this.state.p_photo).then(result=>{
      this.setState({photo_hash:result.cid.toV1().toString()})
      console.log(this.state.photo_hash)
    },error=>{
      console.log(error)
    })
    await ipfs.add(this.state.citizenship_front).then(result=>{
      this.setState({citizenship_front_hash:result.cid.toV1().toString()})
    },error=>{
      console.log(error)
    })
    await ipfs.add(this.state.citizenship_back).then(result=>{
      this.setState({citizenship_back_hash:result.cid.toV1().toString()})
    },error=>{
      console.log(error)
    })
    this.state.kyc1.updateKYC(this.state.eth_address,this.state.jsonHash,this.state.photo_hash,this.state.citizenship_front_hash,this.state.citizenship_back_hash,true,this.state.key[1],this.state.key[2],{from:this.state.account})
    .then((res)=>{
      this.setState({loading : false})
      this.setState({added:res})
    }).catch(err=>{
      this.setState({loading : false})
      if(err.message==="MetaMask Tx Signature: User denied transaction signature."){
        this.setState({
          error:true,
          errormsg:err.message
        })
      }
      else{
        this.setState({
          error:true,
          errormsg:err.data.message
        })
      }
    })
  }

  handleJsonChange = (event) => {
    const target = event.target
    const name = target.name
    const value = target.value
    this.setState({data:{
      ...this.state.data,
      [name]:value
    }})
  }
  handleChange = (event) => {
    const target = event.target
    const name = target.name
    const value = target.value
    this.setState({[name]:value})
  }
  captureFile = (event) => {
    const name = event.target.name
    const file = event.target.files[0]
    let fr = new FileReader();
    fr.onload = function(e) {
      let textread = e.target.result;
      let enc = encrypt(textread,this.state.key[0],this.state.key[2])
      console.log(textread)
      this.setState({[name]:enc})
      console.log(this.state.p_photo)
    }.bind(this)
    fr.readAsDataURL(file);
  }

  onRequest = (event) =>{
    event.preventDefault();
    this.setState({loading:true})
    this.state.kyc1.requestKYC(this.state.eth_address,{from:this.state.account})
    .then((req)=>{
      this.setState({loading : false})
      this.setState({req})
      console.log(req)
    }).catch(err=>{
      this.setState({
        loading:false
      })
      if(err.message==="MetaMask Tx Signature: User denied transaction signature."){
        this.setState({
          error:true,
          errormsg:err.message
        })
      }
      else{
        this.setState({
          error:true,
          errormsg:err.data.message
        })
      }
    })
  }

  onDeleteRequest =  (event)=>{
    event.preventDefault()
    this.setState({loading:true})
    this.state.kyc1.deleteRequestOrg(this.state.req_count,{from:this.state.account})
      .then((del) => {
        this.setState({
         loading:false
       })
        this.setState({del})
      }).catch(err=>{
        this.setState({loading : false})
        if(err.message==="MetaMask Tx Signature: User denied transaction signature."){
          this.setState({
            error:true,
            errormsg:err.message
          })
        }
        else{
          this.setState({
            error:true,
            errormsg:"Request doesnt exist"
          })
        }
      })
  }

  cleanState = () => {
    this.setState({
      error:false,
      errormsg:"",
      loading:false,
      req:""
    })
  }

  constructor(props){
    super(props);
    this.state={
      account : '',
      kyc :{},
      kyc1 :{},
      orgDetail : '',
      validOrg: false,
      loading:false,
      loadingorg:true,
      data : {},
      jsonHash : '',
      photo_hash :'',
      citizenship_front_hash : '',
      citizenship_back_hash:'',
      p_photo : '',
      citizenship_front :'',
      citizenship_back: '',
      eth_address:'',
      added:'',
      req:'',
      req_count:'',
      del:'',
      custDetail:'',
      error:false,
      errormsg:''
    }
  }

  render() {
    const validOrg = this.state.validOrg
    let content
    if(this.state.loadingorg){
      content = <Container style={{textAlign: "center",paddingTop:"30px"}}><h2>Loading....</h2></Container>
    }
    else{
      content = validOrg ? 
      <>
        <NavBar account={this.state.account} />
        <Switch>
          <Route exact path="/Organization/">
            <OrgProfile orgDetail={this.state.orgDetail}/>
          </Route>
          <Route exact path="/Organization/add">
            <Addkyc 
            cleanState={this.cleanState}
            error={this.state.error} 
            errormsg={this.state.errormsg}
            added={this.state.added}
            loading={this.state.loading}
            captureFile={this.captureFile}
            handleSubmit={this.handleSubmit} 
            handleChange={this.handleChange} 
            handleJsonChange={this.handleJsonChange}/>
          </Route>
          <Route exact path="/Organization/view">
            <Viewkyc 
            account={this.state.account} 
            kyc={this.state.kyc} 
            kyc1={this.state.kyc1}/>
          </Route>
          <Route exact path="/Organization/request">
            <Requestkyc
            cleanState={this.cleanState}
            error={this.state.error} 
            errormsg={this.state.errormsg}
            req={this.state.req}
            loading={this.state.loading}
            onRequest={this.onRequest}
            handleChange  ={this.handleChange} />
          </Route>
          <Route exact path="/Organization/update/">
            <Updatekyc
            cleanState={this.cleanState}
            error={this.state.error} 
            errormsg={this.state.errormsg}
            added={this.state.added}
            loading={this.state.loading}
            captureFile={this.captureFile}
            updateKyc={this.updateKyc} 
            handleChange={this.handleChange} 
            handleJsonChange={this.handleJsonChange} />
          </Route>
          <Route exact path="/Organization/delete">
            <Deleterequest
            cleanState={this.cleanState}
            error={this.state.error} 
            errormsg={this.state.errormsg}
            del={this.state.del}
            loading={this.state.loading}
            onDeleteRequest={this.onDeleteRequest}
            handleChange={this.handleChange} />
          </Route>
          <Route exact path="/Organization/list">
            <Listrequest
            kyc={this.state.kyc}
            kyc1={this.state.kyc1}
            account={this.state.account}
            handleChange={this.handleChange}
            onDeleteRequest={this.onDeleteRequest} />
          </Route>
          <Route path="*">
            <NotFound />
          </Route>
        </Switch>
      </>      
      :
      <Container style={{textAlign: "center",paddingTop:"30px"}}>
        <h2>Only Organization added by admin are allowed</h2>
        <p>Contact Admin if you want to gain access..</p>
      </Container>
    }
    return (
      <Router>
        {content}
      </Router>
      
      
    );
  }
}

export default Org;
