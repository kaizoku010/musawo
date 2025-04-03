import axios from 'axios';

export const checkDatabaseConnection = async () => {
  try {
    // Add logging to debug the connection attempt
    console.log('Checking database connection...');
    const response = await axios.get('http://localhost:8000/api/health/db');
    console.log('Database check response:', response.data);
    return response.data.status === 'connected';
  } catch (error) {
    console.error('Database connection check failed:', error);
    return false;
  }
};

