// // // backend/routes/studentRoutes.js
// // const express = require('express');
// // const { createStudent, getAllStudents } = require('../controllers/studentcontrollers.js');

// // const router = express.Router();

// // router.post('/', createStudent);
// // router.get('/', getAllStudents); // ← NEW

// // module.exports = router;

// const express = require('express');
// const { createStudent, getAllStudents } = require('../controllers/studentcontrollers.js');
// const auth = require('../middleware/auth.js');
// const adminOnly = require('../middleware/adminOnly.js');

// const router = express.Router();

// router.use(auth); // must be logged in
// router.post('/', adminOnly, createStudent);
// router.get('/', adminOnly, getAllStudents);

// module.exports = router;


const express = require('express');
const {
  createStudent,
  getAllStudents,
  updateStudent,
  deleteStudent,
} = require('../controllers/studentcontrollers.js');
const auth = require('../middleware/auth.js');
const adminOnly = require('../middleware/adminOnly.js');

const router = express.Router();

router.use(auth); // must be logged in

router.post('/', adminOnly, createStudent);
router.get('/', adminOnly, getAllStudents);
router.put('/:id', adminOnly, updateStudent);   // ✅ Edit student
router.delete('/:id', adminOnly, deleteStudent); // ✅ Delete student

module.exports = router;
