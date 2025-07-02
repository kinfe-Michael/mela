// components/SingleProductDisplaySkeleton.tsx
import React from 'react';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"; // Assuming these are valid components

const SingleProductDisplaySkeleton: React.FC = () => {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex flex-col md:flex-row gap-8 bg-white p-6 rounded-lg shadow-lg animate-pulse">
        {/* Product Image Skeleton Section */}
        <div className="md:w-1/2 flex justify-center items-center">
          <div className="relative w-full max-w-md h-96 bg-gray-200 rounded-md overflow-hidden">
            {/* Image placeholder */}
          </div>
        </div>

        {/* Product Details Skeleton Section */}
        <div className="md:w-1/2 space-y-6">
          {/* Product Name Skeleton */}
          <div className="h-10 bg-gray-200 rounded w-3/4"></div>
          {/* Price Skeleton */}
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>

          {/* Description Skeleton */}
          <div className="text-gray-700">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div> {/* Description title */}
            <ScrollArea className="h-48 w-full border rounded-md p-3 bg-gray-100">
              {/* Description lines */}
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-11/12 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <ScrollBar orientation="vertical" /> {/* ScrollBar might not animate, but keeps structure */}
            </ScrollArea>
          </div>

          {/* Attributes Skeleton */}
          <div className="grid grid-cols-2 gap-4 text-gray-600 text-sm">
            <div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
            <div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
            <div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
            <div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>

          {/* Action Buttons Skeleton */}
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <div className="h-12 bg-gray-200 rounded-md shadow-md w-full sm:w-1/2"></div>
            <div className="h-12 bg-gray-200 rounded-md shadow-md w-full sm:w-1/2"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleProductDisplaySkeleton;
