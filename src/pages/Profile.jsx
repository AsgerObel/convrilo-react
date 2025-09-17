import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { User, Mail, Calendar, Shield, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import './Profile.css';

function Profile() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isEditing, setIsEditing] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [userInfo, setUserInfo] = useState({
    displayName: user?.user_metadata?.full_name || user?.email?.split('@')[0] || '',
    email: user?.email || '',
  });

  useEffect(() => {
    // Check if user came from successful payment
    if (searchParams.get('success') === 'true') {
      setShowSuccess(true);
      // Remove success param from URL after 5 seconds
      setTimeout(() => {
        setShowSuccess(false);
        navigate('/profile', { replace: true });
      }, 5000);
    }
  }, [searchParams, navigate]);

  useEffect(() => {
    if (user) {
      fetchSubscription();
    }
  }, [user]);

  const fetchSubscription = async () => {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching subscription:', error);
      } else {
        setSubscription(data);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSave = () => {
    // Here you would typically update the user profile in Supabase
    setIsEditing(false);
  };

  const handleCancelSubscription = async () => {
    if (!confirm('Are you sure you want to cancel your subscription? You will continue to have access until the end of your billing period.')) {
      return;
    }

    try {
      const response = await fetch('/api/cancel-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Your subscription has been cancelled. You will continue to have access until the end of your billing period.');
        // Refresh subscription data
        fetchSubscription();
      } else {
        console.error('Cancellation failed:', data);
        alert(data.error || 'Failed to cancel subscription. Please try again.');
      }
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      alert('Failed to cancel subscription. Please try again.');
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  if (!user) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <h1>Please sign in to view your profile</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Success Message */}
        {showSuccess && (
          <div className="success-banner">
            <CheckCircle size={24} className="success-icon" />
            <div>
              <h3>Payment Successful!</h3>
              <p>Welcome to Convrilo Pro! Your subscription is now active.</p>
            </div>
          </div>
        )}

        <div className="profile-header">
          <div className="profile-avatar">
            <User size={48} />
          </div>
          <h1>My Profile</h1>
          <div className="subscription-badge">
            {subscription?.status === 'active' ? (
              <span className="badge-pro">Pro</span>
            ) : (
              <span className="badge-free">Free</span>
            )}
          </div>
        </div>

        <div className="profile-content">
          {/* Subscription Status Section */}
          <div className="profile-section">
            <h2>Subscription Status</h2>
            <div className="subscription-info">
              {subscription?.status === 'active' ? (
                <div className="subscription-active">
                  <CheckCircle size={20} className="success-icon" />
                  <div className="subscription-details">
                    <p><strong>Pro Plan Active</strong></p>
                    <p>Enjoy unlimited conversations and large file uploads!</p>
                    {subscription?.cancel_at_period_end && (
                      <p className="cancellation-notice">
                        Your subscription will end on {new Date(subscription.current_period_end).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  {!subscription?.cancel_at_period_end && (
                    <button
                      onClick={handleCancelSubscription}
                      className="btn-cancel-subscription"
                    >
                      Cancel Subscription
                    </button>
                  )}
                </div>
              ) : (
                <div className="subscription-inactive">
                  <div>
                    <p><strong>Free Plan</strong></p>
                    <p>Upgrade to Pro for unlimited conversations and large file uploads</p>
                  </div>
                  <button
                    onClick={() => navigate('/pricing')}
                    className="btn-upgrade"
                  >
                    Upgrade to Pro
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="profile-section">
            <h2>Account Information</h2>
            <div className="profile-fields">
              <div className="profile-field">
                <label>
                  <User size={20} />
                  Display Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={userInfo.displayName}
                    onChange={(e) => setUserInfo({...userInfo, displayName: e.target.value})}
                    className="profile-input"
                  />
                ) : (
                  <span className="profile-value">{userInfo.displayName}</span>
                )}
              </div>

              <div className="profile-field">
                <label>
                  <Mail size={20} />
                  Email
                </label>
                <span className="profile-value">{userInfo.email}</span>
              </div>

              <div className="profile-field">
                <label>
                  <Calendar size={20} />
                  Member Since
                </label>
                <span className="profile-value">
                  {new Date(user.created_at).toLocaleDateString()}
                </span>
              </div>

              <div className="profile-field">
                <label>
                  <Shield size={20} />
                  Account Type
                </label>
                <span className="profile-value">
                  {user.app_metadata?.provider === 'google' ? 'Google Account' : 'Email Account'}
                </span>
              </div>
            </div>
          </div>

          <div className="profile-actions">
            {isEditing ? (
              <div className="edit-actions">
                <button onClick={handleSave} className="btn-save">
                  Save Changes
                </button>
                <button onClick={() => setIsEditing(false)} className="btn-cancel">
                  Cancel
                </button>
              </div>
            ) : (
              <button onClick={() => setIsEditing(true)} className="btn-edit">
                Edit Profile
              </button>
            )}

            <button onClick={handleSignOut} className="btn-signout">
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;