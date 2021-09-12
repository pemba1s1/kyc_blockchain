import React, { Component } from "react";
import Container from "react-bootstrap/esm/Container";
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import 'bootstrap/dist/css/bootstrap.min.css'
import useDocumentTitle from '../useDoucmentTitle'

const Removeorg = (props) =>{
    useDocumentTitle("Admin | Remove Org")
    return(
        <Container>
            <Form style={{margin:"auto",width:"80%",padding:"30px 10px 10px 10px"}} onSubmit={props.removeOrg}>
                <Form.Group>
                <Form.Label>ethAddress:</Form.Label>
                <Form.Control  type="text" name='address' value={props.address} onChange={props.handleChange} />
                </Form.Group>
                <br />
                <Button variant="danger" type="submit" value="Submit" >Remove Organization</Button>
            </Form>
            <div style={{margin:"auto",width:"80%",padding:"10px",color:"red"}}>
            {props.loading && <p style={{color:'blue'}}>In Transaction...</p>}
            {props.removed && <p>Org Removed</p>}
            </div>
        </Container>
        
    );
    
    }
export default Removeorg