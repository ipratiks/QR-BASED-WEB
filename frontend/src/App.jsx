// frontend/src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PatientRegistration from './pages/PatientRegistration';
import DoctorConsole from './pages/DoctorConsole';
import AdminDashboard from './pages/AdminDashboard';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage'; // Import SignupPage
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
            {/* Public Routes */}
            <Route path="/" element={<PatientRegistration />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} /> {/* New Signup Route */}
            <Route path="/unauthorized" element={<Unauthorized />} />

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