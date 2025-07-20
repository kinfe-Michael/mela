import { reviews, users } from '@/db/schema'; // Import necessary schemas for types
import { getAverageRatingForProduct, getReviewsByProductId } from '@/util/orderUtil'; // Adjust path
import { InferSelectModel } from 'drizzle-orm';

// Define types for reviews and user data
type ReviewType = InferSelectModel<typeof reviews> & {
  user?: Pick<InferSelectModel<typeof users>, 'id' | 'userName'>;
};

interface ProductReviewsProps {
  productId: string;
}

export default async function ProductReviews({ productId }: ProductReviewsProps) {
  const allReviews: ReviewType[] = await getReviewsByProductId(productId);
  const averageRating = await getAverageRatingForProduct(productId);
  
//   const averageRating = typeof averageRatingReal === 'number' && !isNaN(averageRatingReal) ? averageRatingReal : 0;
  return (
    <div className="bg-white shadow-md rounded-lg p-6 mt-8">
      <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>

      {averageRating > 0 ? (
        <div className="mb-4">
          <p className="text-xl font-semibold text-yellow-500">
            Average Rating: {(averageRating).toFixed(2)} / 5
          </p>
          <div className="flex items-center mt-1">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-5 h-5 ${i < Math.round(averageRating) ? 'text-yellow-400' : 'text-gray-300'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.927 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="ml-2 text-gray-600">({allReviews.length} reviews)</span>
          </div>
        </div>
      ) : (
        <p className="text-gray-600 mb-4">No ratings yet. Be the first to review!</p>
      )}

      <h3 className="text-xl font-semibold mb-3">All Reviews</h3>
      {allReviews.length === 0 ? (
        <p className="text-gray-500">No reviews for this product yet.</p>
      ) : (
        <div className="space-y-4">
          {allReviews.map((review) => (
            <div key={review.id} className="border-b border-gray-200 pb-4 last:border-b-0">
              <div className="flex items-center mb-1">
                <span className="font-medium text-gray-800">{review.user?.userName || 'Anonymous'}</span>
                <span className="ml-3 text-sm text-yellow-500">
                  Rating: {review.rating}/5
                </span>
              </div>
              {review.comment && <p className="text-gray-700 text-sm mt-1">{review.comment}</p>}
              <p className="text-xs text-gray-500 mt-1">
                Reviewed on {new Date(review.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}