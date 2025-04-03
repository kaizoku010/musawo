import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const checkDatabaseConnection = async () => {
  try {
    console.log('Checking database connection...');
    const response = await axios.get(`${API_URL}/api/health/db`, {
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
    return false;
  }
};


