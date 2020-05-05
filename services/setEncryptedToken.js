const kmsClient = require("./kms-client");
const {encrypt} = require("./utils");
const {setAsync} = require("./redis-client")
const atob = require('atob');
const btoa = require("btoa");
const {kms} = require("../config/config")
const {projectId, keyRingId, cryptoKeyId} = kms;

const setEncryptedToken = async (accessToken, sessionId) => {
    const base64AT = btoa(accessToken);
    const encryptedAccessToken = await encrypt(projectId, keyRingId, cryptoKeyId, base64AT, kmsClient);
    const binaryEncryptedAT = atob(encryptedAccessToken);
    return setAsync(sessionId, binaryEncryptedAT)
}

module.exports = setEncryptedToken;