// // const express = require('express');
// // const auth = require('../middleware/auth.js');
// // const {
// //   createExam,
// //   getExams,
// //   getExamById,
// //   updateExam,
// //   deleteExam,
// //   getActiveExams,
// //   submitExam,
// //   getStudentResults,
// //   deleteStudentResult,
// //   publishExam,
// //   unpublishExam
// // } = require('../controllers/examControllers.js');

// // const router = express.Router();

// // // 🔹 PUBLIC ROUTES (no auth, no :id conflict)
// // router.post('/', createExam);
// // router.get('/active', getActiveExams);
// // router.get('/:id', getExamById);
// // router.post('/submit', submitExam);

// // // 🔹 PROTECTED STATIC ROUTES (must come BEFORE :id)
// // router.use(auth); // Apply auth middleware from here

// // router.get('/results', getStudentResults);                // ✅ BEFORE :id
// // router.get('/results/:username', getStudentResults);     // ✅ BEFORE :id
// // router.delete('/results', deleteStudentResult);  

// // // router.get('/:id', getExamById); 
// // // 🔹 DYNAMIC ROUTES (last)
// // router.get('/', getExams);
// // // router.get('/:id', getExamById); 
// // router.put('/:id', updateExam);
// // router.delete('/:id', deleteExam);
// // router.patch('/:id/publish', publishExam);
// // router.patch('/:id/unpublish', unpublishExam);// ✅ BEFORE :id

// // module.exports = router;
// const express = require('express');
// const auth = require('../middleware/auth.js');
// const {
//   createExam,
//   getExams,
//   getExamById,
//   updateExam,
//   deleteExam,
//   getActiveExams,
//   submitExam,
//   getStudentResults,
//   deleteStudentResult,
//   publishExam,
//   unpublishExam
// } = require('../controllers/examControllers.js');

// const router = express.Router();

// // 🔹 PUBLIC ROUTES (no auth)
// router.post('/', createExam);
// router.get('/active', getActiveExams);
// router.post('/submit', submitExam);

// // ✅ PROTECTED ROUTES
// router.use(auth);

// // ✅ Static routes FIRST (before :id)
// router.get('/results', getStudentResults);
// router.get('/results/:username', getStudentResults);
// router.delete('/results', deleteStudentResult);
// router.patch('/:id/publish', publishExam);
// router.patch('/:id/unpublish', unpublishExam);

// // ✅ Now put dynamic routes LAST
// router.get('/', getExams);
// router.put('/:id', updateExam);
// router.delete('/:id', deleteExam);
// router.get('/:id', getExamById); // ✅ move this LAST (after everything)


// module.exports = router;


const express = require('express');
const auth = require('../middleware/auth.js');
const adminOnly = require('../middleware/adminOnly');
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
} = require('../controllers/examControllers.js');

const router = express.Router();

// 🔹 PUBLIC routes (for students)
router.get('/active', getActiveExams);
router.post('/submit', submitExam);

// 🔹 PROTECTED routes (require JWT)
router.use(auth);

// 🔹 Results routes (must come before /:id)
router.get('/results', getStudentResults);
router.get('/results/:username', getStudentResults);
router.delete('/results', adminOnly, deleteStudentResult);

// 🔹 Admin-only routes
router.post('/', adminOnly, createExam);
router.put('/:id', adminOnly, updateExam);
router.delete('/:id', adminOnly, deleteExam);
router.patch('/:id/publish', adminOnly, publishExam);
router.patch('/:id/unpublish', adminOnly, unpublishExam);

// 🔹 General routes (keep LAST)
router.get('/', getExams);
router.get('/:id', getExamById);

module.exports = router;
