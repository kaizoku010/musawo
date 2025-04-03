// Product related types
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  image?: string;
  reviews: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductCreateInput {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  image?: string;
  reviews?: number;
}

export interface ProductUpdateInput extends Partial<ProductCreateInput> {}

// Order related types
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

// Analytics related types
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

// Service related types
export interface ServiceStatus {
  isConnected: boolean;
  details: {
    state: number;
    host: string;
    name: string;
  };
}
