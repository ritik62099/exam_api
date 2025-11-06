// backend/routes/studentRoutes.js
const express = require('express');
const { createStudent, getAllStudents } = require('../controllers/studentController.js');

const router = express.Router();

router.post('/', createStudent);
router.get('/', getAllStudents); // ← NEW

module.exports = router;