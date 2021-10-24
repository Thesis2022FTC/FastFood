import React, { useState, useEffect } from "react";
import { Form, Row, Col, Button, Alert, ProgressBar, Container, Stack, Table } from "react-bootstrap";
import { getAuth } from "@firebase/auth";
import { doc, setDoc, collection, query, where, onSnapshot, addDoc } from "firebase/firestore";
import db from './config';
import { encode, decode } from 'js-base64';
import { useSelector, useDispatch } from "react-redux";
import MenuCard from "./MDComponent/MenuCard";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const AddMenu = () => {
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
        const q = query(collection(db, "menu"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const menus = [];
            querySnapshot.forEach((doc) => {
                menus.push(doc.data());

            });
            setmenu(menus)
            console.log('Menu:', menus)
        });

    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        // const { companyname, fullname, seat, address1, address2, city, zip, drivethru, parkspace, startTime, endTime, description, uploadFile } = e.target.elements;

        // const base64Image=encode(uploadFile.files[0].name)
        const productcategory = {
            MenuName: menuName,
            Price: price,
            uid: user.uid
        }


        const storageRef = ref(storage, user.uid + '/menu/' + srcFile.name/* uploadFile.files[0].name */);

        const uploadTask = uploadBytesResumable(storageRef, srcFile);
        uploadTask.on('state_changed',
            (snapshot) => {
                // Observe state change events such as progress, pause, and resume
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                setVisible(true)
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                setProg(progress)
                switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused');
                        break;
                    case 'running':
                        console.log('Upload is running');
                        break;
                }


            },
            (error) => {
                alert("Please try again!", error)
            },
            () => {
                // Handle successful uploads on complete
                // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    // setUrl(downloadURL)
                    console.log('File available at', downloadURL);
                    productcategory['Logo'] = downloadURL
                    setTimeout(() => {
                        addDoc(collection(db, "menu"), productcategory);
                        alert('Record has been saved!')
                        setVisible(false)
                        fetchMenu();
                    }, 3000);
                });

            }
        );
        setMenuName('');
        setPrice('');

    }

    const changeHandler = (event) => {
        setSrcFile(event.target.files[0]);
    };

    return (
        <div className="container auth-inner auth-wrapper" style={{ marginTop: 30, marginBottom: 30 }}>
            <Alert variant="dark" className="text-center blockquote">Add/Update Menu</Alert>
            <Form onSubmit={handleSubmit}>
                <Row className="mb-3">
                    <Form.Group as={Col} controlId="formGridCompanyname">
                        <Form.Label>Menu Name</Form.Label>
                        <Form.Control type="text" placeholder="Add Menu name" name='menuName' required value={menuName} onChange={(e) => setMenuName(e.target.value)} />
                    </Form.Group>
                    <Form.Group as={Col} controlId="formGridZip">
                        <Form.Label>Price</Form.Label>
                        <Form.Control type="number" placeholder="Price" name="price" value={price} onChange={(e) => setPrice(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="position-relative mb-3">
                        <Form.Label>Upload Logo</Form.Label>
                        <Form.Control
                            type="file"
                            required
                            name="logo"
                            onChange={changeHandler}
                            accept="image/*"
                        />
                    </Form.Group>
                </Row>


                <div className="text-center" style={{ marginBottom: 30 }}>
                    {
                        visible ?
                            <ProgressBar style={{ marginTop: 10, marginBottom: 10 }} >
                                <ProgressBar striped variant="success" now={prog} key={1} animated label={`${Math.floor(prog / 3)}%`} />
                                <ProgressBar variant="warning" now={prog} key={2} animated label={`${Math.floor(prog / 1.5)}%`} />
                                <ProgressBar striped variant="danger" now={prog} key={3} animated label={`${Math.floor(prog - 1)}%`} />
                            </ProgressBar> : null
                    }
                    <Stack gap={2} className="col-md-5 mx-auto">
                        <Button variant="secondary" type="submit">Save it now!</Button>

                    </Stack>

                </div>
            </Form>

            <MenuCard menu={menu} />

        </div>
    )
}

export default AddMenu;

