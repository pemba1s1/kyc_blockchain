import React,{useEffect} from "react";
import Container from "react-bootstrap/esm/Container";
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import 'bootstrap/dist/css/bootstrap.min.css'

const Vieworg = (props) =>{
    useEffect(() => {
        document.title='Admin | View Org Details'
    })
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
            {props.orgDetail ? 
            <h3>Bank Name : {props.orgDetail.name }<br/>
            Eth Address : {props.orgDetail.ethAddress} </h3>
            :<p></p>}
            </div>
        </Container>
    );
    
    }
export default Vieworg