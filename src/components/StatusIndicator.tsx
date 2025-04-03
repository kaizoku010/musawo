import { useEffect, useState } from 'react';
import { healthService } from '../services/health';
import type { ServiceStatus } from '../types/api';

export function StatusIndicator() {
  const [status, setStatus] = useState<ServiceStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const result = await healthService.checkStatus();
        setStatus(result);
      } catch (error) {
        console.error('Failed to check status:', error);
      } finally {
        setLoading(false);
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div>Checking service status...</div>;

  return (
    <div className="flex items-center gap-2">
      <div className={`w-3 h-3 rounded-full ${status?.isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
      <span>{status?.isConnected ? 'Connected' : 'Disconnected'}</span>
    </div>
  );
}