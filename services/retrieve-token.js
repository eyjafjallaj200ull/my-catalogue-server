const {getAsync} = require("./redis-client");
const kmsClient = require("./kms-client")
const {decrypt} = require("./utils")
const atob = require('atob');
const btoa = require("btoa");
const {kms} = require("../config/config")

const retrieveToken = async (sessionId) => {
    const {projectId, keyRingId, cryptoKeyId} = kms;
    const binaryEncryptedAT = await getAsync(sessionId);
    const encryptedAccessToken = btoa(binaryEncryptedAT);
    const base64AT = await decrypt(projectId, keyRingId, cryptoKeyId, encryptedAccessToken, kmsClient)
    const accessToken = atob(base64AT)
    return accessToken
}

module.exports = retrieveToken