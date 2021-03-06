const tweet = require('express').Router();
const pool = require('../db.js');
const authorization = require("../middleware/authorization");

//CREATE A NEW TWEET
tweet.post("/create", async (req,res) => {
  try{
    const {id, tweet} = req.body
    const newTweet = await pool.query("INSERT INTO tweets(author, tweet, favorites_num) VALUES ($1, $2, $3) RETURNING *", [id, tweet, 0])
    const tweet_id = newTweet.rows[0].tweet_id
    await pool.query(`UPDATE users SET tweets = array_append(tweets, '${tweet_id}') WHERE user_id = '${id}'`);
    res.json(newTweet.rows)
  }catch(err){
    console.error(err.message);
    res.status(500).json("Server Error")
  }
})

//READ ALL FOLLOWING TWEETS
tweet.get("/read/:id", async (req, res) => {
  try{
    const {id} = req.params
    let allTweets = await
    pool.query(`SELECT tweeter.username, current.following, tweets.tweet_id, tweets.author, tweets.created_at, tweets.favorites_num, tweets.tweet FROM users AS current INNER JOIN tweets ON tweets.author = ANY (current.following) INNER JOIN users AS tweeter ON tweets.author = tweeter.user_id WHERE current.user_id = '${id}' ORDER BY created_at DESC;`)
    res.json(allTweets.rows)
  }catch(err){
    console.error(err.message);
  }
})


//READ ALL USERS
tweet.get("/users", async (req, res) => {
  let allUsers = await pool.query("SELECT user_id, username FROM users;")
  res.json(allUsers.rows)
})

//READ ALL OF ONE USER'S TWEETS
tweet.get("/user/:id", async (req, res) => {
  try{
    const {id} = req.params
    let userTweets = await pool.query(`SELECT user_id, author, username, favorites_num, created_at, tweet_id, tweet  FROM users JOIN tweets ON author=user_id WHERE user_id = '${id}' ORDER BY created_at DESC;`)
    console.log(userTweets);
    res.json(userTweets.rows);
  }catch(err){
    console.log(err.message);
  }
})

//READ USER FAVES
tweet.get("/faves/:user_id", async (req,res) => {
  const {user_id} = req.params
  let userFaves = await pool.query(`SELECT favorites FROM users WHERE user_id = '${user_id}'`)
  res.json(userFaves.rows)
})

//FOLLOW/UNFOLLOW USER
tweet.put("/follow", async (req, res) => {
  try{
    const {currentUser, user_id} = req.body
    let check = await pool.query(`SELECT following FROM users WHERE user_id = '${currentUser}' AND '${user_id}' = ANY(following);`)
    if(check.rows.length === 0){
      await pool.query(`UPDATE users SET following = array_append(following, '${user_id}') WHERE user_id = '${currentUser}';`)
      res.json('Followed')
    }else{
      await pool.query(`UPDATE users SET following = array_remove(following, '${user_id}') WHERE user_id = '${currentUser}';`);
      res.json('Un-followed')
    }
  }catch(err){
    console.error(err.message);
    res.status(500).json("Server Error")
  }

})


//FAVORITE/UNFAVORITE A TWEET
tweet.put("/favorite", async (req,res) => {
  try{
    const {tweet_id, user_id} = req.body
    let check = await pool.query(`SELECT favorites FROM users WHERE user_id = '${user_id}' AND '${tweet_id}' = ANY(favorites)`)
    if(check.rows.length>0){
      await pool.query(`UPDATE users SET favorites = array_remove(favorites, '${tweet_id}') WHERE user_id = '${user_id}';`);
      await pool.query(`UPDATE tweets SET favorites_num = favorites_num - 1 WHERE tweet_id = '${tweet_id}'`)
      res.json('Un-favorited')
    }else{
      await pool.query(`UPDATE users SET favorites = array_append(favorites, '${tweet_id}') WHERE user_id = '${user_id}';`);
      await pool.query(`UPDATE tweets SET favorites_num = favorites_num + 1 WHERE tweet_id = '${tweet_id}'`)
      res.json('Favorited')
    }
  }catch(err){
  console.error(err.message);
  res.status(500).json("Server Error")
  }
})

//DELETE A TWEET
tweet.delete("/delete/:id", async (req, res) => {
  try{
    const tweet_id = req.params.id
    await pool.query(`UPDATE users SET favorites = array_remove(favorites, '${tweet_id}');`)
    await pool.query(`UPDATE users SET tweets = array_remove(tweets, '${tweet_id}');`)
    await pool.query(`DELETE FROM tweets WHERE tweet_id = '${tweet_id}';`)
    res.json("Tweet Deleted")
  }catch(err){
    console.error(err.message)
    res.status(500).json("Server Error")
  }
})


module.exports = tweet
