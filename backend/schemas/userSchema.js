const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  name: String,
  pass: String,
  gender: String,
  email: String,
  favnum: Number
});

module.exports = userSchema;