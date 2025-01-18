const express=require("express");
const router=express.Router();
const Listing = require("../models/listing.js");
const wrapAsync=require("../utils/wrapAsync.js")
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema}=require("../schema.js");

const validateListing=(req,res,next)=>{
    const {error}=listingSchema.validate(req.body);
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

// INDEX ROUTE
router.get("/", wrapAsync(async (req, res) => {
    const listings = await Listing.find({});
    res.render("./listings/index.ejs", { listings });
  }));
  
  // Create new listing route
  router.get("/new", (req, res) => {
    res.render("./listings/newListings.ejs");
  });
  
  // Show routes
  router.get("/:id",wrapAsync(async (req, res) => {
    let { id } = req.params;
    const specificPost = await Listing.findById(id).populate("reviews");
    if(!specificPost){
      req.flash("error","This listing does not exist");
      res.redirect("/listings");
    }
    else{
      res.render("./listings/show.ejs", { specificPost });
    }
  }));
  
  // OPEN EDIT PAGE
  router.get("/:id/edit",wrapAsync(async (req, res) => {
    const { id } = req.params;
    const editPost = await Listing.findById(id);
    if(!editPost){
      req.flash("error","This listing does not exist");
      res.redirect("/listings");
    }
    else{
      res.render("./listings/edit.ejs", { editPost });
    }
  }));
  
  // route to add new object to database
  router.post("/", validateListing, wrapAsync(async (req, res) => {
      const newListings = new Listing(req.body.listings);
      await newListings.save();
      req.flash("success","New Listing Created Successfully");
      res.redirect("/listings");
  }));
  
  // ROUTE TO UPDATE OBJECT
  router.put("/:id",validateListing, wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listings });
    req.flash("success","Listing Edited Successfully");
    res.redirect(`/listings/${id}`);
  }));
  
  // DELETE ROUTE
  router.delete("/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted Successfully");
    res.redirect("/listings");
  }));

  module.exports=router;