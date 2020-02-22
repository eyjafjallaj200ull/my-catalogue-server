const {db} = require("../config")

const editReview = (content, id) => {
    return db("reviews").where("id", id).update("content", content)
}

module.exports = {
    editReview
}