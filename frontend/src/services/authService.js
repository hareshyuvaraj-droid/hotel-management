import api from './api';

export const registerUser = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const loginUser = async (credentials) => {
  // Token is now set as httpOnly cookie by the server — we only store user info locally
  const response = await api.post('/auth/login', credentials);
  const { user } = response.data;
  localStorage.setItem('user', JSON.stringify(user));
  return user;
};

export const logoutUser = async () => {
  try {
    await api.post('/auth/logout'); // Clears the httpOnly cookie server-side
  } finally {
    localStorage.removeItem('user');
  }
};

export const getUserProfile = async () => {
  const response = await api.get('/auth/profile');
  return response.data;
};

export const changePassword = async (passwordData) => {
  const response = await api.post('/auth/change-password', passwordData);
  return response.data;
};

// Auth check: user object in localStorage means they've logged in this session.
// The actual token lives in an httpOnly cookie — the server validates it on each request.
export const isAuthenticated = () => Boolean(localStorage.getItem('user'));

export const getCurrentUser = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch {
    localStorage.removeItem('user');
    return null;
  }
};
