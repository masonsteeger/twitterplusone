import React, {Fragment, useState} from 'react';
import {Link} from "react-router-dom"
import 'bulma/css/bulma.css'
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
      toast.success("Login Success!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        })
    }else{
      setAuth(false)
      toast.error(parseRes, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        })
    }

    }catch(err){
      console.log(err.message)
    }
  }

  return(
    <Fragment>
        <h1 className="title is-1 has-text-centered">Welcome to Twitter+1</h1>
        <form className=" ml-6 mr-6 container" onSubmit={onSubmitForm}>
          <div className="field">
            <div className="control">
                <input className="input is-large" type="text" name="username" placeholder="username" value={username} onChange={event => onChange(event)}/>
            </div>
          </div>
          <div className="field">
            <div className="control">
              <input className="input is-large" type="password" name="password" placeholder="password" value={password} onChange={event => onChange(event)}/>
            </div>
          </div>

          <div className="field">
            <div className="mb-3 control">
              <input className="button is-success is-large is-fullwidth" type="submit" value="Log In" />
            </div>
            <div className="control">
              <Link to="/register"><div className="button is-info is-large is-fullwidth">Create an Account</div></Link>
            </div>
          </div>
        </form>
    </Fragment>
  )
}

export default Login;
