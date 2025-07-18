'use server';

import { upsertProductReview } from '@/util/orderUtil';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key';

async function verifyAuthToken(token: string): Promise<string | null> {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    return decoded.userId;
  } catch (error) {
    console.error("Error verifying auth token:", error);
    return null;
  }
}

export async function addReviewAction(productId: string, formData: FormData) {
  const cookieStore =await cookies();
  const authToken = cookieStore.get('auth_token')?.value;

  if (!authToken) {
    console.error("Authentication required: auth_token cookie not found.");
    return { success: false, message: "Authentication required. Please log in to add a review." };
  }

  const userId = await verifyAuthToken(authToken);

  if (!userId) {
    console.error("Authentication required: Invalid or expired auth_token.");
    return { success: false, message: "Authentication failed. Please log in again." };
  }

  const rating = parseInt(formData.get('rating') as string);
  const comment = formData.get('comment') as string;
  const productNameSlug = formData.get('productNameSlug') as string;

  if (isNaN(rating) || rating < 1 || rating > 5) {
    console.error("Invalid rating provided.");
    return { success: false, message: "Invalid rating. Must be between 1 and 5." };
  }
  if (!productId) {
    console.error("Missing product ID.");
    return { success: false, message: "Missing product information." };
  }

  try {
    const upsertedReview = await upsertProductReview({
      productId,
      userId,
      rating,
      comment: comment || null,
    });

    revalidatePath(`/products/${productNameSlug}`, 'page');

    return { success: true, message: "Review added successfully!", review: upsertedReview };
  } catch (error: any) {
    console.error("Failed to upsert review:", error);
    return { success: false, message: error.message || "Failed to add review." };
  }
}