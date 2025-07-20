"use client";

import { fetchAllProducts, Product } from '@/app/actions/all-products';
import ProductCard from '@/app/components/ProductCard';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useEffect, useRef } from 'react';
import NavLink from './CustomNavLink';

interface AllProductsClientWrapperProps {
  initialProducts: Product[];
  initialHasMore: boolean;
}

const PRODUCTS_PER_PAGE = 12;

const  AllProductsClientWrapper: React.FC<AllProductsClientWrapperProps> = ({
  initialProducts,
  initialHasMore,
}) => {
  const observerTarget = useRef<HTMLDivElement>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: ['allProducts'],
    queryFn: async ({ pageParam }) => {
      return fetchAllProducts(pageParam);
    },
    initialPageParam: PRODUCTS_PER_PAGE,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.hasMore) {
        return undefined;
      }
      return allPages.reduce((acc, page) => acc + page.products.length, 0);
    },
    initialData: {
      pages: [{ products: initialProducts, hasMore: initialHasMore }],
      pageParams: [0],
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const allProducts: Product[] = data?.pages.flatMap((page) => page.products) || [];
  
  
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
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] text-red-600">
        <h2 className="text-2xl font-semibold mb-4">Error Loading Products</h2>
        <p className="text-lg mb-6">{error?.message || 'An unknown error occurred while fetching products.'}</p>
      </div>
    );
  }

  if (allProducts.length === 0 && !isLoading && !isFetchingNextPage) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] text-gray-700">
        <h2 className="text-2xl font-semibold mb-4">No products available yet!</h2>
        <p className="text-lg mb-6">Check back later or consider adding some.</p>
        <NavLink href="/add-product" className="bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors duration-200">
          Add New Product
        </NavLink>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-wrap items-center justify-center  gap-6">
        {allProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div ref={observerTarget} className="h-10 flex justify-center items-center mt-8">
        {isFetchingNextPage && (
          <div className="text-gray-600 flex items-center">
            <Loader2 className="animate-spin mr-2" size={20} /> Loading more products...
          </div>
        )}
        {!hasNextPage && allProducts.length > 0 && !isFetchingNextPage && (
          <p className="text-gray-500">{"You've reached the end of the products list."}</p>
        )}
      </div>
    </>
  );
};

export default AllProductsClientWrapper;