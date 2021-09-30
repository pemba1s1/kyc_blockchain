import React,{Component} from "react";
import { Container,Table,Button, Form } from "react-bootstrap"
import 'bootstrap/dist/css/bootstrap.min.css'


export default class Viewrequest extends Component{
    componentDidMount=()=>{
        document.title="List Request";
        this.props.kyc.methods.viewRequestCust().call({from:this.props.account})
        .then(res=>{
            this.setState({list:res})
        })
    }

    componentDidUpdate=()=>{
        this.props.kyc.methods.viewRequestCust().call({from:this.props.account})
        .then(res=>{
            this.setState({list:res})
        })
    }
    
    onChange =async(event) => {
        event.preventDefault();
        const value=event.target.value
        await this.setState({isAllowed:value})
        console.log(this.state.isAllowed,this.req_count.value,this.address.value)
        this.props.kyc.methods.giveAccessKYC(this.req_count.value,this.address.value,this.state.isAllowed)
            .send({from:this.props.account})
    }
    constructor(props) {
        super(props);
        this.state = {
            list : [],
            Address:'',
            isAllowed:''
        };
    }
    render(){
    return(
        <Container>
        <br/>
        <Table style={{margin:"auto",width:"90%",padding:"200px 10px 10px 10px"}} striped bordered hover responsive="sm">
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
                <tr key={person.req_count}>
                    <td>{person.req_count}</td>
                    <td>{person.Address}</td>
                    <td><Form >
                        <Form.Control type="hidden" name="req_count" value={person.req_count} ref={(input) => { this.req_count = input }}/>
                        <Form.Control type="hidden" name="Address" value={person.Address} ref={(input) => { this.address = input }}/>
                        <Button variant="primary" onClick={this.onChange} type="submit" name="isAllowed" value='true'>Accept</Button>
                        <Button variant="danger" onClick={this.onChange} type="submit" name="isAllowed" value='false'>Decline</Button>
                    </Form></td>
                </tr>
            ))
        }
            </tbody>
        </Table>
        </Container>
    )
}
}