
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux'
import React, { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { setLoginState } from './redux/features/userSlice'; // adjust based on your reducer
import Login from "./login";
import SignUp from "./signup";
import Dashboard from './Dashboard';
import Header from './header';
import AddToCart from './Order/AddToCart'
import MyCart from './Order/MyCart';

import EmailVerification from './emailVerification';
import Admin from './Admin'
import Profile from './profile'
import { getAuth } from 'firebase/auth'
import SuccessOrder from './Order/SuccessOrder';
import ResetPassword from './ForgotPassword';
import CustomerSignup from './signupCustomer'
import MyOrderHistory from './Order/OrderHistory';
import Terms from './Terms';
//import CashierSignup from './signupCashier'
function App() {
  const dispatch = useDispatch();
  const { isLogin } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true); // Wait for Firebase init
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        dispatch(setLoginState(true));
      } else {
        setUser(null);
        dispatch(setLoginState(false));
      }
      setLoading(false);
    });

    return () => unsubscribe(); // cleanup on unmount
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;

  return (
    <Router>
      <div className="App">
        {user ? <Header /> : null}

        <Switch>
          <Route exact path='/' component={Login} />
          <Route path="/admin" component={Admin} />
          <Route path="/profile" component={Profile} />
          <Route path="/sign-in" component={Login} />
          <Route path="/sign-up" component={SignUp} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/email-verification" component={EmailVerification} />
          <Route path="/add-to-cart" component={AddToCart} />
          <Route path="/my-cart" component={MyCart} />
          <Route path="/success-page" component={SuccessOrder} />
          <Route path="/reset-pass" component={ResetPassword} />
          <Route path="/sign-up-customer" component={CustomerSignup} />
          <Route path="/order-history" component={MyOrderHistory} />
           <Route path="/terms" component={Terms} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;