import React from "react";
import classes from "./Profile.module.css";
import NavBar from "../org/NavBar";

function Profile() {
  return (
    <div>
      <NavBar />
      <div  className={classes.bground}>
      <div className={classes.header}>
        <img src="https://w7.pngwing.com/pngs/627/693/png-transparent-computer-icons-user-user-icon-thumbnail.png" className={classes.pic} alt='prop'/>
        <h1>Profile</h1>
    </div>
      <div  className={classes.container}>
      <table  className={classes.boxes}>
        <tr>
          <td>Name</td>
          <td>: Need to bring from props</td>
        </tr>
        <tr>
          <td>Father's Name</td>
          <td>: Need to bring from props</td>
        </tr>
        <tr>
          <td>Mother's Name</td>
          <td>: Need to bring from props</td>
        </tr>
        <tr>
          <td>Grandfather's Name</td>
          <td>: Need to bring from props</td>
        </tr>
        <tr>
          <td>Temporary Adress</td>
          <td>: Fillin address, jpt</td>
        </tr>
        <tr>
          <td>Permanent address</td>
          <td>: Permanent address, district</td>
        </tr>
        <tr>
          <td>Contact number</td>
          <td>: 98989898</td>
        </tr>
        <tr>
          <td>Email</td>
          <td>: smth@gmail.com</td>
        </tr>
        <tr>
          <td>Govt. issued docs</td>
          <img className={classes.govt} src='https://english.onlinekhabar.com/wp-content/uploads/2018/11/citizenship.jpg' alt='prop' /> 
        </tr>
      </table>
      </div>
      <br />
      <div className={classes.footer}>© Footer</div>
      </div>
      </div>
  );
}

export default Profile;
