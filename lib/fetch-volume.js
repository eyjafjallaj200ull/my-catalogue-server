const {GOOGLE_CONFIG} = require("../config");
const fetch = require('node-fetch');
const {getAsync} = require("./redisClient");
const kmsClient = require("./kmsClient")
const {decrypt} = require("./utils")
const atob = require('atob');
const btoa = require("btoa");

const fetchVolume = (id, sessionId) => {
  return fetch(`https://www.googleapis.com/books/v1/volumes/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  })
  .then(res => res.json())
  .catch(err => console.log(err)
  )
}

module.exports = {
  fetchVolume
}