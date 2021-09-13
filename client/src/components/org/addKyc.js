import React,{Component} from "react";
import {Form , Container, Button } from "react-bootstrap"
import useDocumentTitle from '../useDoucmentTitle'
import 'bootstrap/dist/css/bootstrap.min.css'

export default function Addkyc(){
    useDocumentTitle("Add KYC")
    return(
        <Container>
        <br/>
        <h2 style={{margin:"auto",width:"80%",padding:"20px 10px 10px 10px"}}>Add new KYC </h2>
            <Form style={{margin:"auto",width:"80%",padding:"30px 10px 10px 10px"}}>
                <Form.Group>
                    <Form.Label>Eth Address : </Form.Label>
                    <Form.Control type="text" name="eth_address"></Form.Control>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Name : </Form.Label>
                    <Form.Control type="text" name="name"></Form.Control>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Location : </Form.Label>
                    <Form.Control type="text" name="location"></Form.Control>
                </Form.Group>
                <Form.Group>
                    <Form.Label>DOB : </Form.Label>
                    <Form.Control type="date" name="dob"></Form.Control>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Citizenship number : </Form.Label>
                    <Form.Control type="text" name="citizenship_no"></Form.Control>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Location : </Form.Label>
                    <Form.Control type="text" name="location"></Form.Control>
                </Form.Group>
                <br />
                <Form.Group>
                    <Form.Label>Your Photo : </Form.Label>
                    <Form.Control type="file" name="photo"></Form.Control>
                </Form.Group>   
                <br />
                <Form.Group>
                    <Form.Label>Citizenship Front : </Form.Label>
                    <Form.Control type="file" name="citizenship_front"></Form.Control>
                </Form.Group>
                <br />
                <Form.Group>
                    <Form.Label>Citizenship Back : </Form.Label>
                    <Form.Control type="file" name="citizenship_back"></Form.Control>
                </Form.Group>             
                <br/>
                <Button variant="primary" type="submit" value="Submit" >Submit</Button>
            </Form>
        </Container>
    )
}