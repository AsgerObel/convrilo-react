import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const location = useLocation();

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        <div className="icon">C</div>
        <span className="brand">Convrilo</span>
      </Link>
      <div className="links">
        <Link to="#" className="link">Updates</Link>
        <Link
          to="/pricing"
          className={`link ${location.pathname === '/pricing' ? 'active' : ''}`}
        >
          Pricing
        </Link>
      </div>
      <button className="signup">Sign up →</button>
    </nav>
  );
}

export default Navbar;