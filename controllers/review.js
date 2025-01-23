const Listing=require("../models/listing.js");
const Review=require("../models/review.js");

module.exports.createrReview=async(req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);
    newReview.createdBy=req.user._id;
    listing.reviews.push(newReview);  
    await newReview.save();
    await listing.save();
    req.flash("success","Review Created Successfully");
    res.redirect(`/listings/${listing._id}`)
  }

  module.exports.deleteReview=async(req,res)=>{
    const{id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted Successfully");
    res.redirect(`/listings/${id}`);
  }

  module.exports.editReview=(req,res)=>{
    const reviewId=req.params;
    const currentEdit=Review.findById(reviewId).populate("");
    // console.log(currentEdit);
    // res.render("./listings/editReview.ejs")
  }