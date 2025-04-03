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

// Product endpoints
interface ProductData {
  name: string;
  price: number;
  category: string;
  stock: number;
  image: string;
  description?: string;
}

export const productService = {
  getAll: (params?: any) => api.get('/products', { params }),
  getOne: (id: string) => api.get(`/products/${id}`),
  create: (data: ProductData) => api.post('/products', data, {
    headers: {
      'Content-Type': 'application/json',
      // Authorization header will be automatically added by your api instance
    }
  }),
  update: (id: string, data: any) => api.put(`/products/${id}`, data),
  delete: (id: string) => api.delete(`/products/${id}`),
};

// Order endpoints
export const orderService = {
  getAll: (params?: any) => api.get('/orders', { params }),
  getOne: (id: string) => api.get(`/orders/${id}`),
  create: (data: any) => api.post('/orders', data),
  update: (id: string, data: any) => api.put(`/orders/${id}`, data),
};

// Analytics endpoints
export const analyticsService = {
  getSummary: () => api.get('/analytics'),
  getSales: (params?: any) => api.get('/analytics/sales', { params }),
  getInventory: () => api.get('/analytics/inventory'),
};

// Auth endpoints
export const authService = {
  login: (email: string, password: string) => 
    api.post('/auth/login', { email, password }),
  validate: () => api.get('/auth/validate'),
  logout: () => api.post('/auth/logout'),
};

// Auth endpoints
export const auth = {
  login: (email: string, password: string) => api.post('/auth/login', { email, password }),
  validate: () => api.get('/auth/validate'),
  logout: () => api.post('/auth/logout'),
};


export default api;


