// require('dotenv').config();
// const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');
// const Student = require('../models/Student');

// (async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI);

//     const existing = await Student.findOne({ username: 'admin' });
//     if (existing) {
//       console.log('✅ Admin already exists.');
//       process.exit(0);
//     }

//     const hashed = await bcrypt.hash('admin123', 10);
//     const admin = new Student({
//       username: 'admin',
//       password: hashed,
//       plainPassword: 'admin123',
//       registrationNumber: 'ADMIN001',
//       role: 'admin',
//     });

//     await admin.save();
//     console.log('✅ Admin user created successfully!');
//     process.exit(0);
//   } catch (err) {
//     console.error('❌ Error creating admin:', err);
//     process.exit(1);
//   }
// })();


require('dotenv').config();
const mongoose = require('mongoose');
const { hashPassword } = require('./utils/passwordUtils');
const Student = require('./models/Student');

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const existing = await Student.findOne({ username: 'admin' });
    if (existing) {
      console.log('⚠️  Admin already exists');
      process.exit(0);
    }

    const hashed = await hashPassword('admin123');

    const admin = new Student({
      username: 'admin',
      password: hashed,
      plainPassword: 'admin123',
      registrationNumber: 'ADMIN001',
      role: 'admin',
    });

    await admin.save();
    console.log('✅ Admin user created successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();
