const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';


    if (!authHeader.startsWith('Bearer ')) {

      return res.status(401).json({ success: false, message: 'Invalid auth format' });
    }

    const token = authHeader.split(' ')[1];


    const decoded = jwt.verify(token, process.env.JWT_SECRET);


    req.user = decoded;
    req.userRole = decoded.role;
    next();
  } catch (err) {

    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
};

module.exports = auth;
