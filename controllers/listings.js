const Listing = require("../models/listing.js");

module.exports.index = async (req, res) => {
  const allData = await Listing.find({});
  res.render("./listings/index.ejs", { allData });
};

module.exports.createNewListingForm = (req, res) => {
  res.render("./listings/new.ejs");
};

module.exports.showListings = async (req, res) => {
  let { id } = req.params;
  const particularData = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!particularData) {
    req.flash("error", "Listing you requested does not exist");
    res.redirect("/listings");
  }
  res.render("./listings/show.ejs", { particularData });
};

module.exports.createNewListing = async (req, res, err) => {
  let url = req.file.path;
  let filename = req.file.filename;
  const newListing = new Listing(req.body.listing);
  let response = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${req.body.listing.location}`
  );
  let data = await response.json();
  newListing.owner = req.user._id;
  newListing.image = { filename, url };
  newListing.mapDetails.lat = data[0].lat;
  newListing.mapDetails.lon = data[0].lon;
  newListing.mapDetails.displayName = data[0].display_name;
  await newListing.save();
  req.flash("success", "New Listing is Created");
  res.redirect("/listings");
};

module.exports.editForm = async (req, res) => {
  let { id } = req.params;
  const data = await Listing.findById(id);
  if (!data) {
    req.flash("error", "Listing you requested does not exist");
    res.redirect("/listings");
  }

  let orignalImageUrl = data.image.url;
  orignalImageUrl = orignalImageUrl.replace("/upload", "/upload/w_250");

  res.render("./listings/edit.ejs", { data, orignalImageUrl });
};

module.exports.updateListings = async (req, res) => {
  const { id } = req.params;
  let listings = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listings.image = { filename, url };
    await listings.save();
  }
  req.flash("success", "Listing Updated Successfully");
  res.redirect(`/listings/${id}`);
};

module.exports.deleteListings = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted Successfully");
  res.redirect("/listings");
};
