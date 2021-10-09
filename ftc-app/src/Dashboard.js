import React from "react";
import { useSelector } from "react-redux";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";
const Dashboard=(props)=>{
    const {isLogin}=useSelector(state=>state.user)
   
    return(
        isLogin?
        <div>
            <p>Welcome {props.user}</p>
        </div>:
        <Redirect to={'/sign-in'}/>
    )
}

export default Dashboard;