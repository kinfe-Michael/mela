'use server';
import { addProduct } from '@/util/dbUtil'; // Assuming this function exists and is correctly defined
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { useAuthStore } from '@/lib/authStore';

// Import productCategoryEnum for validation if needed, or just rely on form input.
// import { productCategoryEnum } from '@/drizzle/schema'; 

// Initialize S3 Client
const s3Client = new S3Client({
  region: process.env.AWS_S3_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});
console.log(process.env.NEXT_PUBLIC_BASE_URL)
const initialState = {
  message: '',
  success: false,
};

export async function createProductAction(prevState: typeof initialState, formData: FormData) {
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const price = parseFloat(formData.get('price') as string);
  const quantity = parseInt(formData.get('quantity') as string, 10);
  const category = formData.get('category') as string; // Get the category
  const imageFile = formData.get('imageFile') as File;
  // const checkAuthStatus = useAuthStore((state)=>state.checkAuthStatus)

  // --- Seller ID Handling using internal API call ---
  let sellerId: string | null = null;
  try {
    
    // const authStatusResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/status`);
    const authStatusResponse = await fetch(`http://localhost:3000/api/auth/status`);
    console.log("authStatusResponse")
    console.log(authStatusResponse)
    console.log("authStatusResponse")
    
    const authData = await authStatusResponse.json();
    console.log("authData")
    console.log(authData)
    console.log("authData")


    if (authStatusResponse.ok && authData.isLoggedIn && authData.user && authData.user.userId) {
      sellerId = authData.user.userId;
    } else {
      return { success: false, message: 'Authentication required to add a product.' };
    }
  } catch (error) {
    console.error('Error fetching auth status in server action:', error);
    return { success: false, message: 'Failed to verify authentication status.' };
  }
  // --- END Seller ID Handling ---

  // Basic server-side validation
  if (!name || !price || isNaN(price) || !quantity || isNaN(quantity) || !category || !sellerId) {
    return { success: false, message: 'Please fill in all required fields (Name, Price, Quantity, Category) and ensure you are logged in.' };
  }
  if (price <= 0 || quantity < 0) {
    return { success: false, message: 'Price must be positive, and Quantity cannot be negative.' };
  }

  // Optional: Validate if the category is one of the allowed enum values
  // if (!productCategoryEnum.enumValues.includes(category as any)) {
  //   return { success: false, message: 'Invalid product category selected.' };
  // }

  let imageUrl: string | null = null;

  if (imageFile && imageFile.size > 0) {
    try {
      const fileExtension = path.extname(imageFile.name);
      const uniqueFilename = `products/${uuidv4()}${fileExtension}`;

      const buffer = Buffer.from(await imageFile.arrayBuffer());

      const uploadCommand = new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: uniqueFilename,
        Body: buffer,
        ContentType: imageFile.type,
        ACL: 'public-read',
      });

      await s3Client.send(uploadCommand);

      imageUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${uniqueFilename}`;

    } catch (uploadError: any) {
      console.error('Error uploading image to S3:', uploadError);
      return { success: false, message: `Failed to upload image to S3: ${uploadError.message}` };
    }
  }

  try {
    const result = await addProduct({
      name,
      description: description || null,
      price: price.toString(),
      quantity,
      category: category, // Pass the category
      imageUrl: imageUrl,
      sellerId, // Now sellerId comes from the internal auth check
    });

    if (result.success) {
      return { success: true, message: `Product "${result.product?.name}" added successfully!` };
    } else {
      return { success: false, message: result.error || 'Failed to add product.' };
    }
  } catch (error: any) {
    console.error('Error in server action (addProduct call):', error);
    return { success: false, message: error.message || 'An unexpected error occurred.' };
  }
}