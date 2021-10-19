import React,{useEffect} from "react";
import {Form , Container, Button } from "react-bootstrap"
import 'bootstrap/dist/css/bootstrap.min.css'

export default function Addkyc(props){
    useEffect(() => {
        document.title='Add KYC'
    })
    return(
        <Container>
        {console.log(props)}
        <h2 style={{margin:"auto",width:"80%",padding:"20px 10px 10px 10px"}}>Add new KYC </h2>
            <Form style={{margin:"auto",width:"80%",padding:"30px 10px 10px 10px"}} onSubmit={props.handleSubmit}>
                <Form.Group>
                    <Form.Label>Eth Address : </Form.Label>
                    <Form.Control type="text" name="eth_address" onChange={props.handleChange}></Form.Control>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Name : </Form.Label>
                    <Form.Control type="text" name="name" onChange={props.handleJsonChange}></Form.Control>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Father's Name : </Form.Label>
                    <Form.Control type="text" name="fathername" onChange={props.handleJsonChange}></Form.Control>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Mother's Name : </Form.Label>
                    <Form.Control type="text" name="mothername" onChange={props.handleJsonChange}></Form.Control>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Grandfather's Name : </Form.Label>
                    <Form.Control type="text" name="grandfathername" onChange={props.handleJsonChange}></Form.Control>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Temporay Address : </Form.Label>
                    <Form.Control type="text" name="taddress" onChange={props.handleJsonChange}></Form.Control>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Permanent Address : </Form.Label>
                    <Form.Control type="text" name="paddress" onChange={props.handleJsonChange}></Form.Control>
                </Form.Group>
                <Form.Group>
                    <Form.Label>DOB : </Form.Label>
                    <Form.Control type="date" name="dob" onChange={props.handleJsonChange}></Form.Control>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Citizenship number : </Form.Label>
                    <Form.Control type="text" name="citizenship_no" onChange={props.handleJsonChange}></Form.Control>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Phone Number : </Form.Label>
                    <Form.Control type="number" name="phone" onChange={props.handleJsonChange}></Form.Control>
                </Form.Group>
                <br />
                <Form.Group>
                    <Form.Label>Your Photo : </Form.Label>
                    <Form.Control type="file" name="p_photo" onChange={props.captureFile}></Form.Control>
                </Form.Group> 
                <br />
                <Form.Group>
                    <Form.Label>Citizenship Front : </Form.Label>
                    <Form.Control type="file" name="citizenship_front" onChange={props.captureFile}></Form.Control>
                </Form.Group>
                <br />
                <Form.Group>
                    <Form.Label>Citizenship Back : </Form.Label>
                    <Form.Control type="file" name="citizenship_back" onChange={props.captureFile}></Form.Control>
                </Form.Group>             
                <br/>
                <Button variant="primary" type="submit" value="Submit" >Add</Button>
            </Form>
            <div style={{margin:"auto",width:"80%",padding:"10px",color:"green"}}>
                {props.loading ? <p style={{color:'blue'}}>Adding Customer KYC...</p>:props.added && <p>Customer KYC Added</p>}
            </div>
        </Container>
    )
}