const express = require('express')
const router = express.Router()
const bodyParser = require("body-parser");
const passport = require('passport')
const authController = require('./controllers/auth.controller')
const googleAuth = passport.authenticate('google', { scope: ['openid profile email', "https://www.googleapis.com/auth/books"] })
const bookshelfController = require("./controllers/bookshelf-controller");
const volumeControllers = require("./controllers/volume-controllers")
const reviewControllers = require("./controllers/review-controllers")
const sessionExpiryCheck = require("./middlewares/sessionExpiryCheck")
const addSocketIdToSession = require("./middlewares/addSocketIdToSession")

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: true
 }));

// Route that is triggered by the React client
router.get('/google', addSocketIdToSession, googleAuth)

// Route that is triggered by the callback from Google once 
// the user has authenticated successfully
router.get('/google/callback', googleAuth, authController.google)

// Destroy the session when the user logs out
router.get('/logout', authController.logout)
 
router.get("/bookshelf", sessionExpiryCheck, bookshelfController)

router.get("/volume", volumeControllers.fetchVolume)

router.post("/volume/add", sessionExpiryCheck, volumeControllers.addVolume)

router.post("/volume/remove", sessionExpiryCheck, volumeControllers.removeVolume)

router.get("/reviews", reviewControllers.fetchReviews)

router.get("/myreviews", reviewControllers.fetchMyReviews)

router.post("/review", reviewControllers.addReview)

router.put("/review", reviewControllers.editReview)

router.delete("/review", reviewControllers.deleteReview)

module.exports = router
