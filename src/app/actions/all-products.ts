// app/actions/all-products.ts
'use server';

import { getAllProducts } from '@/util/dbUtil'; // Adjust path if necessary
import { InferSelectModel } from 'drizzle-orm'; // Import from drizzle-orm
import { products } from '@/db/schema'; // For typing

// Define the type for a product as it will be sent to the client
export type Product = InferSelectModel<typeof products>;

interface GetAllProductsResponse {
  products: Product[];
  hasMore: boolean;
  error?: string;
}

const PRODUCTS_PER_PAGE = 12; // A slightly higher limit for the main page

export async function fetchAllProducts(
  offset: number
): Promise<GetAllProductsResponse> {
  try {
    const fetchedProducts = await getAllProducts({
      limit: PRODUCTS_PER_PAGE + 1, // Fetch one extra to check if there's a next page
      offset: offset,
    });

    const hasMore = fetchedProducts.length > PRODUCTS_PER_PAGE;
    const productsToSend = hasMore ? fetchedProducts.slice(0, PRODUCTS_PER_PAGE) : fetchedProducts;

    const serializableProducts = productsToSend.map(p => ({
        ...p,
        // If you had BigInt for IDs or numbers, convert them:
        // id: p.id.toString(),
        // quantity: Number(p.quantity),
    }));

    return { products: serializableProducts, hasMore };
  } catch (error: any) {
    console.error('Error fetching all products in Server Action:', error);
    return { products: [], hasMore: false, error: error.message || 'Failed to fetch products.' };
  }
}