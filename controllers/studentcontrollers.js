// // backend/controllers/studentController.js
// const Student = require('../models/Student.js');
// const { hashPassword } = require('../utils/passwordUtils.js');

// const createStudent = async (req, res) => {
//   const { username, password } = req.body; // ✅ ye sirf backend mein valid hai

//   if (!username || !password) {
//     return res.status(400).json({ success: false, message: 'Username and password required' });
//   }

//   try {
//     const existingStudent = await Student.findOne({ username });
//     if (existingStudent) {
//       return res.status(409).json({ success: false, message: 'Student already exists' });
//     }

//     const hashedPassword = await hashPassword(password);

//     const newStudent = new Student({
//       username,
//       password: hashedPassword,
//       plainPassword: password // ⚠️ temporary
//     });
//     await newStudent.save();

//     res.status(201).json({ success: true, message: 'Student created successfully' });
//   } catch (error) {
//     console.error('Student creation error:', error);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// };


const Student = require('../models/Student');
const { hashPassword } = require('../utils/passwordUtils');

// Helper function to generate next registration number
async function generateRegistrationNumber() {
  const prefix = 'DCE';
  const year = new Date().getFullYear().toString().slice(-2); // e.g. "25"

  // Find the most recently created student for this year
  const lastStudent = await Student.findOne({ registrationNumber: new RegExp(`^${prefix}/${year}/`) })
    .sort({ createdAt: -1 })
    .exec();

  let nextNumber = 1;

  if (lastStudent && lastStudent.registrationNumber) {
    const lastReg = lastStudent.registrationNumber.split('/').pop(); // get last part
    nextNumber = parseInt(lastReg, 10) + 1;
  }

  const padded = String(nextNumber).padStart(3, '0'); // "001"
  return `${prefix}/${year}/${padded}`;
}

// Create Student Controller
const createStudent = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password are required' });
    }

    const existing = await Student.findOne({ username });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Username already exists' });
    }

    const hashedPassword = await hashPassword(password);
    const registrationNumber = await generateRegistrationNumber();

    const newStudent = new Student({
      username,
      password: hashedPassword,
      plainPassword: password, // only for demo
      registrationNumber,
    });

    await newStudent.save();

    res.json({
      success: true,
      message: 'Student created successfully',
      student: {
        username: newStudent.username,
        registrationNumber: newStudent.registrationNumber,
      },
    });
  } catch (error) {
    console.error('Create student error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};



// NEW: Get all students (for admin only)
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find({}, 'username plainPassword registrationNumber'); // only these fields
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

