const passport = require('passport')
const { OAuth2Strategy: GoogleStrategy } = require('passport-google-oauth')
const {GOOGLE_CONFIG} = require("../../config/config");
const kmsClient = require("../../services/kms-client");
const {encrypt} = require("../../services/utils");
const {setAsync} = require("../../services/redis-client")
const atob = require('atob');
const btoa = require("btoa");
const GoogleApi = require("../../services/google-api")
const {kms} = require("../../config/config")
const {projectId, keyRingId, cryptoKeyId} = kms;

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
    passport.serializeUser((user, cb) =>  cb(null, user))
    passport.deserializeUser((obj, cb) =>  cb(null, obj))

    // The callback that is invoked when an OAuth provider sends back user
    // information. 
    const callback = (req, accessToken, refreshToken, profile, cb) => {
      const base64AT = btoa(accessToken);
      //const base64RT = btoa(refreshToken)
      return encrypt(projectId, keyRingId, cryptoKeyId, base64AT, kmsClient)
      //redisclient set req session Id, encrypted access t.
      .then(encryptedAccessToken => {
        console.log(req.session.id)
        console.log(encryptedAccessToken)
        const binaryEncryptedAT = atob(encryptedAccessToken);
        console.log(binaryEncryptedAT)
        console.log("passport");
        
        return setAsync(req.session.id, binaryEncryptedAT)
        .then(() =>
            {GoogleApi.fetchLibrary(accessToken)
            .then(data => {
              profile.bookshelves = data.items;
              return cb(null, profile)
            })
            .catch(err => console.log(err))
          }
          )
      })
      .catch(err => console.log(err))
    }
    passport.use(new GoogleStrategy(GOOGLE_CONFIG, callback))
  }
