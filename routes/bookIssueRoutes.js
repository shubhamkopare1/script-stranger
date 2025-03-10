const express = require("express");
const mongoose = require("mongoose");
const asyncWrap = require("../utils/wrapAsync");
const { ensureRole, isLoggedIn, checkAvailability } = require("../middlewear");
const Book = require("../models/book");
const Booking = require("../models/student");
const StudentData = require("../models/studentData");
const router = express.Router();
const { Resend } = require("resend");

require("dotenv").config();

// ✅ Set Resend API Key
const resend = new Resend(process.env.RESEND_API_KEY);

const crypto = require("crypto");
const otpStore = new Map(); // ✅ Temporary store for OTP verification

const generateOTP = () => Math.floor(100000 + Math.random() * 900000); // 6-digit OTP

// ✅ Function to Send OTP via Resend API
const sendOTPEmail = async (email, otp) => {
  if (!email) {
    console.error("⚠️ No recipient email provided, skipping OTP email.");
    return;
  }

  try {
    const msg = {
      from: "onboarding@resend.dev", // 🔥 Free Testing Email
      to: email,
      subject: "🔐 Library Book Issue OTP Verification",
      text: `Your OTP for book issue is: ${otp}.\n\nIt is valid for 10 minutes.`,
    };

    await resend.emails.send(msg);
    console.log("📨 OTP Email Sent Successfully!");
  } catch (error) {
    console.error("⚠️ Error Sending OTP Email: ", error);
  }
};

// ✅ Function to Send Book Return Email
const sendReturnEmail = async (email, studentName, bookTitle) => {
  if (!email) {
    console.error("⚠️ No recipient email provided, skipping return email.");
    return;
  }

  try {
    const msg = {
      from: "onboarding@resend.dev",
      to: email,
      subject: "📚 Library Book Return Confirmation",
      text: `Dear ${studentName},\n\nYou have successfully returned the book "${bookTitle}".\nThank you for using our library services.\n\nRegards,\nLibrary Team`,
    };

    await resend.emails.send(msg);
    console.log("📨 Return Confirmation Email Sent Successfully!");
  } catch (error) {
    console.error("⚠️ Error Sending Return Email: ", error);
  }
};

// ✅ Route to Issue a Book
router.post(
  "/books/issue/:id",
  isLoggedIn,
  checkAvailability,
  asyncWrap(async (req, res) => {
    const bookId = req.params.id;
    const { email, studentId, title, contact } = req.body;

    if (!email || !studentId || !title || !contact) {
      req.flash("error", "All fields (Student ID, Name, Email, Contact) are required.");
      return res.redirect(`/books/issue/${bookId}`);
    }

    // 🔹 Validate student details
    const student = await StudentData.findOne({ studentId, email, name: title, contact });

    if (!student) {
      req.flash("error", "Invalid student details. Please check and try again.");
      return res.redirect(`/books/issue/${bookId}`);
    }

    // ✅ Generate OTP and store it
    const otp = generateOTP();
    otpStore.set(email, { otp, expiresAt: Date.now() + 10 * 60 * 1000 });

    // 🔹 Send OTP via Resend API
    await sendOTPEmail(email, otp);

    req.flash("info", "OTP sent to your email. Please verify to proceed.");
    res.redirect(`/books/verifyOtp/${bookId}?email=${encodeURIComponent(email)}`);
  })
);


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

router.get("/books/verifyOtp/:id", (req, res) => {
  const { email } = req.query;
  const bookId = req.params.id;
console.log(email);

  if (!email) {
    req.flash("error", "Invalid request. No email found.");
    return res.redirect(`/books/issue/${bookId}`);
  }
  // res.render("books/bookData", { bookingData, studentDatas });

  res.render("books/verifyOtp", { email, bookId });
});


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

// ✅ Route to Verify OTP and Issue Book
router.post(
  "/books/verifyOtp/:id",
  isLoggedIn,
  asyncWrap(async (req, res) => {
    const bookId = req.params.id;
    const { email, enteredOtp } = req.body;

    // 🔹 Check OTP validity
    const storedOtp = otpStore.get(email);
    if (!storedOtp || storedOtp.otp !== parseInt(enteredOtp)) {
      req.flash("error", "Invalid or expired OTP. Please try again.");
      return res.redirect(`/books/verifyOtp/${bookId}?email=${encodeURIComponent(email)}`);
    }

    // 🔹 Remove OTP after successful verification
    otpStore.delete(email);

    // ✅ Get book details
    const bookToIssue = await Book.findById(bookId);
    if (!bookToIssue || bookToIssue.books <= 0) {
      req.flash("error", "This book is not available right now.");
      return res.redirect(`/books`);
    }

    // ✅ Get student details
    const student = await StudentData.findOne({ email });
    if (!student) {
      req.flash("error", "Invalid student details.");
      return res.redirect(`/books/issue/${bookId}`);
    }

    const bookTitle = Array.isArray(bookToIssue.title) ? bookToIssue.title.join(", ") : bookToIssue.title;

    // ✅ Create new booking entry
    const newIssue = new Booking({
      title: bookTitle,
      bookId,
      studentId: student.studentId,
      course: student.course || "N/A",
      contact: student.contact,
      email: student.email,
      book: bookToIssue.title[0],
      userId: req.user._id,
      issueDate: new Date(),
      dueDate: new Date(new Date().setDate(new Date().getDate() + 7)),
    });

    await newIssue.save();
    bookToIssue.books -= 1;
    await bookToIssue.save();

    // ✅ Send Issue Confirmation Email
    await sendIssueEmail(email, student.name, bookTitle, newIssue.dueDate.toDateString());

    req.flash("success", "Book issued successfully after OTP verification!");
    res.redirect(`/books`);
  })
);

// ✅ Route to Return a Book
router.post(
  "/books/return/:id",
  asyncWrap(async (req, res) => {
    try {
      const bookId = req.params.id;
      const issuedBook = await Booking.findOne({ bookId });

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

// ✅ Function to Send Book Issue Email
const sendIssueEmail = async (email, studentName, bookTitle, dueDate) => {
  if (!email) {
    console.error("⚠️ No recipient email provided, skipping issue confirmation.");
    return;
  }

  try {
    const msg = {
      from: "onboarding@resend.dev",
      to: email,
      subject: "📚 Library Book Issued Confirmation",
      text: `Dear ${studentName},\n\nYou have successfully issued the book "${bookTitle}".\nYour due date for returning the book is ${dueDate}.\n\nThank you for using our library services!\n\nRegards,\nLibrary Team`,
    };

    await resend.emails.send(msg);
    console.log("📨 Issue Confirmation Email Sent Successfully!");
  } catch (error) {
    console.error("⚠️ Error Sending Issue Email: ", error);
  }
};

module.exports = router;
