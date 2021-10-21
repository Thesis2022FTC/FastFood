import React, { useEffect, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import firebaseConfig from "./config";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, updateProfile, signInWithEmailAndPassword } from "firebase/auth";
import Dashboard from "./Dashboard";
import { useDispatch } from 'react-redux'
import { getUser, clearUsers, isUserLogin } from './redux/features/userSlice'
import { doc, setDoc } from "firebase/firestore";
import db from './config';

const SignUp = () => {
    const dispatch = useDispatch()
    const [currentUser, setCurrentUser] = useState(null);
    const [error, setError] = useState()
    let image = "https://firebasestorage.googleapis.com/v0/b/fastfood-queue.appspot.com/o/Jolibee%2FJollibee-logo.png?alt=media&token=3c45576b-bd03-4a27-8bb7-50f4e3279ee3"
    const auth = getAuth();
    const user=auth.currentUser;



    useEffect(() => {
        dispatch(clearUsers())
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { email, password, fname, lname, phone, userType } = e.target.elements;
        const profile = {
            Firstname: fname.value,
            Lastname: lname.value,
            Displayname: fname.value + ' ' + lname.value,
            Email: email.value,
            Password: password.value,
            PhoneNumber: phone.value,
            UserType: userType.value,
            uid:user.uid

        }
        try {
            await createUserWithEmailAndPassword(auth, email.value, password.value);

            await updateProfile(auth.currentUser, {
                displayName: fname.value + ' ' + lname.value, photoURL: image
            })
            const user=auth.currentUser;
            setDoc(doc(db, "userProfile", user.uid), profile);
            await signInWithEmailAndPassword(auth, email.value, password.value)
            setCurrentUser(true);
            dispatch(isUserLogin(true))
            await sendEmailVerification(auth.currentUser)
            
        } catch (error) {
            setError(error.message)
        }
    };

    if (currentUser) {
        return <Redirect to={'/email-verification'} />
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
                <form onSubmit={handleSubmit}>
                    <h3>Sign Up</h3>

                    <div className="form-group">
                        <label>First name</label>
                        <input type="text" className="form-control" placeholder="First name" name='fname' required />
                    </div>

                    <div className="form-group">
                        <label>Last name</label>
                        <input type="text" className="form-control" placeholder="Last name" name='lname' required />
                    </div>

                    <div className="form-group">
                        <label>Email address</label>
                        <input type="email" className="form-control" placeholder="Enter email" name="email" required />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" className="form-control" placeholder="Enter password" name="password" required />
                    </div>

                    <div className="form-group">
                        <label>Phone Number</label>
                        <input type="number" className="form-control" placeholder="Enter Phone Number" required name='phone' />
                    </div>
                    <label>What type of use are you?</label>
                    <div className="form-group">
                        <label for="manager" style={{marginTop:5,marginRight:10}}>
                            <input type="radio" value="Manager" required  id="manager" name="userType" style={{marginRight:3, marginBottom:3}}/>
                            Manager</label> 

                        <label for="customer" style={{marginTop:5,marginRight:10}}>
                            <input type="radio" value="Customer" required  id="customer" name="userType" style={{marginRight:3, marginBottom:3}}/>
                            Customer</label>
                    </div>


                    <InValidCredential />
                    <div className="form-group">
                        <button type="submit" className="btn btn-primary form-control">Sign Up</button>
                    </div>
                    <p className="forgot-password text-right">
                        Already registered <Link to={"/sign-in"}>Sign in</Link>
                    </p>
                </form>
            </div></div>
    );
}
export default SignUp;