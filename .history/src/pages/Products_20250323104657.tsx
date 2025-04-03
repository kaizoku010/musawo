
import React, { useState } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { DataTable } from '@/components/DataTable';
import ProductForm from '@/components/ProductForm';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useMockData, Product } from '@/hooks/useMockData';
import { format } from 'date-fns';
import { PlusCircle } from 'lucide-react';

const Products = () => {
  const { products, addProduct, isLoading } = useMockData();
  const [addingProduct, setAddingProduct] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const columns = [
    {
      header: 'Product',
      accessorKey: 'name' as const,
      cell: (product: Product) => (
        <div className="flex items-center gap-3">
          <img
            src={product.image}
            alt={product.name}
            className="w-10 h-10 rounded object-cover"
          />
          <span className="font-medium">{product.name}</span>
        </div>
      ),
    },
    {
      header: 'Category',
      accessorKey: 'category' as const,
      cell: (product: Product) => (
        <Badge variant="outline">{product.category}</Badge>
      ),
    },
    {
      header: 'Price',
      accessorKey: 'price' as const,
      cell: (product: Product) => (
        <span className="font-medium">${product.price.toLocaleString()}</span>
      ),
    },
    {
      header: 'Stock',
      accessorKey: 'stock' as const,
      cell: (product: Product) => (
        <div className="flex items-center">
          <div className={`h-2 w-2 rounded-full mr-2 ${
            product.stock > 50 ? 'bg-green-500' : 
            product.stock > 10 ? 'bg-yellow-500' : 'bg-red-500'
          }`} />
          <span>{product.stock}</span>
        </div>
      ),
    },
    {
      header: 'Added',
      accessorKey: 'createdAt' as const,
      cell: (product: Product) => (
        <span className="text-muted-foreground">
          {format(new Date(product.createdAt), 'MMM d, yyyy')}
        </span>
      ),
    },
  ];

  const handleAddProduct = (data: Omit<Product, 'id' | 'createdAt'>) => {
    setAddingProduct(true);
    
    // Simulate server delay
    setTimeout(() => {
      addProduct(data);
      setAddingProduct(false);
      setIsDialogOpen(false);
    }, 1000);
  };

  return (
    <AdminLayout title="Products">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Products</h2>
            <p className="text-muted-foreground">Manage your product inventory</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
                <DialogDescription>
                  Fill in the details for the new product.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <ProductForm 
                  onSubmit={async (data) => {
                    setAddingProduct(true);
                    try {
                      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate server delay
                      await addProduct(data);
                    } finally {
                      setAddingProduct(false);
                      setIsDialogOpen(false);
                    }
                  }}
                  loading={addingProduct} 
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardContent className="p-6">
            <DataTable
              data={products}
              columns={columns}
              searchKey="name"
              loading={isLoading}
            />
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Products;

