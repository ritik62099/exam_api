// backend/models/Student.js
const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: { // hashed
    type: String,
    required: true
  },
  // ⚠️ Temporary field for demo ONLY
  plainPassword: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);