const {fetchReviews, fetchUsersReviewIds, fetchMyReviews} = require("../../services/review-services/fetch-reviews");
const {addReview} = require("../../services/review-services/add-review");
const {deleteReview} = require("../../services/review-services/delete-review");
const {editReview} = require("../../services/review-services/edit-review");

exports.fetchReviews = (req, res) => {
    const {volumeId, userId} = req.query;
    fetchReviews(volumeId).then(reviewRows => {
      fetchUsersReviewIds(volumeId, userId).then(idRows => {
        const reviews = reviewRows.map(review => {
          //review whose id is a key in idRows
          const userReview = idRows.find(obj => {
            return obj.id === review.id;
          })
          if(userReview) {
            review.isUserReview = true;
            return review;
          } else {
            review.isUserReview = false;
            return review;
          }
        })
        return res.json(reviews);
      }) //catch
    })
    .catch(err => {
      res.status(500).json()
    })
}

exports.fetchMyReviews = (req, res) => {
    const userId = req.query.userId;
    fetchMyReviews(userId)
    .then(reviews => {
      res.json(reviews)
    })
    .catch(err => res.status(500).json())
}

exports.addReview = (req, res) => {
    const {userid, username, content, bookid, booktitle} = req.body;
    addReview(userid, username, content, bookid, booktitle)
    .then(() => res.status(204).json())
    .catch(err => res.status(500).json())
}

exports.deleteReview = (req, res) => {
    const {reviewId} = req.body;
    deleteReview(reviewId)
    .then(() => res.status(204).json())
    .catch(err => res.status(500).json())
}

exports.editReview = (req, res) => {
    const {content, id} = req.body;
    editReview(content, id)
    .then(() => res.status(204).json())
    .catch(err => res.status(500).json()) 
}