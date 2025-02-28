const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Define the Student sub-schema
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
  college: {
    type: String,
    required: true, // Ensure college name is provided
  },
});
const StudentData= mongoose.model("StudentData", studentSchema);
module.exports = StudentData;