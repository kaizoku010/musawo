import axios from 'axios';

const BASE_URL = 'https://smserver-kdya.onrender.com';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

// Remove token requirement
api.interceptors.request.use((config) => {
  // Temporarily set a default admin token
  config.headers.Authorization = 'Bearer admin-token';
  return config;
});

export const auth = {
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

interface ProductData {
  name: string;
  price: number;
  category: string;
  stock: number;
  image: string;
  description?: string;
}

export const productService = {
  create: async (productData: ProductData) => {
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
console.log()
      return response.data;
    } catch (error) {
      console.error('Failed to fetch products:', error);
      throw error;
    }
  },

  update: async (id: string, data: Partial<ProductData>) => {
    try {
      const response = await api.put(`/api/products/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Failed to update product:', error);
      throw error;
    }
  },

  delete: async (id: string) => {
    try {
      const response = await api.delete(`/api/products/${id}`);
      return response.data;
    } catch (error) {
      console.error('Failed to delete product:', error);
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

export const orderService = {
  getAll: async () => {
    try {
      const response = await api.get('/api/orders');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      throw error;
    }
  },
  
  getOne: async (id: string) => {
    try {
      const response = await api.get(`/api/orders/${id}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch order:', error);
      throw error;
    }
  },

  create: async (data: any) => {
    try {
      const response = await api.post('/api/orders', data);
      return response.data;
    } catch (error) {
      console.error('Failed to create order:', error);
      throw error;
    }
  },

  update: async (id: string, data: any) => {
    try {
      const response = await api.put(`/api/orders/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Failed to update order:', error);
      throw error;
    }
  }
};

export default api;










