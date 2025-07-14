
"use client"; 

import PageWraper from '@/app/components/PageWraper'; 
import { useAuthStore } from '@/lib/authStore'; 
import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchProductsForSeller, Product } from '@/app/actions/products'; // Path to your Server Action
import { useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import ProductCard from '@/app/components/ProductCard';
import NavLink from '@/app/components/CustomNavLink';


export default function MyProductsPage() {
  const { user, isLoggedIn, isLoading: isAuthLoading, checkAuthStatus } = useAuthStore();
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading, 
    isError,
    error,
    isFetched, 
  } = useInfiniteQuery({
    queryKey: ['myProducts', user?.userId], 
    queryFn: async ({ pageParam }) => {
      if (!user?.userId) {
        return { products: [], hasMore: false };
      }
      return fetchProductsForSeller(user.userId, pageParam);
    },
    initialPageParam: 0, 
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.hasMore) {
        return undefined;
      }
      return allPages.reduce((acc, page) => acc + page.products.length, 0);
    },
    enabled: !!user?.userId,
    staleTime: 5 * 60 * 1000, 
    refetchOnWindowFocus: false, 
  });

  const allProducts: Product[] = data?.pages.flatMap((page) => page.products) || [];
  const hasLoadedInitial = isFetched && !isLoading; 

  useEffect(() => {
    if (!observerTarget.current || !fetchNextPage || !hasNextPage || isFetchingNextPage) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 } 
    );

    observer.observe(observerTarget.current);

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, hasLoadedInitial]);

  if (isAuthLoading) {
    return (
      <PageWraper>
        <div className="flex justify-center items-center h-screen text-gray-600">
          <Loader2 className="animate-spin mr-2" size={24} /> Checking authentication...
        </div>
      </PageWraper>
    );
  }

  if (!isLoggedIn) {
    return (
      <PageWraper>
        <div className="flex flex-col items-center justify-center min-h-screen text-gray-700">
          <h2 className="text-2xl font-semibold mb-4">Please Log In to View Your Products</h2>
          <p className="text-lg mb-6">You need to be logged in to manage your sales.</p>
          <NavLink href="/login" className="bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors duration-200">
            Go to Login
          </NavLink>
        </div>
      </PageWraper>
    );
  }

  if (isError) {
    return (
      <PageWraper>
        <div className="flex flex-col items-center justify-center min-h-screen text-red-600">
          <h2 className="text-2xl font-semibold mb-4">Error Loading Products</h2>
          <p className="text-lg mb-6">{error?.message || 'An unknown error occurred while fetching your products.'}</p>
        </div>
      </PageWraper>
    );
  }

  if (hasLoadedInitial && allProducts.length === 0) {
    return (
      <PageWraper>
        <div className="flex flex-col items-center justify-center min-h-screen text-gray-700">
          <h2 className="text-2xl font-semibold mb-4">You haven't posted any products yet!</h2>
          <p className="text-lg mb-6">Start selling by adding your first product.</p>
          <NavLink href="/add-product" className="bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors duration-200">
            Add New Product
          </NavLink>
        </div>
      </PageWraper>
    );
  }

  return (
    <PageWraper>
      <div className="p-4 sm:p-6 lg:p-8 font-sans min-h-screen bg-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Your Products for Sale</h1>
          <NavLink href="/user/addProduct" className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors duration-200">
            Add Product
          </NavLink>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {allProducts.map((product) => (
            <ProductCard key={product.id} product={product} showActions={true} />
          ))}
        </div>

        {isLoading && allProducts.length === 0 && (
            <div className="flex justify-center items-center h-40">
                <Loader2 className="animate-spin mr-2" size={24} /> Loading products...
            </div>
        )}

        <div ref={observerTarget} className="h-10 flex justify-center items-center mt-8">
          {isFetchingNextPage && (
            <div className="text-gray-600 flex items-center">
              <Loader2 className="animate-spin mr-2" size={20} /> Loading more products...
            </div>
          )}
          {!hasNextPage && allProducts.length > 0 && !isFetchingNextPage && (
            <p className="text-gray-500">You've reached the end of your products list.</p>
          )}
        </div>
      </div>
    </PageWraper>
  );
}