if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = 3000;
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/expressError.js");
const listingRoute = require("./routes/listingRoute.js");
const reviewRoute = require("./routes/reviewRoute.js");
const signupRoute = require("./routes/signupRoute.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const dbUrl = process.env.ATLAS_MONGO;

main()
  .then(() => {
    console.log("connected succesfully");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error" ,(err)=>{
  console.log("Error in mongoDB store" , err)
})

const sessionOption = {
  store,
  secret:process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 6 * 24 * 60 * 60 * 1000,
    maxAge: 6 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};


app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});
app.use("/listings", listingRoute);
app.use("/listings/:id/reviews", reviewRoute);
app.use("/", signupRoute);

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
  let { status = 505, message = "Internal Server Error" } = err;
  res.status(status).render("error.ejs", { err });
});

app.listen(port, () => {
  console.log(`listening on http://127.0.0.1:${port}/`);
});
