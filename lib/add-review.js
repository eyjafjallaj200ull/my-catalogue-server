const {db} = require("../config")


const addReview = (userid, username, content, bookid) => {
    return db("reviews").insert(
        {
            userid: userid,
            username: username,
            content: content,
            bookid: bookid,
            timestamp: new Date()
        }
    )
}

module.exports = {
    addReview
}