// components/SingleProductDisplay.tsx
import React from 'react';
import Image from 'next/image'; // For optimized image loading
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"; // Assuming these are valid components

import { InferSelectModel } from 'drizzle-orm'; // Import for type safety
import { products } from '@/db/schema'; // Import your Drizzle schema for 'products' type

// Define the props interface for SingleProductDisplay
interface SingleProductDisplayProps {
  // The product prop is now typed directly from your Drizzle schema
  product: InferSelectModel<typeof products>;
}

const SingleProductDisplay: React.FC<SingleProductDisplayProps> = ({ product }) => {
  // Ensure product.price is treated as a number for toFixed, as it's 'numeric' in Drizzle
  const displayPrice = parseFloat(product.price as string).toFixed(2);

  // Determine stock status based on the 'quantity' field from your schema
  const inStock = product.quantity > 0;

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex flex-col md:flex-row gap-8 bg-white p-6 rounded-lg shadow-lg">
        {/* Product Image Section */}
        <div className="md:w-1/2 flex justify-center items-center">
          <div className="relative w-full max-w-md h-96 bg-gray-100 rounded-md overflow-hidden">
            {/* Use product.imageUrl from your database, with a fallback placeholder */}
            <Image
              src={product.imageUrl || 'https://placehold.co/400x400/EEF2FF/3F20BA?text=No+Image'}
              alt={product.name}
              layout="fill" // Use fill to make the image cover the container
              objectFit="contain" // Maintain aspect ratio and fit within container
              className="rounded-md"
            />
          </div>
        </div>

        {/* Product Details Section */}
        <div className="md:w-1/2 space-y-6">
          <h1 className="text-4xl font-extrabold text-gray-900">{product.name}</h1>
          <p className="text-3xl font-bold text-indigo-700">${displayPrice}</p>

          <div className="text-gray-700">
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <ScrollArea className="h-48 w-full border rounded-md p-3 bg-gray-50">
              {/* Use product.description from your database */}
              <p className="text-base leading-relaxed">{product.description || 'No description available.'}</p>
              <ScrollBar orientation="vertical" />
            </ScrollArea>
          </div>

          <div className="grid grid-cols-2 gap-4 text-gray-600 text-sm">
            <div>
              {/* Use product.category from your database */}
              <span className="font-semibold">Category:</span> {product.category.replace(/_/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </div>
            <div>
              {/* Use product.quantity to determine stock status */}
              <span className="font-semibold">Availability:</span> {inStock ? `In Stock (${product.quantity})` : 'Out of Stock'}
            </div>
            {/* Removed Brand, Rating, and ReviewsCount as they are not in your current 'products' schema */}
            {/* If you wish to display these, they need to be added to your database schema or fetched from related tables. */}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <button
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-md shadow-md transition duration-300 ease-in-out transform hover:scale-105"
              // Add onClick handler for Add to Cart functionality
            >
              Add to Cart
            </button>
            <button
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-md shadow-md transition duration-300 ease-in-out transform hover:scale-105"
              // Add onClick handler for Buy Now functionality
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleProductDisplay;
