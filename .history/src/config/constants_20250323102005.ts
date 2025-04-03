export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'https://smserver-kdya.onrender.com',
  ENDPOINTS: {
    AUTH: '/api/auth',
    PRODUCTS: '/api/products',
    ORDERS: '/api/orders',
    USERS: '/api/users',
    HEALTH: '/api/health/db'
  }
};

export const DEFAULT_ADMIN = {
  id: '1',
  email: 'admin@example.com',
  name: 'Admin User',
  role: 'admin' as const,
  avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=0D8ABC&color=fff'
};
