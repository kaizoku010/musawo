export const DEFAULT_ADMIN = {
  id: '1',
  email: 'admin@example.com',
  name: 'Admin User',
  role: 'admin' as const,
  avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=0D8ABC&color=fff'
};

export const API_CONFIG = {
  BASE_URL: 'http://localhost:8000',
  MONGODB_URI: 'mongodb+srv://dev:mDuM2DVgsdjJkAft@sembeza.1dv27.mongodb.net/?retryWrites=true&w=majority&appName=sembeza',
  ENDPOINTS: {
    AUTH: '/api/auth',
    PRODUCTS: '/api/products',
    ORDERS: '/api/orders',
    USERS: '/api/users',
    HEALTH: '/api/health'
  }
};

