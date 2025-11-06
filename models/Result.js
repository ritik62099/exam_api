// backend/models/Result.js
const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  studentUsername: { type: String, required: true },
  examId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
  score: { type: Number, required: true },
  totalMarks: { type: Number, required: true },
  answers: [{
    questionIndex: Number,
    selectedOption: Number,
    isCorrect: Boolean
  }],
  submittedAt: { type: Date, default: Date.now },
  isDeleted: { type: Boolean, default: false }
});

module.exports = mongoose.model('Result', resultSchema);