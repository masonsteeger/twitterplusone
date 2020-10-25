import React, {Fragment, useState, useEffect} from 'react';
import 'bulma/css/bulma.css'
import '../App.css'
import {toast} from "react-toastify"

const Dashboard = ({setAuth}) => {

  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [inputs, setInputs] = useState({
    tweet: "",
  })
  const [allTweets, setAllTweets] = useState([])
  const {tweet} = inputs;


  const getAllTweets = async() => {
    try{
    const response = await fetch("/tweet/read")
    const parseRes = await response.json()
    setAllTweets(parseRes);
    }catch(err){
      console.log(err.message);
    }
  }


  async function getName() {
    try{
      const response = await fetch("/dashboard",{
        method: "GET",
        headers: {token: localStorage.token}
      })
      const parseRes = await response.json()
      setName(parseRes.username);
      setId(parseRes.user_id);
    }catch(err){
      console.error(err.message)
    }
  }


  const onChange = (event) => {
    setInputs({...inputs, [event.target.name]:event.target.value})
  }

  const openModal = () => {
    let tweetModal = document.getElementById('tweet');
    tweetModal.classList.add("is-active");
  }

  const closeModal = () => {
    let tweetModal = document.getElementById('tweet');
    tweetModal.classList.remove("is-active");
    let box = document.getElementById('tweet-box');
    box.value=""
  }

  const submitTweet = async (event) => {
    event.preventDefault();
    try{
      const body = {id, tweet}
      const response = await fetch("/tweet/create", {
        method: "POST",
        headers:{"Content-Type": "application/json"},
        body: JSON.stringify(body)
      })
      getAllTweets();
      closeModal();

      toast.success("Tweet Sent!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        })
    }catch(err){
      console.log(err.message);
    }
  }


  useEffect(() => {
    getName();
    getAllTweets();
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
      <div>
        <nav className="navbar is-fixed-top is-link">
          <div className="navbar-start">
            <div className="ml-6 navbar-item">Hello {name}!</div>
          </div>
          <div className="navbar-end">
            <div className="buttons">
              <a className="mr-2 button is-primary" onClick={openModal}>Add A Tweet+</a>
              <a className="mr-2 button is-danger " onClick={event => logout(event)}>Log Out</a>
            </div>
          </div>
        </nav>
        <div className="modal" id="tweet">
        <div className="modal-background"></div>
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">Send a Tweet!</p>
          </header>
          <section className="modal-card-body">
          <form id="send-tweet" onSubmit={submitTweet}>
            <textarea id="tweet-box" name="tweet" value={tweet} cols="48" rows="6" form="send-tweet" maxLength="281" onChange={event => onChange(event)}/>
            <input type="submit" value="Submit" className="button is-info mr-4" />
          </form>
          </section>
          <footer className="modal-card-foot">
            <button className="button is-danger" onClick={closeModal}>Cancel</button>
          </footer>
        </div>
      </div>
      <br/>
      <br/>
      <br/>
      <div className="tweets-container">
      {allTweets.map( tweet => (
        <div>
          <h1>{tweet.username}</h1>
          <p>{tweet.tweet}</p>
        </div>
      ))}
      </div>
    </div>

    </Fragment>
  )
}

export default Dashboard;
