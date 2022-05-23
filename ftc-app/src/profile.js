import React,{useState,useEffect} from 'react'
import { Container, Row } from 'react-bootstrap'
import { collection, query, where, onSnapshot } from "firebase/firestore";
import ProfileCard from "./MDComponent/ProfileCard";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import db from './config';

const Profile = () => {
    const [store, setStore] = useState([])
    const auth = getAuth();
    const user = auth.currentUser;

    useEffect(() => {
        if(user){
            fetchStore();
        }
       

    }, [])

    const fetchStore = async () => {
        // dispatch(clearStore())
        const q = query(collection(db, "fastfood"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const fastfood = [];
            querySnapshot.forEach((doc) => {
                fastfood.push(doc.data());
            });
            setStore(fastfood.filter(item=>item.uid==user.uid))
           
        });

    }


    return (
        <Container style={{ marginTop: 30, marginBottom: 30, backgroundColor:'#fff'}}>
            <ProfileCard fastfood={store} />
        </Container>
    )


}


export default Profile;