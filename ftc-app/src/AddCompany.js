import React from "react";
import FormComponent from './MDComponent/Form'
import { Redirect } from "react-router-dom";
import { useSelector } from "react-redux";
const AddCompany=()=>{
    // const { isLogin } = useSelector(state => state.user)
    // if (!isLogin) {
    //     return <Redirect to={'/sign-in'} />
    // }
    return(
        <FormComponent/>
    )
}

export default AddCompany;