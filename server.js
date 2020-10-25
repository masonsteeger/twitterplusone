//DEPENDENCIES

const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
require("dotenv").config();
PORT = process.env.PORT


//MIDDLEWARE
app.use(express.json())
app.use(cors())


app.use(express.static(path.join(__dirname, 'client/build')))


//ROUTES


//CONTROLLERS
//Register/Login
app.use("/auth", require("./controllers/jwtAuth.js"))
//Dashboard
app.use("/dashboard", require("./controllers/dashboard.js"))
//Tweet
app.use("/tweet", require("./controllers/tweet.js"))


//LISTENER
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
})
