import React, {Fragment, useState, useEffect} from 'react';
import 'bulma/css/bulma.css'
import '../App.css'
import {toast} from "react-toastify"

const Dashboard = ({setAuth}) => {

  const [name, setName] = useState("")

  async function getName() {
    try{


      const response = await fetch("/dashboard",{
        method: "GET",
        headers: {token: localStorage.token}
      })

      const parseRes = await response.json()

      setName(parseRes.username)
    }catch(err){
      console.error(err.message)
    }
  }

  useEffect(() => {
    getName()
  }, [])

  const logout = (event) => {
    event.preventDefault()
    localStorage.removeItem("token")
    setAuth(false)
    toast.info("Logged out. Thank you for using Twitter+1", {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      })
  }


  return(
    <Fragment>
      <nav className="navbar is-fixed-top is-link">
        <div className="navbar-start">
          <div className="ml-6 navbar-item">Hello {name}!</div>
        </div>
        <div className="navbar-end">
          <div className="buttons">
            <a className="mr-2 button is-primary" >Add A Tweet+</a>
            <a className="mr-2 button is-danger " onClick={event => logout(event)}>Log Out</a>
          </div>
        </div>
      </nav>



    </Fragment>
  )
}

export default Dashboard;
