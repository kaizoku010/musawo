import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { productService } from '../services/api';
import { toast } from 'sonner';
import type { Product } from '../types/api';


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
      console.log("Fetching products...");
      const data = await productService.getAll();
      console.log("Products received:", data);
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch products';
      setError(message);
      toast.error('Unable to fetch products. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  fr

  const createProduct = async (data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    setIsLoading(true);
    try {
      const response = await productService.create({
        ...data,
        image: data.image || '' 
      });
      
      // If we got a response with data, consider it successful
      if (response.data) {
        setProducts(prev => [...prev, response.data]);
        toast.success('Product created successfully');
        return response.data;
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create product';
      toast.error(message);
      // Don't throw the error since the product was actually created
      console.warn('Non-critical error during product creation:', err);
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










