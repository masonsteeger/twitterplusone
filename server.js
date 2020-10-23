//DEPENDENCIES

const express = require('express')
const app = express()
const cors = require('cors')

//MIDDLEWARE
app.use(express.json())
app.use(cors())

//ROUTES


//CONTROLLERS
//Register/Login
app.use("/auth", require("./controllers/jwtAuth.js"))
//Dashboard
app.use("/dashboard", require("./controllers/dashboard.js"))

//LISTENER
app.listen(5000, () => {
  console.log('Listening on Port 5000...');
})
