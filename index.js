const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const path = require("path");
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const listingSchema=require("./schema.js");
const reviewSchema=require("./schema.js");

const MONGO_URI = "mongodb://127.0.0.1:27017/airbnb";
app.set("view engine", "ejs");
app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

main()
  .then(() => {
    console.log("Database sucessfully connected");
  })
  .catch((err) => console.log(err));
async function main() {
  await mongoose.connect(MONGO_URI);
}

const validateListing=(req,res,next)=>{
  let{error}=listingSchema.validate(req.body);
  if(error){
    throw new ExpressError(404,error)
  }
  else{
    next();
  }
}
const validateReview=(req,res,next)=>{
  let{error}=reviewSchema.validate(req.body);
  if(error){
    throw new ExpressError(404,error)
  }
  else{
    next();
  }
}

// BASE ROUTE
app.get("/", (req, res) => {
  res.redirect("/listings");
});

// INDEX ROUTE
app.get("/listings", wrapAsync(async (req, res) => {
  const listings = await Listing.find({});
  res.render("./listings/index.ejs", { listings });
}));

// Create new listing route
app.get("/listings/new", (req, res) => {
  res.render("./listings/newListings.ejs");
});

// Show routes
app.get("/listings/:id",wrapAsync(async (req, res) => {
  let { id } = req.params;
  const specificPost = await Listing.findById(id).populate("reviews");
  res.render("./listings/show.ejs", { specificPost });
}));

// OPEN EDIT PAGE
app.get("/listings/:id/edit",wrapAsync(async (req, res) => {
  const { id } = req.params;
  const editPost = await Listing.findById(id);
  res.render("./listings/edit.ejs", { editPost });
}));

// route to add new object to database
app.post("/listings",validateListing, wrapAsync(async (req, res) => {
    const newListings = new Listing(req.body.listings);
    await newListings.save();
    res.redirect("/listings");
}));

// ROUTE TO UPDATE OBJECT
app.put("/listings/:id",validateListing, wrapAsync(async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listings });
  res.redirect(`/listings/${id}`);
}));

// DELETE ROUTE
app.delete("/listings/:id", wrapAsync(async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
}));
// Reviews 

app.post("/listings/:id/reviews",validateReview,wrapAsync(async(req,res)=>{
  let listing=await Listing.findById(req.params.id);
  let newReview=new Review(req.body.review);
  listing.reviews.push(newReview);

  await newReview.save();
  await listing.save();
  console.log("review saved");
  res.redirect(`/listings/${listing._id}`)
}));
app.all("*",(req,res,next)=>{
  next(new ExpressError(404,"Page Not Found"));
})
app.use((err, req, res, next) => {
  let{statusCode=500,message="this is error content"}=err;
  res.render("error.ejs",{err});
  // res.status(statusCode).send(message);
});
app.listen(3000, () => {
  console.log("Server listining at port 3000");
});
