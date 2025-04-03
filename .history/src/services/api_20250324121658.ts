import axios from 'axios';
import { DEFAULT_ADMIN } from '../config/constants';

const BASE_URL = 'http://localhost:5000'; // adjust to match your backend URL

// Create axios instance with base configuration
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

// Add request interceptor to include token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.token) {
        localStorage.setItem('admin_token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
};

export const productService = {
  create: async (productData: Pr) => {
    try {
      const response = await api.post('/api/products', productData);
      return response.data;
    } catch (error) {
      console.error('Failed to create product:', error);
      throw error;
    }
  },

  getAll: async () => {
    try {
      const response = await api.get('/api/products');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch products:', error);
      throw error;
    }
  }
};

export const healthService = {
  checkStatus: async () => {
    try {
      const response = await api.get('/api/health');
      return {
        isConnected: true,
        status: 'connected',
        mode: 'online',
        details: response.data
      };
    } catch (error) {
      return {
        isConnected: false,
        status: 'error',
        mode: 'offline',
        error: error instanceof Error ? error.message : 'Service unavailable'
      };
    }
  }
};

export default api;

