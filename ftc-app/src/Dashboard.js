import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Redirect, useHistory } from "react-router-dom";
import { getAuth, onAuthStateChanged ,setPersistence, browserLocalPersistence } from "firebase/auth";
import DataTable from './MDComponent/DataTable'
import ControlledCarousel from "./MDComponent/Carousel";
import CardGrid from "./MDComponent/Cards";

import Sidebar from './Sidebar'
import db from './config';
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { getStore } from "./redux/features/fastfood";
import { Container, Row, Col, Alert } from "react-bootstrap";

const Dashboard = () => {
    const dispatch = useDispatch();
    const history = useHistory()
    const { isLogin, isUserType } = useSelector(state => state.user)
    const [store, setStore] = useState([])
    const auth = getAuth();
    const user = auth.currentUser;
    setPersistence(auth, browserLocalPersistence);
    // onAuthStateChanged(auth, (userr) => {
    //     if (userr) {
    //         const uid = userr.uid;
 
    //     } else {
    //         history.push('/sign-in')
    //     }
    // });

    if (user !== null) {
        // The user object has basic properties such as display name, email, etc.
        const displayName = user.displayName;
        const email = user.email;
        const photoURL = user.photoURL;
        const emailVerified = user.emailVerified;
        const uid = user.uid;
        if (!emailVerified) {
            history.push('/email-verification')
        }
    }

    useEffect(() => {
        let isSubscribed = true
        if (isSubscribed) {
            // dispatch(getUser(user))
            fetchStore();

        }

        return () => isSubscribed = false

    }, [user.uid])

    const Footer = () => {
        return (
            <Row>
                <Alert variant='secondary'>
                    <p>FTC Queuing System</p>
                    <i class="fa fa-assistive-listening-systems" aria-hidden="true">Copyright 2021-Dan Corp</i>
                </Alert>
            </Row>

        )
    }

    const fetchStore = async () => {
        // dispatch(clearStore())
        const q = query(collection(db, "fastfood"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const fastfood = [];
            querySnapshot.forEach((doc) => {
                fastfood.push(doc.data());
                dispatch(getStore(doc.data()))
            });
            setStore(fastfood)
            // console.log(JSON.stringify(store))
            console.log('TEST', isUserType.UserType)
        });

    }
    if (!isLogin) {
        return <Redirect to={'/sign-in'} />
    }
    const ReturnDashNoard = () => {
        if (isUserType.UserType == 'Customer') {
            return (
                <Container fluid >
                    <div className="container bg-light" style={{ marginTop: 30, paddingTop: 30 }}>
                        <div className="container-fluid bg-dark" > <ControlledCarousel fastfood={store} /></div>
                        <div style={{ marginTop: 50, paddingBottom: 50 }}>
                            <CardGrid fastfood={store} />
                        </div>
                    </div>
                    <Footer />
                </Container >

            )

        } else {
            return (
                <Container fluid >
                    <div className="container bg-dark" style={{ marginTop: 30, paddingTop: 30, marginBottom: 110 }}>
                        <Row>
                            <Col><Sidebar usertype={isUserType.UserType} /></Col>
                        </Row>
                    </div>
                    <Footer />
                </Container>

            )
        }
    }

    return (
        <ReturnDashNoard />
    )
}

export default Dashboard;




