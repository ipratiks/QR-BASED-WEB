// frontend/src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api/authApi'; // Import custom login API
import { getCurrentUserRole } from '../api/patientApi'; // To get role after token is set

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Stores { id, email, role }
  const [role, setRole] = useState(null); // Stores 'ADMIN' or 'DOCTOR'
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUserFromToken = async () => {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Verify token and get user details/role from backend
          const data = await getCurrentUserRole(); // This call uses the stored token
          if (data && data.userId && data.email && data.role) { // Ensure data is valid
            setUser({ id: data.userId, email: data.email, role: data.role });
            setRole(data.role);
          } else {
            // If data is malformed, treat as invalid token
            console.error('getCurrentUserRole returned malformed data:', data);
            localStorage.removeItem('token'); // Clear invalid/expired token
            setUser(null);
            setRole(null);
          }
        } catch (error) {
          console.error('Failed to load user from token:', error);
          localStorage.removeItem('token'); // Clear invalid/expired token
          setUser(null);
          setRole(null);
        }
      }
      setLoading(false);
    };

    loadUserFromToken();
  }, []); // Run only once on mount

  const signIn = async (email, password) => {
    setLoading(true);
    try {
      const responseData = await loginUser(email, password); // Get the full response data
      console.log('AuthContext - Response from loginUser:', responseData); // Debugging: Check what the backend returns

      // --- NEW LOGIC: Explicitly check for expected properties ---
      if (!responseData || !responseData.user || !responseData.token) {
        console.error('AuthContext - Login response missing expected user data or token.', responseData);
        throw new Error('Invalid login response from server.');
      }
      // --- END NEW LOGIC ---

      localStorage.setItem('token', responseData.token); // Store JWT
      setUser(responseData.user); // Set user data (id, email, role)
      setRole(responseData.user.role);
      return { user: responseData.user, token: responseData.token }; // Return the actual user object and token
    } catch (error) {
      console.error('AuthContext - Login failed:', error);
      throw error; // Re-throw to be handled by LoginPage
    } finally {
      setLoading(false);
    }
  };

  const signOut = () => {
    localStorage.removeItem('token'); // Remove JWT
    setUser(null);
    setRole(null);
    navigate('/login'); // Redirect to login page after logout
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
