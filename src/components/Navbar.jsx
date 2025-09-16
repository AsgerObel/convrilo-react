import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

function Navbar() {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    setShowUserMenu(false);
  };

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
        <div className="user-menu">
          <button
            className="user-button"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <User size={20} />
            <span>{user.email}</span>
          </button>
          {showUserMenu && (
            <div className="user-dropdown">
              <button onClick={handleSignOut} className="user-dropdown-item">
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          )}
        </div>
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