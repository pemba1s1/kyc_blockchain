import React from "react"
import { Container } from "react-bootstrap"

export default function Viewdetail(props){
    return(
        <Container>
        <br />
            <p>Eth Address : {props.custDetail.custAddress}</p>
            <p>json hash : {props.custDetail.jsonHash}</p>
            <p>photo hash : {props.custDetail.photoHash}</p>
            <p>front : {props.custDetail.citizenship_front_hash}</p>
            <p>back : {props.custDetail.citizenship_back_hash}</p>
        </Container>
    )
}