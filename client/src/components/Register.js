import React, {Fragment, useState} from 'react';
import {Link} from "react-router-dom";
import { toast } from 'react-toastify';

const Register = ({setAuth}) => {
  const [inputs, setInputs] = useState({
    email: "",
    username: "",
    password: ""
  })

  const {email, username, password} = inputs;

  const onChange = (event) => {
    setInputs({...inputs, [event.target.name]:event.target.value})
  }

  const onSubmitForm = async (event) => {
    event.preventDefault();
    try{
      const body = {email, username, password};

      const response = await fetch("http://localhost:5000/auth/register", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(body)
      })


      const parseRes = await response.json()

      if(parseRes.token){
        localStorage.setItem("token", parseRes.token)
        setAuth(true)
        toast.success("Successfully Registered!")
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
      <h1>Register</h1>
      <form onSubmit={onSubmitForm}>
        <input type="email" name="email" placeholder="email" value={email} onChange={event => onChange(event)}/>
        <input type="text" name="username" placeholder="username" value={username} onChange={event => onChange(event)}/>
        <input type="password" name="password" placeholder="password" value={password} onChange={event => onChange(event)}/>
        <input type= "submit" value="Submit" />
      </form>
      <Link to="/login">Login</Link>
    </Fragment>
  )
}

export default Register;
