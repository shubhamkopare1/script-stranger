// routes/userRoutes.js
const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const User = require('../models/user'); 
const asyncWrap = require('../utils/wrapAsync'); 
const router = express.Router();

// GET /register
router.get('/register', (req, res) => {
  res.render('register/register');
});

// POST /register
router.post('/register', asyncWrap(async (req, res) => {
  const { username, password, email, role } = req.body;
  const hash = await bcrypt.hash(password, 10);
  const user = new User({ username, email, password: hash, role });
  await user.save();
  req.flash('success', 'Registered successfully, please login.');
  res.redirect('/login');
}));

// GET /login
router.get('/login', (req, res) => {
  res.render('register/login');
});

// POST /login
router.post('/login', passport.authenticate('local', {
  failureRedirect: '/login',
  failureFlash: true,
}), (req, res) => {
  req.flash('success', 'Welcome back!');
  res.redirect('/books');
});

// GET /logout
router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) { return next(err); }
    req.flash('success', 'Logged out successfully.');
    res.redirect('/books');
  });
});

// Protected Route Example
router.get('/protected', (req, res) => {
  if (!req.isAuthenticated()) {
    req.flash('error', 'You need to login first.');
    return res.redirect('/login');
  }
  res.send('This is a protected route.');
});

module.exports = router;
