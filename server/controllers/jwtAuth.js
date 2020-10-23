const auth = require('express').Router();
const bcrypt = require('bcrypt');
const pool = require('../db.js');
const jwtGenerator = require("../utils/jwtGen.js");
const validEmail = require("../middleware/validEmail.js");
const authorization = require("../middleware/authorization.js")

//REGISTER ROUTE

auth.post("/register", validEmail, async (req, res) => {
  try{
    const {username, email, password} = req.body
    const userEmail = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if(userEmail.rows.length !== 0){
      return res.status(401).json("Email is already in use");
    }
    const userName = await pool.query("SELECT * FROM users WHERE username = $1", [username])
    if(userName.rows.length !== 0){
      return res.status(401).json("Username taken");
    }

    const salt = await bcrypt.genSalt(10);

    const bcryptPassword = await bcrypt.hash(password, salt)

    const newUser = await pool.query("INSERT INTO users(username, email, password) VALUES ($1, $2, $3) RETURNING *", [username, email, bcryptPassword])


    const token = jwtGenerator(newUser.rows[0].user_id)

    res.json({token});

  }catch (err){
    console.error(err.message);
    res.status(500).send("Server Error")
  }
})


//LOGIN ROUTES

auth.post("/login", async (req, res) => {
  try{

    const {username, password} = req.body

    const user = await pool.query("SELECT * FROM users WHERE username = $1", [username]);

    if(user.rows.length === 0){
      return res.status(401).json("Username or Password is incorrect")
    }


    const validPassword = await bcrypt.compare(password, user.rows[0].password);

    if(!validPassword){
      return res.status(401).json("Username or Password is incorrect")
    }

    const token = jwtGenerator(user.rows[0].user_id)
    res.json({token});

  }catch(err){
    console.error(err.message);
    res.status(500).send("Server Error")
  }
})


//VERIFY ROUTES
auth.get("/verify", authorization, async (req, res) => {
  try{
    res.json(true);
  }catch(err){
    console.error(err.message);
    res.status(500).send("Server Error")
  }
})

module.exports = auth
