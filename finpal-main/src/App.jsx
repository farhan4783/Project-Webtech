import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { isAuthenticated } from './utils/auth';
import { setToken, setUser } from './utils/api';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import AgentChat from './pages/AgentChat';
import RealityLens from './pages/RealityLens';
import FutureSimulator from './pages/FutureSimulator';
import Profile from './pages/Profile';

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const userStr = params.get('user');

    if (token && userStr) {
      setToken(token);
      localStorage.setItem('finsync_user', userStr); // manually set user since auth hook might differ
      // specific fix for auth utils if needed, or just use localStorage directly as per api.js

      // Clean URL and redirect
      navigate('/dashboard', { replace: true });
    }
  }, [location, navigate]);

  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to="/dashboard" replace />}
      />
      {/* Login and Signup are handled by external landing page */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/agent-chat"
        element={
          <ProtectedRoute>
            <AgentChat />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reality-lens"
        element={
          <ProtectedRoute>
            <RealityLens />
          </ProtectedRoute>
        }
      />
      <Route
        path="/future-simulator"
        element={
          <ProtectedRoute>
            <FutureSimulator />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
