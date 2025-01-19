const express=require("express")
const router=express.Router({mergeParams:true});
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {reviewSchema}=require("../schema.js");

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
router.post("/",validateReview,wrapAsync(async(req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);
    listing.reviews.push(newReview);
  
    await newReview.save();
    await listing.save();
    req.flash("success","Review Created Successfully");
    res.redirect(`/listings/${listing._id}`)
  }));
  
  // Delete Review Route 
  router.delete("/:reviewId",wrapAsync(async(req,res)=>{
    const{id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted Successfully");
    res.redirect(`/listings/${id}`);
  }));

  // Edit Review
  router.put("/:reviewId",(req,res)=>{
    const reviewId=req.params;
    const currentEdit=Review.findById(reviewId).populate("");
    // console.log(currentEdit);
    // res.render("./listings/editReview.ejs")
  })

  module.exports=router;