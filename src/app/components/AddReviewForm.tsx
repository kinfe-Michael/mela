'use client'; // This directive marks the file as a Client Component

import React, { useState } from 'react';
import { useFormStatus } from 'react-dom'; // Hook for form status
import { addReviewAction } from '@/app/actions/reviews'; // Adjust path

interface AddReviewFormProps {
  productId: string;
  productNameSlug: string; // Used for revalidation path
}

export default function AddReviewForm({ productId, productNameSlug }: AddReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submissionStatus, setSubmissionStatus] = useState<{ success: boolean; message: string } | null>(null);
  const { pending } = useFormStatus(); // Get pending state from the form

  // Bind the server action to the form
  const addReviewWithProductId = addReviewAction.bind(null, productId);

  const handleSubmit = async (formData: FormData) => {
    // Add productNameSlug to formData for revalidation path
    formData.append('productNameSlug', productNameSlug);

    const result = await addReviewWithProductId(formData);
    setSubmissionStatus(result);

    if (result.success) {
      // Clear form on success
      setRating(0);
      setComment('');
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mt-8">
      <h2 className="text-2xl font-bold mb-4">Add Your Review</h2>

      <form action={handleSubmit} className="space-y-4">
        {/* Rating Input */}
        <div>
          <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-1">
            Rating:
          </label>
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <label key={star} className="cursor-pointer">
                <input
                  type="radio"
                  name="rating"
                  value={star}
                  checked={rating === star}
                  onChange={() => setRating(star)}
                  className="sr-only" // Hide default radio button
                  required
                />
                <svg
                  className={`w-8 h-8 ${rating >= star ? 'text-yellow-400' : 'text-gray-300'} transition-colors duration-200`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.927 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                </svg>
              </label>
            ))}
          </div>
        </div>

        {/* Comment Textarea */}
        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
            Comment (Optional):
          </label>
          <textarea
            id="comment"
            name="comment"
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
            placeholder="Share your thoughts on the product..."
          ></textarea>
        </div>

        {/* Submission Button */}
        <button
          type="submit"
          className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={pending || rating === 0} // Disable if submitting or no rating selected
        >
          {pending ? 'Submitting...' : 'Submit Review'}
        </button>

        {/* Submission Status Message */}
        {submissionStatus && (
          <p className={`mt-3 text-center ${submissionStatus.success ? 'text-green-600' : 'text-red-600'}`}>
            {submissionStatus.message}
          </p>
        )}
      </form>
    </div>
  );
}