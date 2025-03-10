const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const bodyParser = require("body-parser");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
require("./views/passportConfig");
const userRoutes = require("./routes/userRoutes");
const bookRoutes = require("./routes/booksRoute");
const issueRoutes = require("./routes/bookIssueRoutes");
const bookInfoRoutes = require("./routes/bookInfoRoutes");
const profileRoutes = require("./routes/profileRoutes");
const books = require("./routes/books");
const studentData = require("./routes/studentData");

const ExpressError = require("./utils/expressError.js");
const methodOverride = require("method-override");

const app = express();

app.use(
  session({
    secret: process.env.SECRET_KEY, 
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    },
  })
);

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  next();
});

app.listen(8080, () => {
  console.log("server started");
});
// app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "views"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(methodOverride("_method"));
// "mongodb://127.0.0.1:27017/books"
const dbUrl = process.env.MONGO_URL;
async function main() {
  await mongoose.connect(dbUrl);
}

main()
  .then(() => {
    console.log("connection establish");
  })
  .catch((err) => {
    console.log(err);
  });

app.use("/", userRoutes);
app.use("/", bookRoutes);
app.use("/", issueRoutes);
app.use("/books", bookInfoRoutes);
app.use("/profile", profileRoutes);
app.use("/", books);
app.use("/", studentData);

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "page is not found"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "something went wrong" } = err;
  res.status(statusCode).render("error.ejs", { message });
});
