import React, {Fragment, useState} from 'react';
import {Link} from "react-router-dom"
import { toast } from 'react-toastify';

const Login = ({setAuth}) => {

  const [inputs, setInputs] = useState({
    username: "",
    password: ""
  })

  const {username, password} = inputs;

  const onChange = (event) => {
    setInputs({...inputs, [event.target.name]:event.target.value})
  }

  const onSubmitForm = async (event) => {
    event.preventDefault();
    try{

      const body = {username, password}

      const response = await fetch("/auth/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(body)
      }
    )
    const parseRes = await response.json()

    if(parseRes.token){
      localStorage.setItem("token", parseRes.token);
      setAuth(true)
      toast.success("Login Success!")
    }else{
      setAuth(false)
      toast.error(parseRes)
    }

    }catch(err){
      console.error(err.message)
    }
  }

  return(
    <Fragment>
      <h1>Login</h1>
      <form onSubmit={onSubmitForm}>
        <input type="text" name="username" placeholder="username" value={username} onChange={event => onChange(event)}/>
        <input type="password" name="password" placeholder="password" value={password} onChange={event => onChange(event)}/>
        <input type="submit" value="Log In" />
      </form>
      <Link to="/register">Create an Account</Link>
    </Fragment>
  )
}

export default Login;
