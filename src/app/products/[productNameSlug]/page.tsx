// app/products/[productId]/page.tsx
// This is a React Server Component, ensuring SSR for SEO.

import React from 'react';
import { notFound, redirect } from 'next/navigation';
import { InferSelectModel } from 'drizzle-orm';
import { products } from '@/db/schema';
import { getProductById, getProductsByCategory } from '@/util/dbUtil'; // Ensure getProductById and getProductsByCategory are imported
import { slugify } from '@/util/slugify'; // Assuming you have this utility

import PageWraper from '@/app/components/PageWraper';
import SingleProductDisplay from '../components/SingleProductDisplay';
import SimilarProducts from '../components/SimilarProducts';
import ProductReviews from '@/app/components/ProductReviews'; // NEW: Import ProductReviews
import AddReviewForm from '@/app/components/AddReviewForm'; // NEW: Import AddReviewForm

import type { Metadata } from 'next';

// Define the type for the product data, directly from your Drizzle schema
type ProductType = InferSelectModel<typeof products>;

// The main page component is an async Server Component
export default async function ProductDetailPage({ params, searchParams }: {
  params: Promise < {
    productNameSlug: string
  } >;
  searchParams: Promise < {
    id: string
  } >;
}) {
  const { productNameSlug } = await params;
  const { id: productId } =await searchParams; // Renamed 'id' to 'productId' for clarity

  if (!productId) {
    notFound();
  }

  const product: ProductType | undefined = await getProductById(productId);

  if (!product) {
    notFound();
  }

  // Ensure the slug matches for SEO and correctness, redirect if not
  const expectedSlug = slugify(product.name);
  if (productNameSlug !== expectedSlug) {
    redirect(`/products/${expectedSlug}?id=${productId}`);
  }

  const similarProducts: ProductType[] = await getProductsByCategory(
    product.category,
    product.id,
    { limit: 4 }
  );

  return (
    <PageWraper>
      <SingleProductDisplay product={product} />

      {/* NEW: Product Reviews Section */}
      <ProductReviews productId={product.id} />

      {/* NEW: Add Review Form */}
      <AddReviewForm productId={product.id} productNameSlug={productNameSlug} />

      {similarProducts.length > 0 && (
        <SimilarProducts products={similarProducts} />
      )}
    </PageWraper>
  );
}


export async function generateMetadata({ params, searchParams }: {
  params: Promise < {
    productNameSlug: string
  } >;
  searchParams:Promise < {
    id: string
  } >;
}): Promise<Metadata> {
const { id: productId } =await searchParams;

  if (!productId) {
    return { title: 'Product Not Found' };
  }
  Promise < {
    productNameSlug: string
  } >

  const product = await getProductById(productId);

  if (!product) {
    return { title: 'Product Not Found' };
  }

  return {
    title: product.name,
    description: product.description || `Details for ${product.name}`,
    // Add more SEO meta tags as needed
    openGraph: {
      images: product.imageUrl ? [product.imageUrl] : [],
    },
  };
}