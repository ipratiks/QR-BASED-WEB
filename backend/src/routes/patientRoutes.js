// backend/src/routes/patientRoutes.js
const express = require('express');
const patientController = require('../controllers/patientController');
const { authorizeRoles } = require('../middleware/authMiddleware');

// Router for unauthenticated routes (e.g., patient registration by reception)
// This is now handled directly in app.js as a public route.
// exports.registerPatientNoAuth = patientController.registerPatientNoAuth; // No longer exporting a router here

// Router for authenticated and authorized routes
const protectedRouter = express.Router();

// Doctor Console operations (require DOCTOR or ADMIN role)
protectedRouter.post('/scan', authorizeRoles('DOCTOR', 'ADMIN'), patientController.recordAppointmentTime);
protectedRouter.get('/', authorizeRoles('DOCTOR', 'ADMIN'), patientController.getAllPatients);

// Admin Dashboard operations (require ADMIN role)
protectedRouter.get('/average-waiting-time', authorizeRoles('ADMIN'), patientController.getAverageWaitingTime);

// Get current user's role (requires authentication)
protectedRouter.get('/current-user-role', patientController.getCurrentUserRole);

exports.protectedRoutes = protectedRouter;
exports.registerPatientNoAuth = patientController.registerPatientNoAuth; // Export the function directly for app.js