require("dotenv").config();
const express = require("express");
const path = require("path");
const passport = require('passport')
const session = require('express-session')
const cors = require('cors')
const socketio = require('socket.io')
const authRouter = require('./lib/auth.router')
const passportInit = require('./lib/passport.init')
const {CLIENT_ORIGIN } = require('./config')
const uuid = require('uuid/v4')
const FileStore = require('session-file-store')(session)
const app = express()
const {redisClient} = require("./lib/redisClient")
/* 
when you get the user id encrypt it with kms key also jwt so you can send it to the client
and save it to redis and the value will be encrypted access token
also save it to the database with encrypted refresh token
each time you make a request that needs user id you can send it in the query str, decrypt and use it like that
*/
//let authToken = "";

redisClient.on("error", function(error) {
  console.error(error);
});


// Setup for passport and to accept JSON objects
app.use(express.json())
app.use(passport.initialize())
passportInit()

// Accept requests from the client
app.use(cors({
  origin: CLIENT_ORIGIN,
  credentials: true
}))

// saveUninitialized: true allows us to attach the socket id to the session
// before we have authenticated the user
app.use(session({
  genid: req => uuid(),
  store: new FileStore(),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))

const server = app.listen(process.env.PORT || 8080, () => {
  console.log('listening...')
})

// Connecting sockets to the server and adding them to the request
// so that we can access them later in the controller
const io = socketio(server)
app.set('io', io)

// Direct all requests to the auth router
app.use('/', authRouter)
