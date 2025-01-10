const express = require('express')
const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');
const router = express.Router({mergeParams: true});

router.use(authController.protect);

router
    .route('/')
    .get(reviewController.getAllReviews)
    .post( authController.restrictTo('user'),reviewController.setTourUserIds,reviewController.createReview);

router.route('/:id')
    .patch( authController.restrictTo('user','admin'),reviewController.updateReview)
    .get(reviewController.getReview)
    .delete( authController.restrictTo('user','admin'),reviewController.deleteReview);


module.exports = router;