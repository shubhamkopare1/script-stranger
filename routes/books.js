const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const csv = require("csv-parser");
const Book = require("../models/book");

const router = express.Router();

// ✅ Multer for CSV File Upload
const upload = multer({ dest: "uploads/" });

// ✅ Route to Handle CSV Upload
router.post("/uploadCsv", upload.single("csvFile"), async (req, res) => {
  if (!req.file) {
    req.flash("error", "Please upload a CSV file.");
    return res.redirect("/books/add");
  }

  const results = [];
  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", async () => {
      try {
        await Book.insertMany(results);
        req.flash("success", "Books added successfully from CSV!");
        res.redirect("/books");
      } catch (err) {
        req.flash("error", "Error inserting CSV data into the database.");
        res.redirect("/books/add");
      }
      fs.unlinkSync(req.file.path); // ✅ Delete file after processing
    });
});

module.exports = router;
