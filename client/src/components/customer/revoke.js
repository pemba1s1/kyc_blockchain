import React,{Component} from "react"
import { Container } from "react-bootstrap"
import { Form,Button } from "react-bootstrap"



export default class Revoke extends Component{
    constructor(props){
        super(props);
        this.state={
            revoke:false,
            ethAddress:'',
            loading:'',
            error:false,
            errormsg:''
        }
    }

    componentDidMount = () =>{
        document.title="Revoke Access"
    }

    revokeAccess = (event) => {
        event.preventDefault()
        this.setState({loading:true})
        this.props.kyc1.revokeAccessKYC(this.state.ethAddress,{from:this.props.account})
            .then(res=>{
                this.setState({revoke:true,loading:false})
            })
            .catch(e=>{
                this.setState({
                    loading:false,
                    error:true,
                    errormsg:"This particular organization has no access to your data"
                })
            })
    }

    render(){
        return(
            <Container>
                <Form style={{margin:"auto",width:"80%",padding:"30px 10px 10px 10px"}} onSubmit={this.revokeAccess}>
                    <Form.Group>
                        <Form.Label>
                        ethAddress:                    
                        </Form.Label>
                        <Form.Control  type="text" name='address' value={this.state.ethAddress} onChange={e => this.setState({ethAddress:e.target.value})} />
                    </Form.Group>
                    <br/>
                    <Button  variant="primary" type="submit" value="Submit" >Revoke Organization</Button>
                </Form>
                <div style={{margin:"auto",width:"80%",padding:"10px",color:"green"}}>
                {this.state.loading ? <p style={{color:'blue'}}>Revoking Access</p>:
                this.state.error? <p style={{color:"red"}}>{this.state.errormsg}</p>:this.state.revoke && <p>Revoked</p>}
                </div>
            </Container>
        )
    }
    
}