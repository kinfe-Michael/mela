// app/components/AllProductsClientWrapper.tsx
"use client";

import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import ProductCard from '@/app/components/ProductCard';
import { fetchAllProducts, Product } from '@/app/actions/all-products'; // Import for client-side fetching

interface AllProductsClientWrapperProps {
  initialProducts: Product[];
  initialHasMore: boolean;
}

const PRODUCTS_PER_PAGE = 12; // Keep consistent with the Server Action

const AllProductsClientWrapper: React.FC<AllProductsClientWrapperProps> = ({
  initialProducts,
  initialHasMore,
}) => {
  const observerTarget = useRef<HTMLDivElement>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading, // This isLoading is for *subsequent* fetches if `initialData` is provided
    isError,
    error,
    isFetched,
  } = useInfiniteQuery({
    queryKey: ['allProducts'],
    queryFn: async ({ pageParam }) => {
      // This will be called for subsequent fetches
      return fetchAllProducts(pageParam);
    },
    initialPageParam: PRODUCTS_PER_PAGE, // Start next fetch from this offset
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.hasMore) {
        return undefined;
      }
      return allPages.reduce((acc, page) => acc + page.products.length, 0);
    },
    initialData: { // This is the key for SSR hydration!
      pages: [{ products: initialProducts, hasMore: initialHasMore }],
      pageParams: [0], // Initial page was loaded at offset 0
    },
    // select: (data) => ({
    //   ...data,
    //   pages: data.pages.map(page => ({
    //     ...page,
    //     // Ensure BigInts are converted here if they somehow slipped through serialization
    //     products: page.products.map(p => ({
    //         ...p,
    //         // Example: id: typeof p.id === 'bigint' ? p.id.toString() : p.id,
    //         // Example: quantity: typeof p.quantity === 'bigint' ? Number(p.quantity) : p.quantity,
    //     }))
    //   }))
    // }),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  // Extract all products from pages, including the initial ones
  const allProducts: Product[] = data?.pages.flatMap((page) => page.products) || [];
  
  // Use `isFetched` to determine if the query has completed its *first* fetch (after initialData is set)
  // `isLoading` from useInfiniteQuery will be true only for subsequent fetches after initialData
  const hasLoadedInitialData = isFetched && initialProducts.length > 0;
  
  // Intersection Observer for infinite scrolling
  useEffect(() => {
    // Only set up observer if we have a target, can fetch next page, there IS a next page, and not already fetching
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
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]); // Depend on relevant state for observer

  // Conditional rendering for error and empty states
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] text-red-600">
        <h2 className="text-2xl font-semibold mb-4">Error Loading Products</h2>
        <p className="text-lg mb-6">{error?.message || 'An unknown error occurred while fetching products.'}</p>
      </div>
    );
  }

  // Display message if no products after all potential fetches are complete
  // This check applies if initialProducts was empty and no more pages were found
  if (allProducts.length === 0 && !isLoading && !isFetchingNextPage) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] text-gray-700">
        <h2 className="text-2xl font-semibold mb-4">No products available yet!</h2>
        <p className="text-lg mb-6">Check back later or consider adding some.</p>
        <Link href="/add-product" className="bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors duration-200">
          Add New Product
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {allProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Loading Indicator for subsequent fetches */}
      <div ref={observerTarget} className="h-10 flex justify-center items-center mt-8">
        {isFetchingNextPage && (
          <div className="text-gray-600 flex items-center">
            <Loader2 className="animate-spin mr-2" size={20} /> Loading more products...
          </div>
        )}
        {!hasNextPage && allProducts.length > 0 && !isFetchingNextPage && (
          <p className="text-gray-500">You've reached the end of the products list.</p>
        )}
      </div>
    </>
  );
};

export default AllProductsClientWrapper;