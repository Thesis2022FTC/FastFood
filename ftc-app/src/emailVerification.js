import React from 'react'
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { Redirect } from 'react-router-dom/cjs/react-router-dom.min';
import { useDispatch, useSelector } from "react-redux";

const EmailVerification = () => {
    const { isLogin } = useSelector(state => state.user)
    const auth = getAuth();
    const user=auth.currentUser;
    if(!isLogin){
        return <Redirect to={'/sign-in'} />
    }
    const verifyNow =  () => {
             sendEmailVerification(auth.currentUser)
                .then(() => {
                  
                   <Redirect to={'/sign-in'} />
                })

    }

    return (
        <div className='container-fluid'>
            <p>Hi {user.displayName},</p><p>An email was sent to your address for verification.
            if you haven't received an email please click the Verify button.</p>
            <button className="btn btn-primary form-control" style={{marginBottom:10}}>
                Verify Now
            </button>
            <button className="btn btn-primary form-control">
               Sign In
            </button>
        </div>
    )


}


export default EmailVerification;