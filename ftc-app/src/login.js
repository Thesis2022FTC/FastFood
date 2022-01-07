import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { clearUsers, getUser, isUserLogin } from './redux/features/userSlice'
import firebaseConfig from "./config";
import { getAuth, signInWithEmailAndPassword, setPersistence, browserLocalPersistence } from "firebase/auth";
import { Link, Redirect } from "react-router-dom";


const auth = getAuth();
const Login = () => {
    const dispatch = useDispatch()
    const [currentUser, setCurrentUser] = useState(null);
    const [email, setEmail] = useState()
    const [error, setError] = useState();
    const [verify, setVerify] = useState(false)

    useEffect(() => {
        //  dispatch(clearUsers())
    }, [])

    const handleLogin = (e) => {
        e.preventDefault();
        const { email, password } = e.target.elements;
        const user = auth.currentUser;
        setPersistence(auth, browserLocalPersistence);
        signInWithEmailAndPassword(auth, email.value, password.value)
            .then(() => {
                // Signed in 
                dispatch(getUser(user))
                dispatch(isUserLogin(true))
                setCurrentUser(true)
            })
            .catch((error) => {
                const errorCode = error.code;
                setError(error.message);
                // alert(errorMessage)
            });
    }


    if (currentUser) {
        return <Redirect to={'/dashboard'} />
    }
    const InValidCredential = () => {
        return (
            <div>
                <p style={{ fontSize: 10, marginTop: 10 }} className="text-danger">{error}</p>
            </div>
        )
    }

    return (
        <div className="auth-wrapper">
            <div className="auth-inner">
                <form onSubmit={handleLogin}>
                    <h3>Sign In</h3>

                    <div className="form-group">
                        <label>Email address</label>
                        <input type="email" className="form-control" placeholder="Enter email" name="email" />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" className="form-control" placeholder="Enter password" name="password" />
                    </div>
                    <InValidCredential />
                    <div className="form-group">
                        <div className="custom-control custom-checkbox">
                            <input type="checkbox" className="custom-control-input" id="customCheck1" />
                            <label className="custom-control-label" htmlFor="customCheck1">Remember me</label>
                        </div>
                    </div>

                    <div className="form-group">
                        <button style={{ marginTop: 20 }} type="submit" className="btn btn-primary form-control">Sign in</button>
                    </div>
                    <p className="forgot-password text-right">
                        Forgot <a href="/reset-pass">password?</a>
                    </p>
                    <p className="forgot-password text-right">

                        <Link to={"/sign-up"}> Create an account now</Link></p>
                </form>
            </div></div>
    );
}
export default Login;