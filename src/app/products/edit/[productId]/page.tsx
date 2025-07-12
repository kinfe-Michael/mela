// app/dashboard/products/edit/[productId]/page.tsx
// This is a React Server Component, ensuring SSR for initial data fetch.

import React from 'react';
import { notFound } from 'next/navigation';
import { InferSelectModel } from 'drizzle-orm';
import { products } from '@/db/schema'; // Import your Drizzle schema for 'products' type
import { getProductById } from '@/util/dbUtil'; // Import the function to get product by ID

import PageWraper from '@/app/components/PageWraper'; // Your page wrapper component
import EditProductForm from '@/app/components/EditProductsForm'; // The client-side form component

interface EditProductPageProps {
  params: 
    Promise < {
    productId: string
  } > // The dynamic segment from the folder name [productId]
  ;
}

// This page is an async Server Component
export default async function EditProductPage({ params }: EditProductPageProps) {
  const { productId } = await params;

  // Fetch the product data on the server
  const product: InferSelectModel<typeof products> | undefined = await getProductById(productId);

  // If product not found, render Next.js 404 page
  if (!product) {
    notFound();
  }

  return (
    <PageWraper>
      {/* Pass the fetched product data to the client-side form component */}
      <EditProductForm initialProduct={product} />
    </PageWraper>
  );
}
