const express = require("express")
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { saveRedirectUrl } = require("../middleware/verify.js");
const passport = require("passport");


const userController=require("../controllers/user.js");

router.get("/signup", (req, res) => {
    res.render("user/signup.ejs")
})

router.post("/signup", wrapAsync(userController.signUpUser));

router.get("/login", userController.showLogin)

router.post("/login",saveRedirectUrl,passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
}), userController.loginUser)

// Logout route 

router.get("/logout", userController.logoutUser)

module.exports = router;