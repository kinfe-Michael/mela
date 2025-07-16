// app/components/ProductCard.tsx
"use client"; // This component needs to be a Client Component if it uses client-side hooks or event handlers

import Image from 'next/image'; // For optimized image loading
import { useRouter } from 'next/navigation'; // For client-side navigation after delete

import { InferSelectModel } from 'drizzle-orm'; // Import for type safety
import { products } from '@/db/schema'; // Import your Drizzle schema for 'products' type
import { slugify } from '@/util/slugify'; // Import the slugify utility
import { deleteProductAction } from '@/app/actions/deleteProduct'; // Import the delete Server Action
// import { useToast } from '@/components/ui/use-toast'; // Assuming you have a toast notification system
import { useState, useTransition } from 'react'; // For managing pending state and confirmation modal
import NavLink from './CustomNavLink';

// Define the props interface for ProductCard
interface ProductCardProps {
  // The product prop is now typed directly from your Drizzle schema
  product: InferSelectModel<typeof products>;
  showActions?: boolean; // Optional prop to show Edit/Delete buttons
}

const ProductCard: React.FC<ProductCardProps> = ({ product, showActions = false }) => {
  const router = useRouter();
  // const { toast } = useToast();
  const [isDeleting, startTransition] = useTransition();
  const [showConfirmModal, setShowConfirmModal] = useState(false); // State for confirmation modal

  // Function to capitalize the first letter of each word and replace underscores
  const formatCategory = (category: string) => {
    return category
      .replace(/_/g, ' ') // Replace underscores with spaces
      .replace(/\b\w/g, (char: string) => char.toUpperCase()); // Capitalize first letter of each word
  };

  // Convert price to a fixed-point number for display
  const displayPrice = parseFloat(product.price as string).toFixed(2);

  // Construct the SEO-friendly URL for the product detail page
  const productDetailHref = `/products/${slugify(product.name)}?id=${product.id}`;
  // Construct the URL for the edit product page
  // const editProductHref = `/dashboard/products/edit/${product.id}`; // Edit page uses product ID directly

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the NavLink from navigating
    setShowConfirmModal(true); // Show confirmation modal
  };

  const confirmDelete = async () => {
    setShowConfirmModal(false); // Hide modal immediately
    startTransition(async () => {
      const result = await deleteProductAction(product.id);

      if (result.success) {
        // toast({
        //   title: "Product Deleted!",
        //   description: result.message,
        //   variant: "default",
        // });
        // Optionally, redirect or refresh the list if this card is part of a dynamic list
        // For example, if on a user's product list, you might want to refresh the parent page.
        // Server action revalidates paths, so often a simple re-render of the parent list is enough.
        // If you need to explicitly navigate away from a single product page after deletion:
        router.push('/user/products'); // Example: navigate back to user's product list
      } else {
        // toast({
        //   title: "Deletion Failed",
        //   description: result.error || "An unknown error occurred.",
        //   variant: "destructive",
        // });
      }
    });
  };

  const cancelDelete = () => {
    setShowConfirmModal(false);
  };

  return (
    <>
      {/* Wrap the entire card in a NavLink component to make it clickable */}
     
      <div className=' max-w-min flex flex-col items-center '>
         <NavLink href={productDetailHref} passHref className="block">
        <div className="bg-white flex flex-col items-center w-64 p-1 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
          {/* Using Next.js Image component for optimization */}
          <div className="relative w-48 h-48"> {/* Container for the Image component */}
            <Image
              src={product.imageUrl || 'https://placehold.co/300x192/EEF2FF/3F20BA?text=No+Image'} // Use product.imageUrl with a fallback
              alt={product.name}
              layout="fill" // Makes the image fill the parent div
              objectFit="cover" // Covers the area, cropping if necessary
              className="rounded-t-lg" // Apply rounded corners to the top of the image
              onError={(e) => {
                // Fallback for broken image URLs
                e.currentTarget.src = 'https://placehold.co/300x192/EEF2FF/3F20BA?text=Image+Error';
              }}
            />
          </div>

          <div className="p-4 max-w-64 flex flex-col items-center text-center"> {/* Centered content */}
            <h3 className="text-lg font-semibold text-gray-800 truncate mb-1 w-full">{product.name}</h3>
            {/* Ensure product.description is a string, provide fallback if null/undefined */}
            <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description || 'No description available.'}</p>
            <div className="flex justify-between items-center mt-2 w-full">
              <span className="text-blue-600 font-bold text-xl">${displayPrice}</span>
              <span className="text-gray-500 text-sm">Qty: {product.quantity}</span>
            </div>
            <p className="text-gray-500 text-xs mt-1 w-full">Category: {formatCategory(product.category)}</p>

            {/* Conditional rendering of Edit/Delete buttons */}
     
          </div>
        </div>
      </NavLink>
             {showActions && (
              <div className="mt-4  max-w-min flex justify-center space-x-2 w-full">
                <NavLink href={`/products/edit/${product.id}`} passHref>
                  <button
                    className="text-sm bg-indigo-500 hover:bg-indigo-600 text-white py-1 px-3 rounded-md transition-colors duration-200"
                    onClick={(e) => e.stopPropagation()} // Prevent NavLink navigation when button is clicked
                  >
                    Edit
                  </button>
                </NavLink>
                <button
                  className="text-sm bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-md transition-colors duration-200"
                  onClick={handleDeleteClick} // Use the handler that shows modal
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            )}

      </div>

      {/* Confirmation Modal (simple example, use a proper modal component) */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl text-center">
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p className="mb-6">Are you sure you want to delete "{product.name}"?</p>
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
