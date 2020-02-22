const {GOOGLE_CONFIG} = require("../config");
const fetch = require('node-fetch');
const {getAsync} = require("./redisClient");
const kmsClient = require("./kmsClient")
const {decrypt} = require("./utils")
const atob = require('atob');
const btoa = require("btoa");

const fetchVolume = async (id, sessionId) => {
  const encryptedAccessToken = await getAsync(sessionId);
  const base64AT = await decrypt("my-catalogue1", "project", "google-auth", encryptedAccessToken, kmsClient)
  const accessToken = atob(base64AT)
  return fetch(`https://www.googleapis.com/books/v1/volumes/${id}?key=${GOOGLE_CONFIG.clientSecret}`, {
    method: "GET",
    withCredentials: true,
    credentials: 'include',
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    }
  })
  .then(res => res.json())
}

module.exports = {
  fetchVolume
}