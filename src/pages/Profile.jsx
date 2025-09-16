import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Calendar, Shield } from 'lucide-react';
import './Profile.css';

function Profile() {
  const { user, signOut } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    displayName: user?.user_metadata?.full_name || user?.email?.split('@')[0] || '',
    email: user?.email || '',
  });

  const handleSave = () => {
    // Here you would typically update the user profile in Supabase
    setIsEditing(false);
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
        <div className="profile-header">
          <div className="profile-avatar">
            <User size={48} />
          </div>
          <h1>My Profile</h1>
        </div>

        <div className="profile-content">
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