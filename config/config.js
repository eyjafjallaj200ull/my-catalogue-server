const knex       = require('knex');

const googleURL = "http://localhost:8080/google/callback";

exports.GOOGLE_CONFIG = {
  clientID: process.env.GOOGLE_KEY,
  clientSecret: process.env.GOOGLE_SECRET,
  callbackURL: googleURL,
  passReqToCallback: true,
  accessType: "offline"
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

exports.kms = {
  projectId: process.env.PROJECT_ID,
  keyRingId: process.env.KEYRING_ID,
  cryptoKeyId: process.env.CRYPTO_KEY_ID
}