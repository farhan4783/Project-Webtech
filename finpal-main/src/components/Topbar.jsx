import { useNavigate } from 'react-router-dom';
import '../pages/dashboard.css';

export default function Topbar({ title }) {
  const navigate = useNavigate();

  return (
    <header className="topbar">
      <h1 className="topbar-title">{title}</h1>
      <div className="topbar-actions">
        <button className="topbar-icon-button">
          <span className="icon-add">+</span>
        </button>
        <button className="topbar-icon-button">
          <span className="icon-notification">🔔</span>
          <span className="notification-dot"></span>
        </button>
        <button 
          className="topbar-icon-button"
          onClick={() => navigate('/profile')}
          title="Profile"
        >
          <span className="icon-profile">👤</span>
        </button>
      </div>
    </header>
  );
}
