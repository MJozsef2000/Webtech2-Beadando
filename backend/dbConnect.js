const mongoose = require('mongoose');
// Connect to MongoDB database
module.exports = function(){
  mongoose.connect('mongodb://127.0.0.1:27017/DasAuto');
  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function() {
    console.log('Connected to MongoDB database.');
  });
}