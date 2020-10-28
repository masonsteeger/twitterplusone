import React, {Fragment, useState, useEffect} from 'react';
import {Link} from "react-router-dom"
import 'bulma/css/bulma.css'
import '../App.css'
import {toast} from "react-toastify"

const Dashboard = ({setAuth}) => {
/////////////////////////////////////CONSTANTS////////////////////////
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [faves, setFaves] = useState([])
  const [allTweets, setAllTweets] = useState([])
  const [inputs, setInputs] = useState({
    tweet: "",
  })
  const [users, setUsers] = useState([])
  const [following, setFollowing] = useState([])
  const {tweet} = inputs;
  const onChange = (event) => {
    setInputs({...inputs, [event.target.name]:event.target.value})
  }


//////////////////////////////USEEFFECT FUNCTIONS////////////////////////
  async function getName() {
    try{
      const response = await fetch("/dashboard",{
        method: "GET",
        headers: {token: localStorage.token}
      })
      const parseRes = await response.json()
      setName(parseRes.username)
      setId(parseRes.user_id)
      setFollowing(parseRes.following)
    }catch(err){
      console.error(err.message)
    }
  }

  const getAllTweets = async() => {
    try{
    const response = await fetch(`/tweet/read/${id}`)
    const parseRes = await response.json()
    setAllTweets(parseRes);
    }catch(err){
      console.log(err.message);
    }
  }

  const getUsers = async() => {
    try{
      const response = await fetch("/tweet/users")
      const parseRes = await response.json()
      setUsers(parseRes)
    }catch(err){
        console.log(err.message);
    }
  }

  const getFaves = async () => {
    const user_id = id
    try{
      const response = await fetch(`/tweet/faves/${user_id}`,{
        method: "GET",
      })
      const parseRes = await response.json();
      setFaves(parseRes[0].favorites);

    }catch (err){
      console.error(err.message);
    }
  }


///////////////////////////////MODAL CONTROLS////////////////////////

  const openTweetModal = () => {
    let tweetModal = document.getElementById('tweet');
    tweetModal.classList.add("is-active");
  }

  const closeTweetModal = () => {
    let tweetModal = document.getElementById('tweet');
    tweetModal.classList.remove("is-active");
    setInputs({...inputs, tweet:''})
  }

  const openUserModal = () => {
    let userModal = document.getElementById('users-list');
    userModal.classList.add("is-active");
  }

  const closeUserModal = () => {
    let userModal = document.getElementById('users-list');
    userModal.classList.remove("is-active");
  }

  const pressEnter = (event) => {
    if(event.key === 'Enter'){
      submitTweet(event);
    }
  }


/////////////////////////////SUBMITTING TWEET////////////////////////

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
      closeTweetModal();

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


///////////////////////////FAVORITES CONTROLS////////////////////////

//TOGGLEING FAVORITES BUTTON
  const favToggle = async(event) => {
    const tweet_id = event.target.id
    const user_id = id
    const body = {tweet_id, user_id}
    switch (event.target.classList[1]) {
      case ('unfavorite'):
        event.target.classList.remove('unfavorite');
        event.target.classList.add('favorite');
      break;
      case ('favorite'):
        event.target.classList.remove('favorite');
        event.target.classList.add('unfavorite');
      break;
    }
    try{
      const body = {tweet_id, user_id}
      const response = await fetch("/tweet/favorite", {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(body)
      })
    }catch(err){
      console.error(err.message);
    }
    getFaves();
    getAllTweets();
  }


//CHECKING FAVORITES
  const checkFav = (tweet_id) => {
    if(faves === null || faves.length === 0){
      return(<div className="fav-button unfavorite" id={tweet_id} onClick={event => favToggle(event)}></div>)
    }else{
      for(let i = 0; i < faves.length; i++){
        if(faves[i] === tweet_id){
          return(<div className="fav-button favorite" id={tweet_id} onClick={event => favToggle(event)}></div>)
        }
      }
      return(<div className="fav-button unfavorite" id={tweet_id} onClick={event => favToggle(event)}></div>)
    }
    getAllTweets();
  }


//////////////////////////////FOLLOWING CONTROLS////////////////////////
  const followToggle = async(event) => {
    const button = event.target
    const currentUser = id;
    const user_id = button.id
    console.log(currentUser);
    console.log(user_id);
    switch(button.classList[1]){
      case("is-info") :
        button.classList.remove('is-info')
        button.classList.add('is-danger')
        button.innerHTML="Unfollow"
      break;
      case("is-danger"):
      button.classList.add('is-info')
      button.classList.remove('is-danger')
      button.innerHTML="Follow"
    }
    try{
      const body = {currentUser, user_id}
      console.log(body);
      const response = await fetch("/tweet/follow", {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(body)
      })

    }catch(err){
      console.error(err.message);
    }
    getName();
    getUsers();
    getAllTweets();
  }


//CHECK FOLLOWERS
  const checkFollow = (user_id) => {
    console.log(following);
    console.log(user_id);
    if(following === null || following.length === 0){
      return(<button id={user_id} onClick={event => followToggle(event)} className="button is-info" value="Follow">Follow</button>)
    }else{
       for(let i=0; i<following.length; i++){
         if(following[i] === user_id){
           return(<button id={user_id} onClick={event => followToggle(event)} className="button is-danger">Unfollow</button>)
         }
       }
       return(<button id={user_id} onClick={event => followToggle(event)} className="button is-info">Follow</button>)
    }
  }


/////////////////////////////DELETEING FUNCTIONS////////////////////////

  const deleteTweet = async (event) => {
    const tweet_id = event.target.id
    try{
      const response = await fetch(`/tweet/delete/${tweet_id}`, {
        method: "DELETE"
      })
      toast.error("Tweet Deleted", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        })
    }catch(err){
      console.error(err.message);

    }
    getAllTweets();
  }

  const checkDelete = (user_id, tweet_id) => {
    if(user_id === id){
      return(<button id={tweet_id} className="button is-danger" onClick={event => deleteTweet(event)}>DELETE</button>)
    }
  }

