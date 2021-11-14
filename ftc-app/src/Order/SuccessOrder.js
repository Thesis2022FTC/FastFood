import React from 'react'
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { Redirect,useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import moment from 'moment';

const SuccessOrder = () => {
    const { isLogin } = useSelector(state => state.user)
    const auth = getAuth();
    const user = auth.currentUser;
    const history=useHistory()
    

    return (
        <div className='auth-wrapper '>
            <div className='auth-inner '>
            <p>Hi {user.displayName},</p><p>Thank you for your advanced order. The QR code valid only for today {moment().format('LL')}. </p>
            <button className="btn btn-primary form-control" style={{ marginBottom: 10 }} onClick={()=>history.push('/dashboard')}>
                Go Back to Dashboard
            </button>
            
        </div>
        </div >
    )


}


export default SuccessOrder;