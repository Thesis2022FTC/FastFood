import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import DataTable from './MDComponent/DataTable'
import ControlledCarousel from "./MDComponent/Carousel";
import CardGrid from "./MDComponent/Cards";
import Admin from "./Admin"
import db from './config';
import { collection, query, where, onSnapshot } from "firebase/firestore";
import  { getStore} from "./redux/features/fastfood";

const Dashboard = () => {
    const dispatch = useDispatch();
    const { isLogin, isUserType } = useSelector(state => state.user)
    const [store, setStore] = useState([])
    const auth = getAuth();
    const user = auth.currentUser;

    useEffect(() => {
        let isSubscribed = true
        if (isSubscribed) {
            // dispatch(getUser(user))
            fetchStore();
           
        }

        return () => isSubscribed = false

    },[user.uid])



    const fetchStore = async () => {
        const q = query(collection(db, "fastfood"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const fastfood = [];
            querySnapshot.forEach((doc) => {
                fastfood.push(doc.data());
                dispatch(getStore(doc.data()))
            });
            setStore(fastfood)
            // console.log(JSON.stringify(store))
            console.log('TEST',isUserType.UserType)
        });

    }
    if (!isLogin) {
        return <Redirect to={'/sign-in'} />
    }



    return (
        isUserType.UserType == 'Customer' ?
            <div className="container bg-light" style={{ marginTop: 30, paddingTop: 30, marginBottom: 100 }}>

                <div className="container-fluid bg-dark" > <ControlledCarousel fastfood={store} /></div>
                <div style={{ marginTop: 50, paddingBottom: 50 }}>
                    <CardGrid fastfood={store} />
                </div>
            </div> :
            <Admin />
    )
}

export default Dashboard;




