export const DEFAULT_ADMIN = {
  id: '1',
  email: 'admin@example.com',
  name: 'Admin User',
  role: 'admin' as const,
  avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=0D8ABC&color=fff'
};

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  ENDPOINTS: {
    AUTH: '/api/auth',
    PRODUCTS: '/api/products',
    ORDERS: '/api/orders',
    USERS: '/api/users',
    HEALTH: '/api/health'
  }
};


