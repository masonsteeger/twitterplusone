import React, {Fragment, useState, useEffect} from 'react';
import 'bulma/css/bulma.css'
import '../App.css'
import {toast} from "react-toastify"

const Dashboard = ({setAuth}) => {

  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [faves, setFaves] = useState([])
  const [inputs, setInputs] = useState({
    tweet: "",
  })
  const [allTweets, setAllTweets] = useState([])
  const {tweet} = inputs;

  async function getName() {
    try{
      const response = await fetch("/dashboard",{
        method: "GET",
        headers: {token: localStorage.token}
      })
      const parseRes = await response.json()
      setName(parseRes.username)
      setId(parseRes.user_id)

    }catch(err){
      console.error(err.message)
    }
    //getting favorites
    const user_id = id
    try{
      // THIS IS THE ONLY THING WRONG WITH THE FAV FUNCTION WHEN I HARD-CODE THE USER ID IN IT WORKS PERFECTLY
      const response = await fetch(`/tweet/faves/${user_id}`,{
        method: "GET",
      })
      const parseRes = await response.json();
      console.log(parseRes);
      setFaves(parseRes[0].favorites);

    }catch (err){
      console.error(err.message);
    }
    try{
    const response = await fetch("/tweet/read")
    const parseRes = await response.json()
    setAllTweets(parseRes);
    }catch(err){
      console.log(err.message);
    }
  }

  const getAllTweets = async() => {

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
    setInputs({...inputs, tweet:''})
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

  const getFaves = async () => {
    const result = await getName();
    console.log(id);

  }

  const checkFav = (tweet_id) => {
    console.log(faves);
    if(faves === null || faves.length === 0){
      return(<div className="fav-button unfavorite" id={tweet_id} onClick={event => favToggle(event)}></div>)
    }else{
      for(let i = 0; i < faves.length; i++){
        if(faves[i] == tweet_id){
          return(<div className="fav-button favorite" id={tweet_id} onClick={event => favToggle(event)}></div>)
        }
      }
      return(<div className="fav-button unfavorite" id={tweet_id} onClick={event => favToggle(event)}></div>)
    }
  }


  const favToggle = async(event) => {
    const tweet_id = event.target.id
    const user_id = id
    const body = {tweet_id, user_id}
    console.log(body);
    switch (event.target.classList[1]) {
      case ('unfavorite'):
        event.target.classList.remove('unfavorite');
        event.target.classList.add('favorite');
        try{
          const response = await fetch("/tweet/favorite", {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(body)
          })

        }catch(err){

        }
      break;
      case ('favorite'):
        event.target.classList.remove('favorite');
        event.target.classList.add('unfavorite');
        try{
          const body = {tweet_id, user_id}
          const response = await fetch("/tweet/favorite", {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(body)
          })

        }catch(err){

        }
      break;
    }
    getFaves();
    getAllTweets();
  }

  const logout = (event) => {
    event.preventDefault()
    localStorage.removeItem("token")
    setName("");
    setId("");
    setFaves([]);
    setAllTweets([]);
    setAuth(false);
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

  useEffect(() => {
    getName();
  }, [])

  return(
    <Fragment>
      <div>
        <nav className="navbar pt-2 pb-2 is-fixed-top is-link">
          <div className="navbar-start">
            <div className="ml-4 navbar-item">Hello {name}!</div>
          </div>
          <div className="navbar-end">
            <div className="buttons">
              <a className="mr-2 ml-5 button is-primary" onClick={openModal}>Add A Tweet+</a>
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
      <div className="tweets-container mt-4">
      {allTweets.map( tweet => (
        <div className="tweet">
          <h1>@{tweet.username}</h1>
          <p>{tweet.tweet}</p>
          <div className="fav-container">
            <div className="faves-num">{tweet.favorites_num}</div>
            {checkFav(tweet.tweet_id)}
          </div>
        </div>
      ))}
      </div>
    </div>

    </Fragment>
  )
}

export default Dashboard;
