export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  products: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface AnalyticsSummary {
  totalSales: number;
  totalOrders: number;
  averageOrderValue: number;
  topProducts: Array<{
    productId: string;
    name: string;
    totalSold: number;
  }>;
}

export interface ServiceStatus {
  isConnected: boolean;
  details: {
    state: number;
    host: string;
    name: string;
  };
}