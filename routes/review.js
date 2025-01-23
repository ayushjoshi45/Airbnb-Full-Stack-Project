const express=require("express")
const router=express.Router({mergeParams:true});
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {reviewSchema}=require("../schema.js");
const { isUserLogin, isReviewOwner } = require("../middleware/verify.js");

const reviewController=require("../controllers/review.js");

const validateReview=(req,res,next)=>{
  const {error}=reviewSchema.validate(req.body);
  console.log(req.error);
  if(error){
    const errmes=error.details.map((data)=>data.message).join(',');
  return next(new ExpressError(400,errmes));
  }
  else{
    next();
  }
  // console.log(req.error);
}

// Reviews at show route for reviews
router.post("/",isUserLogin,validateReview,wrapAsync(reviewController.createrReview));
  
  // Delete Review Route 
  router.delete("/:reviewId",isUserLogin,isReviewOwner,wrapAsync(reviewController.deleteReview));

  // Edit Review
  router.put("/:reviewId",reviewController.editReview)

  module.exports=router;