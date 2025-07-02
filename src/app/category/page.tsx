// pages/index.tsx
"use client";

import React from 'react';
import PageWraper from '../components/PageWraper';
// Removed 'next/head', 'next/image', and 'next/link' imports due to compilation issues.
// Using standard HTML elements for broader compatibility in this environment.

// Define the Category interface directly in this file for self-containment
interface Category {
  id: string;
  name: string;
  imageUrl: string; // URL for the category image
  slug: string; // Used for friendly URLs (e.g., /categories/electronics)
  description?: string;
}

// Hardcoded mock data for 5 categories
const staticCategories: Category[] = [
  {
    id: 'electronics',
    name: 'Electronics',
    imageUrl: 'https://placehold.co/400x400/FF0000/FFFFFF?text=Electronics',
    slug: 'electronics',
    description: 'Gadgets, devices, and tech accessories.',
  },
  {
    id: 'clothing',
    name: 'Clothing & Apparel',
    imageUrl: 'https://placehold.co/400x400/00FF00/000000?text=Clothing',
    slug: 'clothing',
    description: 'Fashion for all seasons and styles.',
  },
  {
    id: 'home-decor',
    name: 'Home & Kitchen',
    imageUrl: 'https://placehold.co/400x400/0000FF/FFFFFF?text=Home+Decor',
    slug: 'home-kitchen',
    description: 'Decorations, furniture, and kitchen essentials.',
  },
  {
    id: 'books',
    name: 'Books',
    imageUrl: 'https://placehold.co/400x400/FFFF00/000000?text=Books',
    slug: 'books',
    description: 'From bestsellers to timeless classics.',
  },
  {
    id: 'sports',
    name: 'Sports & Outdoors',
    imageUrl: 'https://placehold.co/400x400/FF00FF/FFFFFF?text=Sports',
    slug: 'sports-outdoors',
    description: 'Gear for your active lifestyle.',
  },
];

const StaticCategoriesPage: React.FC = () => {
  return (
    <PageWraper>
        <div className="min-h-screen bg-gray-100 py-8">
      {/* Replaced <Head> with a simple div or removed as it's not critical for sandbox display */}
      {/* For SEO in a real Next.js app, you'd use <Head> */}
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-10">
          Explore Our Categories
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {staticCategories.map((category) => (
            // Replaced <Link> with <a> tag for direct navigation
            <a key={category.id} href={`/categories/${category.slug}`} className="block group">
              <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden h-full flex flex-col">
                <div className="relative w-full h-48 sm:h-56 md:h-64 overflow-hidden">
                  {/* Replaced <Image> with <img> tag for direct image display */}
                  <img
                    src={category.imageUrl}
                    alt={category.name}
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105 rounded-md"
                    onError={(e) => {
                      e.currentTarget.src = "https://placehold.co/400x400/E0E0E0/808080?text=Category"; // Fallback image
                    }}
                  />
                </div>
                <div className="p-4 flex-grow flex flex-col justify-between">
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300 line-clamp-2">
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className="text-gray-600 text-sm mt-2 line-clamp-3">
                      {category.description}
                    </p>
                  )}
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>

    </PageWraper>
    
  );
};

export default StaticCategoriesPage;
