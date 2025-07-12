import React, { useEffect, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import firebaseConfig from "./config";
import { getAuth, RecaptchaVerifier, createUserWithEmailAndPassword, sendEmailVerification, updateProfile, signInWithEmailAndPassword } from "firebase/auth";
import Dashboard from "./Dashboard";
import { useDispatch } from 'react-redux'
import { getUser, clearUsers, isUserLogin } from './redux/features/userSlice'
import { doc, setDoc } from "firebase/firestore";
import db from './config';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
const SignUp = () => {
    const dispatch = useDispatch()
    const [currentUser, setCurrentUser] = useState(null);
    const [passError,setPassEror]=useState(false)
    const [error, setError] = useState()
    const [legalFiles, setLegalFiles] = useState([]);
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [termsError, setTermsError] = useState(false);

    let image = "https://firebasestorage.googleapis.com/v0/b/fastfood-queue.appspot.com/o/Jolibee%2FJollibee-logo.png?alt=media&token=3c45576b-bd03-4a27-8bb7-50f4e3279ee3"
    const auth = getAuth();
    auth.languageCode = 'it';

    useEffect(() => {
        dispatch(clearUsers())
        setPassEror(false)
    }, [])

   const handleSubmit = async (e) => {
  e.preventDefault();

  if (!acceptTerms) {
    setTermsError(true);
    return;
  } else {
    setTermsError(false);
  }

  const { email, password, fname, lname, phone, cpassword } = e.target.elements;

  if (password.value !== cpassword.value) {
    setPassEror(true);
    return;
  }

  setPassEror(false);

  try {
    await createUserWithEmailAndPassword(auth, email.value, password.value);

    await updateProfile(auth.currentUser, {
      displayName: `${fname.value} ${lname.value}`,
      photoURL: image,
    });

    const user = auth.currentUser;
    await signInWithEmailAndPassword(auth, email.value, password.value);
    setCurrentUser(true);
    dispatch(isUserLogin(true));

    const storage = getStorage();
    const uploadedFileUrls = [];

    // Upload each file to Firebase Storage
    for (const file of legalFiles) {
      const storageRef = ref(storage, `legalDocuments/${user.uid}/${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      uploadedFileUrls.push({ name: file.name, url: downloadURL });
    }

    const profile = {
      Firstname: fname.value,
      Lastname: lname.value,
      Displayname: `${fname.value} ${lname.value}`,
      Email: email.value,
      Password: password.value,
      PhoneNumber: phone.value,
      UserType: 'Manager',
      uid: user.uid,
      legalDocuments: uploadedFileUrls, // Store uploaded file metadata
    };

    await setDoc(doc(db, "userProfile", user.uid), profile);
    await sendEmailVerification(user);

  } catch (error) {
    setError(error.message);
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
        <div className="auth-wrapper" style={{backgroundColor:'#FCF3CF'}}>
            <div className="auth-inner" style={{backgroundColor:'#F9E79F'}}>
                <form onSubmit={handleSubmit}>
                    <h3>Manager's Registration Form</h3>

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

                        <div className="form-group">
                        <label>Upload Legal Documents</label>
                        <input
                        type="file"
                        multiple
                        className="form-control"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => setLegalFiles(Array.from(e.target.files))}
                        />

                        </div>

                        <div className="form-group form-check mt-3">
                        <input
                            type="checkbox"
                            className="form-check-input"
                            id="terms"
                            checked={acceptTerms}
                            onChange={(e) => setAcceptTerms(e.target.checked)}
                        />
                        <label className="form-check-label" htmlFor="terms">
                            I agree to the <a href="/terms" target="_blank" rel="noreferrer">Terms and Conditions</a>
                        </label>
                        {termsError && (
                            <small className="text-danger d-block mt-1">You must accept the terms to continue.</small>
                        )}
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