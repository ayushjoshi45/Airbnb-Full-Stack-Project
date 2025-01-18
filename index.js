const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const path = require("path");
const ExpressError=require("./utils/ExpressError.js");

const listings=require("./routes/listing.js");
const reviews=require("./routes/review.js");

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

app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);

// BASE ROUTE
app.get("/", (req, res) => {
  res.redirect("/listings");
});
// Check for 404 page not found 
app.all("*",(req,res,next)=>{
  next(new ExpressError(404,"Page Not Found"));
})
// Check for err next middleware 
app.use((err, req, res, next) => {
  let{statusCode=500,message="this is error content"}=err;
  res.render("error.ejs",{err});
  // res.status(statusCode).send(message);
});
app.listen(3000, () => {
  console.log("Server listining at port 3000");
});
