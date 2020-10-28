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



//CONTROLLERS
//Register/Login
app.use("/auth", require("./controllers/jwtAuth.js"))
//Dashboard
app.use("/dashboard", require("./controllers/dashboard.js"))
//Tweets
app.use("/tweet", require("./controllers/tweet.js"))


//CATCH FRONTEND ROUTES
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, 'client/build/index.html'), function(err) {
    if (err) {
      res.status(500).send(err)
    }
  })
})

//LISTENER
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
})
