const mongoose = require("mongoose");
const Schema = require("mongoose");
const Review = require("../models/review.js");
const User = require("../models/user.js");

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true,
    unique: true,
  },
  description: {
    type: String,
  },
  url: {
    link: String,
    filename: String,
  },
  price: {
    type: Number,
    require: true,
  },
  location: {
    type: String,
    require: true,
  },
  country: {
    type: String,
    require: true,
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

listingSchema.post("findOneAndDelete", async (data) => {
  // console.log("init delete in review");
  if (data) {
    await Review.deleteMany({ _id: { $in: data.reviews } });
  }
});
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
