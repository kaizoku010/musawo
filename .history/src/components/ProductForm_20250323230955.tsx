
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
import { uploadToCloudinary } from '@/utils/cloudinary';
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
  const [imageUrl, setImageUrl] = useState<string>('');
  const [uploadStatus, setUploadStatus] = useState({
    isUploading: false,
    isDone: false,
    error: null as string | null
  });

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

    // Upload to Cloudinary
    setUploadStatus({
      isUploading: true,
      isDone: false,
      error: null
    });

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'your_preset_here');
      formData.append('folder', 'products');

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dnko3bvt0/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();
      if (data.secure_url) {
        setImageUrl(data.secure_url);
        setUploadStatus({
          isUploading: false,
          isDone: true,
          error: null
        });
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setUploadStatus({
        isUploading: false,
        isDone: false,
        error: 'Failed to upload image'
      });
    }
  };

  const handleSubmit = async (data: ProductFormValues) => {
    try {
      setUploadStatus({
        isUploading: true,
        isDone: false,
        error: null
      });
      
      // Create form data for image upload
      const formData = new FormData();
      if (data.image) {
        formData.append('file', data.image);
        formData.append('upload_preset', 'your_preset_here'); // Make sure to use your preset
      }

      // Create the product data
      const productData: ProductCreateInput = {
        name: data.name,
        price: data.price,
        category: data.category,
        stock: data.stock,
        reviews: data.reviews,
        description: data.description || '',
        image: '' // Will be updated if image upload succeeds
      };

      // Direct upload to Cloudinary if image exists
      if (data.image) {
        try {
          const response = await fetch(
            `https://api.cloudinary.com/v1_1/dnko3bvt0/image/upload`,
            {
              method: "POST",
              body: formData,
            }
          );

          const imageData = await response.json();
          if (imageData.secure_url) {
            productData.image = imageData.secure_url;
            setUploadStatus({
              isUploading: false,
              isDone: true,
              error: null
            });
          }
        } catch (error) {
          setUploadStatus({
            isUploading: false,
            isDone: false,
            error: 'Failed to upload image'
          });
          throw error;
        }
      }

      // Submit to API
      await onSubmit(productData);

      // Reset form
      form.reset();
      setImagePreview(null);
      setUploadStatus({
        isUploading: false,
        isDone: false,
        error: null
      });
    } catch (error) {
      console.error('Form submission error:', error);
      throw error;
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
          disabled={loading || uploadStatus.isUploading}
        >
          {uploadStatus.isUploading ? (
            <>
              <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              {uploadStatus.isDone ? "Image Uploaded! Submitting..." : "Uploading Image..."}
            </>
          ) : uploadStatus.error ? (
            <>
              <span className="!text-red-500 mr-2">! </span>
              {uploadStatus.error}
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











