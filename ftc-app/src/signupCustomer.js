import React, { useEffect, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import firebaseConfig from "./config";
import { getAuth, RecaptchaVerifier, createUserWithEmailAndPassword, sendEmailVerification, updateProfile, signInWithEmailAndPassword } from "firebase/auth";
import Dashboard from "./Dashboard";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid';
import { useDispatch } from 'react-redux'
import { getUser, clearUsers, isUserLogin } from './redux/features/userSlice'
import { doc, setDoc } from "firebase/firestore";
import db from './config';
import { Form, Row, Col, Button, Alert, ProgressBar, Container, Stack, Table } from "react-bootstrap";
const SignUpCustomer = () => {
    const dispatch = useDispatch()
    const [currentUser, setCurrentUser] = useState(null);
    const [error, setError] = useState()
    const [srcFile, setSrcFile] = useState()
    const [passError,setPassEror]=useState(false)
    let image = "https://firebasestorage.googleapis.com/v0/b/fastfood-queue.appspot.com/o/Jolibee%2FJollibee-logo.png?alt=media&token=3c45576b-bd03-4a27-8bb7-50f4e3279ee3"
    const auth = getAuth();
    auth.languageCode = 'it';
    const [visible, setVisible] = useState(false)
    const storage = getStorage();
    const [prog, setProg] = useState(0)

    useEffect(() => {
        dispatch(clearUsers())
        setPassEror(false)
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();
        const user = auth.currentUser;
        const { email, password, fname, lname, phone,cpassword } = e.target.elements;
        if(password.value===cpassword.value){
            setPassEror(false)
        try {
            await createUserWithEmailAndPassword(auth, email.value, password.value);

            await updateProfile(auth.currentUser, {
                displayName: fname.value + ' ' + lname.value, photoURL: image
            })
            const user = auth.currentUser;

            await signInWithEmailAndPassword(auth, email.value, password.value)

            setCurrentUser(true);
            dispatch(isUserLogin(true))
            const profile = {
                Firstname: fname.value,
                Lastname: lname.value,
                Displayname: fname.value + ' ' + lname.value,
                Email: email.value,
                Password: password.value,
                PhoneNumber: phone.value,
                UserType: 'Customer',
                uid: user.uid

            }
           
            await sendEmailVerification(auth.currentUser)
            
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
                    // eslint-disable-next-line default-case
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
                        profile['Logo'] = downloadURL
                        setTimeout(() => {
                          
                            setDoc(doc(db, "userProfile", user.uid), profile);
                            alert('Record has been saved!')
                            setVisible(false)
                           
                        }, 3000);
                    });
    
                }
            );

        } catch (error) {
            setError(error.message)
        }
    }else{
        setPassEror(true)
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

    const changeHandler = (event) => {
        setSrcFile(event.target.files[0]);
    };
    return (
        <div className="auth-wrapper" style={{backgroundColor:'#FCF3CF'}}>
            <div className="auth-inner" style={{backgroundColor:'#F9E79F'}}>
                <form onSubmit={handleSubmit}>
                    <h3>Customer's Registration Form</h3>

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
                        <label hidden={!passError} style={{fontSize:10,color:'red'}}>{passError?"* Password doesn't matched!":""}</label>
                    </div>
                    <div className="form-group">
                        <label>Confirm Password</label>
                        <input type="password" className="form-control" placeholder="Enter password" name="cpassword" required />
                    </div>

                    <div className="form-group">
                        <label>Phone Number</label>
                        <input type="text" className="form-control" placeholder="Enter Phone Number" required name='phone' maxlength="11"/>
                    </div>
                    {/* <label>What type of use are you?</label> */}
                    {/* <div className="form-group">
                        <label for="manager" style={{ marginTop: 5, marginRight: 10 }}>
                            <input type="radio" value="Manager" required id="manager" name="userType" style={{ marginRight: 3, marginBottom: 3 }} />
                            Manager</label>
                        <label for="manager" style={{ marginTop: 5, marginRight: 10 }}>
                            <input type="radio" value="Cashier" required id="cashier" name="userType" style={{ marginRight: 3, marginBottom: 3 }} />
                            Cashier</label>

                        <label for="customer" style={{ marginTop: 5, marginRight: 10 }}>
                            <input type="radio" value="Customer" required id="customer" name="userType" style={{ marginRight: 3, marginBottom: 3 }} />
                            Customer</label>
                    </div> */}
                    
                    <Form.Group className="position-relative mb-3">
                        <Form.Label>Upload Senior Card <i style={{color:'red'}}>*Optional*</i></Form.Label>
                        <Form.Control
                            type="file"
                            name="logo"
                            onChange={changeHandler}
                            accept="image/*"
                        />
                    </Form.Group>
                   
                    <InValidCredential />
                    {
                        visible ?
                            <ProgressBar style={{ marginTop: 10, marginBottom: 10 }} >
                                <ProgressBar striped variant="success" now={prog} key={1} animated label={`${Math.floor(prog / 3)}%`} />
                                <ProgressBar variant="warning" now={prog} key={2} animated label={`${Math.floor(prog / 1.5)}%`} />
                                <ProgressBar striped variant="danger" now={prog} key={3} animated label={`${Math.floor(prog - 1)}%`} />
                            </ProgressBar> : null
                    }
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
export default SignUpCustomer;