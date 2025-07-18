
import React from 'react';
import { notFound } from 'next/navigation';
import { InferSelectModel } from 'drizzle-orm';
import { products } from '@/db/schema';
import { getProductById } from '@/util/dbUtil';

import PageWraper from '@/app/components/PageWraper';
import EditProductForm from '@/app/components/EditProductsForm';

interface EditProductPageProps {
  params: 
    Promise < {
    productId: string
  } >
  ;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { productId } = await params;

  const product: InferSelectModel<typeof products> | undefined = await getProductById(productId);

  if (!product) {
    notFound();
  }

  return (
    <PageWraper>
      <EditProductForm initialProduct={product} />
    </PageWraper>
  );
}
