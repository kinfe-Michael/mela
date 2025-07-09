// app/actions/products.ts
'use server';

import { getProductsBySeller } from '@/util/dbUtil'; // Adjust path if necessary
import { products } from '@/db/schema'; // For typing
import { InferSelectModel } from 'drizzle-orm';
// Define the type for a product as it will be sent to the client
export type Product = InferSelectModel<typeof products>;

interface GetProductsBySellerResponse {
  products: Product[];
  hasMore: boolean;
  error?: string;
}

const PRODUCTS_PER_PAGE = 9; // Define your pagination limit

export async function fetchProductsForSeller(
  sellerId: string,
  offset: number
): Promise<GetProductsBySellerResponse> {
  try {
    const fetchedProducts = await getProductsBySeller(sellerId, {
      limit: PRODUCTS_PER_PAGE + 1, // Fetch one extra to check if there's a next page
      offset: offset,
    });

    const hasMore = fetchedProducts.length > PRODUCTS_PER_PAGE;
    const productsToSend = hasMore ? fetchedProducts.slice(0, PRODUCTS_PER_PAGE) : fetchedProducts;

    // IMPORTANT: Convert any BigInt or specific Drizzle types if necessary
    // Drizzle's numeric type maps to string, so price is already string
    const serializableProducts = productsToSend.map(p => ({
        ...p,
        // If you had BigInt for IDs or numbers, convert them:
        // id: p.id.toString(),
        // quantity: Number(p.quantity),
    }));

    return { products: serializableProducts, hasMore };
  } catch (error: any) {
    console.error('Error fetching products for seller in Server Action:', error);
    return { products: [], hasMore: false, error: error.message || 'Failed to fetch products.' };
  }
}