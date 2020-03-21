//const jwt = require('jsonwebtoken')
const {GOOGLE_CONFIG, JWT_SECRET, db} = require("../config")
const atob = require('atob');
const uuid = require('uuid/v4');
const {delAsync} = require("./redisClient")


// const createAuthToken = user =>
//   jwt.sign({user}, JWT_SECRET, {
//     subject: user.id,
//     //expiresIn: JWT_EXPIRY,
//     algorithm: 'HS256'
//   })

exports.google = (req, res) => {
  const io = req.app.get('io')
  db('users').select("id")
      .where('email', req.user.emails[0].value)
      .then( (rows) => {
          if (rows.length===0) {
              // no matching records found
              const id = uuid()
              
              db('users').insert({
                  'email': req.user.emails[0].value,
                  "id": id
              })
              .then(() => {                
                const user = {
                  name: req.user.displayName,
                  firstName: req.user.displayName.split(" ")[0],
                  bookshelves: req.user.bookshelves,
                  id: id
              }
              //console.log(user)
              //console.log(req);
              //console.log(req.query);
              
              // console.log(req.session.socketId)
              // console.log("controller");  
              
              io.in(req.session.socketId).emit("google", user)
              res.end();
              })
              .catch(console.log());
          } else {
            
            const user = {
              name: req.user.displayName,
              firstName: req.user.displayName.split(" ")[0],
              bookshelves: req.user.bookshelves,
              id: rows[0].id
          }
          //console.log(user)
          //console.log(req);
          //console.log(req.query);
          
          // console.log(req.session.socketId)
          // console.log("controller");  
          
          io.in(req.session.socketId).emit("google", user)
          res.end();
          } 
      })
      .catch(function(err) {
          // you can find errors here.
          console.log(err);
      })
  
}

// exports.refresh = (req, res) => {
//     res.json(createAuthToken(req.user))
// }

exports.logout = (req, res) => {
    delAsync(req.session.id)
    .then(() => {
        req.session.sessionId = ''
        req.session.passport = {}
        res.status(204).end()
    })
    .catch(err => {
        console.log(err);
        res.status(400).send({
            message: err
        })
    })
}