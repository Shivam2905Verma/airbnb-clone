const mongoose = require("mongoose");
const Review = require("./reviews.js");
const { types, string } = require("joi");

const listingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: {
    filename: { type: String },
    url: {
      type: String,
      default:
        "https://img.freepik.com/premium-photo/home-with-driveway-that-has-driveway-that-has-garage-door-that-says-welcome-home_1291376-1855.jpg?w=996",
      set: (v) => {
        return v === ""
          ? "https://img.freepik.com/premium-photo/home-with-driveway-that-has-driveway-that-has-garage-door-that-says-welcome-home_1291376-1855.jpg?w=996"
          : v;
      },
    },
  },
  price: { type: Number, required: true, min: 0 },
  location: { type: String, required: true },
  mapDetails:{
    lon: { type: String },
    lat: { type: String },
    displayName: {type: String}
  },
  country: { type: String, required: true },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

listingSchema.post("findOneAndDelete", async (data) => {
  if (data) {
    await Review.deleteMany({ _id: { $in: data.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
