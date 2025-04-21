const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const {reviewServerValidation, isloggedIn, isauthor,} = require("../middleware/middleware.js");

const { createNewReview, deleteReview } = require("../controllers/reviews.js");

//create new review
router.post("/", isloggedIn, reviewServerValidation, wrapAsync(createNewReview));

//delete reeview
router.delete("/:reviewId", isloggedIn, isauthor, wrapAsync(deleteReview));

module.exports = router;
