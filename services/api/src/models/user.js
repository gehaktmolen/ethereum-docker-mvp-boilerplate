const uuid = require('uuid');
const mongoose = require('../databases/mongo');

const UserSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: uuid.v4,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    required: true,
  },
});

module.exports = mongoose.model('User', UserSchema);
