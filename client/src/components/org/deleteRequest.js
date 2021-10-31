import React,{useEffect} from "react";
import {Form , Container, Button } from "react-bootstrap"
import 'bootstrap/dist/css/bootstrap.min.css'


export default function Deleterequest(props){
    useEffect(() => {
        document.title='Delete Request'
        props.cleanState()
    },[])
    return(
        <Container>
        <h2 style={{margin:"auto",width:"80%",padding:"20px 10px 10px 10px"}}>Request Customer KYC </h2>
            <Form style={{margin:"auto",width:"80%",padding:"30px 10px 10px 10px"}} onSubmit={props.onDeleteRequest}>
                <Form.Group>
                    <Form.Label>Request Number</Form.Label>
                    <Form.Control type="text" name="req_count" onChange={props.handleChange}></Form.Control>
                </Form.Group>
                <br/>
                <Button variant="danger" type="submit" value="Submit" >Delete</Button>
            </Form>
            <div style={{margin:"auto",width:"80%",padding:"10px",color:"green"}}>
                {props.loading ? <p style={{color:'blue'}}>Deleting KYC Request...</p>:
                props.error? <p style={{color:"red"}}>{props.errormsg}</p>: props.del && <p>Customer KYC Request Deleted</p>}
            </div>
        </Container>
    )
}