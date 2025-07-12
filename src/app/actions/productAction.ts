"use server"; 

import { revalidatePath } from 'next/cache'; 
import { redirect } from 'next/navigation'; 
import { updateProduct } from '@/util/dbUtil'; 
import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { products } from '@/db/schema'; 

type ProductUpdateData = Partial<Omit<InferInsertModel<typeof products>, 'id' | 'createdAt' | 'updatedAt'>>;


export async function updateProductAction(productId: string, formData: FormData) {
  const name = formData.get('name') as string;
  const description = formData.get('description') as string | null;
  const price = formData.get('price') as string; // Drizzle numeric type is string
  const quantity = parseInt(formData.get('quantity') as string);
  const category = formData.get('category') as InferSelectModel<typeof products>['category']; // Ensure type safety for enum
  const imageUrl = formData.get('imageUrl') as string | null;

  if (!name || !price || isNaN(quantity) || !category) {
    return { success: false, error: 'Name, Price, Quantity, and Category are required.' };
  }

  const updates: ProductUpdateData = {
    name,
    description: description || null, 
    price,
    quantity,
    category,
    imageUrl: imageUrl || null,
  };

  try {
    const updated = await updateProduct(productId, updates);

    if (updated) {
      revalidatePath(`/user/products`); 
      return { success: true, message: 'changes applied.' };
      
    } else {
      return { success: false, error: 'Product not found or no changes applied.' };
    }
  } catch (error: any) {
    console.error('Failed to update product:', error);
    return { success: false, error: error.message || 'An unexpected error occurred.' };
  }
}

function slugify(text: string): string {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}
