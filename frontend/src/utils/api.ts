import axios from 'axios';

// Create an instance of axios with the backend API baseURL
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token to headers automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('lumina_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiry (401 errors)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn('Unauthorized or token expired. Clearing session...');
      localStorage.removeItem('lumina_token');
      localStorage.removeItem('lumina_user');
      // We can also redirect to login if necessary, or let the AuthContext handle state cleanups
    }
    return Promise.reject(error);
  }
);

export default api;
