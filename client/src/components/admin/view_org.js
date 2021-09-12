import React, { Component } from "react";
import Container from "react-bootstrap/esm/Container";
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import 'bootstrap/dist/css/bootstrap.min.css'
import useDocumentTitle from '../useDoucmentTitle'

const Vieworg = (props) =>{
    useDocumentTitle("Admin | View Org")
    return(
        <Container>
            <Form style={{margin:"auto",width:"80%",padding:"30px 10px 10px 10px"}} onSubmit={props.viewOrg}>
                <Form.Group>
                    <Form.Label>
                    ethAddress:                    
                    </Form.Label>
                    <Form.Control  type="text" name='address' value={props.address} onChange={props.handleChange} />
                </Form.Group>
                <br/>
                <Button  variant="primary" type="submit" value="Submit" >Search Organization</Button>
            </Form>
            <div style={{margin:"auto",width:"80%",padding:"10px"}}>
            {props.name ? 
            <h3>Bank Name : {props.name }<br/>
            Eth Address : {props.address} </h3>
            :<p></p>}
            </div>
        </Container>
    );
    
    }
export default Vieworg