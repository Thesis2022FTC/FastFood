import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { clearUsers ,isUserLogin} from './redux/features/userSlice'
import firebaseConfig from "./config";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

import { Redirect } from 'react-router';
import Dashboard from "./Dashboard";

const Login = () => {
    const dispatch=useDispatch()
    const [currentUser, setCurrentUser] = useState(null);
    const [email,setEmail]=useState()
    useEffect(() => {
        dispatch(clearUsers())
    }, [])
const handleLogin=(e)=>{
    e.preventDefault();
    const { email, password } = e.target.elements;
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email.value, password.value)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        setCurrentUser(true);
        setEmail(email.value)
       dispatch(isUserLogin(true))
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorMessage)
      });
}

if (currentUser) { 
    return(
        <Dashboard user={email}/>
    )
  
  }
    
   

    return (
        <form onSubmit={handleLogin}>
            <h3>Sign In</h3>

            <div className="form-group">
                <label>Email address</label>
                <input type="email" className="form-control" placeholder="Enter email" name="email"/>
            </div>

            <div className="form-group">
                <label>Password</label>
                <input type="password" className="form-control" placeholder="Enter password" name="password"/>
            </div>

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
                Forgot <a href="#">password?</a>
            </p>
        </form>
    );
}
export default Login;