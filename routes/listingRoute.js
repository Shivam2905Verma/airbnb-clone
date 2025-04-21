const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");

const {
  isloggedIn,
  isOwner,
  serverValidatorHandler,
} = require("../middleware/middleware.js");
const {
  index,
  createNewListing,
  showListings,
  createNewListingForm,
  editForm,
  updateListings,
  deleteListings,
} = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const ExpressError = require("../utils/expressError.js");
const uplaod = multer({ storage });

router.post("/search", async (req, res) => {
  const { name } = req.body;

  const allData = await Listing.find({
    location: { $regex: name, $options: "i" },
  });

  console.log("Found listing:", allData, "Count:", allData.length);

  if (allData.length === 0) {
    req.flash("error", "Listing you requested does not exist");
    return res.redirect("/listings");
  }

  res.render("./listings/search.ejs", { allData });
});


//index show all the listings
// create new Listings
router
  .route("/")
  .get(wrapAsync(index))
  .post(
    isloggedIn,
    uplaod.single("listing[url]"),
    serverValidatorHandler,
    wrapAsync(createNewListing)
  );

// create new Listings form
router.get("/new", isloggedIn, createNewListingForm);

//show particular listings
//Delete Listings
router
  .route("/:id")
  .get(wrapAsync(showListings))
  .delete(isloggedIn, isOwner, wrapAsync(deleteListings));

//edit form
router.get("/:id/edit", isloggedIn, isOwner, wrapAsync(editForm));

//update Listings
router.patch(
  "/:id/update",
  isloggedIn,
  isOwner,
  uplaod.single("listing[url]"),
  serverValidatorHandler,
  wrapAsync(updateListings)
);

module.exports = router;
