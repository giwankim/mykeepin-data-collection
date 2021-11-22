const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  did: String,
  vp: String,
  signature: String,
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
