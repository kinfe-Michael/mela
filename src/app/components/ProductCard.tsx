// app/components/ProductCard.tsx
import Image from 'next/image'; // Consider using next/image for optimized images
import Link from 'next/link'; // If you want to link to a product detail page
import { Product } from '@/app/actions/products'; // Import the Product type

interface ProductCardProps {
  product: Product;
  // You can add more props here if needed, e.g., onEdit, onDelete handlers
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  // Function to capitalize the first letter of each word and replace underscores
  const formatCategory = (category: string) => {
    return category
      .replace(/_/g, ' ') // Replace underscores with spaces
      .replace(/\b\w/g, (char: string) => char.toUpperCase()); // Capitalize first letter of each word
  };

  return (
    <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
      {/* You can wrap the image/card in a Link if you have a product detail page */}
      {/* <Link href={`/products/${product.id}`} className="block"> */}
      {product.imageUrl && (
        // Using Next.js Image component for optimization
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-48 object-cover"
          // If using Next.js Image, you might want to add width/height or fill
          // width={300} // Example fixed width
          // height={192} // Example fixed height (h-48 = 192px)
        />
      )}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 truncate mb-1">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
        <div className="flex justify-between items-center mt-2">
          <span className="text-blue-600 font-bold text-xl">${product.price}</span>
          <span className="text-gray-500 text-sm">Qty: {product.quantity}</span>
        </div>
        <p className="text-gray-500 text-xs mt-1">Category: {formatCategory(product.category)}</p>
        <div className="mt-4 flex justify-end space-x-2">
          {/* Example Edit/Delete buttons (you'd add functionality later) */}
          {/* <button className="text-sm text-indigo-600 hover:underline">Edit</button>
          <button className="text-sm text-red-600 hover:underline">Delete</button> */}
        </div>
      </div>
      {/* </Link> */}
    </div>
  );
};

export default ProductCard;