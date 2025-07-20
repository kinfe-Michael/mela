
import { products } from '@/db/schema';
import { getProductById, getProductsByCategory } from '@/util/dbUtil';
import { slugify } from '@/util/slugify';
import { InferSelectModel } from 'drizzle-orm';
import { notFound, redirect } from 'next/navigation';

import AddReviewForm from '@/app/components/AddReviewForm';
import PageWraper from '@/app/components/PageWraper';
import ProductReviews from '@/app/components/ProductReviews';
import SimilarProducts from '../components/SimilarProducts';
import SingleProductDisplay from '../components/SingleProductDisplay';

import type { Metadata } from 'next';

type ProductType = InferSelectModel<typeof products>;

export default async function ProductDetailPage({ params, searchParams }: {
  params: Promise < {
    productNameSlug: string
  } >;
  searchParams: Promise < {
    id: string
  } >;
}) {
  const { productNameSlug } = await params;
  const { id: productId } =await searchParams;

  if (!productId) {
    notFound();
  }

  const product: ProductType | undefined = await getProductById(productId);

  if (!product) {
    notFound();
  }

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

      <ProductReviews productId={product.id} />

      <AddReviewForm productId={product.id} productNameSlug={productNameSlug} />

      {similarProducts.length > 0 && (
        <SimilarProducts products={similarProducts} />
      )}
    </PageWraper>
  );
}


export async function generateMetadata({  searchParams }: {
  searchParams:Promise < {
    id: string
  } >;
}): Promise<Metadata> {
const { id: productId } =await searchParams;

  if (!productId) {
    return { title: 'Product Not Found' };
  }


  const product = await getProductById(productId);

  if (!product) {
    return { title: 'Product Not Found' };
  }

  return {
    title: product.name,
    description: product.description || `Details for ${product.name}`,
    openGraph: {
      images: product.imageUrl ? [product.imageUrl] : [],
    },
  };
}