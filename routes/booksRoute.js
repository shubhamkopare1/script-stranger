// routes/bookRoutes.js

const express = require('express');
const mongoose = require('mongoose');
const { upload } = require('../config/cloudinaryConfig');  
const asyncWrap = require('../utils/wrapAsync'); 
const { checkAvailability, isLoggedIn ,ensureRole} = require('../middlewear'); 
const Book = require('../models/book'); 
const router = express.Router();

// DELETE /books/:id
router.delete('/books/:id', ensureRole('admin'), asyncWrap(async (req, res) => {
  const { id } = req.params;
  await Book.findByIdAndDelete(id);
  req.flash('success', 'Book deleted successfully.');
  res.redirect('/books'); 
}));

// GET /books/:id/edit
router.get('/books/:id/edit', ensureRole('admin'), asyncWrap(async (req, res) => {
  const { id } = req.params;
  const book = await Book.findById(id);
  res.render('books/edit', { book });
}));

// PUT /books/:id
router.put('/books/:id', ensureRole('admin'), asyncWrap(async (req, res) => {
    const { id } = req.params;
    const { books } = req.body; 
    await Book.findByIdAndUpdate(id, { books });
    req.flash('success', 'Book updated successfully.');
    res.redirect('/books'); 
  }));

// GET /addBooks
router.get('/addBooks', ensureRole('admin'), isLoggedIn, (req, res) => {
  res.render('books/addBooks');
});

// POST /books/add
router.post('/books/add', upload.single('image'), ensureRole('admin'), isLoggedIn, async (req, res) => {
  try {
    const newBook = new Book({
      ...req.body,
      image: req.file.path 
    });
    await newBook.save();
    req.flash('success', 'Book added successfully!');
    res.redirect('/books'); 
  } catch (error) {
    req.flash('error', 'Error saving the book data. Please try again.');
    res.redirect('/books/add');
  }
});

router.get("/books/returnss/:id", async (req, res) => {
  try {
    const bookId = req.params.id;
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).send("Book not found");
    }
    res.render("books/bookReturn", { bookdata: book });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error loading return book page");
  }
});
// GET /books
router.get('/books', asyncWrap(async (req, res) => {
  let queryTitle = req.query.title;
  let filter = {};
  if (queryTitle) {
    let searchWords = queryTitle.split(' ');
    let wordFilters = [];
    searchWords.forEach((word) => {
      let wordRegex = new RegExp(word, 'i');
      wordFilters.push({ title: wordRegex });
    });
    filter.$and = wordFilters;
  }
  let allData = await Book.find(filter);
  res.render('books/books', { user: req.user, allData }); 
}));

module.exports = router;
