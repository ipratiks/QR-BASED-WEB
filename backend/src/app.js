// backend/src/app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const patientRoutes = require('./routes/patientRoutes'); // Contains protected routes and registerPatientNoAuth function
const authRoutes = require('./routes/authRoutes');     // Contains signup/login routes
const { PrismaClient } = require('@prisma/client');
const { authenticateToken } = require('./middleware/authMiddleware');

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// --- Public Routes ---
// Authentication routes (signup and login)
app.use('/api/auth', authRoutes);

// Patient registration (accessible without authentication, e.g., by reception staff)
app.post('/api/patients/register', patientRoutes.registerPatientNoAuth);

// --- Protected Routes ---
// All routes under /api/patients (except register) will now require authentication
// Specific routes will then apply role-based authorization
app.use('/api/patients', authenticateToken, patientRoutes.protectedRoutes);

// Root route for simple backend health check
app.get('/', (req, res) => {
  res.send('Hospital Waiting App Backend is running!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});