//////////////////////////////////////LOGOUT////////////////////////
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

  useEffect(() => {
    getFaves();
    getAllTweets();
    getUsers();
  },[id, following])





  return(
    <Fragment>
      <div>
        <nav className="navbar pt-2 pb-2 is-fixed-top is-link">
          <div className="navbar-start">
            <div className="navbar-brand">
              <a className="navbar-item" href="/"><img src="./icons/logo.png" width="32" height="32" />Twitter+1</a>
            </div>
            <div className="navbar-menu">
              <a className="navbar-item" onClick={openUserModal}>User's List</a>
            </div>
          </div>
          <div className="navbar-end">
            <div className="ml-4 navbar-item">Hello {name}!</div>
            <div className="buttons">
              <a className="ml-5 button is-primary" onClick={openTweetModal}>Add A Tweet+</a>
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
              <textarea id="tweet-box" name="tweet" value={tweet} cols="48" rows="6" form="send-tweet" maxLength="281" onKeyPress={event => pressEnter(event)} onChange={event => onChange(event)}/>
              <input type="submit" value="Submit" className="button is-info mr-4" />
            </form>
            </section>
            <footer className="modal-card-foot">
              <button className="button is-danger" onClick={closeTweetModal}>Cancel</button>
            </footer>
          </div>
        </div>
        <div className="modal" id="users-list">
          <div className="modal-background"></div>
          <div className="modal-card">
            <header className="modal-card-head">
              <p className="modal-card-title">All Users</p>
            </header>
            <section className="modal-card-body">
              {users.map(user =>
                user.user_id === id ? null : (
                <div className="user">
                  <a className="username" href="#">{user.username}</a>
                  {checkFollow(user.user_id)}
                </div>
              ))}
            </section>
            <footer className="modal-card-foot">
              <button className="button is-danger" onClick={closeUserModal}>Close</button>
            </footer>
          </div>
        </div>
      <br/>
      <br/>
      <br/>
      <div className="tweets-container mt-4">
      {allTweets.map(tweet => (
        <div className="tweet">
          <h1>@{tweet.username}</h1>
          <p>{tweet.tweet}</p>
          <div className="tweet-footer">
            <div className="fav-container">
              <div className="faves-num">{tweet.favorites_num}</div>
              {checkFav(tweet.tweet_id)}
            </div>
            <div>
              {checkDelete(tweet.author, tweet.tweet_id)}
            </div>
          </div>
        </div>
      ))}
      </div>
      </div>
    </Fragment>
  )
}

export default Dashboard;
