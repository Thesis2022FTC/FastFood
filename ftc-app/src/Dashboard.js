import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Redirect, useHistory } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import DataTable from './MDComponent/DataTable'
import ControlledCarousel from "./MDComponent/Carousel";
import CardGrid from "./MDComponent/Cards";
import background from "./assets/bg3.jpg";
import Sidebar from './Sidebar'
import db from './config';
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { getStore,getSliders } from "./redux/features/fastfood";
import { Container, Row, Col, Alert } from "react-bootstrap";

const Dashboard = () => {
    const dispatch = useDispatch();
    const history = useHistory()
    const { isLogin, isUserType } = useSelector(state => state.user)
    const { sliders } = useSelector(state => state.fastfood)
    const [store, setStore] = useState([])
    const [slider,setSlider]=useState([])
    const auth = getAuth();
    const user = auth.currentUser;
    const [profile, setProfile] = useState([])
    // onAuthStateChanged(auth, (userr) => {
    //     if (userr) {
    //         const uid = userr.uid;

    //     } else {
    //         history.push('/sign-in')
    //     }
    // });
    const fetchUserProfile = async () => {
        const q = query(collection(db, "userProfile"), where("uid", "==", user.uid));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const userProfile = [];
            querySnapshot.forEach((doc) => {
                setProfile(doc.data())
                // dispatch(isUser(doc.data()))
            });
        });
    }
    const fetchSlider = async () => {
        const q = query(collection(db, "slider"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
           const sliders = [];
            querySnapshot.forEach((doc) => {
                setSlider(JSON.stringify(doc.data()));
                // dispatch(getSliders(doc.data))
            });
            
            console.log('SLIDERS', slider)
        });
    }

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
        if (user) {
            // let isSubscribed = true
            // if (isSubscribed) {
                // dispatch(getUser(user))
                fetchUserProfile();
                fetchStore();
                
                const displayName = user.displayName;
                const email = user.email;
                const photoURL = user.photoURL;
                const emailVerified = user.emailVerified;
                const uid = user.uid;
                if (!emailVerified) {
                    history.push('/email-verification')
                }
            // }

            // return () => isSubscribed = f    alse
        } else {
            history.push('/sign-in')
        }


    }, [])

    const Footer = () => {
        return (
           
            <Row style={{backgroundColor:'#FCF3CF'}}>
                <Alert style={{backgroundColor:'#F39C12'}}>
                    <p style={{color:'#FFF'}}>FTC Queuing System</p>
                    <i style={{color:'#FFF'}} class="fa fa-assistive-listening-systems" aria-hidden="true">Copyright 2022-Dan Corp</i>
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
    fetchSlider();
    const ReturnDashNoard = () => {
        if (profile.UserType == 'Customer') {
            return (
                <Container fluid style={{backgroundColor:'#FCF3CF'/* backgroundImage: `url(${background})`, resizeMode:'contains' */}} >
                    <div style={{marginTop:24, backgroundColor:'#F39C12'}}> <ControlledCarousel slider={slider} /></div>
                    <div className="container" style={{ padding: 30, }}>
                       
                        <div style={{backgroundColor:'red',marginTop: 50, paddingBottom: 50 }}  >
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
                            <Col><Sidebar usertype={profile.UserType} /></Col>
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




