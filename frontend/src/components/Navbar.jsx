import React from 'react';
import { Link, useLocation } from 'react-router-dom'; // Import useLocation
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, role, signOut } = useAuth();
  const location = useLocation(); // Get current location object

  // Determine if the current path is the login or signup page
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <nav style={{ marginBottom: '20px', padding: '10px 0', borderBottom: '1px solid #eee' }}>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
        {/* Patient Registration: Visible to unauthenticated users (reception) and ADMINs,
            BUT NOT when on Login or Signup pages. */}
        {(!user && !isAuthPage) || (user && role === 'ADMIN') ? (
          <li>
            <Link to="/">Patient Registration</Link>
          </li>
        ) : null}

        {/* Doctor Console: Visible only to DOCTORs */}
        {user && role === 'DOCTOR' && (
          <li>
            <Link to="/doctor-console">Doctor Console</Link>
          </li>
        )}

        {/* Admin Dashboard: Visible only to ADMINs */}
        {user && role === 'ADMIN' && (
          <li>
            <Link to="/admin-dashboard">Admin Dashboard</Link>
          </li>
        )}

        <li style={{ marginLeft: 'auto' }}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '0.9em', color: '#555' }}>
                Logged in as: <strong>{user.email}</strong> ({role})
              </span>
              <button onClick={signOut} style={{ padding: '8px 15px', fontSize: '0.9em', backgroundColor: '#e74c3c' }}>
                Logout
              </button>
            </div>
          ) : (
            // Show Login button only if not already on Login/Signup page
            !isAuthPage && (
              <Link to="/login">
                <button style={{ padding: '8px 15px', fontSize: '0.9em' }}>Login</button>
              </Link>
            )
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;