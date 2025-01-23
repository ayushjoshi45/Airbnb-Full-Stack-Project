const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const { isUserLogin, isOwner } = require("../middleware/verify.js");

// Requiring Controllers
const listingController = require("../controllers/listing.js");

const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  console.log(req.error);
  if (error) {
    const errmes = error.details.map((data) => data.message).join(",");
    return next(new ExpressError(400, errmes));
  } else {
    next();
  }
};

// Create new listing route
router.get("/new", isUserLogin, listingController.newForm);

// OPEN EDIT PAGE
router.get("/:id/edit", isUserLogin, wrapAsync(listingController.openEdit));

router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isUserLogin,
    validateListing,
    wrapAsync(listingController.addNewListing)
  );

router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isUserLogin,
    isOwner,
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(isUserLogin, wrapAsync(listingController.deleteListing));

module.exports = router;
