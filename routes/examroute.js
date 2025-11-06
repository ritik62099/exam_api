const express = require('express');
const auth = require('../middleware/auth.js');
const {
  createExam,
  getExams,
  getExamById,
  updateExam,
  deleteExam,
  getActiveExams,
  submitExam,
  getStudentResults,
  deleteStudentResult,
  publishExam,
  unpublishExam
} = require('../controllers/examController.js');

const router = express.Router();

// 🔹 PUBLIC ROUTES (no auth, no :id conflict)
router.post('/', createExam);
router.get('/active', getActiveExams);
router.post('/submit', submitExam);

// 🔹 PROTECTED STATIC ROUTES (must come BEFORE :id)
router.use(auth); // Apply auth middleware from here

router.get('/results', getStudentResults);                // ✅ BEFORE :id
router.get('/results/:username', getStudentResults);     // ✅ BEFORE :id
router.delete('/results', deleteStudentResult);  


// 🔹 DYNAMIC ROUTES (last)
router.get('/', getExams);
router.get('/:id', getExamById); 
router.put('/:id', updateExam);
router.delete('/:id', deleteExam);
router.patch('/:id/publish', publishExam);
router.patch('/:id/unpublish', unpublishExam);// ✅ BEFORE :id

module.exports = router;