const User=require("../models/user.js")

module.exports.signUpUser=async (req, res) => {
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
}
module.exports.showLogin=(req, res) => {
    res.render("user/login.ejs");
}

module.exports.loginUser=async (req, res) => {
    req.flash("success", "Welcome to Ayush project, You are logined");
    let redirectUrl=res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}

module.exports.logoutUser=(req, res) => {
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
}