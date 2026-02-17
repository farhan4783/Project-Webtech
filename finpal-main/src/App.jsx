import { Routes, Route, Navigate } from 'react-router-dom';
import { isAuthenticated } from './utils/auth';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import AgentChat from './pages/AgentChat';
import RealityLens from './pages/RealityLens';
import FutureSimulator from './pages/FutureSimulator';
import Profile from './pages/Profile';

function App() {
  return (
    <Routes>
      <Route 
        path="/" 
        element={isAuthenticated() ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} 
      />
      <Route 
        path="/login" 
        element={isAuthenticated() ? <Navigate to="/dashboard" replace /> : <Login />} 
      />
      <Route 
        path="/signup" 
        element={isAuthenticated() ? <Navigate to="/dashboard" replace /> : <Signup />} 
      />
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
