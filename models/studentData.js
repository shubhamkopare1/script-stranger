const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the Student schema
const studentSchema = new Schema({
  studentId: {
    type: String,
    required: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
  },
  branch: {
    type: String,
    required: true,
  },
  contact: {
    type: String,
    required: true, // Ensure contact information is provided
  },
  email: {
    type: String,
    required: true, // Ensure email is provided
    unique: true, // Prevent duplicate emails
    lowercase: true, // Store emails in lowercase
    trim: true, // Remove extra spaces
    match: [
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/, 
      "Please enter a valid email address"
    ], // Basic email format validation
  },
  college: {
    type: String,
    required: true,
  },
});

const StudentData = mongoose.model("StudentData", studentSchema);
module.exports = StudentData;
