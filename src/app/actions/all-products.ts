'use server';

import { getAllProducts } from '@/util/dbUtil'; 
import { InferSelectModel } from 'drizzle-orm'; 
import { products } from '@/db/schema'; 

export type Product = InferSelectModel<typeof products>;

interface GetAllProductsResponse {
  products: Product[];
  hasMore: boolean;
  error?: string;
}

const PRODUCTS_PER_PAGE = 12; 

export async function fetchAllProducts(
  offset: number
): Promise<GetAllProductsResponse> {
  try {
    const fetchedProducts = await getAllProducts({
      limit: PRODUCTS_PER_PAGE + 1, 
      offset: offset,
    });

    const hasMore = fetchedProducts.length > PRODUCTS_PER_PAGE;
    const productsToSend = hasMore ? fetchedProducts.slice(0, PRODUCTS_PER_PAGE) : fetchedProducts;

    const serializableProducts = productsToSend.map(p => ({
        ...p,
    }));

    return { products: serializableProducts, hasMore };
  } catch (error: any) {
    console.error('Error fetching all products in Server Action:', error);
    return { products: [], hasMore: false, error: error.message || 'Failed to fetch products.' };
  }
}