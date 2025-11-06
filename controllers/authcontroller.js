const Student = require('../models/Student');
const { comparePassword } = require('../utils/passwordUtils');

// Fixed admin credentials
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123';

const login = async (req, res) => {
  const { username, password } = req.body;

  // Validate input
  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password required' });
  }

  // Check for admin
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    return res.json({
      success: true,
      role: 'admin',
      token: 'admin-dummy-token', // Replace with JWT later
      message: 'Admin login successful'
    });
  }

  // Check for student
  try {
    const student = await Student.findOne({ username });
    if (!student) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await comparePassword(password, student.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    res.json({
      success: true,
      role: 'student',
      token: 'student-dummy-token',
      message: 'Student login successful'
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { login };