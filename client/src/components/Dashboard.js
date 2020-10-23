import React, {Fragment, useState, useEffect} from 'react';
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
    toast.success("Logged out. Thank you for using Twitter+1")
  }


  return(
    <Fragment>
      <h1>Hello {name}!</h1>
      <button onClick={event => logout(event)}>Log Out</button>
    </Fragment>
  )
}

export default Dashboard;
