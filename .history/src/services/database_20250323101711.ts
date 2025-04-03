import axios from 'axios';
import { API_CONFIG } from '../config/constants';

export const checkDatabaseConnection = async () => {
  try {
    console.log('Checking database connection...');
    const response = await axios.get(`${API_CONFIG.BASE_URL}/api/health/db`, {
      timeout: 5000, // 5 second timeout
    });
    console.log('Database check response:', response.data);
    return response.data.status === 'connected';
  } catch (error) {
    console.error('Database connection check failed:', error);
    if (axios.isAxiosError(error)) {
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        response: error.response?.data
      });
    }
    // If using default admin, return true for connection
    const token = localStorage.getItem('admin_token');
    if (token === 'default-admin-token') {
      return true;
    }
    return false;
  }
};



