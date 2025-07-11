import React, { useEffect, useState } from "react";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, updateProfile, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useDispatch } from 'react-redux';
import db from './config';
import { isUserLogin } from './redux/features/userSlice';

const SignUpCashier = () => {
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const [passError, setPassError] = useState(false);

  const auth = getAuth();
  auth.languageCode = 'it';

  const image = "https://firebasestorage.googleapis.com/v0/b/fastfood-queue.appspot.com/o/Jolibee%2FJollibee-logo.png?alt=media&token=3c45576b-bd03-4a27-8bb7-50f4e3279ee3";

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password, fname, lname, phone, cpassword } = e.target.elements;

    if (password.value !== cpassword.value) {
      setPassError(true);
      return;
    }

    try {
      setPassError(false);
      const userCred = await createUserWithEmailAndPassword(auth, email.value, password.value);
      const user = userCred.user;

      await updateProfile(user, {
        displayName: `${fname.value} ${lname.value}`,
        photoURL: image,
      });

      await signInWithEmailAndPassword(auth, email.value, password.value);
      dispatch(isUserLogin(true));

      const profile = {
        Firstname: fname.value,
        Lastname: lname.value,
        Displayname: `${fname.value} ${lname.value}`,
        Email: email.value,
        Password: password.value,
        PhoneNumber: phone.value,
        UserType: 'Cashier',
        uid: user.uid,
      };

      await setDoc(doc(db, "userProfile", user.uid), profile);
      await sendEmailVerification(user);

      alert("✅ Cashier added successfully! Email verification required.");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to right, #fceabb, #f8b500)",
        padding: "30px"
      }}
    >
      <div
        className="card shadow-lg p-4"
        style={{
          maxWidth: "500px",
          width: "100%",
          borderRadius: "20px",
          backgroundColor: "#fff",
        }}
      >
        <h3 className="text-center mb-4 text-dark">👩‍💼 Cashier Registration</h3>

        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
           
            <input type="text" className="form-control" name="fname" placeholder="First Name" required />
          </div>

          <div className="form-group mb-3">
           
            <input type="text" className="form-control" name="lname" placeholder="Last Name" required />
          </div>

          <div className="form-group mb-3">
           
            <input type="email" className="form-control" name="email" placeholder="Enter Email" required />
          </div>

          <div className="form-group mb-3">
           
            <input type="password" className="form-control" name="password" placeholder="Enter Password" required />
            {passError && (
              <small className="text-danger">* Passwords do not match</small>
            )}
          </div>

          <div className="form-group mb-3">
           
            <input type="password" className="form-control" name="cpassword" placeholder="Confirm Password" required />
          </div>

          <div className="form-group mb-4">
           
            <input type="text" className="form-control" name="phone" placeholder="Enter Phone Number" maxLength="11" required />
          </div>

          {error && (
            <div className="alert alert-danger small py-2 mb-3" role="alert">
              {error}
            </div>
          )}

          <button type="submit" className="btn btn-warning w-100 fw-bold shadow-sm">
            ➕ Add Cashier
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUpCashier;
