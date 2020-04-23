const {db} = require("../../config/config")


const addReview = (userid, username, content, bookid, booktitle) => {
    return db("reviews").insert(
        {
            userid: userid,
            username: username,
            content: content,
            bookid: bookid,
            booktitle: booktitle,
            timestamp: new Date()
        }
    )
}

module.exports = {
    addReview
}