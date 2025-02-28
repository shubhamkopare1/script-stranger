const express = require("express");
const mongoose = require("mongoose");
const asyncWrap = require("../utils/wrapAsync");
const {
  ensureRole,
  isLoggedIn,
  checkAvailability,
  isValidObjectId,
} = require("../middlewear");
const Book = require("../models/book");
const Booking = require("../models/student");

const router = express.Router();

router.get(
  "/:id", 
  
  checkAvailability,
  asyncWrap(async (req, res) => {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).send("Invalid book ID");
    }
    const bookdata = await Book.findById(id);
    if (!bookdata) {
      return res.status(404).send("Book not found");
    }
    const issuedBook = req.user
    ? await Booking.findOne({ bookId: bookdata._id, userId: req.user._id })
    : null;
    res.render("books/info", { bookdata, issuedBook, user: req.user });
  })
);

router.get(
  "/info/edit/:id",
  ensureRole("admin"),
  isLoggedIn,
  asyncWrap(async (req, res) => {
    const bookId = req.params.id;
    const bookdata = await Book.findById(bookId);
    if (!bookdata) {
      return res.status(404).send("Book not found");
    }
    res.render("books/bookEdit", { bookdata });
  })
);

// Route to handle book editing
router.post(
  "/book/edit/:id",
  ensureRole("admin"),
  isLoggedIn,
  asyncWrap(async (req, res) => {
    const id = req.params.id;
    const { title, author, info, location ,latitude, longitude } = req.body;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send("Invalid book ID format");
    }
    await Book.findByIdAndUpdate(id, { title, author, info, location ,latitude, longitude});
    req.flash("success", "Book data edited successfully");
    res.redirect(`/books/${id}`);
  })
);

module.exports = router;
