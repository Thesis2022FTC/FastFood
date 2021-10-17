import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import FormComponent from './MDComponent/Form'
const Admin=()=>{
    const { isLogin } = useSelector(state => state.user)
    if (!isLogin) {
        return <Redirect to={'/sign-in'} />
    }
    return(
        <div>
           < FormComponent/>
        </div>
    )
}

export default Admin;