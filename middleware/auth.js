// backend/middleware/auth.js
const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  // Admin token (from your frontend)
  if (authHeader === 'admin-dummy-token') {
    req.userRole = 'admin';
  } else {
    req.userRole = 'student';
  }
  next();
};

module.exports = auth;