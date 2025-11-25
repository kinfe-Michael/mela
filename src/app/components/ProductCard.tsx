"use client";

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { deleteProductAction } from '@/app/actions/deleteProduct';
import { products } from '@/db/schema';
import { slugify } from '@/util/slugify';
import { InferSelectModel } from 'drizzle-orm';
import { useState, useTransition } from 'react';
import NavLink from './CustomNavLink';

interface ProductCardProps {
  product: InferSelectModel<typeof products>;
  showActions?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, showActions = false }) => {
  const router = useRouter();
  const [isDeleting, startTransition] = useTransition();
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const formatCategory = (category: string) => {
    return category
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (char: string) => char.toUpperCase());
  };

  const displayPrice = parseFloat(product.price as string).toFixed(2);

  const productDetailHref = `/products/${slugify(product.name)}?id=${product.id}`;

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    setShowConfirmModal(false);
    startTransition(async () => {
      const result = await deleteProductAction(product.id);

      if (result.success) {
        router.push('/user/products');
      } else {
      }
    });
  };

  const cancelDelete = () => {
    setShowConfirmModal(false);
  };

  return (
    <>
     
      <div className=' max-w-min flex flex-col items-center '>
         <NavLink href={productDetailHref} passHref className="block">
        <div className="bg-white flex flex-col items-center w-64 p-1 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
          <div className="relative w-48 h-48">
            <Image
              src={product.imageUrl || 'https://placehold.co/300x192/EEF2FF/3F20BA?text=No+Image'}
              alt={product.name}
              unoptimized={true} // Disables Next.js Image Optimization
              layout="fill"
              objectFit="cover"
              className="rounded-t-lg"
              onError={(e) => {
                e.currentTarget.src = 'https://placehold.co/300x192/EEF2FF/3F20BA?text=Image+Error';
              }}
            />
          </div>

          <div className="p-4 max-w-64 flex flex-col items-center text-center">
            <h3 className="text-lg font-semibold text-gray-800 truncate mb-1 w-full">{product.name}</h3>
            <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description || 'No description available.'}</p>
            <div className="flex justify-between items-center mt-2 w-full">
              <span className="text-blue-600 font-bold text-xl">${displayPrice}</span>
              <span className="text-gray-500 text-sm">Qty: {product.quantity}</span>
            </div>
            <p className="text-gray-500 text-xs mt-1 w-full">Category: {formatCategory(product.category)}</p>

     
          </div>
        </div>
      </NavLink>
             {showActions && (
              <div className="mt-4  max-w-min flex justify-center space-x-2 w-full">
                <NavLink href={`/products/edit/${product.id}`} passHref>
                  <button
                    className="text-sm bg-indigo-500 hover:bg-indigo-600 text-white py-1 px-3 rounded-md transition-colors duration-200"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Edit
                  </button>
                </NavLink>
                <button
                  className="text-sm bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-md transition-colors duration-200"
                  onClick={handleDeleteClick}
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            )}

      </div>

      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl text-center">
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p className="mb-6">Are you sure you want to delete {product.name}?</p>
            <div className="flex justify-center space-x-4">
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-md"
                onClick={cancelDelete}
              >
                Cancel
              </button>
              <button
                className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md"
                onClick={confirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductCard;
