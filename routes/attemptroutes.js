// routes/attempt.routes.js
const express = require('express');
const { 
  startAttempt, 
  getAttempt, 
  saveAttempt, 
  submitAttempt,
  getMyAttempts
} = require('../controllers/attemptcontroller');
const auth = require('../middleware/auth');

const router = express.Router();

// Student-only actions (auth middleware ensures user is logged in)
router.post('/exams/:examId/attempts', auth, startAttempt);
router.get('/:attemptId', auth, getAttempt);
router.put('/:attemptId', auth, saveAttempt);
router.post('/:attemptId/submit', auth, submitAttempt);
router.get('/me', auth, getMyAttempts);


module.exports = router;