// app/products/[productId]/page.tsx
// This is a React Server Component by default in the App Router.
// It inherently achieves SSR for data fetching and initial render.

import React from 'react';
import { notFound } from 'next/navigation'; // For handling 404s

import { Product } from '@/types/Product'; // Adjust path to your Product interface (using alias)
import PageWraper from '@/app/components/PageWraper';
import SingleProductDisplay from '../components/SingleProductDisplay';
import SimilarProducts from '../components/SimilarProducts';

// --- MOCK DATA AND DATA FETCHING FUNCTIONS ---
// In a real application, these would be actual API calls or database queries.

const allProducts: Product[] = [
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
  {
    id: 'smartwatch',
    name: 'Smart Watch Pro',
    price: 249.00,
    description: 'Track your fitness and stay connected with the Smart Watch Pro. Features heart rate monitoring, GPS, and notifications. Compatible with iOS and Android.',
    imageUrl: 'https://placehold.co/400x400/EEF2FF/3F20BA?text=Smartwatch',
    category: 'Electronics',
    brand: 'WearTech',
    inStock: true,
    rating: 4.2,
    reviewsCount: 85,
  },
  {
    id: 'laptop',
    name: 'UltraBook Air',
    price: 1199.00,
    description: 'Lightweight and powerful, the UltraBook Air is perfect for productivity on the go. Featuring a stunning Retina display and long battery life.',
    imageUrl: 'https://placehold.co/400x400/EEF2FF/3F20BA?text=Laptop',
    category: 'Electronics',
    brand: 'ZenPC',
    inStock: true,
    rating: 4.7,
    reviewsCount: 300,
  },
  {
    id: 'earbuds',
    name: 'Compact Wireless Earbuds',
    price: 129.99,
    description: 'Immersive sound in a tiny package. These earbuds offer superior audio quality and a snug fit for all-day comfort. Comes with a portable charging case.',
    imageUrl: 'https://placehold.co/400x400/EEF2FF/3F20BA?text=Earbuds',
    category: 'Electronics',
    brand: 'SoundStream',
    inStock: true,
    rating: 4.3,
    reviewsCount: 210,
  },
];

async function getProductData(productId: string): Promise<Product | undefined> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 100));
  return allProducts.find(p => p.id === productId);
}

async function getSimilarProducts(currentProductId: string, category: string): Promise<Product[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 50));
  // Filter products by category, excluding the current product itself
  return allProducts.filter(p => p.category === category && p.id !== currentProductId);
}

// --- PAGE COMPONENT ---

// Define props for the page component, including the dynamic segment params
interface ProductDetailPageProps {
  params: {
    productId: string; // The dynamic segment from the folder name [productId]
  };
}

// The main page component is an async Server Component
export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  // Correct way to access the dynamic parameter in an App Router Server Component
  const { productId } = params;

  // Fetch the main product data
  const product = await getProductData(productId);

  if (!product) {
    notFound(); // Call Next.js's notFound() helper if product is not found
  }

  // Fetch similar products based on the current product's category
  // This also happens on the server as part of this Server Component
  const similarProducts = await getSimilarProducts(product.id, product.category);

  return (
    <PageWraper>
      <SingleProductDisplay product={product} />

      {/* Render the SimilarProducts component at the bottom */}
      {similarProducts.length > 0 && (
        <SimilarProducts products={similarProducts} />
      )}
    </PageWraper>
  );
}