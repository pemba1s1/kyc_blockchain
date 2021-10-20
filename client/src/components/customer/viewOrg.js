import React,{useEffect} from "react"
import { Container } from "react-bootstrap"
import { Table,Button } from "react-bootstrap"

export default function Vieworg(props){
    useEffect(() => {
        document.title='View Organization'
    })
    return(
        <Container>
        <br/>
            <Table striped hover responsive="sm">
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
                            <td style={{width:"20%"}}>
                                <Button variant="danger" onClick={()=>{
                                    props.kyc1.revokeAccessKYC(org,{from:props.account})
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