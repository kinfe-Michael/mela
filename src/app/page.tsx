
import PageWraper from '@/app/components/PageWraper';
import { fetchAllProducts } from '@/app/actions/all-products'; // Import your Server Action
import { Metadata } from 'next'; 
import AllProductsClientWrapper from '@/app/components/AllProductsClientWrapper'; // Import the new client wrapper
import { searchProducts } from '@/util/dbUtil';

export const metadata: Metadata = {
  title: 'mela - Your Marketplace',
  description: 'Browse a wide variety of products from different sellers. Find what you need!',
  keywords: ['products', 'marketplace', 'shop', 'ecommerce'],
};

export default async function HomePage() {
  const PRODUCTS_PER_PAGE = 12; 

  const { products: initialProducts, hasMore: initialHasMore, error } = await fetchAllProducts(0);

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
        <AllProductsClientWrapper
          initialProducts={initialProducts}
          initialHasMore={initialHasMore}
        />
      </div>
    </PageWraper>
  );
}