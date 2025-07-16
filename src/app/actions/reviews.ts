// app/products/actions.ts
'use server'; // This directive marks the file as a Server Action file

import { addProductReview } from '@/util/orderUtil'; // Assuming addProductReview is in dbUtil now
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers'; // Import cookies
import jwt from 'jsonwebtoken'; // You'll need to install 'jsonwebtoken' (npm install jsonwebtoken)

// IMPORTANT: Replace with your actual JWT secret key from environment variables
// This secret is used to sign and verify your JWTs. Keep it secure and never expose it client-side.
const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key'; // <<< REPLACE THIS IN PRODUCTION

/**
 * Verifies the JWT from the auth_token cookie and extracts the userId.
 * In a real app, this would be part of a more comprehensive auth utility.
 * @param token The JWT string.
 * @returns The userId if valid, otherwise null.
 */
async function verifyAuthToken(token: string): Promise<string | null> {
  try {
    // Decode the token. The payload should contain the userId.
    // Ensure your JWT payload includes a 'userId' or 'uid' field.
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    return decoded.userId;
  } catch (error) {
    console.error("Error verifying auth token:", error);
    return null;
  }
}

/**
 * Server Action to handle adding a new product review.
 * @param productId The ID of the product being reviewed.
 * @param formData FormData object from the client-side form.
 */
export async function addReviewAction(productId: string, formData: FormData) {
  const cookieStore =await cookies();
  const authToken = cookieStore.get('auth_token')?.value;

  if (!authToken) {
    console.error("Authentication required: auth_token cookie not found.");
    // Redirect to login page or return an error
    return { success: false, message: "Authentication required. Please log in to add a review." };
    // Alternatively, you could redirect:
    // redirect('/login');
  }

  const userId = await verifyAuthToken(authToken);

  if (!userId) {
    console.error("Authentication required: Invalid or expired auth_token.");
    // Redirect to login page or return an error
    return { success: false, message: "Authentication failed. Please log in again." };
    // Alternatively, you could redirect:
    // redirect('/login');
  }

  const rating = parseInt(formData.get('rating') as string);
  const comment = formData.get('comment') as string;
  const productNameSlug = formData.get('productNameSlug') as string; // Get slug for revalidation

  if (isNaN(rating) || rating < 1 || rating > 5) {
    console.error("Invalid rating provided.");
    return { success: false, message: "Invalid rating. Must be between 1 and 5." };
  }
  if (!productId) {
    console.error("Missing product ID.");
    return { success: false, message: "Missing product information." };
  }

  try {
    const newReview = await addProductReview({
      productId,
      userId, // Now using the userId extracted from the token
      rating,
      comment: comment || null, // Ensure comment is null if empty string
    });

    // Revalidate the current product page to show the new review and updated average rating
    revalidatePath(`/products/${productNameSlug}`, 'page');

    return { success: true, message: "Review added successfully!", review: newReview };
  } catch (error: any) {
    console.error("Failed to add review:", error);
    return { success: false, message: error.message || "Failed to add review." };
  }
}