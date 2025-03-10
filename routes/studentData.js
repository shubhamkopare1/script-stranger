const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const csv = require("csv-parser");
const StudentData = require("../models/studentData");

const router = express.Router();



// ✅ GET Route to Render Add Student Form
router.get("/addStudents", (req, res) => {
  res.render("books/studentData"); // Ensure correct path
});

router.post("/students/add", async (req, res) => {
    try {
      console.log("🛠 Received Form Data:", req.body); // ✅ Debugging Purpose
  
      const { studentId, name, branch, contact, college, email } = req.body;
  
      // ✅ Remove Extra Spaces & Check Required Fields
      if (
        !studentId?.trim() ||
        !name?.trim() ||
        !branch?.trim() ||
        !contact?.trim() ||
        !college?.trim() ||
        !email?.trim()
      ) {
        req.flash("error", "All fields are required. Please fill all details.");
        return res.redirect("/addStudents");
      }
  
      // ✅ Check for Duplicate Student ID
      const existingStudent = await StudentData.findOne({ studentId });
      if (existingStudent) {
        req.flash("error", "Student with this ID already exists.");
        return res.redirect("/addStudents");
      }
  
      // ✅ Save Student Data
      const newStudent = new StudentData({
        studentId: studentId.trim(),
        name: name.trim(),
        branch: branch.trim(),
        contact: contact.trim(),
        college: college.trim(),
        email: email.trim(),
      });
  
      await newStudent.save();
      req.flash("success", "Student added successfully!");
      res.redirect("/addStudents");
    } catch (error) {
      console.error("⚠ Error adding student:", error);
      req.flash("error", "Failed to add student. Please try again.");
      res.redirect("/addStudents");
    }
  });
  


// ✅ Multer for CSV File Upload
const upload = multer({ dest: "uploads/" });

// ✅ Route to Handle CSV Upload
router.post("/uploadCsv", upload.single("csvFile"), async (req, res) => {
  if (!req.file) {
    req.flash("error", "Please upload a CSV file.");
    return res.redirect("/students/add");
  }

  const results = [];
  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", async () => {
      try {
        await StudentData.insertMany(results);
        req.flash("success", "Students added successfully from CSV!");
        res.redirect("/students");
      } catch (err) {
        req.flash("error", "Error inserting CSV data into the database.");
        res.redirect("/students/add");
      }
      fs.unlinkSync(req.file.path); // ✅ Delete file after processing
    });
});

module.exports = router;
