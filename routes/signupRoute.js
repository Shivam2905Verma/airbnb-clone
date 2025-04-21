const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware/middleware.js");
const {
  signupNewUser,
  renderLoginForm,
  renderSignupForm,
  successLogin,
  logOut,
} = require("../controllers/user.js");


//render sign up form
//sign up new user
router.route("/signup")
.get(renderSignupForm)
.post(wrapAsync(signupNewUser));

//render login form
//login
router.route("/login")
.get(renderLoginForm)
.post(saveRedirectUrl, passport.authenticate("local", 
  {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  successLogin
);

//logout
router.get("/logout", logOut);

module.exports = router;
