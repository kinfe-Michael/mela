'use server';

import { getProductsBySeller } from '@/util/dbUtil';
import { products } from '@/db/schema';
import { InferSelectModel } from 'drizzle-orm';
export type Product = InferSelectModel<typeof products>;

interface GetProductsBySellerResponse {
  products: Product[];
  hasMore: boolean;
  error?: string;
}

const PRODUCTS_PER_PAGE = 9;

export async function fetchProductsForSeller(
  sellerId: string,
  offset: number
): Promise<GetProductsBySellerResponse> {
  try {
    const fetchedProducts = await getProductsBySeller(sellerId, {
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
    console.error('Error fetching products for seller in Server Action:', error);
    return { products: [], hasMore: false, error: error.message || 'Failed to fetch products.' };
  }
}