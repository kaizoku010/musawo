import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { productService } from '../services/api';
import { toast } from 'sonner';
import type { Product } from '../types/api';
import axios from 'axios';
import { API_CONFIG } from '../config/constants';

interface ProductContextType {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  createProduct: (data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateProduct: (id: string, data: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await productService.getAll();
      setProducts(Array.isArray(data) ? data : data.products || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch products';
      setError(message);
      toast.error('Unable to fetch products. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createProduct = async (data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    setIsLoading(true);
    try {
      const response = await productService.create({
        ...data,
        image: data.image || '' 
      });
      setProducts(prev => [...prev, response.data]);
      toast.success('Product created successfully');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create product';
      toast.error(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };


  const updateProduct = async (id: string, data: Partial<Product>) => {
    setIsLoading(true);
    try {
      const response = await productService.update(id, data);
      setProducts(prev => prev.map(p => p.id === id ? response.data : p));
      toast.success('Product updated successfully');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update product';
      toast.error(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    setIsLoading(true);
    try {
      await productService.delete(id);
      setProducts(prev => prev.filter(p => p.id !== id));
      toast.success('Product deleted successfully');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete product';
      toast.error(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProductContext.Provider value={{
      products,
      isLoading,
      error,
      fetchProducts,
      createProduct,
      updateProduct,
      deleteProduct
    }}>
      {children}
    </ProductContext.Provider>
  );
}

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};









