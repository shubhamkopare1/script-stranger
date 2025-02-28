// routes/issueRoutes.js

const express = require("express");
const mongoose = require("mongoose");
const asyncWrap = require("../utils/wrapAsync");
const { ensureRole, isLoggedIn, checkAvailability } = require("../middlewear");
const Book = require("../models/book");
const Booking = require("../models/student");
const StudentData = require("../models/studentData");
const router = express.Router();

// Route to display issue page
router.get(
  "/books/issue/:id",
  isLoggedIn,
  checkAvailability,
  asyncWrap(async (req, res) => {
    const { id } = req.params;
    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).send("Book not found");
    }

    res.render("books/issue", { book, id });
  })
);

// Route to display all bookings for admin
router.get(
  "/bookIssue",
  ensureRole("admin"),
  asyncWrap(async (req, res) => {
    const bookingData = await Booking.find();

    const studentIds = bookingData.map((booking) => booking.studentId);

    const studentDatas = await StudentData.find({
      studentId: { $in: studentIds },
    });

    res.render("books/bookData", { bookingData, studentDatas });
  })
);

// Route to delete a booking
router.delete(
  "/issueBook/:id",
  ensureRole("admin"),
  asyncWrap(async (req, res) => {
    const studentId = req.params.id;
    // Find and delete the booking record by studentId
    const deletedBooking = await Booking.findOneAndDelete({
      studentId: studentId,
    });
    if (deletedBooking) {
      await Book.findByIdAndUpdate(deletedBooking.bookId, {
        $inc: { books: 1 },
      });
      req.flash("success", "Booking deleted successfully.");
      res.redirect("/bookIssue");
    } else {
      res.status(404).send("Booking record not found.");
    }
  })
);

// Route to issue a book
router.post(
  "/books/issue/:id",
  isLoggedIn,
  checkAvailability,
  asyncWrap(async (req, res) => {
    const bookId = req.params.id;
    const { title, studentId, course, book, contact  } = req.body;
    const bookToIssue = await Book.findById(bookId);
    if (bookToIssue.books <= 0) {
      req.flash("error", "This book is not available right now.");
      return res.redirect(`/books/issue/${bookId}`);
    }
    const issuedBook = await Booking.findOne({ bookId });
    if (issuedBook) {
      req.flash("error", "This book has already been issued.");
      return res.redirect(`/books/issue/${bookId}`);
    }
    const student = await StudentData.findOne({ studentId, contact });
    if (!student) {
      req.flash("error", "Invalid student ID. Please try again.");
      return res.redirect(`/books/issue/${bookId}`);
    }
    bookToIssue.books -= 1;
    await bookToIssue.save();
    const newIssue = new Booking({
      title,
      studentId,
      course,
      book,
      contact,
      issueDate: new Date(),
      dueDate: new Date(new Date().setDate(new Date().getDate() + 7)), // 7 days from now
      bookId,
      userId: req.user._id,
    });
    await newIssue.save();
    req.user.bookings.push(newIssue._id);
    await req.user.save();
    req.flash("success", "Book issued successfully!");
    res.redirect(`/books`);
  })
);

// Route to return a book
router.post(
  "/books/return/:id",
  asyncWrap(async (req, res) => {
    try {
      const bookId = req.params.id;
      const issuedBook = await Booking.findOne({ book: bookId });
      if (issuedBook) {
        issuedBook.returnDate = new Date();
        await issuedBook.save();
        req.flash("success", "Book returned successfully.");
      } else {
        req.flash("error", "No issued record found for this book.");
      }
      res.redirect(`/books/info/${bookId}`);
    } catch (error) {
      req.flash("error", "An error occurred while returning the book.");
      res.redirect(`/books/info/${bookId}`);
    }
  })
);

module.exports = router;
