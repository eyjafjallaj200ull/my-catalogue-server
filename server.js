require("dotenv").config();
const express = require("express");
const path = require("path");
const passport = require('passport')
const session = require('express-session')
const cors = require('cors')
const socketio = require('socket.io')
const Router = require('./routes/routes')
const passportInit = require('./routes/middlewares/passport.init')
const {CLIENT_ORIGIN } = require('./config/config')
const uuid = require('uuid/v4')
const FileStore = require('session-file-store')(session)
const app = express()
const {redisClient} = require("./services/redis-client")

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

// Direct all requests to the router
app.use('/', Router)
