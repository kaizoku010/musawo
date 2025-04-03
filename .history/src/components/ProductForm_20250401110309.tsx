
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { uploadToCloudinary } from '../utils/cloudinary';
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
  additionalImages: z.array(z.any()).optional().default([]),
  color: z.string().optional(),
  sku: z.string().optional(), // This will be auto-generated
});

type ProductFormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
  onSubmit: (data: ProductCreateInput) => Promise<void>;
  loading?: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({ onSubmit, loading = false }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState<string[]>([]);
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
        image: '',
        additionalImages: [],

      };

      // Upload main image
      if (data.image instanceof File) {
        try {
          productData.image = await uploadToCloudinary(data.image);
        } catch (error) {
          console.error('Main image upload failed:', error);
          throw new Error('Failed to upload main image');
        }
      }

      // Upload additional images
      if (data.additionalImages?.length) {
        try {
          const uploadPromises = Array.from(data.additionalImages).map(file => 
            file instanceof File ? uploadToCloudinary(file) : Promise.resolve('')
          );
          productData.additionalImages = await Promise.all(uploadPromises);
        } catch (error) {
          console.error('Additional images upload failed:', error);
          throw new Error('Failed to upload additional images');
        }
      }

      // Submit to API
      await onSubmit(productData);

      // Reset form and previews
      form.reset();
      setImagePreview(null);
      setAdditionalImagePreviews([]);
    } catch (error) {
      console.error('Form submission error:', error);
      throw error;
    } finally {
      setUploadingImage(false);
    }
  };


  //catergories like crafts, sandles, bags, jewelry, accesories
  //sku auto generated...SMZ-number here
  //color: any
  //4 extra images....another input to take multi-images. leaving the current one as is


  return (
    <Form {...form}>

      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">

        <div>
          <h1 className="text-2xl font-bold">Add Product</h1>
        </div>

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
                <Textarea 
                  placeholder="Enter product description"
                  className="min-h-[120px] resize-y"
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
                  <SelectItem value="Crafts">Crafts</SelectItem>
                  <SelectItem value="Crafts">Clothing</SelectItem>
                  <SelectItem value="Sandals">Sandals</SelectItem>
                  <SelectItem value="Bags">Bags</SelectItem>
                  <SelectItem value="Jewelry">Jewelry</SelectItem>
                  <SelectItem value="Accessories">Accessories</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Color</FormLabel>
              <FormControl>
                <Input placeholder="Enter product color" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="additionalImages"
          render={({ field: { value, onChange, ...field } }) => (
            <FormItem>
              <FormLabel>Additional Images (up to 4)</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []).slice(0, 4);
                    onChange(files);
                  }}
                  {...field}
                />
              </FormControl>
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














