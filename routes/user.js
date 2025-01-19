const express=require("express")
const router=express.Router();
const User=require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");

router.get("/signup",(req,res)=>{
    res.render("user/signup.ejs")
})

router.post("/signup",wrapAsync(async(req,res)=>{
    try {
        let{username,email,password}=req.body;
        const newUser= new User({email,username});
        const registerUser=await User.register(newUser,password);
        req.flash("success", "User register Successfully");
        res.redirect("/listings");
    } catch (error) {
        req.flash("error","User with this username already exist");
        res.redirect("/signup");
    }
}));

router.get("/login",(req,res)=>{
    res.render("user/login.ejs");
})

router.post("/login",passport.authenticate("local",{
    failureRedirect:"/login",
    failureFlash:true,
}),async(req,res)=>{
    req.flash("success","Welcome to Ayush project, You are logined");
    res.redirect("/listings");
})

module.exports=router;