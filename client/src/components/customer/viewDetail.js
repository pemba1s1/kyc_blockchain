import React,{useEffect} from "react"
import Profile from "../profile"

export default function Viewdetail(props){
    useEffect(() => {
        document.title='Your Details'
    })
    return(
        <>
        {props.error? <p>{props.errormsg}</p>:<Profile detail={props.custDetail}/>}
            
        </>
    )
}