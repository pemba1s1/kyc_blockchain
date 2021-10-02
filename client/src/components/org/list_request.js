import React,{Component} from "react";
import { Container,Table,Button, Form } from "react-bootstrap"
import 'bootstrap/dist/css/bootstrap.min.css'


export default class Listrequest extends Component{
    componentDidMount=()=>{
        document.title="List Request"
        this.props.kyc.methods.listRequest().call({from:this.props.account})
        .then(res=>{
            this.setState({list:res})
        })
    }
    componentDidUpdate=()=>{
        this.props.kyc.methods.listRequest().call({from:this.props.account})
        .then(res=>{
            this.setState({list:res})
        })
    }
    constructor(props) {
        super(props);
        this.state = {
            list : []
        };
    }
    render(){
    return(
        <Container>
        <br/>
        <Table striped hover responsive="sm">
            <thead>
                <tr>
                    <th>Request Number</th>
                    <th>Customer Address</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
        {
            this.state.list.map((person, index) => (
                <tr key={person.req_count}>
                    <td>{person.req_count}</td>
                    <td>{person.Address}</td>
                    <td style={{width:"10%"}}><Form onSubmit={this.props.onDeleteRequest}>
                        <Form.Control type="hidden" value={person.req_count} onChange={this.props.handleChange}/>
                        <Button variant="danger" type="submit">Delete</Button>
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