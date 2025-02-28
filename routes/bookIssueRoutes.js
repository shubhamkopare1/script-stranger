const express = require("express");
const mongoose = require("mongoose");
const asyncWrap = require("../utils/wrapAsync");
const { ensureRole, isLoggedIn, checkAvailability } = require("../middlewear");
const Book = require("../models/book");
const Booking = require("../models/student");
const StudentData = require("../models/studentData");
const router = express.Router();
const sgMail = require("@sendgrid/mail");
require("dotenv").config();

// ✅ Set SendGrid API Key once
sgMail.setApiKey(process.env.SENDGRID_API_KEY);


const sendIssueEmail = async (email, studentName, bookTitle, dueDate) => {
  if (!email) {
    console.error("⚠️ No recipient email provided, skipping issue email.");
    return;
  }

  try {
    const msg = {
      to: email,
      from: {
        email: process.env.SENDER_EMAIL, // ✅ Ensure this is set in .env
        name: "Library Admin",
      },
      subject: "📚 Library Book Issue Confirmation",
      text: `Dear ${studentName},\n\nYou have successfully issued the book "${bookTitle}".\nPlease return it by ${dueDate}.\n\nThank you!`,
    };

    await sgMail.send(msg);
    console.log("📨 Issue Confirmation Email Sent Successfully!");
  } catch (error) {
    console.error("⚠️ Error Sending Issue Email: ", error.response ? error.response.body : error);
  }
};

// ✅ Function to Send Return Email
const sendReturnEmail = async (email, studentName, bookTitle) => {
  if (!email) {
    console.error("⚠️ No recipient email provided, skipping return email.");
    return;
  }

  try {
    const msg = {
      to: email,
      from: {
        email: process.env.SENDER_EMAIL, // ✅ Ensure this is set in .env
        name: "Library Admin",
      },
      subject: "📚 Library Book Return Confirmation",
      text: `Dear ${studentName},\n\nYou have successfully returned the book "${bookTitle}".\nThank you for using our library services.\n\nRegards,\nLibrary Team`,
    };

    await sgMail.send(msg);
    console.log("📨 Return Confirmation Email Sent Successfully!");
  } catch (error) {
    console.error("⚠️ Error Sending Return Email: ", error.response ? error.response.body : error);
  }
};

// ✅ Route to Display Book Issue Page
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

// ✅ Route to Display All Bookings for Admin
router.get(
  "/bookIssue",
  ensureRole("admin"),
  asyncWrap(async (req, res) => {
    const bookingData = await Booking.find();
    const studentIds = bookingData.map((booking) => booking.studentId);
    const studentDatas = await StudentData.find({ studentId: { $in: studentIds } });

    res.render("books/bookData", { bookingData, studentDatas });
  })
);

// ✅ Route to Issue a Book
router.post(
  "/books/issue/:id",
  isLoggedIn,
  checkAvailability,
  asyncWrap(async (req, res) => {
    const bookId = req.params.id;
    const { title, studentId, course, book, contact, email } = req.body;
    const bookToIssue = await Book.findById(bookId);

    if (!email) {
      req.flash("error", "Email is required to issue a book.");
      return res.redirect(`/books/issue/${bookId}`);
    }

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

    // 📌 Reduce book count
    bookToIssue.books -= 1;
    await bookToIssue.save();

    // 📌 Create new booking
    const dueDate = new Date(new Date().setDate(new Date().getDate() + 7)); // 7 days from now
    const newIssue = new Booking({
      title,
      studentId,
      course,
      book,
      contact,
      email, // ✅ Store email in DB
      issueDate: new Date(),
      dueDate,
      bookId,
      userId: req.user._id,
    });

    await newIssue.save();
    req.user.bookings.push(newIssue._id);
    await req.user.save();

    // 📌 Send confirmation email
    await sendIssueEmail(email, title, book, dueDate.toDateString());

    req.flash("success", "Book issued successfully! A confirmation email has been sent.");
    res.redirect(`/books`);
  })
);

// ✅ Route to Return a Book and Send Email
router.delete(
  "/issueBook/:id",
  ensureRole("admin"),
  asyncWrap(async (req, res) => {
    const studentId = req.params.id;

    // 🔍 Find and Delete Booking Record
    const deletedBooking = await Booking.findOneAndDelete({ studentId });

    if (deletedBooking) {
      // 🔄 Increase Book Count
      await Book.findByIdAndUpdate(deletedBooking.bookId, { $inc: { books: 1 } });

      // 📨 Fetch Student Email for Notification
      const student = await StudentData.findOne({ studentId });

      if (student && student.email) {
        await sendReturnEmail(student.email, student.name, deletedBooking.book);
      } else {
        console.warn("⚠️ No email found for student:", studentId);
      }

      req.flash("success", "Booking deleted successfully.");
      res.redirect("/bookIssue");
    } else {
      res.status(404).send("Booking record not found.");
    }
  })
);

// ✅ Route to Return a Book (Fixing Book ID Reference)
router.post(
  "/books/return/:id",
  asyncWrap(async (req, res) => {
    try {
      const bookId = req.params.id;
      const issuedBook = await Booking.findOne({ bookId }); // 🔥 FIXED HERE

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
