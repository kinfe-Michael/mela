// app/page.tsx
// This is now a Server Component by default (no "use client")

import PageWraper from '@/app/components/PageWraper';
import { fetchAllProducts } from '@/app/actions/all-products'; // Import your Server Action
import Link from 'next/link';
import { Metadata } from 'next'; // For SEO metadata
import AllProductsClientWrapper from '@/app/components/AllProductsClientWrapper'; // Import the new client wrapper

// Define SEO metadata for this page
export const metadata: Metadata = {
  title: 'Home - Your Marketplace',
  description: 'Browse a wide variety of products from different sellers. Find what you need!',
  keywords: ['products', 'marketplace', 'shop', 'ecommerce'],
};

export default async function HomePage() {
  const PRODUCTS_PER_PAGE = 12; // Must match the client component and server action

  // Fetch initial data directly on the server
  const { products: initialProducts, hasMore: initialHasMore, error } = await fetchAllProducts(0);

  // Handle server-side errors before rendering client component
  if (error) {
    return (
      <PageWraper>
        <div className="flex flex-col items-center justify-center min-h-screen text-red-600">
          <h2 className="text-2xl font-semibold mb-4">Server Error</h2>
          <p className="text-lg mb-6">{error || 'Failed to load initial products on the server.'}</p>
        </div>
      </PageWraper>
    );
  }

  return (
    <PageWraper>
      <div className="p-4 sm:p-6 lg:p-8 font-sans min-h-screen bg-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">All Products</h1>
          <Link href="/add-product" className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors duration-200">
            Sell Your Product
          </Link>
        </div>

        {/* Pass the initial data to the Client Component for hydration and infinite scroll */}
        <AllProductsClientWrapper
          initialProducts={initialProducts}
          initialHasMore={initialHasMore}
        />
      </div>
    </PageWraper>
  );
}