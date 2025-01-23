const Listing=require("../models/listing.js");
const Review = require("../models/review.js");

module.exports.isUserLogin=(req,res,next)=>{
    if(!req.isAuthenticated()){
      req.session.redirectUrl=req.originalUrl;
        req.flash("error","You must be login to create listing");
        return res.redirect("/login");
      }
      else{
          next();
        }
}

module.exports.saveRedirectUrl=(req,res,next)=>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl=req.session.redirectUrl;
  }
  next();
}

module.exports.isOwner=async(req,res,next)=>{
  const {id}=req.params;
  const listing=await Listing.findById(id);
  if(!listing.owner._id.equals(res.locals.currentuser._id)){
    req.flash("error","You can not edit this lsiting");
    return res.redirect(`/listings/${id}`);
  }
  next();
}


module.exports.isReviewOwner=async(req,res,next)=>{
  const {id,reviewId}=req.params;
  const review=await Review.findById(reviewId);
  if(!review.createdBy.equals(res.locals.currentuser._id)){
    req.flash("error","You can not delete this review");
    return res.redirect(`/listings/${id}`);
  }
  next();
}