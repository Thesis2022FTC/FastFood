import React from 'react'
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { Redirect } from 'react-router-dom/cjs/react-router-dom.min';
import { useDispatch, useSelector } from "react-redux";

const EmailVerification = () => {
    const { isLogin } = useSelector(state => state.user)
    const auth = getAuth();
    const user = auth.currentUser;

    const verifyNow = async (e) => {
        e.preventDefault();
        try {
            await sendEmailVerification(auth.currentUser)
            alert('Email Sent!')
            return <Redirect to={'/sign-in'} />
        } catch (err) {
            alert('Email already sent!!!')
        }


    }

    return (
        <div className='auth-wrapper '>
            <div className='auth-inner '>
            <p>Hi {user.displayName},</p><p>An email was sent to your address for verification. please check  the email:
                {user.email}.
                if you haven't received an email please click the Verify button.</p>
            <button className="btn btn-primary form-control" style={{ marginBottom: 10 }} onClick={verifyNow}>
                Verify Now
            </button>
            
        </div>
        </div >
    )


}


export default EmailVerification;