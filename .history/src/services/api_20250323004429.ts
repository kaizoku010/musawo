import axios from 'axios';
import { API_CONFIG } from '../config/constants';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const getProducts = (params?: any) => api.get('/products', { params });
export const getProduct = (id: string) => api.get(`/products/${id}`);
export const createProduct = (data: any) => api.post('/products', data);
export const updateProduct = (id: string, data: any) => api.put(`/products/${id}`, data);
export const deleteProduct = (id: string) => api.delete(`/products/${id}`);

export const getOrders = (params?: any) => api.get('/orders', { params });
export const getOrder = (id: string) => api.get(`/orders/${id}`);
export const createOrder = (data: any) => api.post('/orders', data);
export const updateOrder = (id: string, data: any) => api.put(`/orders/${id}`, data);

export const getUsers = (params?: any) => api.get('/users', { params });
export const getUser = (id: string) => api.get(`/users/${id}`);
export const updateUser = (id: string, data: any) => api.put(`/users/${id}`, data);

export const getAnalytics = () => api.get('/analytics');

// Auth endpoints
export const auth = {
  login: (email: string, password: string) => api.post('/auth/login', { email, password }),
  validate: () => api.get('/auth/validate'),
  logout: () => api.post('/auth/logout'),
};

export default api;