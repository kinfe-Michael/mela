// components/SimilarProducts.tsx
"use client"; // This component needs to be a Client Component

import React from 'react';
import ProductCard from '../../components/ProductCard'; // Import the ProductCard component
import { Product } from '@/types/Product'; // Adjust path to your Product interface

interface SimilarProductsProps {
  products: Product[]; // Array of similar products to display
}

const SimilarProducts: React.FC<SimilarProductsProps> = ({ products }) => {
  if (!products || products.length === 0) {
    return null; // Don't render anything if no similar products
  }

  return (
    <section className="container mx-auto p-4 md:p-8 mt-8 bg-gray-50 rounded-lg shadow-inner">
      <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Similar Products</h2>
      <div className="flex flex-wrap justify-center gap-4">
        {products.map((product) => (
          <ProductCard
            key={product.id} // Important for React list rendering
            url={product.imageUrl}
            alt={product.name}
            productName={product.name}
            price={product.price}
            // If you want to link to the product page from ProductCard, you'd add
            // a href prop or wrap ProductCard in <Link href={`/products/${product.id}`}></Link>
          />
        ))}
      </div>
    </section>
  );
};

export default SimilarProducts;