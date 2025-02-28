// middleware.js
const mongoose = require("mongoose");
const Book = require("./models/book");

// isLoggedIn middleware
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.session.returnTo = req.originalUrl;
  res.redirect("/login");
}

// checkAvailability middleware
const checkAvailability = async (req, res, next) => {
  try {
    const bookId = req.params.id;
    const book = await Book.findById(bookId);
    if (book && book.books > 0) {
      return next();
    } else {
      res.status(404).render("books/bookNotAvailable", { bookId });
    }
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

function ensureRole(role) {
  return function (req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    }
    req.flash("error", "you have not permission of this page .");
    res.redirect("/");
  };
}
function isValidObjectId(id) {
  return (
    mongoose.Types.ObjectId.isValid(id) &&
    String(new mongoose.Types.ObjectId(id)) === id
  );
}

module.exports = { isLoggedIn, checkAvailability, ensureRole, isValidObjectId };
