import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth(); // signIn function from AuthContext
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // The signIn function now returns { user: userData, token }
      const { user: loggedInUser } = await signIn(email, password);

      // --- NEW LOGIC: Redirect based on role ---
      if (loggedInUser.role === 'DOCTOR') {
        navigate('/doctor-console'); // Redirect Doctor to Doctor Console
      } else {
        navigate('/'); // Default redirect for ADMIN (or any other role) to Patient Registration / Home
      }
      // --- END NEW LOGIC ---

    } catch (err) {
      setError(err.message || 'Failed to log in. Please check your credentials.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>🔑 Login</h1>
      {error && <div className="message error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="your.email@example.com"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Your password"
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p style={{marginTop: '20px'}}>
        Don't have an account? <Link to="/signup">Sign Up here</Link>
      </p>
      <p style={{marginTop: '20px'}}>
        **Note:** For initial setup, you'll need to sign up users via the Signup page.
        The first user can be signed up as ADMIN, subsequent users as DOCTOR.
      </p>
    </div>
  );
};

export default LoginPage;