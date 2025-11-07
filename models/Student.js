// // backend/models/Student.js
// const mongoose = require('mongoose');

// const studentSchema = new mongoose.Schema({
//   username: {
//     type: String,
//     required: true,
//     unique: true,
//     trim: true
//   },
//   password: { // hashed
//     type: String,
//     required: true
//   },
//   // ⚠️ Temporary field for demo ONLY
//   plainPassword: {
//     type: String,
//     required: true
//   }
// }, { timestamps: true });

// module.exports = mongoose.model('Student', studentSchema);

const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    plainPassword: {
      type: String,
      required: true,
    },
    registrationNumber: {
      type: String,
      unique: true,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Student', studentSchema);
