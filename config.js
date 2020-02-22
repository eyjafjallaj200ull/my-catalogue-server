//const { ExtractJwt } = require('passport-jwt')
const knex       = require('knex');

const googleURL = "http://localhost:8080/google/callback";

exports.GOOGLE_CONFIG = {
  clientID: process.env.GOOGLE_KEY,
  clientSecret: process.env.GOOGLE_SECRET,
  callbackURL: googleURL,
  passReqToCallback: true,
  accessType: "offline",
  prompt: 'consent'
}

exports.CLIENT_ORIGIN = "http://localhost:3000";

exports.db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : process.env.DB_PASSWORD,
    database : 'my-catalogue'
  }
});

// const JWT_SECRET = process.env.JWT_SECRET
// exports.JWT_SECRET = JWT_SECRET

// exports.JWT_CONFIG = {
//   secretOrKey: JWT_SECRET,
//   jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
//   algorithms: ['HS256']
// }