const express = require("express")
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware/verify.js");

router.get("/signup", (req, res) => {
    res.render("user/signup.ejs")
})

router.post("/signup", wrapAsync(async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registerUser = await User.register(newUser, password);
        req.login(registerUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "User register Successfully");
            res.redirect("/listings");
        })

    } catch (error) {
        req.flash("error", "User with this username already exist");
        res.redirect("/signup");
    }
}));

router.get("/login", (req, res) => {
    res.render("user/login.ejs");
})

router.post("/login",saveRedirectUrl, passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
}), async (req, res) => {
    req.flash("success", "Welcome to Ayush project, You are logined");
    let redirectUrl=res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
})

// Logout route 

router.get("/logout", (req, res) => {
    if (!req.isAuthenticated()) {
        req.flash("error", "You are already Logout");
        return res.redirect("/listings");
    }
    else {
        req.logout((err) => {
            if (err) {
                next(err);
            }
            else {
                req.flash("success", "Logout Successfully");
                res.redirect("/listings");
            }
        })
    }
})

module.exports = router;