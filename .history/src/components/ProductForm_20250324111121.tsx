
import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { uploadToCloudinary } from '@/utils';
import { useState } from 'react';
import type { ProductCreateInput } from '../types/models';

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Product name must be at least 2 characters.",
  }),
  price: z.coerce.number().min(0.01, {
    message: "Price must be greater than 0.",
  }),
  category: z.string().min(1, {
    message: "Please select a category.",
  }),
  stock: z.coerce.number().min(0, {
    message: "Stock cannot be negative.",
  }),
  reviews: z.coerce.number().min(0, {
    message: "Reviews cannot be negative.",
  }).default(0),
  image: z.any().optional(),
  description: z.string().optional(),
});

type ProductFormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
  onSubmit: (data: ProductCreateInput) => Promise<void>;
  loading?: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({ onSubmit, loading = false }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      price: 0,
      category: "",
      stock: 0,
      reviews: 0,
      image: undefined,
      description: "",
    },
  });

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    form.setValue('image', file);
  };

  const handleSubmit = async (data: ProductFormValues) => {
    try {
      setUploadingImage(true);
      
      const productData: ProductCreateInput = {
        name: data.name,
        price: data.price,
        category: data.category,
        stock: data.stock,
        reviews: data.reviews,
        description: data.description || '',
        image: '' 
      };

       if (data.image instanceof File) {
        try {
          productData.image = await uploadToCloudinary(data.image);
        } catch (error) {
          console.error('Image upload failed:', error);
          throw new Error('Failed to upload image');
        }
      }
  
      // Submit to API
      await onSubmit(productData);

      // Reset form
      form.reset();
      setImagePreview(null);
    } catch (error) {
      console.error('Form submission error:', error);
      throw error;
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter product name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price ($)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stock</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="reviews"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reviews</FormLabel>
                <FormControl>
                  <Input type="number" min="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter product description"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Electronics">Electronics</SelectItem>
                  <SelectItem value="Clothing">Clothing</SelectItem>
                  <SelectItem value="Home">Home</SelectItem>
                  <SelectItem value="Books">Books</SelectItem>
                  <SelectItem value="Sports">Sports</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image"
          render={({ field: { value, onChange, ...field } }) => (
            <FormItem>
              <FormLabel>Product Image</FormLabel>
              <FormControl>
                <div className="space-y-4">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    {...field}
                  />
                  {imagePreview && (
                    <div className="mt-2">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-md"
                      />
                    </div>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full" 
          disabled={loading || uploadingImage}
        >
          {(loading || uploadingImage) ? (
            <>
              <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              {uploadingImage ? "Uploading Image..." : "Adding Product"}
            </>
          ) : (
            "Add Product"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default ProductForm;









