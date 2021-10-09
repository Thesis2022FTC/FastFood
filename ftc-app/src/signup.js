import React, { useEffect, useState } from "react";
import {  Link ,Redirect} from "react-router-dom";
import firebaseConfig from "./config";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import Dashboard from "./Dashboard";
import {useDispatch} from 'react-redux'
import {getUser,clearUsers,isUserLogin} from './redux/features/userSlice'
const SignUp = () => {
    const dispatch=useDispatch()
    const [currentUser, setCurrentUser] = useState(null);
    const [email,setEmail]=useState()

useEffect(()=>{
dispatch(clearUsers())
},[])

    const handleSubmit = (e) => {
        e.preventDefault();
        const { email, password } = e.target.elements;
        try {
            const auth = getAuth();
            createUserWithEmailAndPassword(auth,email.value, password.value);
            setCurrentUser(true);
            setEmail(email.value)
           dispatch(isUserLogin(true))
        } catch (error) {
            alert(error);
        }
    };
    if (currentUser) {
      return  <Dashboard user={email}/>
    }
    
    return (
        <form onSubmit={handleSubmit}>
            <h3>Sign Up</h3>

            <div className="form-group">
                <label>First name</label>
                <input type="text" className="form-control" placeholder="First name" />
            </div>

            <div className="form-group">
                <label>Last name</label>
                <input type="text" className="form-control" placeholder="Last name" />
            </div>

            <div className="form-group">
                <label>Email address</label>
                <input type="email" className="form-control" placeholder="Enter email" name="email"/>
            </div>

            <div className="form-group">
                <label>Password</label>
                <input type="password" className="form-control" placeholder="Enter password" name="password"/>
            </div>

            <div className="form-group">
                <label>Phone Number</label>
                <input type="number" className="form-control" placeholder="Enter Phone Number" />
            </div>

            <div className="form-group">
                <button style={{ marginTop: 20 }} type="submit" className="btn btn-primary form-control">Sign Up</button>
            </div>
            <p className="forgot-password text-right">
                Already registered <Link to={"/sign-in"}>Sign in</Link>
            </p>
        </form>
    );
}
export default SignUp;