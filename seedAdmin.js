// seedAdmin.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/exam_system')
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Admin user data
const adminData = {
  name: 'Admin User',
  username: 'admin',
  password: 'admin123', // आप इसे बदल सकते हैं
  role: 'admin'
};

// User Schema (same as your model)
const userSchema = new mongoose.Schema({
  name: String,
  username: { type: String, unique: true },
  password: String,
  role: { type: String, default: 'student' }
});

const User = mongoose.model('User', userSchema);

// Create admin
async function createAdmin() {
  try {
    // Check if admin already exists
    const existing = await User.findOne({ username: adminData.username });
    if (existing) {
      console.log('Admin user already exists!');
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(adminData.password, 12);

    // Create user
    const admin = new User({
      name: adminData.name,
      username: adminData.username,
      password: hashedPassword,
      role: adminData.role
    });

    await admin.save();
    console.log('✅ Admin user created successfully!');
    console.log(`Username: ${adminData.username}`);
    console.log(`Password: ${adminData.password}`);
  } catch (err) {
    console.error('Error creating admin:', err);
  } finally {
    mongoose.connection.close();
  }
}

createAdmin();