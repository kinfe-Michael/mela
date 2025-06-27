// pages/products/[productId].tsx

import React from 'react';

import type { NextPage } from 'next'; // Type for Next.js page components

import PageWraper from '../../components/PageWraper'; // Adjust path if necessary
import SingleProductDisplay from '../components/SingleProductDisplay'; // Adjust path if necessary
import { Product } from '@/types/Product';
 // Adjust path to your Product interface

// Mock data (in a real app, you'd fetch this from an API)
const allProducts: Product[] = [ // Explicitly type the array
  {
    id: 'headphones',
    name: 'Wireless Bluetooth Headphones',
    price: 79.99,
    description: 'Experience immersive audio with our premium wireless Bluetooth headphones. Featuring crystal-clear sound, comfortable over-ear design, and long-lasting battery life. Perfect for music lovers and professionals alike. Comes with noise-cancellation and a built-in microphone for calls. Available in black and silver.',
    imageUrl: 'https://placehold.co/400x400/EEF2FF/3F20BA?text=Headphones',
    category: 'Electronics',
    brand: 'AudioTech',
    inStock: true,
    rating: 4.5,
    reviewsCount: 128,
  },
  {
    id: 'smartphone',
    name: 'NextGen Smartphone X',
    price: 899.00,
    description: 'Unleash the power of the NextGen Smartphone X with its stunning OLED display, powerful processor, and advanced camera system. Capture every moment in breathtaking detail. Available in multiple storage options and vibrant colors.',
    imageUrl: 'https://placehold.co/400x400/EEF2FF/3F20BA?text=Smartphone',
    category: 'Electronics',
    brand: 'TechGlow',
    inStock: true,
    rating: 4.8,
    reviewsCount: 560,
  },
  // Add more mock products as needed
];

export default async function ProductDetailPage  ({params}:any) {
  const {productId} = await params

  // In a real application, you would fetch data here based on `productId`
  // For demonstration, we'll find it from our mock array.
  const product: Product | undefined = allProducts.find(p => p.id === productId);

  if (!product) {
    // Handle case where product is not found (e.g., show a 404 page)
    return (
      <PageWraper>
        <div className="text-center p-8 text-xl text-gray-600">Product not found.</div>
      </PageWraper>
    );
  }

  return (
    <PageWraper>
      <SingleProductDisplay product={product} />
    </PageWraper>
  );
};

