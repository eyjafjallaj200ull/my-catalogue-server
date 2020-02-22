const passport = require('passport')
const { OAuth2Strategy: GoogleStrategy } = require('passport-google-oauth')
//const { Strategy: JwtStrategy } = require('passport-jwt')
const {GOOGLE_CONFIG, JWT_CONFIG, db} = require("../config");
const fetch = require('node-fetch');
const kmsClient = require("./kmsClient");
const {encrypt} = require("./utils");
const {setAsync} = require("./redisClient")
const atob = require('atob');
const btoa = require("btoa");

/* 
accesstoken comes -> encrypt it with kms key
user sends request with encrypted user id in the query string and her cookie (session id)
search redis with session id
find the token
decrypt it with the help of gcp client
encrypted token is useless because... you cannot directly send authorized request to google
lets say the database is compromised
if someone knows the user id they CAN'T make a successful request with it
because the server is only going to be accepting request from the client website
*/
//set new redis key value pair 
//session id, encrypted accessToken

module.exports = () => {
    

    // Allowing passport to serialize and deserialize users into sessions
    passport.serializeUser((user, cb) => cb(null, user))
    passport.deserializeUser((obj, cb) => cb(null, obj))

    // The callback that is invoked when an OAuth provider sends back user
    // information. 
    const callback = async (req, accessToken, refreshToken, profile, cb) => {
      

      //encrypt accessToken and refreshToken with kms key
      const base64AT = btoa(accessToken);
      console.log(refreshToken)
      //const base64RT = btoa(refreshToken)
      const encryptedAccessToken = await encrypt("my-catalogue1", "project", "google-auth", base64AT, kmsClient);
      //const encryptedRefreshToken = await encrypt("my-catalogue1", "project", "google-auth", base64RT, kmsClient);
      //redisclient set req session Id, encrypted access t.
      console.log(req.session.id)
      console.log(encryptedAccessToken)
      console.log(base64AT)
      await setAsync(req.session.id, encryptedAccessToken);

      //db insert encrypted user id encrypted refresh token
      const base64UId = btoa(profile.id)
      const encryptedUserId = await encrypt("my-catalogue1", "project", "user-id", base64UId, kmsClient);
      profile.encryptedUserId = encryptedUserId;
      /*await db('users').select()
      .where('id', encryptedUserId)
      .then(async (rows) => {
          if (rows.length===0) {
              // no matching records found
              await db('users').insert({
                  'id': encryptedUserId,
                  "encryptedRefreshToken": encryptedRefreshToken
              })
          } 
      })
      .catch(function(err) {
          // you can find errors here.
          console.log(err);
      })*/
      fetch(`https://www.googleapis.com/books/v1/mylibrary/bookshelves?key=${GOOGLE_CONFIG.clientSecret}`, {
        method: "GET",
        withCredentials: true,
        credentials: 'include',
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        }
      })
      .then(res => res.json())
      .then(data => {
        profile.bookshelves = data.items;
        return cb(null, profile)
      })
    }

    // const jwtCallback = (payload, cb) => {
    //   db("users").where("id", "=", payload.user.id)
    //   .first().then(user => cb(null, user))
    // }

    passport.use(new GoogleStrategy(GOOGLE_CONFIG, callback))
    //passport.use(new JwtStrategy(JWT_CONFIG, jwtCallback))
  }
