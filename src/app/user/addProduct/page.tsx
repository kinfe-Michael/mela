"use client"
import PageWraper from '@/app/components/PageWraper';
import { useState, useEffect } from 'react'; // Import useState and useEffect
import { productCategoryEnum } from '@/db/schema';
import { useAuthStore } from '@/lib/authStore';

// Component for the submit button to show loading state
interface SubmitButtonProps {
  pending: boolean;
}

function SubmitButton({ pending }: SubmitButtonProps) {
  const checkAuthStatus = useAuthStore((state) => state.checkAuthStatus);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]); // Add checkAuthStatus to dependency array

  return (
    <button
      type="submit"
      aria-disabled={pending}
      className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? 'Adding Product...' : 'Add Product'}
    </button>
  );
}

export default function AddProductPage() {
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [pending, setPending] = useState(false); // State to manage loading status

  // Get the enum values for categories
  const categories = productCategoryEnum.enumValues;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPending(true); // Set loading state
    setMessage(''); // Clear previous messages
    setSuccess(false);

    const formData = new FormData(event.currentTarget);

    try {
      // Make sure the API route path is correct.
      // If you are using App Router, it's typically /api/createProduct
      // If you are using Pages Router, it's typically /api/createProduct
      const response = await fetch('/api/product/createProduct', {
        method: 'POST',
        body: formData, // FormData directly handles file uploads to API routes
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setMessage(data.message || 'Product added successfully!');
        // Optionally, clear the form after successful submission
        event.currentTarget.reset();
      } else {
        setSuccess(false);
        setMessage(data.message || 'Failed to add product. Please try again.');
      }
    } catch (error: any) {
      console.error('Network or unexpected error:', error);
      setSuccess(false);
      setMessage(error.message || 'An unexpected error occurred. Please check your network connection.');
    } finally {
      setPending(false); // Reset loading state
    }
  };

  return (
    <PageWraper>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-200">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Add New Product</h1>

          <form onSubmit={handleSubmit} className="space-y-5" encType="multipart/form-data">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-gray-700 text-sm font-medium mb-1">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="e.g., Organic Honey"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-gray-700 text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-y"
                placeholder="A brief description of the product..."
              ></textarea>
            </div>

            {/* Price */}
            <div>
              <label htmlFor="price" className="block text-gray-700 text-sm font-medium mb-1">
                Price <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="price"
                name="price"
                step="0.01"
                min="0.01"
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="e.g., 19.99"
              />
            </div>

            {/* Quantity */}
            <div>
              <label htmlFor="quantity" className="block text-gray-700 text-sm font-medium mb-1">
                Quantity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                min="0"
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="e.g., 100"
              />
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-gray-700 text-sm font-medium mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                name="category"
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>

            {/* Image File Input */}
            <div>
              <label htmlFor="imageFile" className="block text-gray-700 text-sm font-medium mb-1">
                Product Image
              </label>
              <input
                type="file"
                id="imageFile"
                name="imageFile"
                accept="image/*"
                className="w-full p-3 border border-gray-300 rounded-md file:mr-4 file:py-2 file:px-4
                               file:rounded-md file:border-0 file:text-sm file:font-semibold
                               file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100
                               transition-all duration-200 cursor-pointer"
              />
            </div>

            {/* Display messages based on form state */}
            {message && (
              <p
                className={`text-center p-3 rounded-md ${
                  success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                } text-sm font-medium`}
              >
                {message}
              </p>
            )}

            <SubmitButton pending={pending} />
          </form>
        </div>
      </div>
    </PageWraper>
  );
}