import React, { useState, useEffect } from "react";
import { Form, Row, Col, Button, Alert, ProgressBar, Container, Stack, Table } from "react-bootstrap";
import { getAuth } from "firebase/auth";
import { doc, setDoc, collection, query, where, onSnapshot, addDoc } from "firebase/firestore";
import db from '../config';
import { encode, decode } from 'js-base64';
import { useSelector, useDispatch } from "react-redux";
import MenuCard from "../MDComponent/MenuCard";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const AddMenu = () => {
    const {uid}=useSelector(state=>state.fastfood)
    const auth = getAuth();   
    const user = auth.currentUser;
    const [menu, setmenu] = useState([])
    const [menuName, setMenuName] = useState()
    const [logo, setLogo] = useState()
    const [price, setPrice] = useState()
    const [srcFile, setSrcFile] = useState()
    const [visible, setVisible] = useState(false)
    const storage = getStorage();
    const [prog, setProg] = useState(0)
    
    useEffect(() => {
        
        fetchMenu();

    }, []);

    const fetchMenu = async () => {
        // dispatch(clearStore())
        const q = query(collection(db, "menu"), where("uid","==",uid));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const menus = [];
            querySnapshot.forEach((doc) => {
                menus.push(doc.data());

            });
            setmenu(menus)
            console.log('Menu:', menus)
        });

    }


    return (
        <div className="container auth-inner auth-wrapper" style={{ marginTop: 30, marginBottom: 30 }}>
            <Alert variant="dark" className="text-center blockquote">ORDER NOW</Alert>

            <MenuCard menu={menu} />

        </div>
    )
}

export default AddMenu;

