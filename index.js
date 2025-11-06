const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// // Routes
const authRoutes = require('./routes/authroutes.js');
// const studentRoutes = require('./routes/studentRoutes.js');
const studentRoutes = require('./');
const examRoutes = require('./routes/examRoutes.js');


dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// // Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/exams', examRoutes);

// Basic test route
app.get("/", (req, res) => {
  res.send("Hello from Express on Vercel!");
});


// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });

module.exports = app;