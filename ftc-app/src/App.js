import React from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import {useDispatch, useSelector} from 'react-redux'
import Login from "./login";
import SignUp from "./signup";
import Dashboard from './Dashboard';
import Header from './header';

function App() {
  
  const {isLogin} = useSelector((state) => state.user)

  return (<Router>
    <div className="App">
    {!isLogin? <Header  link='Sign in' link2='Sign up'/>:<Header link='Sign out' link2=''/>}

      <div className="auth-wrapper">
        <div className="auth-inner">
          <Switch>
            <Route exact path='/' component={Login} />
            <Route path="/sign-in" component={Login} />
            <Route path="/sign-up" component={SignUp} />
            <Route path="/dashboard" component={Dashboard} />
          </Switch>
        </div>
      </div>
    </div></Router>
  );
}

export default App;