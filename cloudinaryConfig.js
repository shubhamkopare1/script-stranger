// cloudinaryConfig.js
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'dcgsjinou', // Replace with your Cloudinary cloud name
  api_key: '266198562241696',       // Replace with your Cloudinary API key
  api_secret: 'NdC48HEP9ou8MSWrmSEJEbIWhQM', // Replace with your Cloudinary API secret
});

module.exports = cloudinary;

