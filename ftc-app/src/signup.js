import React, { useEffect, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import firebaseConfig from "./config";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification,updateProfile,signInWithEmailAndPassword} from "firebase/auth";
import Dashboard from "./Dashboard";
import { useDispatch } from 'react-redux'
import { getUser, clearUsers, isUserLogin } from './redux/features/userSlice'
const SignUp = () => {
    const dispatch = useDispatch()
    const [currentUser, setCurrentUser] = useState(null);
    const [error, setError] = useState()
    
    const auth = getAuth();
    useEffect(() => {
        dispatch(clearUsers())
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { email, password,fname,lname} = e.target.elements;
        try {
            await createUserWithEmailAndPassword(auth, email.value, password.value);
            
            await updateProfile(auth.currentUser, {
                displayName: fname.value+' ' + lname.value, photoURL: "https://example.com/jane-q-user/profile.jpg"
              })
            await sendEmailVerification(auth.currentUser)
            await signInWithEmailAndPassword(auth, email.value, password.value)
            setCurrentUser(true);
            // setEmail(email.value)
            dispatch(isUserLogin(true))
        } catch (error) {
            setError(error.message  )   
        }
    };
  
    if (currentUser) {
        return <Redirect to={'/email-verification'}/> 
    }

    const InValidCredential=()=>{
        return(
            <div>
                <p style={{fontSize:10,marginTop:10}}className="text-danger">{error}</p>
            </div>
        )
    }
    

    return (
        <form onSubmit={handleSubmit}>
            <h3>Sign Up</h3>

            <div className="form-group">
                <label>First name</label>
                <input type="text" className="form-control" placeholder="First name" name='fname' required/>
            </div>

            <div className="form-group">
                <label>Last name</label>
                <input type="text" className="form-control" placeholder="Last name" name='lname' required/>
            </div>

            <div className="form-group">
                <label>Email address</label>
                <input type="email" className="form-control" placeholder="Enter email" name="email" required/>
            </div>

            <div className="form-group">
                <label>Password</label>
                <input type="password" className="form-control" placeholder="Enter password" name="password" required/>
            </div>

            <div className="form-group">
                <label>Phone Number</label>
                <input type="number" className="form-control" placeholder="Enter Phone Number" required/>
            </div>
            <InValidCredential/>
            <div className="form-group">
                <button type="submit" className="btn btn-primary form-control">Sign Up</button>
            </div>
            <p className="forgot-password text-right">
                Already registered <Link to={"/sign-in"}>Sign in</Link>
            </p>
        </form>
    );
}
export default SignUp;