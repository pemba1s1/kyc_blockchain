import React from 'react'
import classes from "./../profile/Profile.module.css";

export default function OrgProfile(props) {
    return (
        <div className={classes.bground}>
        <h1>Organization Details</h1>
          <div  className={classes.container} style={{width:"100%"}}>
            <table  className={classes.boxes}>
              <tbody>
                <tr>
                  <td>Organization Name</td>
                  <td>: {props.orgDetail[0]} </td>
                </tr>
                <tr>
                  <td>Organization Eth Address</td>
                  <td>: {props.orgDetail[1]}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
    )
}
