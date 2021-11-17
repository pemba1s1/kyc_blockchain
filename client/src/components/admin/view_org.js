import React,{useEffect} from "react";
import Container from "react-bootstrap/esm/Container";
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import 'bootstrap/dist/css/bootstrap.min.css'
import OrgProfile from "../orgProfile";

const Vieworg = (props) =>{
    useEffect(() => {
        document.title='Admin | View Org Details'
        props.cleanState()
        // eslint-disable-next-line
    },[])

    return(
        <>
        {props.orgDetail?
            <>
            <Container>
            <Button style={{marginTop:"15px",marginLeft:"10px"}} onClick={props.cleanState}>Go Back</Button>
            </Container>
            <OrgProfile orgDetail={props.orgDetail}/>
            </>:
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
                {props.error&& <p style={{color:"red"}}>{props.errormsg}</p>}
                </div>
            </Container>
        }
        </>
    );
    
    }
export default Vieworg