const {db} = require("../../config/config")
const uuid = require('uuid/v4');
const {delAsync} = require("../../services/redis-client")

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
              io.in(req.session.socketId).emit("google", user)
              res.end();
              })
              .catch(err => res.status(500).json());
          } else {
            
            const user = {
              name: req.user.displayName,
              firstName: req.user.displayName.split(" ")[0],
              bookshelves: req.user.bookshelves,
              id: rows[0].id
          }
          
          io.in(req.session.socketId).emit("google", user)
          res.end();
          } 
      })
      .catch((err) => {
          res.status(500).json();
      })
  
}

exports.logout = (req, res) => {
    delAsync(req.session.id)
    .then(() => {
        req.session.sessionId = ''
        req.session.passport = {}
        res.status(204).end()
    })
    .catch(err => {
        res.status(500).json();
    })
}