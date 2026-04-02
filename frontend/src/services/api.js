import axios from 'axios';
import { toast } from 'react-toastify';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true  // Send httpOnly cookies with every request
});

// Handle common HTTP errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      toast.error('Network error: could not connect to the server.');
      return Promise.reject(new Error('Network error'));
    }

    const { status, data } = error.response;
    const message = data?.message || 'An unexpected error occurred';

    if (status === 401) {
      // Cookie is invalid/expired — clear local user state and redirect
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    } else if (status === 403) {
      toast.error('You do not have permission to perform this action.');
    } else if (status === 404) {
      toast.error('The requested resource was not found.');
    } else if (status === 429) {
      toast.error('Too many requests. Please slow down and try again.');
    } else {
      toast.error(message);
    }

    return Promise.reject({ status, message });
  }
);

export default api;
