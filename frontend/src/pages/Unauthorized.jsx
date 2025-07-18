// frontend/src/pages/Unauthorized.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <div className="container" style={{ textAlign: 'center', padding: '50px' }}>
      <h1>🚫 Unauthorized Access</h1>
      <p>You do not have permission to view this page.</p>
      <p>Please log in with an authorized account or contact your administrator.</p>
      <Link to="/login" style={{ textDecoration: 'none' }}>
        <button style={{ marginTop: '20px' }}>Go to Login</button>
      </Link>
    </div>
  );
};

export default Unauthorized;