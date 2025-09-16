import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import './AuthModal.css';

function AuthModal({ isOpen, onClose, mode = 'signin' }) {
  const [isSignUp, setIsSignUp] = useState(mode === 'signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const { signIn, signUp } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    if (!email || !password) {
      setError('Please enter both email and password.');
      setLoading(false);
      return;
    }

    if (isSignUp && password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        const { error } = await signUp(email, password);
        if (error) {
          setError(error.message);
        } else {
          setMessage('Check your email for the confirmation link!');
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          setError(error.message);
        } else {
          onClose();
        }
      }
    } catch (err) {
      setError('An unexpected error occurred');
    }

    setLoading(false);
  };

  const switchMode = () => {
    setIsSignUp(!isSignUp);
    setError('');
    setMessage('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <>
      {/* Prevent background interactions and apply blur */}
      <style>{`
        body { overflow: hidden; }
        .main-container { pointer-events: none; filter: blur(2px); }
        .navbar { pointer-events: none; filter: blur(2px); }
        .simple-auth-overlay, .simple-auth-overlay *, .simple-auth-modal, .simple-auth-modal * {
          filter: none !important;
          backdrop-filter: none !important;
        }
      `}</style>

      <div className="simple-auth-overlay" onClick={onClose} style={{ filter: 'none !important' }}>
        <div className="simple-auth-modal" onClick={(e) => e.stopPropagation()} style={{ filter: 'none !important' }}>
          <button className="simple-auth-close" onClick={onClose}>
            <X size={20} />
          </button>

          {/* Logo */}
          <div className="simple-auth-logo">
            <div className="simple-logo-circle">
              <div className="simple-logo-c">C</div>
            </div>
          </div>

          {/* Title */}
          <h2 className="simple-auth-title">Convrilo</h2>

          {message && (
            <div className="simple-auth-message">{message}</div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="simple-auth-form">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="simple-auth-input"
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="simple-auth-input"
              required
            />

            {isSignUp && (
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="simple-auth-input"
                required
              />
            )}

            {error && (
              <div className="simple-auth-error">{error}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="simple-auth-btn primary"
            >
              {loading ? 'Loading...' : (isSignUp ? 'Create Account' : 'Sign in')}
            </button>

            <button
              type="button"
              className="simple-auth-btn google"
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="google-icon"
              />
              Continue with Google
            </button>
          </form>

          {/* Switch Mode */}
          <div className="simple-auth-switch">
            <span className="switch-text">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                type="button"
                onClick={switchMode}
                className="switch-link"
              >
                {isSignUp ? 'Sign in' : 'Sign up, it\'s free!'}
              </button>
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

export default AuthModal;