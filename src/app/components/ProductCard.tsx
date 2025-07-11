// app/components/ProductCard.tsx
import Image from 'next/image'; // For optimized image loading
import Link from 'next/link'; // For linking to product detail page

import { InferSelectModel } from 'drizzle-orm'; // Import for type safety
import { products } from '@/db/schema'; // Import your Drizzle schema for 'products' type
import { slugify } from '@/util/slugify'; // Import the slugify utility

// Define the props interface for ProductCard
interface ProductCardProps {
  // The product prop is now typed directly from your Drizzle schema
  product: InferSelectModel<typeof products>;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
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

  return (
    // Wrap the entire card in a Link component to make it clickable
    <Link href={productDetailHref} passHref className="block">
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

        <div className="p-4 max-w-64">
          <h3 className="text-lg  font-semibold text-center text-gray-800 truncate mb-1">{product.name}</h3>
          {/* Ensure product.description is a string, provide fallback if null/undefined */}
          <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description || 'No description available.'}</p>
          <div className="flex justify-between items-center mt-2">
            <span className="text-blue-600 font-bold text-xl">${displayPrice}</span>
            <span className="text-gray-500 text-sm">Qty: {product.quantity}</span>
          </div>
          <p className="text-gray-500 text-xs mt-1">Category: {formatCategory(product.category)}</p>
          <div className="mt-4 flex justify-end space-x-2">
            {/* Example Edit/Delete buttons (you'd add functionality later) */}
            {/* These buttons would typically have their own click handlers that prevent event bubbling
                if you want to keep the card clickable but have separate button actions. */}
            {/* <button className="text-sm text-indigo-600 hover:underline" onClick={(e) => e.stopPropagation()}>Edit</button>
            <button className="text-sm text-red-600 hover:underline" onClick={(e) => e.stopPropagation()}>Delete</button> */}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
