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
  const [profile, setProfile] = useState("")
  const [count, setCount] =  useState(parseInt(281))

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
    setProfile("all")
    try{
    const response = await fetch(`/tweet/read/${id}`)
    const parseRes = await response.json()
    setAllTweets(parseRes);
    }catch(err){
      console.log(err.message);
    }
  }

  const getUserTweets = async (event, username, user_id) => {
    setProfile(user_id);
    console.log(profile);
    console.log(user_id);
    try{
      const response = await fetch(`tweet/user/${user_id}`)
      const parseRes = await response.json()
      setAllTweets(parseRes);
    }catch(err){
      console.error(err.message);
    }
    const title = document.getElementById('title')
    if(title.innerHTML !== `@${username}'s Profile'`){
      title.innerHTML = "@"+ username + "'s Profile"
    }
    closeUserModal();
    getFaves();
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
    document.getElementById('tweet-box').focus();
    dropMenu();

  }

  const closeTweetModal = () => {
    let tweetModal = document.getElementById('tweet');
    tweetModal.classList.remove("is-active");
    setInputs({...inputs, tweet:''})
    setCount(281)

  }

  const openUserModal = () => {
    let userModal = document.getElementById('users-list');
    userModal.classList.add("is-active");
    dropMenu();
  }

  const closeUserModal = () => {
    let userModal = document.getElementById('users-list');
    userModal.classList.remove("is-active");
  }

  const dropMenu = (event) => {
    const isActive = document.getElementById('burger').classList;
    const menu = document.getElementById('menu').classList;
    if(isActive.length === 2){
      isActive.add('is-active')
      menu.add('is-active')
    }else if(isActive.length === 3){
      isActive.remove('is-active')
      menu.remove('is-active')
    }
  }


