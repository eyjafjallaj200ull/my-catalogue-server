//const jwt = require('jsonwebtoken')
const {GOOGLE_CONFIG, JWT_SECRET} = require("../config")


// const createAuthToken = user =>
//   jwt.sign({user}, JWT_SECRET, {
//     subject: user.id,
//     //expiresIn: JWT_EXPIRY,
//     algorithm: 'HS256'
//   })

exports.google = (req, res) => {
  const io = req.app.get('io')
  const user = {
      name: req.user.displayName,
      firstName: req.user.displayName.split(" ")[0],
      //photo: req.user.image,
      bookshelves: req.user.bookshelves,
      id: `${req.user.encryptedUserId}`
  }
  //const authToken = createAuthToken(user)
  io.in(req.session.socketId).emit('google', user)
  res.end();
}

// exports.refresh = (req, res) => {
//     res.json(createAuthToken(req.user))
// }

exports.logout = (req, res) => {
    req.session.sessionId = ''
    req.session.passport = {}
    res.status(204).end()
}