// server/middleware/auth.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

const protect = (req, res, next) => {
  let token;

  // Check for token in headers (Bearer Token)
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1]; // Get token from "Bearer TOKEN"

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user ID to the request object (you might fetch full user later)
      req.user = { id: decoded.id };
      next(); // Proceed to the next middleware/route handler
    } catch (error) {
      console.error('Token verification failed:', error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = protect;