/////////////////////////////SUBMITTING TWEET////////////////////////

  const pressEnter = (event) => {
    if(event.key === 'Enter'){
      submitTweet(event);
    }
  }

  const countChar = (event) => {
    if(event.keyCode == 8){
      if(count === 281){
        return
      }else{
        setCount(count+1)
      }
    }else if(event.keyCode !== 9 && event.keyCode !== 13 && event.keyCode !== 16 && event.keyCode !== 17 && event.keyCode !== 18 && event.keyCode !== 20 && event.keyCode !== 27 && event.keyCode !== 33 && event.keyCode !== 34 && event.keyCode !== 35 && event.keyCode !== 36 && event.keyCode !== 37 && event.keyCode !== 38 && event.keyCode !== 39 && event.keyCode !== 40 && event.keyCode !== 46){
      if(count === 0){
        return
      }else{
      setCount(count-1)
    }
  }

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
  const favToggle = async(event, username) => {
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
    if(profile === "all"){
      getAllTweets();
    }else{
      getUserTweets(event, username, profile)
    }
  }


//CHECKING FAVORITES
  const checkFav = (tweet_id, username) => {
    if(faves === null || faves.length === 0){
      return(<div className="fav-button unfavorite" id={tweet_id} onClick={event => favToggle(event, username)}></div>)
    }else{
      for(let i = 0; i < faves.length; i++){
        if(faves[i] === tweet_id){
          return(<div className="fav-button favorite" id={tweet_id} onClick={event => favToggle(event, username)}></div>)
        }
      }
      return(<div className="fav-button unfavorite" id={tweet_id} onClick={event => favToggle(event, username)}></div>)
    }
  }



//////////////////////////////FOLLOWING CONTROLS////////////////////////
  const followToggle = async(event) => {
    const button = event.target
    const currentUser = id;
    const username = button.value
    const user_id = button.id
    switch(button.classList[1]){
      case("is-info") :
        button.classList.remove('is-info')
        button.classList.add('is-danger')
        button.innerHTML="Unfollow"
        toast.success(`You are now following @${username}!`, {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          })
      break;
      case("is-danger"):
      button.classList.add('is-info')
      button.classList.remove('is-danger')
      button.innerHTML="Follow"
      toast.error(`You have unfollowed @${username}`, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        })
    }
    try{
      const body = {currentUser, user_id}
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
    if(profile === "all"){
      getAllTweets();
    }else{
      getUserTweets(event, username, profile)
    }
  }


//CHECK FOLLOWERS
  const checkFollow = (user_id, username) => {

     for(let i=0; i<following.length; i++){
       if(following[i] === user_id){
         return(<button id={user_id} value={username} onClick={event => followToggle(event)} className="button is-danger">Unfollow</button>)
      }
    }
     return(<button id={user_id} value={username} onClick={event => followToggle(event)} className="button is-info">Follow</button>)
  }


/////////////////////////////DELETEING FUNCTIONS////////////////////////

  const deleteTweet = async (event, username) => {
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
    if(profile === "all"){
      getAllTweets();
    }else{
      getUserTweets(event, username, profile)
    }
  }

  const checkDelete = (user_id, tweet_id, username) => {
    if(user_id === id){
      return(<button id={tweet_id} className="button is-danger" onClick={event => deleteTweet(event, username)}>DELETE</button>)
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
  },[id, following])

  useEffect( () => {
    getUsers();
  })


  return(
    <Fragment>
      <div>
        <nav className="navbar pt-2 pb-2 is-fixed-top is-link">
          <div className="navbar-start">
            <div className="navbar-brand">
              <a className="navbar-item" href="/home"><img src="./icons/logo.png" width="32" height="32" />Twitter+1</a>
              <a role="button" id='burger' class="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample" onClick={event => dropMenu(event)}>
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
              </a>
            </div>
          </div>
          <div id="menu" className="navbar-menu">
            <div className="navbar-end">
              <a className="navbar-item" onClick={event=>getUserTweets(event, name, id)}>Hello @{name}!</a>
              <a className="navbar-item" onClick={openUserModal}>Following</a>
              <div className="buttons">
                <a className=" ml-2 button is-primary" onClick={openTweetModal}>Add A Tweet+</a>
                <a className="mr-2 button is-danger " onClick={event => logout(event)}>Log Out</a>
              </div>
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
              <textarea id="tweet-box" name="tweet" value={tweet} cols="48" rows="6" form="send-tweet" maxLength="281" onKeyPress={event => pressEnter(event)} onKeyDown={event => countChar(event)} onChange={event => onChange(event)}/>
              <input type="submit" value="Submit" className="button is-info mr-4" />
            </form>
            </section>
            <footer className="modal-card-foot">
              <button className="button is-danger" onClick={closeTweetModal}>Cancel</button>
              <h3 id='char-count'>{count}</h3>
            </footer>
          </div>
        </div>
        <div className="modal" id="users-list">
          <div className="modal-background"></div>
          <div className="modal-card">
            <header className="modal-card-head">
              <p className="modal-card-title">Following</p>
            </header>
            <section className="modal-card-body">
              {users.map(user =>
                user.user_id === id ? null : (
                <div className="user">
                  <a onClick={event=>getUserTweets(event, user.username, user.user_id)} className="username">@{user.username}</a>
                  {checkFollow(user.user_id, user.username)}
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
      <h1 id="title" className="is-size-1">Timeline</h1>
      <div className="tweets-container mt-4">
      {allTweets.map(tweet => (
        <div className="tweet">
        <h1><a onClick={event=>getUserTweets(event, tweet.username, tweet.author)}>@{tweet.username}</a></h1>
        <p>{tweet.tweet}</p>
        <div className="tweet-footer">
          <div className="fav-container">
            <div className="faves-num">{tweet.favorites_num}</div>
            {checkFav(tweet.tweet_id, tweet.username)}
          </div>
            <div>
              {checkDelete(tweet.author, tweet.tweet_id, tweet.username)}
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
