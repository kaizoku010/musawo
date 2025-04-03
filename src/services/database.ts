import axios from 'axios';
import { API_CONFIG } from '../config/constants';

export const isOfflineMode = () => {
  const token = localStorage.getItem('admin_token');
  return token === 'default-admin-token';
};


