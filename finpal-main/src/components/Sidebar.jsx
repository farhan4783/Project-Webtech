import { Link, useLocation, useNavigate } from 'react-router-dom';
import { logout } from '../utils/auth';
import './sidebar.css';

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', shortLabel: 'Home', icon: '⊞' },
    { path: '/agent-chat', label: 'Agent Team Chat', shortLabel: 'Chat', icon: '💬' },
    { path: '/reality-lens', label: 'Reality Lens', shortLabel: 'Lens', icon: '👁️' },
    { path: '/future-simulator', label: 'Future Simulator', shortLabel: 'Sim', icon: '⚡' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <span className="logo-icon">F</span>
          <span className="logo-text">FinSync AI</span>
        </div>
      </div>
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
            <span className="nav-label-mobile">{item.shortLabel}</span>
          </Link>
        ))}
      </nav>
      <div className="sidebar-footer">
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>
    </aside>
  );
}
