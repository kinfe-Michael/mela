// app/products/[productId]/page.tsx
// This is a React Server Component, ensuring SSR for SEO.

import React from 'react';
import { notFound, redirect } from 'next/navigation';
import { InferSelectModel } from 'drizzle-orm';
import { products } from '@/db/schema';
import { getProductById, getProductsByCategory } from '@/util/dbUtil';
import { slugify } from '@/util/slugify';

import PageWraper from '@/app/components/PageWraper';
import SingleProductDisplay from '../components/SingleProductDisplay';
import SimilarProducts from '../components/SimilarProducts';
import type { Metadata } from 'next';

// Define the type for the product data, directly from your Drizzle schema
type ProductType = InferSelectModel<typeof products>;

// Define props for the page component, including dynamic segment and query parameters


// The main page component is an async Server Component
export default async function ProductDetailPage({ params, searchParams }: {
  params: Promise < {
    productNameSlug: string
  } > ;
  searchParams: Promise < {
    [id: string]: string | undefined
  } > ;
}) {
  
  const {productNameSlug} =  await params;
  const {id} =  await searchParams;
  const productId = id
  console.log(params)
  console.log(productId)

  if (!productId) {
    notFound();
  }

  const product: ProductType | undefined = await getProductById(productId); // Await the data fetching function

  if (!product) {
    notFound();
  }

  

  const similarProducts: ProductType[] = await getProductsByCategory(
    product.category,
    product.id,
    { limit: 4 }
  );

  return (
    <PageWraper>
      <SingleProductDisplay product={product} />

      {similarProducts.length > 0 && (
        <SimilarProducts products={similarProducts} />
      )}
    </PageWraper>
  );
}
