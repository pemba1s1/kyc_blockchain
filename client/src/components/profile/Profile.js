import React, { Component } from "react";
import classes from "./Profile.module.css";
import axios from "axios"

class Profile extends Component {

  componentDidMount = () =>{
    axios.get(`https://${this.props.detail[1]}.ipfs.infura-ipfs.io/`)
      .then(res=>{
        this.setState({data:res.data})
      },err=>{
        console.log(err)
      })
  }

  constructor(props){
    super(props);
    this.state={
      data :{},
    }
  }
  render(){
    const p_photo = "https://"+this.props.detail[2]+".ipfs.infura-ipfs.io/"
    const front = "https://"+this.props.detail[3]+".ipfs.infura-ipfs.io/"
    const back = "https://"+this.props.detail[4]+".ipfs.infura-ipfs.io/"
    return (
      <div className={classes.bground}>
        <h1>Profile</h1>
          <div className={classes.header}>
            <img src={p_photo} className={classes.pic} alt='prop'/>
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
                  <td><img className={classes.govt} src={front} alt='front' /> </td>
                </tr>
                <tr>
                  <td></td>
                  <td><img className={classes.govt} src={back} alt='back' /> </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      );
    }
  }
  

export default Profile;
