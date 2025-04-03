
import { useState, useEffect } from 'react';

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  image: string;
  createdAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  joinDate: Date;
  orders: number;
  spent: number;
  status: 'active' | 'inactive';
}

export interface Sale {
  id: string;
  productId: string;
  productName: string;
  date: Date;
  quantity: number;
  amount: number;
  customerId: string;
  customerName: string;
}

export interface DashboardStats {
  totalSales: number;
  totalRevenue: number;
  totalUsers: number;
  totalProducts: number;
  salesByMonth: { month: string; sales: number }[];
  topProducts: { id: string; name: string; sales: number }[];
  recentSales: Sale[];
}

// Generate mock products
const generateMockProducts = (count: number): Product[] => {
  const categories = ['Electronics', 'Clothing', 'Home', 'Books', 'Sports'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `prod-${i + 1}`,
    name: `Product ${i + 1}`,
    price: Math.floor(Math.random() * 1000) + 10,
    category: categories[Math.floor(Math.random() * categories.length)],
    stock: Math.floor(Math.random() * 100),
    image: `https://source.unsplash.com/random/200x200?product=${i}`,
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000))
  }));
};

// Generate mock users
const generateMockUsers = (count: number): User[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `user-${i + 1}`,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    joinDate: new Date(Date.now() - Math.floor(Math.random() * 10000000000)),
    orders: Math.floor(Math.random() * 20),
    spent: Math.floor(Math.random() * 10000),
    status: Math.random() > 0.2 ? 'active' : 'inactive'
  }));
};

// Generate mock sales
const generateMockSales = (products: Product[], users: User[], count: number): Sale[] => {
  const sales: Sale[] = [];
  
  for (let i = 0; i < count; i++) {
    const product = products[Math.floor(Math.random() * products.length)];
    const user = users[Math.floor(Math.random() * users.length)];
    const quantity = Math.floor(Math.random() * 5) + 1;
    
    sales.push({
      id: `sale-${i + 1}`,
      productId: product.id,
      productName: product.name,
      date: new Date(Date.now() - Math.floor(Math.random() * 10000000000)),
      quantity,
      amount: product.price * quantity,
      customerId: user.id,
      customerName: user.name
    });
  }
  
  return sales.sort((a, b) => b.date.getTime() - a.date.getTime());
};

// Generate dashboard stats
const generateDashboardStats = (products: Product[], users: User[], sales: Sale[]): DashboardStats => {
  const totalSales = sales.length;
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.amount, 0);
  const totalUsers = users.length;
  const totalProducts = products.length;
  
  // Create sales by month data
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const salesByMonth = monthNames.map(month => ({
    month,
    sales: Math.floor(Math.random() * 50000) + 10000
  }));
  
  // Create top products data
  const productSales = new Map<string, number>();
  sales.forEach(sale => {
    const current = productSales.get(sale.productId) || 0;
    productSales.set(sale.productId, current + sale.amount);
  });
  
  const topProducts = Array.from(productSales.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([id, sales]) => {
      const product = products.find(p => p.id === id);
      return {
        id,
        name: product ? product.name : 'Unknown Product',
        sales
      };
    });
  
  return {
    totalSales,
    totalRevenue,
    totalUsers,
    totalProducts,
    salesByMonth,
    topProducts,
    recentSales: sales.slice(0, 10)
  };
};

export const useMockData = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initMockData = () => {
      const mockProducts = generateMockProducts(30);
      const mockUsers = generateMockUsers(50);
      const mockSales = generateMockSales(mockProducts, mockUsers, 200);
      const mockStats = generateDashboardStats(mockProducts, mockUsers, mockSales);
      
      setProducts(mockProducts);
      setUsers(mockUsers);
      setSales(mockSales);
      setStats(mockStats);
      setIsLoading(false);
    };
    
    // Simulate server delay
    const timer = setTimeout(() => {
      initMockData();
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Function to add a new product
  const addProduct = (product: Omit<Product, 'id' | 'createdAt'>) => {
    const newProduct: Product = {
      ...product,
      id: `prod-${products.length + 1}`,
      createdAt: new Date()
    };
    
    setProducts(prevProducts => [newProduct, ...prevProducts]);
    return newProduct;
  };

  return {
    products,
    users,
    sales,
    stats,
    isLoading,
    addProduct
  };
};
