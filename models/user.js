const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'editor', 'user'], default: 'user' } ,// Add roles
    email: { type: String, required: true, unique: true },
    bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }] // Reference to bookings

});

module.exports = mongoose.model('User', userSchema);

