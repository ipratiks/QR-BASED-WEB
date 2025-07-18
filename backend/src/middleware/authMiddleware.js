// backend/src/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Middleware to check if the user is authenticated
exports.authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (token == null) {
    return res.status(401).json({ error: 'Authentication token required.' });
  }

  try {
    // Verify the JWT using our secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user from our database to ensure they still exist and get their role
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, role: true }, // Select only necessary fields
    });

    if (!user) {
      return res.status(403).json({ error: 'User not found or invalid token.' });
    }

    req.user = user; // Attach user object (id, email, role)
    req.role = user.role; // Attach user role
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    // Specific error messages for debugging
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired.' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token.' });
    }
    return res.status(403).json({ error: 'Forbidden: Token verification failed.' });
  }
};

// Middleware to check if the user has a specific role
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.role || !roles.includes(req.role)) {
      return res.status(403).json({ error: 'Forbidden: You do not have the necessary permissions.' });
    }
    next();
  };
};