import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { healthService } from '../services/health';
import type { ServiceStatus } from '../types/api';

interface ServiceContextType {
  status: ServiceStatus | null;
  isLoading: boolean;
  checkStatus: () => Promise<void>;
}

const ServiceContext = createContext<ServiceContextType | undefined>(undefined);

export function ServiceProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<ServiceStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkStatus = async () => {
    try {
      const result = await healthService.checkStatus();
      setStatus(result);
    } catch (error) {
      console.error('Failed to check status:', error);
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