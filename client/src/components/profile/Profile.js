import React, { Component } from "react";
import classes from "./Profile.module.css";
import axios from "axios"
import { decrypt } from "../../rsa/Rsa";

class Profile extends Component {

  componentDidMount = () =>{
    let d = Number(this.props.detail[5])
    let n = Number(this.props.detail[6])
    axios.get(`https://${this.props.detail[1]}.ipfs.infura-ipfs.io/`)
      .then(res=>{
        let de =  decrypt(res.data,d,n)
        this.setState({data:JSON.parse(de)})
      },err=>{
        console.log(err)
      })
    axios.get(`https://${this.props.detail[2]}.ipfs.infura-ipfs.io/`)
      .then(res=>{
        let de =  decrypt(res.data,d,n)
        this.setState({p_photo:de})
      },err=>{
        console.log(err)
      })
    axios.get(`https://${this.props.detail[3]}.ipfs.infura-ipfs.io/`)
      .then(res=>{
        let de =  decrypt(res.data,d,n)
        this.setState({front:de})
      },err=>{
        console.log(err)
      })
    axios.get(`https://${this.props.detail[4]}.ipfs.infura-ipfs.io/`)
      .then(res=>{
        let de =  decrypt(res.data,d,n)
        this.setState({back:de})
      },err=>{
        console.log(err)
      })
  }

  constructor(props){
    super(props);
    this.state={
      data :{},
      p_photo:"",
      front:"",
      back:""
    }
  }
  render(){
    return (
      <div className={classes.bground}>
        <h1>Profile</h1>
          <div className={classes.header}>
            <img src={this.state.p_photo} className={classes.pic} alt='prop'/>
          </div>
          <div  className={classes.container}>
            <table  className={classes.boxes}>
              <tbody>
                <tr>
                  <td>Name</td>
                  <td>: {this.state.data.name}</td>
                </tr>
                <tr>
                  <td>Father's Name</td>
                  <td>: {this.state.data.fathername}</td>
                </tr>
                <tr>
                  <td>Mother's Name</td>
                  <td>: {this.state.data.mothername}</td>
                </tr>
                <tr>
                  <td>Grandfather's Name</td>
                  <td>: {this.state.data.grandfathername}</td>
                </tr>
                <tr>
                  <td>Temporary Adress</td>
                  <td>: {this.state.data.taddress}</td>
                </tr>
                <tr>
                  <td>Permanent address</td>
                  <td>: {this.state.data.paddress}</td>
                </tr>
                <tr>
                  <td>Contact number</td>
                  <td>: {this.state.data.phone}</td>
                </tr>
                <tr>
                  <td>DOB</td>
                  <td>: {this.state.data.dob}</td>
                </tr>
                <tr>
                  <td>Govt. issued docs</td>
                  <td><img className={classes.govt} src={this.state.front} alt='front' /> </td>
                </tr>
                <tr>
                  <td></td>
                  <td><img className={classes.govt} src={this.state.back} alt='back' /> </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      );
    }
  }
  

export default Profile;
