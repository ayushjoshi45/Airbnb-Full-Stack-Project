const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const path = require("path");
const wrapAsync=require("./utils/wrapAsync.js");

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

// BASE ROUTE
app.get("/", (req, res) => {
  res.redirect("/listings");
});

// INDEX ROUTE
app.get("/listings", async (req, res) => {
  const listings = await Listing.find({});
  res.render("./listings/index.ejs", { listings });
});

// Create new listing route
app.get("/listings/new", (req, res) => {
  res.render("./listings/newListings.ejs");
});

// Show routes
app.get("/listings/:id", async (req, res) => {
  let { id } = req.params;
  const specificPost = await Listing.findById(id);
  res.render("./listings/show.ejs", { specificPost });
});

// OPEN EDIT PAGE
app.get("/listings/:id/edit", async (req, res) => {
  const { id } = req.params;
  const editPost = await Listing.findById(id);
  res.render("./listings/edit.ejs", { editPost });
});

// route to add new object to database
app.post("/listings", wrapAsync(async (req, res) => {
    const newListings = new Listing(req.body.listings);
    await newListings.save();
    res.redirect("/listings");
}));

// ROUTE TO UPDATE OBJECT
app.put("/listings/:id", async (req, res) => {
  const { id } = req.params;
  // const updatedPost=await req.body.listings;
  await Listing.findByIdAndUpdate(id, { ...req.body.listings });
  res.redirect(`/listings/${id}`);
});

// DELETE ROUTE
app.delete("/listings/:id", async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
});

app.use((err, req, res, next) => {
  res.send("error occured");
});
app.listen(3000, () => {
  console.log("Server listining at port 3000");
});
