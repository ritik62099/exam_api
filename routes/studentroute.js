// backend/routes/studentRoutes.js
const express = require('express');
const { createStudent, getAllStudents } = require('../controllers/studentcontrollers.js');

const router = express.Router();

router.post('/', createStudent);
router.get('/', getAllStudents); // ← NEW

module.exports = router;