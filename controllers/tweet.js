const tweet = require('express').Router();
const pool = require('../db.js');
const authorization = require("../middleware/authorization");

//CREATE A NEW TWEET
tweet.post("/create", async (req,res) => {
  try{
    const {id, tweet} = req.body
    const newTweet = await pool.query("INSERT INTO tweets(author, tweet, favorites_num) VALUES ($1, $2, $3) RETURNING *", [id, tweet, 0])
    res.json(newTweet.rows)
  }catch(err){
    console.error(err.message);
    res.status(500).json("Server Error")
  }
})

//READ ALL TWEETS
tweet.get("/read", async (req, res) => {
  let allTweets = await
  pool.query(`SELECT users.username, tweets.tweet, tweets.created_at, tweets.favorites_num, tweets.tweet_id FROM users, tweets WHERE "user_id" = "author" ORDER BY created_at DESC;`)
  res.json(allTweets.rows)
})

//READ USER FAVES
tweet.get("/faves/:user_id", async (req,res) => {
  const {user_id} = req.params
  let userFaves = await pool.query(`SELECT favorites FROM users WHERE user_id = '${user_id}'`)
  res.json(userFaves.rows)
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


module.exports = tweet