// app/seller/[sellerId]/products-sold/page.tsx
import { getSellerOrderedProducts, getAverageRatingForProduct, getReviewsByProductId } from '@/util/orderUtil'; // Adjust path if you put functions in a different file
import { InferSelectModel } from 'drizzle-orm';
import { products } from '@/db/schema'; // Import products schema for type inference
import Link from 'next/link';

// Define a type for the data fetched for each product, including reviews and average rating
type ProductWithDetails = InferSelectModel<typeof products> & {
  totalOrderedQuantity: number;
  averageRating: number;
  reviews: Awaited<ReturnType<typeof getReviewsByProductId>>; // Infer type from the getReviewsByProductId function
};

interface SellerProductsSoldPageProps {
  params: Promise < {
    sellerId: string
  } >;
}


export default async function SellerProductsSoldPage({ params }: SellerProductsSoldPageProps) {
  const { sellerId } = await params;



  let sellerOrderedProducts: ProductWithDetails[] = [];
  console.log(sellerId)
  let error: string | null = null;

  try {
    const rawOrderedProducts = await getSellerOrderedProducts(sellerId);

    // Fetch reviews and average rating for each product
    sellerOrderedProducts = await Promise.all(
      rawOrderedProducts.map(async (item) => {
        const averageRating = await getAverageRatingForProduct(item.product.id);
        const reviews = await getReviewsByProductId(item.product.id, { limit: 3 }); // Fetch a few reviews
        return {
          ...item.product,
          totalOrderedQuantity: item.totalOrderedQuantity,
          averageRating,
          reviews,
        };
      })
    );

  } catch (err: any) {
    console.error("Failed to fetch seller's ordered products:", err);
    error = "Failed to load products. Please try again later.";
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Products Sold by Seller</h1>

      {error && (
        <p className="text-red-500 text-center mb-4">{error}</p>
      )}

      {!sellerOrderedProducts || sellerOrderedProducts.length === 0 ? (
        <p className="text-center text-gray-600">No products have been sold by this seller yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sellerOrderedProducts.map((product) => (
            <div key={product.id} className="bg-white shadow-md rounded-lg p-6 flex flex-col">
              <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
              {/* <p className="text-gray-700 mb-2 flex-grow">{product.description}</p> */}
              {product.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover rounded-md mb-4" />
              )}
              <div className="flex justify-between items-center mb-2">
                <span className="text-lg font-bold text-blue-600">${parseFloat(product.price).toFixed(2)}</span>
                <span className="text-sm text-gray-500">Category: {product.category}</span>
              </div>
              <p className="text-green-600 font-medium mb-4">Total Ordered Quantity: {product.totalOrderedQuantity}</p>

              {/* Reviews and Ratings Section */}
              <div className="mt-auto pt-4 border-t border-gray-200">
                <h3 className="text-lg font-semibold mb-2">Reviews ({product.reviews.length})</h3>
                {product.averageRating > 0 ? (
                  <p className="text-yellow-500 font-bold mb-2">Average Rating: {product.averageRating.toFixed(1)} / 5</p>
                ) : (
                  <p className="text-gray-500 mb-2">No ratings yet.</p>
                )}

                {product.reviews.length > 0 ? (
                  <div className="space-y-3 max-h-40 overflow-y-auto">
                    {product.reviews.map((review) => (
                      <div key={review.id} className="bg-gray-50 p-3 rounded-md">
                        <p className="text-sm font-medium text-gray-800">
                          {review.user?.userName || 'Anonymous'} - Rating: {review.rating}/5
                        </p>
                        {review.comment && <p className="text-sm text-gray-600 mt-1">"{review.comment}"</p>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No reviews for this product yet.</p>
                )}
                {/* Link to add review - This would typically be on a separate product detail page */}
                {/* <Link href={`/product/${product.id}/add-review`} className="text-blue-500 text-sm hover:underline mt-2 inline-block">
                  Add a Review
                </Link> */}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}