const retrieveToken = require("./retrieve-token")
const GoogleApi = require("./google-api")

const addVolume = async (shelfId, volumeId, sessionId) => {
    const accessToken = await retrieveToken(sessionId)
    return GoogleApi.addVolume(shelfId, volumeId, accessToken)
}

const removeVolume = async (shelfId, volumeId, sessionId) => {
    const accessToken = await retrieveToken(sessionId)
    return GoogleApi.removeVolume(shelfId, volumeId, accessToken)
}

module.exports = {
    addVolume,
    removeVolume
}