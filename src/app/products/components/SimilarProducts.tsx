"use client";

import { products } from '@/db/schema';
import { InferSelectModel } from 'drizzle-orm';
import React from 'react';
import ProductCard from '../../components/ProductCard';

interface SimilarProductsProps {
  products: InferSelectModel<typeof products>[];
}

const SimilarProducts: React.FC<SimilarProductsProps> = ({ products }) => {
  if (!products || products.length === 0) {
    return null;
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
