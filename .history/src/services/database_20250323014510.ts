import axios from 'axios';
import { API_CONFIG } from '../config/constants';

export const checkDatabaseConnection = async () => {
  try {
    const response = await axios.get(`${API_CONFIG.BASE_URL}/api/health/db`);
    return response.data.status === 'connected';
  } catch (error) {
    console.error('Database connection check failed:', error);
    return false;
  }
};
