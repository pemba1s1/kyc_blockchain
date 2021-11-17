import React,{Component} from 'react'
import { ethers } from "ethers";
import { getKey,encrypt,decrypt } from '../rsa/Rsa';
import axios from 'axios';
const provider = new ethers.providers.Web3Provider(window.ethereum)

const {create} = require('ipfs-http-client')
export default class Ethers extends Component {

    async componentDidMount() {

        
const ipfs = create({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })
    let key = await getKey();
       axios.get('https://bafybeibehatm4tvgt3rd2usbthpmvwe2veewwermqtinkcn64censn4ljy.ipfs.infura-ipfs.io/').then(res=>{
           console.log(res.data)
           let d = decrypt(res.data,key[1],key[2])
           console.log(d)
           this.setState({img:d})
       }).catch(err=>{
           console.log(err)
       })
       axios.get('https://bafybeigbqwrv6ueloezfbbl4unp2mysowl63tfplxrdu45x45izzq4brza.ipfs.infura-ipfs.io/').then(res=>{
           console.log(res.data)
           let d = decrypt(res.data,key[1],key[2])
           console.log(d)
           this.setState({img1:d})
       }).catch(err=>{
           console.log(err)
       })
       axios.get('https://bafybeibg66hbkjzh5etk3gj2osummhrvr6utemcpatsehmsmy54p6m7hta.ipfs.infura-ipfs.io/').then(res=>{
           console.log(res.data)
           let d = decrypt(res.data,key[1],key[2])
           console.log(d)
           this.setState({img2:d})
       }).catch(err=>{
           console.log(err)
       })

    }


   
    constructor(props){
        super(props);
        this.state={
          key:"",
          c:"",
          img:"",
          img1:"",
          img2:""
        }
    }
    render(){
        return(
            <div>
                <img src={this.state.img}></img>
                <img src={this.state.img1}></img>
                <img src={this.state.img2}></img>
            </div>
        )
    }
}
