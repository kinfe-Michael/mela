"use client";

import React, { useState, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { InferSelectModel } from 'drizzle-orm';
import { products, productCategoryEnum } from '@/db/schema';
import { updateProductAction } from '@/app/actions/productAction';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface EditProductFormProps {
  initialProduct: InferSelectModel<typeof products>;
}

const EditProductForm: React.FC<EditProductFormProps> = ({ initialProduct }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [formData, setFormData] = useState({
    name: initialProduct.name,
    description: initialProduct.description || '',
    price: initialProduct.price.toString(),
    quantity: initialProduct.quantity.toString(),
    category: initialProduct.category,
    imageUrl: initialProduct.imageUrl || '',
  });

  useEffect(() => {
    setFormData({
      name: initialProduct.name,
      description: initialProduct.description || '',
      price: initialProduct.price.toString(),
      quantity: initialProduct.quantity.toString(),
      category: initialProduct.category,
      imageUrl: initialProduct.imageUrl || '',
    });
  }, [initialProduct]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value as InferSelectModel<typeof products>['category'] }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    startTransition(async () => {
      const data = new FormData(e.currentTarget);

      const result = await updateProductAction(initialProduct.id, data);

      if (result?.success) {
       
        router.push("/user/products")
    } else {
      
      }
    });
  };

  const formatCategoryForDisplay = (category: string) => {
    return category
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Edit Product: {initialProduct.name}</h1>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
        <div>
          <Label htmlFor="name">Product Name</Label>
          <Input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={5}
            className="mt-1"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="price">Price ($)</Label>
            <Input
              id="price"
              name="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              required
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              name="quantity"
              type="number"
              value={formData.quantity}
              onChange={handleChange}
              required
              className="mt-1"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="category">Category</Label>
          <Select
            name="category"
            value={formData.category}
            onValueChange={handleSelectChange}
            required
          >
            <SelectTrigger className="w-full mt-1">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(productCategoryEnum.enumValues).map((category) => (
                <SelectItem key={category} value={category}>
                  {formatCategoryForDisplay(category)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="imageUrl">Image URL</Label>
          <Input
            id="imageUrl"
            name="imageUrl"
            type="url"
            value={formData.imageUrl}
            onChange={handleChange}
            className="mt-1"
          />
        </div>

        <Button type="submit" disabled={isPending} className="w-full py-3">
          {isPending ? 'Updating Product...' : 'Update Product'}
        </Button>
      </form>
    </div>
  );
};

export default EditProductForm;
