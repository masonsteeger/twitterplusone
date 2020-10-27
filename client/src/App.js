import React, {Fragment, useState, useEffect} from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom"
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
//Components
import Dashboard from "./components/Dashboard.js"
import Login from "./components/Login.js"
import Register from "./components/Register.js"

toast.configure()

function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const setAuth = (boolean) => {
    setIsAuthenticated(boolean)
  }

  async function isAuth() {
    try{
      const response = await fetch("/auth/verify",{
        method: "GET",
        headers: {token:localStorage.token}
      })

      const parseRes = await response.json()

      parseRes === true ? setIsAuthenticated(true) : setIsAuthenticated(false)

    }catch(err){
      console.error(err.message)
    }

  }

  useEffect(() => {
    isAuth()
  })


  return (
  <div className= "container">
    <Fragment>
      <Router>
        <Switch>
          <Route exact path ="/" render={props => <Redirect to="/login"/>} />
          <Route exact path = "/login"
          render={props =>
            !isAuthenticated ? (<Login {...props} setAuth={setAuth}/>) : (<Redirect to="/home" />)}/>

          <Route exact path = "/register"
          render={props =>
            !isAuthenticated ? (<Register {...props} setAuth={setAuth}/>) : (<Redirect to="/login" />)}/>

          <Route exact path = "/home"
          render={props =>
            isAuthenticated ? (<Dashboard {...props} setAuth={setAuth}/>) : (<Redirect to="/login" />)}/>
        </Switch>
      </Router>
    </Fragment>
  </div>
  );
}

export default App;
