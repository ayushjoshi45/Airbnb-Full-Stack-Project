if(process.env.NODE_ENV!="production"){
  require("dotenv").config();
}
console.log(process.env.secret);

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const path = require("path");
const ExpressError=require("./utils/ExpressError.js");
const session=require("express-session");
const flash=require("connect-flash");
const passport=require("passport");
const localStrategy=require("passport-local");
const User=require("./models/user.js");

const listingsRouter=require("./routes/listing.js");
const reviewsRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");

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

const sessionOption={
  secret:"mysupersecretcode",
  resave:false,
  saveUninitialized:true,
  cookie:{
    expire:Date.now()+7*24*60*60*100,
    maxAge:7*24*60*60*1000,
    httpOnly:true,
  }
};

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.currentuser=req.user;
  next(); 
})

app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",userRouter);


app.get("/demo",async(req,res)=>{
  let fakeUser=new User({
    email:"demo@gmail.com",
    username:"demo123",
  });
  let newUser=await User.register(fakeUser,"hello");

  res.send(newUser);
})

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
