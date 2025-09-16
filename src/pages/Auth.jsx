import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './Auth.css';

function Auth() {
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const { signIn, signUp } = useAuth();

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
          // Store remember me preference
          if (rememberMe) {
            localStorage.setItem('rememberMe', 'true');
          }
          // Redirect to home page on successful sign in
          window.location.href = '/';
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
    <div className="auth-page">
      <div className="auth-container">
        {/* Logo */}
        <div className="auth-logo">
          <div className="logo-circle">
            <div className="logo-c">C</div>
          </div>
        </div>

        {/* Title */}
        <h1 className="auth-title">
          {isSignUp ? 'Create Account' : 'Welcome Back'}
        </h1>
        <p className="auth-subtitle">
          {isSignUp ? 'Join Convrilo today' : 'Sign in to your account'}
        </p>

        {message && (
          <div className="auth-message">{message}</div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="auth-input"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="auth-input"
            required
          />

          {isSignUp && (
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="auth-input"
              required
            />
          )}

          {error && (
            <div className="auth-error">{error}</div>
          )}

          {!isSignUp && (
            <label className="remember-me">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Remember me</span>
            </label>
          )}

          <button
            type="submit"
            disabled={loading}
            className="auth-btn primary"
          >
            {loading ? 'Loading...' : (isSignUp ? 'Create Account' : 'Sign In')}
          </button>

          <button
            type="button"
            className="auth-btn google"
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
        <div className="auth-switch">
          <span className="switch-text">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
          </span>
          <button
            type="button"
            onClick={switchMode}
            className="switch-link"
          >
            {isSignUp ? 'Sign in' : 'Sign up, it\'s free!'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Auth;