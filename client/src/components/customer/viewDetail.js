import React,{useEffect} from "react"
import Profile from "../profile"

export default function Viewdetail(props){
    useEffect(() => {
        document.title='Your Details'
    })
    return(
        <>
            <Profile detail={props.custDetail}/>
        </>
    )
}