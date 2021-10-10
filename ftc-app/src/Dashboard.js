import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const Dashboard = () => {
    const { isLogin } = useSelector(state => state.user)
    const auth = getAuth();
    const user = auth.currentUser;
    if(!isLogin){
        return <Redirect to={'/sign-in'} />
    }
    if (user !== null) {
        // The user object has basic properties such as display name, email, etc.
        const displayName = user.displayName.toString();
        const email = user.email;
        const photoURL = user.photoURL;
        const emailVerified = user.emailVerified;

        // The user's ID, unique to the Firebase project. Do NOT use
        // this value to authenticate with your backend server, if
        // you have one. Use User.getToken() instead.
        const uid = user.uid;

        return (

            <div>
                <p>Welcome {email}</p>
                <p>Name:{displayName}</p>
                <p><img src={`${photoURL}`} /></p>
                <p>Verified:{photoURL}</p>
            </div>
        )
    }   
}

export default Dashboard;




