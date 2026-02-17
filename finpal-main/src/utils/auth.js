import { getToken, getUser, removeToken } from './api';

export const isAuthenticated = () => {
  return !!getToken();
};

export const getUserData = () => {
  return getUser();
};

export const logout = () => {
  removeToken();
  window.location.href = 'http://localhost:5173';
};

