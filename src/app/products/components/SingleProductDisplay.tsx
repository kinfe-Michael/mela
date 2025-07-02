// components/SingleProductDisplay.tsx
import React from 'react';
import Image from 'next/image'; // For optimized image loading
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"; // Assuming these are valid components

// Import the Product interface
import { Product } from '@/types/Product'; // Adjust path based on where you put Product.ts

// Mock product data for demonstration
const mockProduct: Product = {
  id: 'headphones',
  name: 'Wireless Bluetooth Headphones',
  price: 79.99,
  description: 'Experience immersive audio with our premium wireless Bluetooth headphones. Featuring crystal-clear sound, comfortable over-ear design, and long-lasting battery life. Perfect for music lovers and professionals alike. Comes with noise-cancellation and a built-in microphone for calls. Available in black and silver.',
  imageUrl: 'https://placehold.co/400x400/EEF2FF/3F20BA?text=Product+Image', // Placeholder image
  category: 'Electronics',
  brand: 'AudioTech',
  inStock: true,
  rating: 4.5,
  reviewsCount: 128,
};

// Define the props interface for SingleProductDisplay
interface SingleProductDisplayProps {
  product?: Product; // product prop is optional and defaults to mockProduct
}

const SingleProductDisplay: React.FC<SingleProductDisplayProps> = ({ product = mockProduct }) => {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex flex-col md:flex-row gap-8 bg-white p-6 rounded-lg shadow-lg">
        {/* Product Image Section */}
        <div className="md:w-1/2 flex justify-center items-center">
          <div className="relative w-full max-w-md h-96 bg-gray-100 rounded-md overflow-hidden">
            <Image
              src={"/yohana.jpg"}
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
          <p className="text-3xl font-bold text-indigo-700">${product.price.toFixed(2)}</p>

          <div className="text-gray-700">
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <ScrollArea className="h-48 w-full border rounded-md p-3 bg-gray-50">
              <p className="text-base leading-relaxed">{product.description}</p>
              <ScrollBar orientation="vertical" />
            </ScrollArea>
          </div>

          <div className="grid grid-cols-2 gap-4 text-gray-600 text-sm">
            <div>
              <span className="font-semibold">Category:</span> {product.category}
            </div>
            <div>
              <span className="font-semibold">Brand:</span> {product.brand}
            </div>
            <div>
              <span className="font-semibold">Availability:</span> {product.inStock ? 'In Stock' : 'Out of Stock'}
            </div>
            <div>
              <span className="font-semibold">Rating:</span> {product.rating} ({product.reviewsCount} reviews)
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <button
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-md shadow-md transition duration-300 ease-in-out transform hover:scale-105"
             
            >
              Add to Cart
            </button>
            <button
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-md shadow-md transition duration-300 ease-in-out transform hover:scale-105"
             
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