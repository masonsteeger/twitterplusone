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

app.use(express.static('./client/build'))
if(process.env.NODE_ENV === "production"){
  app.use(express.static(path.join(__dirname, 'client/build')))
}

console.log(path.join(__dirname, 'client/build'));
//ROUTES


//CONTROLLERS
//Register/Login
app.use("/auth", require("./controllers/jwtAuth.js"))
//Dashboard
app.use("/dashboard", require("./controllers/dashboard.js"))


//LISTENER
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
})
