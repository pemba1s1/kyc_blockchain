import React,{Component} from "react";
import {Form , Container, Button } from "react-bootstrap"
import useDocumentTitle from '../useDoucmentTitle'
import 'bootstrap/dist/css/bootstrap.min.css'

export default function Requestkyc(){
    useDocumentTitle("Request KYC")
    return(
        <Container>
        <h2 style={{margin:"auto",width:"80%",padding:"20px 10px 10px 10px"}}>Request Customer KYC </h2>
            <Form style={{margin:"auto",width:"80%",padding:"30px 10px 10px 10px"}}>
                <Form.Group>
                    <Form.Label>Eth Address</Form.Label>
                    <Form.Control type="text" name="eth_address"></Form.Control>
                </Form.Group>
                <br/>
                <Button variant="primary" type="submit" value="Submit" >Submit</Button>
            </Form>
        </Container>
    )
}