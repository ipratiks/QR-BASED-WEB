// frontend/src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; // Import Navigate
import PatientRegistration from './pages/PatientRegistration';
import DoctorConsole from './pages/DoctorConsole';
import AdminDashboard from './pages/AdminDashboard';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Unauthorized from './pages/Unauthorized';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import './index.css'; // Your main CSS file

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="container">
          <Navbar /> {/* Include the Navbar here */}

          <Routes>
            {/* Redirect root path to /login */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Patient Registration is now a specific route, not the default root */}
            <Route path="/patient-registration" element={<PatientRegistration />} />

            {/* Protected Routes */}
            {/* Doctor Console requires DOCTOR or ADMIN role */}
            <Route element={<ProtectedRoute allowedRoles={['DOCTOR', 'ADMIN']} />}>
              <Route path="/doctor-console" element={<DoctorConsole />} />
            </Route>

            {/* Admin Dashboard requires ADMIN role */}
            <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
            </Route>

            {/* Catch-all for undefined routes */}
            <Route path="*" element={<p style={{textAlign: 'center', marginTop: '50px'}}>404 Not Found</p>} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
