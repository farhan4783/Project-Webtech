import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';

export default function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    // Redirect to landing page login
    window.location.href = 'http://localhost:3000';
    return null;
  }
  return children;
}
