const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  googleId: { type: String, unique: true, required: true },
  email: { type: String, required: true },
  name: { type: String },
  picture: { type: String },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
