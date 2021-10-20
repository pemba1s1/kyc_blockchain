import React,{Component} from "react";
import { Container,Table,Button } from "react-bootstrap"
import 'bootstrap/dist/css/bootstrap.min.css'


export default class Listrequest extends Component{
    componentDidMount=()=>{
        document.title="List Request"
        this.props.kyc.listRequest({from:this.props.account})
        .then(res=>{
            this.setState({list:res})
        })
    }
    componentDidUpdate=()=>{
        this.props.kyc.listRequest({from:this.props.account})
        .then(res=>{
            this.setState({list:res})
        })
    }
    onChange =async(event,req_count) => {
        event.preventDefault();
        this.props.kyc1.deleteRequestOrg(req_count,{from:this.props.account})
        console.log(req_count)
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
                <tr key={person.req_count.toNumber()}>
                    <td>{person.req_count.toNumber()}</td>
                    <td>{person.Address}</td>
                    <td style={{width:"10%"}}>
                        <Button variant="danger" onClick={(event)=>{this.onChange(event,person.req_count.toNumber())}}>Delete</Button>
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