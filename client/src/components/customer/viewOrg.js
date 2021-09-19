import React from "react"
import { Container } from "react-bootstrap"
import { Table,Button } from "react-bootstrap"

export default function Vieworg(props){
    return(
        <Container>
        <br/>
            <Table>
                <thead>
                    <tr>
                        <th>Index</th>
                        <th>Organization Address</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {props.custDetail.organization.map((org,index)=>(
                        <tr key={index}>
                            <td>{index}</td>
                            <td>{org}</td>
                            <td>
                                <Button variant="danger" onClick={()=>{
                                    props.kyc.methods.revokeAccessKYC(org).send({from:props.account})
                                        .then(res=>{
                                        })
                                        .catch(e=>{
                                            console.log(e)
                                        })
                                }}>Revoke Access</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    )
}