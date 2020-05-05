const passport = require('passport')
const { OAuth2Strategy: GoogleStrategy } = require('passport-google-oauth')
const {GOOGLE_CONFIG} = require("../../config/config");
const GoogleApi = require("../../services/google-api")
const setEncryptedToken = require("../../services/setEncryptedToken")

module.exports = () => {
    // Allowing passport to serialize and deserialize users into sessions
    passport.serializeUser((user, cb) =>  cb(null, user))
    passport.deserializeUser((obj, cb) =>  cb(null, obj))

    // The callback that is invoked when an OAuth provider sends back user
    // information. 
    const callback = (req, accessToken, refreshToken, profile, cb) => {
      return setEncryptedToken(accessToken, req.session.id)
        .then(() =>
            {GoogleApi.fetchLibrary(accessToken)
            .then(data => {
              profile.bookshelves = data.items;
              return cb(null, profile)
            })
          }
          )
    }
    passport.use(new GoogleStrategy(GOOGLE_CONFIG, callback))
  }
