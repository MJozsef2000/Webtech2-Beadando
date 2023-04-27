const mongoose = require('mongoose');
const videoSchema = new mongoose.Schema({
  link: String,
  favby: Array,
  vid: Number
});

module.exports = videoSchema;