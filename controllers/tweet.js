const tweet = require('express').Router();
const pool = require('../db.js');
const authorization = require("../middleware/authorization");

//CREATE ROUTE
tweet.post("/create", async (req,res) => {
  try{
    const {id, tweet} = req.body
    const newTweet = await pool.query("INSERT INTO tweets(author, tweet) VALUES ($1, $2) RETURNING *", [id, tweet])
    res.json(newTweet.rows)
  }catch(err){
    console.error(err.message);
    res.status(500).json("Server Error")
  }
})


tweet.get("/read", async (req, res) => {
  let allTweets = await
  pool.query(`SELECT users.username, tweets.tweet, tweets.created_at FROM users, tweets WHERE "user_id" = "author";`)
  res.json(allTweets.rows)
})


module.exports = tweet
