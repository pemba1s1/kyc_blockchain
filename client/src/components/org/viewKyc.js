import React,{Component} from "react";
import {Form , Container, Button } from "react-bootstrap"
import Profile from "../profile";

export default class Viewkyc extends Component{
    componentDidMount = () =>{
        document.title = "Customer Kyc"
    }

    getKyc = (event) => {
        event.preventDefault()
        this.props.kyc.methods.viewKYC(this.state.cust_address).call({from:this.props.account})
            .then(res=>{
                this.setState({cust_detail:res})
                this.setState({value:true})
                console.log(res)
            }).catch(err=>{
                console.log(err)
            })
    }

    deleteKyc = (cust) => {
        this.props.kyc.methods.removeKYC(this.state.cust_detail[0]).send({from:this.props.account})
            .then(res=>{
                console.log(res)
            }).catch(err=>{
                console.log(err)
            })
    }

    onChange = (event) => {
        this.setState({
            cust_address : event.target.value
        })
    }

    form = () =>{
        return(
        <Container>
        <h2 style={{margin:"auto",width:"80%",padding:"20px 10px 10px 10px"}}>View Customer KYC </h2>
            <Form onSubmit = {this.getKyc} style={{margin:"auto",width:"80%",padding:"30px 10px 10px 10px"}}>
                <Form.Group>
                    <Form.Label>Eth Address</Form.Label>
                    <Form.Control type="text" name="cust_address" onChange={this.onChange}></Form.Control>
                </Form.Group>
                <br/>
                <Button variant="primary" type="submit" value="Submit" >Submit</Button>
            </Form>
        </Container>
        )
    }

    detail = () => {
        return(
            <>
                <Container style={{margin:"auto",width:"80%",padding:"20px 10px 10px 10px"}}>
                    <Button onClick={()=>{
                        this.setState({value:false})
                    }}>Go Back</Button>
                    <Button variant="danger" onClick={this.deleteKyc} style={{float:"right"}}>Delete</Button>
                </Container>
                <Profile detail={this.state.cust_detail}/>
            </>
        
        )
    }

    constructor(props){
        super(props)
        this.state={
            cust_address : '',
            cust_detail : {},
            value : false
        }
    }
    render(){
    return(
        <>
            {this.state.value ? this.detail():this.form()}
        </>
    )
    }
}