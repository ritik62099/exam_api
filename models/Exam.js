const mongoose = require('mongoose');

// ✅ Use array of strings for options (simpler)
const questionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  options: [{
    type: String,
    required: true,
    validate: [v => v.trim() !== '', 'Option cannot be empty']
  }],
  correctAnswerIndex: { 
    type: Number, 
    required: true, 
    min: 0, 
    max: 3 
  }
}, { _id: false });

const examSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true,
    trim: true
  },
  timeLimit: { 
    type: Number, 
    required: true, 
    min: 1 
  },
  totalMarks: { type: Number, required: true }, 
  marksPerQuestion: { 
    type: Number, 
    required: true,
    min: 0.1
  },
  positiveMarking: { 
    type: Number, 
    required: true,
    min: 0
  },
  negativeMarking: { 
    type: Number, 
    required: true,
    min: 0
  },
  questions: {
    type: [questionSchema],
    validate: [v => v.length > 0, 'At least one question required']
  },
  scheduledAt: { 
    type: Date, 
    required: true 
  },
   durationHours: { type: Number, default: 24 }, // Exam expiry (24 hours default)
  showResults: { type: Boolean, default: true } ,
  isPublished: { type: Boolean, default: false }
}, {
  timestamps: true
});

module.exports = mongoose.model('Exam', examSchema);