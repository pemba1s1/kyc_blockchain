import React from "react";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/Row"
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import {Link} from 'react-router-dom'

const Index = () =>{
    return(
        <Container fluid style={{height: '100vh'}}>
          <Row style={{height: "100%" ,textAlign: "center"}}>
            <Col style={{backgroundImage:`url(/img/kyc.jpeg)`,backgroundSize:'Cover',backgroundRepeat:'no-repeat'}}>

            </Col>
            <Col sm={5}>
              <Row style={{height: "60%",paddingTop:"60px"}}>
                <Col>
                <h1><b>KYC Blockchain</b></h1>
                </Col>
              </Row>
              <Row style={{height: "40%" ,paddingTop:"60px"}}>
                <Col >
                  <h2><Link to="/organization">
                  <Button variant="outline-dark" size= "lg" style={{borderRadius:"10px"}}>Organization</Button>
                  </Link></h2>
                </Col>
                <Col >
                  <h2><Link to="/customer">
                  <Button variant="outline-dark" size="lg"  style={{borderRadius:"10px"}}>Customer</Button>
                  </Link></h2>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
    );
}
export default Index;