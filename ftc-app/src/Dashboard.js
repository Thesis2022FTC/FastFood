import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {  Link ,Redirect} from "react-router-dom";


const Dashboard = (props) => {
    const { isLogin } = useSelector(state => state.user)
    useEffect(()=>{
        <Redirect to={'/sign-in'} />
    },[isLogin])

    return (
        isLogin ?
            <div>
                <p>Welcome {props.user}</p>
            </div> :
            <Redirect to={'/sign-in'} />
    )
}

export default Dashboard;