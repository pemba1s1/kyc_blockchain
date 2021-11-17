import React,{Component} from "react";
import { Container,Table,Button, Form } from "react-bootstrap"
import 'bootstrap/dist/css/bootstrap.min.css'


export default class Viewrequest extends Component{
    componentDidMount=()=>{
        document.title="List Request";
        this.props.kyc.viewRequestCust({from:this.props.account})
        .then(res=>{
            this.setState({list:res})
        })
    }


    componentDidUpdate=()=>{
        this.props.kyc.viewRequestCust({from:this.props.account})
        .then(res=>{
            this.setState({list:res})
        })
    }

    
    onChange =async(event,req_count,address,isAllowed) => {
        event.preventDefault();
        this.props.kyc1.giveAccessKYC(req_count,address,isAllowed,{from:this.props.account})
    }
    constructor(props) {
        super(props);
        this.state = {
            list : [],
        };
    }
    render(){
    return(
        <Container>
        <br/>
        <Table  striped hover responsive="sm">
            <thead>
                <tr>
                    <th>Request Number</th>
                    <th>Bank Eth Address</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
        {
            this.state.list.map((person, index) => (
                <tr key={index}>
                    <td>{person.req_count.toNumber()}</td>
                    <td>{person.Address}</td>
                    <td style={{width:"20%"}}>
                    <Form >
                        <Button variant="primary" onClick={(event)=>{this.onChange(event,person.req_count.toNumber(),person.Address,true)}} type="submit" name="isAllowed" >Accept</Button>&nbsp;&nbsp;&nbsp;
                        <Button variant="danger" onClick={(event)=>{this.onChange(event,person.req_count.toNumber(),person.Address,false)}} type="submit" name="isAllowed" >Decline</Button>
                    </Form>
                    </td>
                </tr>
            ))
        }
            </tbody>
        </Table>
        </Container>
    )
}
}