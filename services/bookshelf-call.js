const retrieveToken = require("./retrieve-token")
const GoogleApi = require("./google-api")

const bookshelfCall = async (id, sessionId) => {
  const accessToken = await retrieveToken(sessionId)
  return GoogleApi.fetchBookshelf(id, accessToken)
}

module.exports = bookshelfCall
