"use server"; 

import { revalidatePath } from 'next/cache'; 
import { redirect } from 'next/navigation'; 
import { updateProduct, deleteProduct } from '@/util/dbUtil'; 
import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { products } from '@/db/schema'; 
import { slugify } from '@/util/slugify'; 

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
      revalidatePath(`/products/${slugify(name)}`); 
      revalidatePath(`/products/${slugify(name)}?id=${productId}`); 
      revalidatePath('/dashboard/products'); 

      redirect(`/products/${slugify(name)}?id=${productId}`);
    } else {
      return { success: false, error: 'Product not found or no changes applied.' };
    }
  } catch (error: any) {
    console.error('Failed to update product:', error);
    return { success: false, error: error.message || 'An unexpected error occurred.' };
  }
}


export async function deleteProductAction(productId: string) {
  try {
   
    const deleted = await deleteProduct(productId);
    console.log(deleted)

    if (deleted) {

  
      revalidatePath(`/user/products`); 
      revalidatePath('/'); 

      return { success: true, message: 'Product deleted successfully.' };
    } else {
      return { success: false, error: 'Product not found or could not be deleted.' };
    }
  } catch (error: any) {
    console.error('Failed to delete product:', error);
    return { success: false, error: error.message || 'An unexpected error occurred.' };
  }
}
