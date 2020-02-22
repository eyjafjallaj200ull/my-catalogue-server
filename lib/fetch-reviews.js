const {db} = require("../config")

const fetchReviews = (id) => {
    return db("reviews").select().where("bookid", id)
    .then(rows => {
      return rows
    });
}

const fetchMyReviews = (userId) => {
  return db("reviews").select().where("userid", userId)
  .then(rows => {
    return rows
  });
}

const fetchUsersReviewIds = (bookId, userId) => {
  return db("reviews").select("id").where("bookid", bookId).andWhere("userid", userId)
  .then(rows => {
    return rows;
  })
}

module.exports = {
    fetchReviews,
    fetchUsersReviewIds,
    fetchMyReviews
}