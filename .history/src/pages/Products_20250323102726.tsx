
import { useEffect } from 'react';
import { useProducts } from '../contexts/ProductContext';
import { useService } from '../contexts/ServiceContext';

export default function Products() {
  const { products, isLoading, error, fetchProducts } = useProducts();
  const { status } = useService();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        await fetchProducts();
      } catch (err) {
        console.error('Failed to load products:', err);
      }
    };
    
    loadProducts();
  }, [fetchProducts]);

  if (!status?.isConnected) {
    return (
      <div className="p-4 text-center">
        <h2 className="text-xl font-semibold text-red-600">Service Unavailable</h2>
        <p className="mt-2 text-gray-600">
          The service is currently offline. Please try again later.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-4 text-center">
        <div className="animate-pulse">Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <h2 className="text-xl font-semibold text-red-600">Error</h2>
        <p className="mt-2 text-gray-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Products</h1>
      {products.length === 0 ? (
        <div className="text-center text-gray-600">
          No products available.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map(product => (
            <div key={product.id} className="p-4 border rounded shadow hover:shadow-md transition-shadow">
              <h2 className="text-lg font-semibold">{product.name}</h2>
              <p className="text-gray-600 mt-2">{product.description}</p>
              <div className="mt-4 flex justify-between items-center">
                <p className="font-medium">${product.price}</p>
                <p className="text-sm text-gray-500">Stock: {product.stock}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}




