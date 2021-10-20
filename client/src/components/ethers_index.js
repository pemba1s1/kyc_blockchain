import React,{Component} from 'react'
import Kyc from "../contracts/Kyc.json";
import { ethers } from "ethers";

const provider = new ethers.providers.Web3Provider(window.ethereum)
export default class Ethers extends Component {

    async componentDidMount() {
        await this.loadWeb3()
        await this.deploy()
        console.log(this.state.kyc)
    }

    async loadWeb3() {
        if (window.ethereum) {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
        }
        else {
          window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
        }
      }

    deploy = async() => {
        const ethereum = window.ethereum
        //Load account
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        this.setState({account : accounts[0]})
        //Network ID
        const networkId = await ethereum.request({ method: 'net_version' })
        const networkData = Kyc.networks[networkId]
        //IF got connection, get data from contracts
        if(networkData){
          const kyc = new ethers.Contract(networkData.address,Kyc.abi,provider)
          this.setState({kyc});
          let valid=kyc.validAdmin({from:this.state.account}).then(res=>{
              console.log(res)
          })
          console.log(valid)
        }else{
          window.alert('KYC contract not deployed on this network')
        }
    };

    constructor(props){
        super(props);
        this.state={
            account:'',
            kyc:{}
        }
    }
    render(){
        return(
            <div>
                hello
            </div>
        )
    }
}
