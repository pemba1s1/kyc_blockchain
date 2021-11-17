import React,{Component} from "react"
import { Container } from "react-bootstrap"
import { Table,Button } from "react-bootstrap"

export default class Vieworg extends Component{
    
    componentDidMount = () =>{
        document.title = "View Organization"
        this.props.kyc.viewOrgWithAccess({from:this.props.account}).then(res=>{
            this.setState({orgWithAccess:res})
        })

    }

    componentDidUpdate = () => {
        this.props.kyc.viewOrgWithAccess({from:this.props.account}).then(res=>{
            this.setState({orgWithAccess:res})
        })
    }

    // const getOrgList = () =>{
    //     props.kyc.viewOrgWithAccess({from:props.account}).then(res=>{
    //         this.setState({orgWithAccess:res})
    //     })
    // }
    
    constructor(props){
        super(props);
        this.state={
            orgWithAccess:[]
        }
      }
    render(){
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
                        {this.state.orgWithAccess.map((org,index)=>(
                            <tr key={index}>
                                <td>{index}</td>
                                <td>{org}</td>
                                <td style={{width:"20%"}}>
                                    <Button variant="danger" onClick={()=>{
                                        this.props.kyc1.revokeAccessKYC(org,{from:this.props.account})
                                            .then(res=>{
                                                console.log("deleted")
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
    
}