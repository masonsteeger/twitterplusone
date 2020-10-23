const dash = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");

dash.get("/", authorization, async (req, res) => {
  try{
    const user = await pool.query("SELECT username, email FROM users WHERE  user_id = $1", [req.user])
    res.json(user.rows[0])
  }catch(err){
    console.error(err)
    res.status(500).json("Server Error")
  }
})

module.exports = dash
