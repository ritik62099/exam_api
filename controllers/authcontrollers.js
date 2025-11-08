const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const { comparePassword } = require('../utils/passwordUtils');

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123';

// ✅ Generate JWT
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id || 'admin',
      username: user.username || 'admin',
      role: user.role || 'admin',
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password required' });
  }

  // ✅ Admin Login
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const adminUser = { username, role: 'admin' };
    const token = generateToken(adminUser);
    return res.json({
      success: true,
      role: 'admin',
      username,
      token, // ✅ real JWT
      message: 'Admin login successful',
    });
  }

  // ✅ Student Login
  try {
    const student = await Student.findOne({ username });
    if (!student) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const isMatch = await comparePassword(password, student.password);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const token = generateToken(student); // ✅ real JWT
    return res.json({
      success: true,
      role: 'student',
      username: student.username,
      registrationNumber: student.registrationNumber,
      token, // ✅ real JWT
      message: 'Student login successful',
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { login };
