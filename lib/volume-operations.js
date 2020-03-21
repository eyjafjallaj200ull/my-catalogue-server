const {GOOGLE_CONFIG} = require("../config");
const fetch = require('node-fetch');
const {getAsync} = require("./redisClient");
const kmsClient = require("./kmsClient")
const {decrypt} = require("./utils")
const atob = require('atob');
const btoa = require("btoa");

const addVolume = async (shelfId, volumeId, sessionId) => {
    const binaryEncryptedAT = await getAsync(sessionId);
    console.log(binaryEncryptedAT);
    const encryptedAccessToken = btoa(binaryEncryptedAT);
    
    const base64AT = await decrypt("my-catalogue1", "project", "google-auth", encryptedAccessToken, kmsClient)
    const accessToken = atob(base64AT)
    return fetch(`https://www.googleapis.com/books/v1/mylibrary/bookshelves/${shelfId}/addVolume?volumeId=${volumeId}&key=${GOOGLE_CONFIG.clientSecret}`, {
        method: "POST",
        withCredentials: true,
        credentials: 'include',
        headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json"
        }
    })
    .catch(err => console.log(err))
}

const removeVolume = async (shelfId, volumeId, sessionId) => {
    const binaryEncryptedAT = await getAsync(sessionId);
    console.log(binaryEncryptedAT);
    const encryptedAccessToken = btoa(binaryEncryptedAT);
    
    const base64AT = await decrypt("my-catalogue1", "project", "google-auth", encryptedAccessToken, kmsClient)
    const accessToken = atob(base64AT)
    return fetch(`https://www.googleapis.com/books/v1/mylibrary/bookshelves/${shelfId}/removeVolume?volumeId=${volumeId}&key=${GOOGLE_CONFIG.clientSecret}`, {
        method: "POST",
        withCredentials: true,
        credentials: 'include',
        headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json"
        }
    })
    .catch(err => console.log(err))
}

module.exports = {
    addVolume,
    removeVolume
}