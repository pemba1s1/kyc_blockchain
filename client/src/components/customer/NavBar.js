import React, { Component } from 'react'
import Navbar from 'react-bootstrap/Navbar' 
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'

export default class NavBar extends Component {
    render() {
        return (
            <Navbar bg="light" expand="lg">
                <Container>
                    <Navbar.Brand href="#home">KYC Blockchain</Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="#add">View KYC</Nav.Link>
                        <Nav.Link href="#edit">View Request</Nav.Link>
                        <Nav.Link href="#request">Revoke Access</Nav.Link>
                        <Nav.Link href="#view">View Organizations</Nav.Link>
                    </Nav>
                    <Nav>
                        <Nav.Link>{this.props.account}</Nav.Link>
                    </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        )
    }
}
