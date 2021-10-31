import React,{useEffect} from "react";
import Container from "react-bootstrap/esm/Container";
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import 'bootstrap/dist/css/bootstrap.min.css'

const Removeorg = (props) =>{
    useEffect(() => {
        document.title='Admin | Remove Org'
        props.cleanState()
    },[])
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
            {props.error ? <p style={{color:"red"}}>{props.errormsg}</p> : 
            props.loading ? <p style={{color:'blue'}}>In Transaction...</p>:
            props.removed && <p>Org Removed</p>}
            </div>
        </Container>
        
    );
    
    }
export default Removeorg