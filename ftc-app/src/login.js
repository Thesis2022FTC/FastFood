import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { clearUsers, getUser, isUserLogin } from './redux/features/userSlice'
import firebaseConfig from "./config";
import { getAuth, signInWithEmailAndPassword, setPersistence, browserLocalPersistence } from "firebase/auth";
import { Link, Redirect } from "react-router-dom";
import logo from './assets/logo.png';
import './login.css'; // ✅ make sure this is the correct path

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
        <div className="login-wrapper">
            <div className="login-card">
                <div className="logo-wrapper">
                    <img src={logo} alt="App Logo" className="logo-img" />
                </div>
                <form onSubmit={handleLogin} className="login-form">
                    <h3>Sign In</h3>

                    <label>Email Address</label>
                    <input type="email" name="email" placeholder="Enter email" required />

                    <label>Password</label>
                    <input type="password" name="password" placeholder="Enter password" required />

                    <InValidCredential />

                 <div className="form-check mt-3">
                <input className="form-check-input" type="checkbox" id="remember"  style={{ marginLeft: '39px' }} />
                <label className="form-check-label" htmlFor="remember" style={{ marginRight: '100px' }}>
                    Remember me
                </label>
                </div>

                    <button type="submit" className="btn-login">Sign In</button>

                    <div className="links">
                        <Link to="/reset-pass">Forgot password?</Link>
                        <Link to="/sign-up">Register as a Manager</Link>
                        <Link to="/sign-up-customer">Register as a Customer</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};
export default Login;