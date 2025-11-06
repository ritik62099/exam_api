// backend/controllers/studentController.js
const Student = require('../models/Student');
const { hashPassword } = require('../utils/passwordUtils');

const createStudent = async (req, res) => {
  const { username, password } = req.body; // ✅ ye sirf backend mein valid hai

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password required' });
  }

  try {
    const existingStudent = await Student.findOne({ username });
    if (existingStudent) {
      return res.status(409).json({ success: false, message: 'Student already exists' });
    }

    const hashedPassword = await hashPassword(password);

    const newStudent = new Student({
      username,
      password: hashedPassword,
      plainPassword: password // ⚠️ temporary
    });
    await newStudent.save();

    res.status(201).json({ success: true, message: 'Student created successfully' });
  } catch (error) {
    console.error('Student creation error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};




// NEW: Get all students (for admin only)
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find({}, 'username plainPassword'); // only these fields
    res.json({
      success: true,
      count: students.length,
      students
    });
  } catch (error) {
    console.error('Fetch students error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { createStudent, getAllStudents };

