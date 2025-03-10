const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const issueBookSchema = new Schema(
  {
    title: {
      type: String,
      required: true, // Required for a book issuance
    },
    bookId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book', // Replace 'Book' with the name of your book model
      required: true
    },
    studentId: {
      type: String,
      required: true, // Ensure student ID is provided
      index: true, // Index for faster searching
    },
    course: {
      type: String,
      required: true, // Ensure course is provided
    },
  
    book: {
      type: String,
      required: true, // Ensure the book reference is provided
      index: true, // Index for faster searching
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model
      required: true, // Ensure user ID is provided
    },
    contact: {
      type: Number,
      required: true, // Ensure review is provided
    },
    issueDate: {
      type: Date,
      default: Date.now, // Automatically set to current date
    },
    dueDate: {
      type: Date,
      default: function () {
        return new Date(Date.now() + 14 * 24 * 60 * 60 * 1000); // ✅ Fixed error
      },
    },
    returnDate: {
      type: Date,
    },
  },
  { timestamps: true } // Automatically manage createdAt and updatedAt fields
);

const Booking = mongoose.model("Booking", issueBookSchema);
module.exports =Booking;
