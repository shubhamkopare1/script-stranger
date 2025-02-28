const express = require('express');
const asyncWrap = require('../utils/wrapAsync'); 
const {  isLoggedIn } = require('../middlewear'); 
const Booking = require('../models/student');
const StudentData = require('../models/studentData');
const router = express.Router();

// Route to display user profile
router.get('/', isLoggedIn, asyncWrap(async (req, res) => {
  if (!req.isAuthenticated()) {
    req.flash('error', 'You need to login first.');
    return res.redirect('/login');
  }
  const userBookings = await Booking.find({ _id: { $in: req.user.bookings } }).populate('book');
  const studentIds = userBookings.map(booking => booking.studentId); 
  const studentData = await StudentData.find({ studentId: { $in: studentIds } }); 
  const studentDataMap = {};
  studentData.forEach(data => {
    studentDataMap[data.studentId] = data; 
  });
  res.render('register/profile', { user: req.user, userBookings, studentDataMap });
}));

module.exports = router;
