import api from './api';

export const healthService = {
  checkStatus: async () => {
    try {
      const response = await api.get('/health/db');
      return {
        isConnected: response.data.status === 'connected',
        details: response.data.details
      };
    } catch (error) {
      console.error('Health check failed:', error);
      return {
        isConnected: false,
        details: {
          state: 0,
          host: 'unknown',
          name: 'unknown'
        }
      };
    }
  }
};