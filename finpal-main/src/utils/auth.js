import { getToken, getUser, removeToken, setToken } from './api';

export const isAuthenticated = () => {
  return !!getToken();
};

export const login = () => {
  setToken('demo_token');
};

export const signup = (name, email, password) => {
  setToken('demo_token');
};

export const getUserData = () => {
  return getUser();
};

export const logout = () => {
  removeToken();
  window.location.href = 'http://localhost:5173';
};

