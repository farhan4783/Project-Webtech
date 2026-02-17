import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { getUserData, logout } from '../utils/auth';
import './dashboard.css';

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const data = getUserData();
    if (data) {
      setUserData(data);
    }
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Topbar title="Profile" />
        <div className="profile-content">
          <div className="profile-card">
            <div className="profile-header">
              <div className="profile-avatar">
                {userData?.name ? userData.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <h2 className="profile-name">{userData?.name || 'User'}</h2>
              <p className="profile-email">{userData?.email || 'No email'}</p>
            </div>

            <div className="profile-section">
              <h3 className="profile-section-title">Account Information</h3>
              <div className="profile-info-grid">
                <div className="profile-info-item">
                  <span className="info-label">Full Name</span>
                  <span className="info-value">{userData?.name || 'Not set'}</span>
                </div>
                <div className="profile-info-item">
                  <span className="info-label">Email</span>
                  <span className="info-value">{userData?.email || 'Not set'}</span>
                </div>
                <div className="profile-info-item">
                  <span className="info-label">Member Since</span>
                  <span className="info-value">
                    {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            <div className="profile-section">
              <h3 className="profile-section-title">Settings</h3>
              <div className="profile-actions">
                <button className="profile-action-button">
                  <span className="action-icon">✏️</span>
                  Edit Profile
                </button>
                <button className="profile-action-button">
                  <span className="action-icon">🔒</span>
                  Change Password
                </button>
                <button className="profile-action-button">
                  <span className="action-icon">🔔</span>
                  Notification Preferences
                </button>
              </div>
            </div>

            <div className="profile-footer">
              <button onClick={handleLogout} className="logout-profile-button">
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
