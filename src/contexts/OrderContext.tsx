import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { orderService } from '../services/api';
import { toast } from 'sonner';
import type { Order } from '../types/api';

interface OrderContextType {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  fetchOrders: () => Promise<void>;
  createOrder: (data: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateOrder: (id: string, data: Partial<Order>) => Promise<void>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await orderService.getAll();
      setOrders(response.data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch orders';
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createOrder = async (data: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => {
    setIsLoading(true);
    try {
      const response = await orderService.create(data);
      setOrders(prev => [...prev, response.data]);
      toast.success('Order created successfully');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create order';
      toast.error(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrder = async (id: string, data: Partial<Order>) => {
    setIsLoading(true);
    try {
      const response = await orderService.update(id, data);
      setOrders(prev => prev.map(o => o.id === id ? response.data : o));
      toast.success('Order updated successfully');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update order';
      toast.error(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <OrderContext.Provider value={{
      orders,
      isLoading,
      error,
      fetchOrders,
      createOrder,
      updateOrder
    }}>
      {children}
    </OrderContext.Provider>
  );
}

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};