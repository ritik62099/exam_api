const Exam = require('../models/Exam.js');
const Result = require('../models/Result.js');

// Create Exam
const createExam = async (req, res) => {
  try {
    const exam = new Exam(req.body);
    await exam.save();
    res.status(201).json({ success: true, exam });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get all exams
const getExams = async (req, res) => {
  try {
    const exams = await Exam.find().sort({ scheduledAt: -1 });
    res.json({ success: true, exams });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update Exam
const updateExam = async (req, res) => {
  try {
    const exam = await Exam.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!exam) return res.status(404).json({ success: false, message: 'Exam not found' });
    res.json({ success: true, exam });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete Exam
const deleteExam = async (req, res) => {
  try {
    const exam = await Exam.findByIdAndDelete(req.params.id);
    if (!exam) return res.status(404).json({ success: false, message: 'Exam not found' });
    res.json({ success: true, message: 'Exam deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Add this inside examController.js
const getExamById = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) {
      return res.status(404).json({ success: false, message: 'Exam not found' });
    }
    res.json({ success: true, exam });
  } catch (error) {
    console.error('Get exam error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};



// Submit exam & calculate result
const submitExam = async (req, res) => {
  try {
    const { examId, studentUsername, answers } = req.body;

    // 🔹 CHECK: Kya student ne pehle se attempt kiya hai?
    const existingResult = await Result.findOne({ examId, studentUsername });
    if (existingResult) {
      return res.status(403).json({
        success: false,
        message: 'You have already attempted this exam.'
      });
    }

    const exam = await Exam.findById(examId);
    if (!exam) return res.status(404).json({ success: false, message: 'Exam not found' });

    const totalMarks = exam.totalMarks || (exam.questions?.length * exam.marksPerQuestion) || 0;

    let score = 0;
    const resultAnswers = answers.map((ans, idx) => {
      const question = exam.questions[idx];
      const isCorrect = question && ans.selectedOption === question.correctAnswerIndex;
      
      if (isCorrect) {
        score += exam.positiveMarking;
      } else if (ans.selectedOption != null) {
        score -= exam.negativeMarking;
      }

      return {
        questionIndex: idx,
        selectedOption: ans.selectedOption,
        isCorrect
      };
    });

    const result = new Result({
      studentUsername,
      examId,
      score: parseFloat(score.toFixed(2)),
      totalMarks,
      answers: resultAnswers
    });
    await result.save();

    res.json({
      success: true,
      result: {
        score: result.score,
        totalMarks: result.totalMarks,
        percentage: ((result.score / result.totalMarks) * 100).toFixed(2),
        answers: resultAnswers
      }
    });
  } catch (error) {
    console.error('Submit exam error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};




// 🔹 Delete student's result AND re-activate exam
const deleteStudentResult = async (req, res) => {
  try {
    const { examId, studentUsername } = req.body;
    
    // Delete result
    const result = await Result.findOneAndDelete({ examId, studentUsername });
    if (!result) {
      return res.status(404).json({ success: false, message: 'Result not found' });
    }

    // 🔹 Re-activate exam: set new scheduled time to NOW
    const exam = await Exam.findById(examId);
    if (exam) {
      exam.scheduledAt = new Date(); // Start from NOW
      exam.durationHours = 24;       // Available for 24 hours
      await exam.save();
    }

    res.json({ 
      success: true, 
      message: 'Result deleted. Exam is now available for 24 hours.' 
    });
  } catch (error) {
    console.error('Re-attempt error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get active exams (published + not expired)
const getActiveExams = async (req, res) => {
  try {
    const now = new Date();
    const exams = await Exam.find({
      isPublished: true, // 🔹 Only published exams
      scheduledAt: { $lte: now },
      $expr: {
        $gte: [
          { $add: ["$scheduledAt", { $multiply: ["$durationHours", 60 * 60 * 1000] }] },
          now
        ]
      }
    }).select('title timeLimit scheduledAt questions durationHours');
    
    res.json({ success: true, exams });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// 🔹 Publish exam
const publishExam = async (req, res) => {
  try {
    const exam = await Exam.findByIdAndUpdate(
      req.params.id,
      { isPublished: true },
      { new: true }
    );
    if (!exam) return res.status(404).json({ success: false, message: 'Exam not found' });
    res.json({ success: true, exam });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// 🔹 Unpublish exam
const unpublishExam = async (req, res) => {
  try {
    const exam = await Exam.findByIdAndUpdate(
      req.params.id,
      { isPublished: false },
      { new: true }
    );
    if (!exam) return res.status(404).json({ success: false, message: 'Exam not found' });
    res.json({ success: true, exam });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


const getStudentResults = async (req, res) => {
  try {
    

    const { username } = req.params;
    const role = req.userRole || req.user?.role || 'student';
    const isStudent = role === 'student';

    let results = [];

    if (username) {
      results = await Result.find({ studentUsername: username })
        .populate('examId', 'title showResults');
    } else {
      results = await Result.find().populate('examId', 'title showResults');
    }

    results = results.filter(r => r.examId !== null);

    if (isStudent) {
      results = results.filter(r => r.examId.showResults !== false);
    }

    return res.json({ success: true, results });
  } catch (error) {
    console.error('❌ Get results error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};


module.exports = { createExam, getExams, updateExam, deleteExam, getExamById,getActiveExams,submitExam,getStudentResults ,deleteStudentResult , publishExam,unpublishExam};