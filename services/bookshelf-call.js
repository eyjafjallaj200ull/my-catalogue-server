const retrieveToken = require("./retrieve-token")
const GoogleApi = require("./google-api")
/*
session can expire
accesstoken can expire

if(!binaryEncryptedAT) {
  delAsync(sessionId)
  .then(() => null)
}
*/
const bookshelfCall = async (id, sessionId) => {
  const accessToken = await retrieveToken(sessionId)
  return GoogleApi.fetchBookshelf(id, accessToken)
}

module.exports = bookshelfCall
