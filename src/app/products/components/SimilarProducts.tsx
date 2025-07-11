// components/SimilarProducts.tsx
"use client"; // This component needs to be a Client Component

import React from 'react';
import Link from 'next/link'; // Import Link for navigation
import ProductCard from '../../components/ProductCard'; // Import the ProductCard component
import { InferSelectModel } from 'drizzle-orm'; // Import for type safety
import { products } from '@/db/schema'; // Import your Drizzle schema for 'products' type
import { slugify } from '@/util/slugify'; // Import the slugify utility

// Define the props interface for SimilarProducts
interface SimilarProductsProps {
  // products prop is now typed directly from your Drizzle schema
  products: InferSelectModel<typeof products>[];
}

const SimilarProducts: React.FC<SimilarProductsProps> = ({ products }) => {
  if (!products || products.length === 0) {
    return null; // Don't render anything if no similar products
  }

  return (
    <section className="container mx-auto p-4 md:p-8 mt-8 bg-gray-50 rounded-lg shadow-inner">
      <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Similar Products</h2>
      <div className="flex flex-wrap justify-center gap-4">
        {products.map((product,i) => (
       
            <ProductCard key={i} product={product} />
        
        ))}
      </div>
    </section>
  );
};

export default SimilarProducts;
