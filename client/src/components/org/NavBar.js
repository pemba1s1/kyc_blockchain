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
                        <Nav.Link href="#add">Add KYC</Nav.Link>
                        <Nav.Link href="#edit">Edit KYC</Nav.Link>
                        <Nav.Link href="#request">Request KYC</Nav.Link>
                        <Nav.Link href="#view">View KYC</Nav.Link>
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
