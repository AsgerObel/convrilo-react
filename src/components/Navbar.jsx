import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

function Navbar() {
  const location = useLocation();
  const { user } = useAuth();

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        <div className="icon">C</div>
        <span className="brand">Convrilo</span>
      </Link>
      <div className="links">
        <Link
          to="/updates"
          className={`link ${location.pathname === '/updates' ? 'active' : ''}`}
        >
          Updates
        </Link>
        <Link
          to="/pricing"
          className={`link ${location.pathname === '/pricing' ? 'active' : ''}`}
        >
          Pricing
        </Link>
      </div>

      {user ? (
        <Link
          to="/profile"
          className="signup"
        >
          My Profile
        </Link>
      ) : (
        <Link
          to="/auth"
          className="signup"
        >
          Sign up →
        </Link>
      )}
    </nav>
  );
}

export default Navbar;