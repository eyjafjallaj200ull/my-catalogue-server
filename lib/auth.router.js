const express = require('express')
const router = express.Router()
const bodyParser = require("body-parser");
const passport = require('passport')
const authController = require('./auth.controller')
const googleAuth = passport.authenticate('google', { scope: ['openid profile email', "https://www.googleapis.com/auth/books"] })
const jwtAuth = passport.authenticate('jwt', {session: false})
const {bookshelfCall} = require("./bookshelf-call");
const {fetchVolume} = require("./fetch-volume");
const {fetchReviews, fetchUsersReviewIds, fetchMyReviews} = require("./fetch-reviews");
const {addReview} = require("./add-review");
const {deleteReview} = require("./delete-review");
const {editReview} = require("./edit-review");
const {addVolume, removeVolume} = require("./volume-operations")
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: true
 }));


router.get('/google/callback', googleAuth, authController.google)

router.use((req, res, next) => {
  req.session.socketId = req.query.socketId
  next()
})

router.get('/google', googleAuth)


// Refresh and hydrate our user on page load
//router.get('/refresh', jwtAuth, authController.refresh)

// Destroy the session when the user logs out
router.get('/logout', authController.logout)
 
/*router.get("/bookshelf", (req, res) => {
  const bookshelfId = req.query.bookshelfId;
  bookshelfCall(bookshelfId)
  .then(data => {
    const books = data.items;
    //console.log(data);
    return res.json(books);
  })
  .catch(err => console.log(err))
})*/
router.get("/bookshelf", (req, res) => {
  bookshelfCall(req.query.bookshelfId, req.session.id)
  .then(data => {
    console.log("hi", data);
    if(data.items) {
      const books = data.items;
      return res.json(books)
    } else {
      res.status(401).json()
    }    
  })
  .catch(err => console.log(err))
})

// router.get("/volume", (req, res) => {
//   const volumeId = req.query.volumeId;
//   fetchVolume(volumeId)
//   .then(data => {
//     volumeInfo = data.volumeInfo;
//     //console.log(data);
//     return res.json(volumeInfo);
//   })
//   .catch(err => console.log(err))
// })
router.get("/volume", (req, res) => {
  fetchVolume(req.query.volumeId, req.session.id)
  .then(data => {
    console.log(data);
    
    const volumeInfo = data.volumeInfo;
    return res.json(volumeInfo);
  })
})

/*router.post("/volume/add", (req, res) => {
  const {shelfId, volumeId} = req.body;
  addVolume(shelfId, volumeId)
  .then(resp =>  resp.json() )
  .then(data => console.log(data))
  .catch(err => console.error())
})*/
router.post("/volume/add", (req, res) => {
  addVolume(req.body.shelfId, req.body.volumeId, req.session.id)
  .then(() => {
    res.status(200).json()
  })
})

// router.post("/volume/remove", (req, res) => {
//   const {shelfId, volumeId} = req.body;
//   removeVolume(shelfId, volumeId)
//   .then(resp => resp.status == 204 ? res.status(204).json() : res.status(400).json() )
//   .catch(err => console.error())
// })
router.post("/volume/remove", (req, res) => {
  removeVolume(req.body.shelfId, req.body.volumeId, req.session.id)
  .then(() => {
    res.status(200).json()
  })
})

router.get("/reviews", (req, res) => {
  const {volumeId, userId} = req.query;
  fetchReviews(volumeId).then(reviewRows => {
    fetchUsersReviewIds(volumeId, userId).then(idRows => {
      const reviews = reviewRows.map(review => {
        //review whose id is a key in idRows
        const userReview = idRows.find(obj => {
          return obj.id === review.id;
        })
        console.log(userReview)
        if(userReview) {
          review.isUserReview = true;
          return review;
        } else {
          review.isUserReview = false;
          return review;
        }
      })
      console.log(reviews);
      return res.json(reviews);
    })
  })
})

router.get("/myreviews", (req, res) => {
  const userId = req.query.userId;
  fetchMyReviews(userId)
  .then(reviews => {
    res.json(reviews)
  })
  .catch(err => console.log(err))
})

router.post("/review", (req, res) => {
  const {userid, username, content, bookid, booktitle} = req.body;
  addReview(userid, username, content, bookid, booktitle)
  .then(() => res.status(204).json())
  .catch(err => console.log(err))
})

router.put("/review", (req, res) => {
  const {content, id} = req.body;
  editReview(content, id)
  .then(() => res.status(204).json())
  .catch(err => console.log(err))
})

router.delete("/review", (req, res) => {
  const {reviewId} = req.body;
  deleteReview(reviewId)
  .then(() => res.status(204).json())
  .catch(err => console.log(err))
})

module.exports = router
