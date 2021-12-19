import React from 'react'
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { Link,Redirect} from "react-router-dom";

const ResetPassword = () => {
    const auth = getAuth();
    auth.languageCode = 'en';

    const resetNow =  (e) => {
        e.preventDefault();
        const {email}=e.target.elements
         sendPasswordResetEmail(auth,email.value)
            .then(() => {
                alert('Email Sent!')
            })
            .catch((error) => {
                alert(error)
            });


    }

    return (
        <div className="auth-wrapper">
            <div className="auth-inner">
                <form onSubmit={resetNow}>
                    <h3>Reset Password</h3>

                    <div className="form-group">
                        <label>Email address</label>
                        <input type="email" className="form-control" placeholder="Enter email" name="email" />
                    </div>
                    <div className="form-group">
                        <button style={{ marginTop: 20 }} type="submit" className="btn btn-primary form-control">Reset Password</button>
                    </div>
                    <p className="forgot-password text-right">

                        <Link to={"/sign-in"}> Go Back to Sign in</Link></p>
                </form>
            </div></div>
    )


}


export default ResetPassword;