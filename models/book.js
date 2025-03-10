let mongoose = require("mongoose");

let Schema = mongoose.Schema;
let booksData = new Schema({
  title: {
    type: [String],
    required: true,
  },
  books: {
    type: Number,
    required: true,
    default: 10, // Initial count of books set to 10
    min: [0, 'Book count cannot be negative'], // Ensure book count is non-negative
  },
  location: {
    type: String,  // Block Name (Example: "Block A")
  },
  rackNumber: {
    type: Number,
    // required: true, // Ensure every book has a latitude
  },
  shelfNumber: {
    type: Number,
    // required: true, // Ensure every book has a longitude
  },
  blockNumber: {
    type: Number,
    // required: true, // Ensure every book has a longitude
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  author: {
    type: String,
    required: true,
  },
  info: {
    type: String,
    required: true,
  },
});

// 📌 Virtual field to check if the book is available
booksData.virtual('isAvailable').get(function () {
  return this.books > 0; // Book is available if count is greater than 0
});

let Book = mongoose.model("Book", booksData);
module.exports = Book;
