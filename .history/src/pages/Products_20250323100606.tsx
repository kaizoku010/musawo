
import { useEffect } from 'react';
import { useProducts } from '../contexts/ProductContext';
import { useService } from '../contexts/ServiceContext';

export default function Products() {
  const { products, isLoading, error, fetchProducts } = useProducts();
  const { status } = useService();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  if (!status?.isConnected) {
    return <div>Service is currently unavailable</div>;
  }

  if (isLoading) {
    return <div>Loading products...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map(product => (
          <div key={product.id} className="p-4 border rounded">
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <p>Price: ${product.price}</p>
            <p>Stock: {product.stock}</p>
          </div>
        ))}
      </div>
    </div>
  );
}



