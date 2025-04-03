import axios from 'axios';
import { API_CONFIG, DEFAULT_ADMIN } from '../config/constants';

// Create axios instance with default config
const api = axios.create({
  baseURL: https://smserver-kdya.onrender.com/,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
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
    getAll: async (params?: any) => {
      const response = await api.get(API_CONFIG.ENDPOINTS.PRODUCTS, { params });
      return response.data;
    },
    getOne: (id: string) => api.get(`/products/${id}`),
    create: (data: ProductData) => api.post('/products', data),
    update: (id: string, data: Partial<ProductData>) => api.put(`/products/${id}`, data),
    delete: (id: string) => api.delete(`/products/${id}`)
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

// Auth endpoints with default admin fallback
export const auth = {
  login: async (email: string, password: string) => {
    // Always allow default admin login
    if (email === DEFAULT_ADMIN.email && password === 'admin123') {
      try {
        // Try API first
        const response = await api.post('/auth/login', { email, password });
        return response;
      } catch (error) {
        // Fallback to local default admin if API fails
        return {
          data: {
            token: 'default-admin-token',
            user: DEFAULT_ADMIN
          }
        };
      }
    }
    // For non-admin users, proceed with normal login
    return api.post('/auth/login', { email, password });
  },
  validate: async () => {
    try {
      return await api.get('/auth/validate');
    } catch (error) {
      // Check if current token is default admin token
      const token = localStorage.getItem('admin_token');
      if (token === 'default-admin-token') {
        return { data: { user: DEFAULT_ADMIN } };
      }
      throw error;
    }
  },
  logout: () => api.post('/auth/logout'),
};

// Health check endpoint
export const healthService = {
  checkStatus: async () => {
    try {
      const response = await api.get('/api/health/db');
      return {
        isConnected: response.data.status === 'connected',
        status: response.data.status,
        mode: 'online',
        details: response.data.details || {}
      };
    } catch (error) {
      // If API is down but we're using default admin, still return connected
      const token = localStorage.getItem('admin_token');
      if (token === 'default-admin-token') {
        return {
          isConnected: true,
          status: 'ok',
          mode: 'offline',
          details: {
            state: 1,
            host: 'offline-mode',
            name: 'local'
          }
        };
      }
      console.error('Health check failed:', error);
      return {
        isConnected: false,
        status: 'error',
        mode: 'error',
        error: error instanceof Error ? error.message : 'Service unavailable'
      };
    }
  }
};

export default api;







