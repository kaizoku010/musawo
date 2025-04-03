import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { healthService } from '../services/api';

interface ServiceStatus {
  isConnected: boolean;
  status: string;
  mode?: 'online' | 'offline';
  error?: string;
}

interface ServiceContextType {
  status: ServiceStatus | null;
  isLoading: boolean;
  checkStatus: () => Promise<void>;
}

const ServiceContext = createContext<ServiceContextType | undefined>(undefined);

export function ServiceProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<ServiceStatus | null>({
    isConnected: true,
    status: 'ok',
    mode: 'offline'
  });
  const [isLoading, setIsLoading] = useState(true);

  const checkStatus = async () => {
    try {
      const result = await healthService.checkStatus();
      setStatus(result);
    } catch (error) {
      console.error('Failed to check status:', error);
      // Set default connected status if using default admin
      const token = localStorage.getItem('admin_token');
      if (token === 'default-admin-token') {
        setStatus({
          isConnected: true,
          status: 'ok',
          mode: 'offline'
        });
      } else {
        setStatus({
          isConnected: false,
          status: 'error',
          error: 'Service unavailable'
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <ServiceContext.Provider value={{ status, isLoading, checkStatus }}>
      {children}
    </ServiceContext.Provider>
  );
}

export const useService = () => {
  const context = useContext(ServiceContext);
  if (context === undefined) {
    throw new Error('useService must be used within a ServiceProvider');
  }
  return context;
};
