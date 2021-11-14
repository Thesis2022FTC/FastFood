import React from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux'
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

function App() {
  const auth = getAuth();
  const user = auth.currentUser;
  const { isLogin } = useSelector((state) => state.user)
  console.log('isLogin:', isLogin)
  return (<Router>
    <div className="App">
      {/* {!isLogin?<Header />:null} */}

      {!user ? null : <Header />}
     
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
      </Switch>

    </div></Router >
  );
}

export default App;