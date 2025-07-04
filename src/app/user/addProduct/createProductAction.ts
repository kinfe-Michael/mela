'use server';

import { addProduct } from '@/util/dbUtil';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

// Initialize S3 Client
const s3Client = new S3Client({
  region: process.env.AWS_S3_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

const initialState = {
  message: '',
  success: false,
};

export async function createProductAction(prevState: typeof initialState, formData: FormData) {
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const price = parseFloat(formData.get('price') as string);
  const quantity = parseInt(formData.get('quantity') as string, 10);
  const imageFile = formData.get('imageFile') as File;

  // --- AUTOMATIC SELLER ID HANDLING ---
  // In a real application, you would get the sellerId from the authenticated user's session.
  // For example, if you're using NextAuth.js, you might do:
  // const session = await getServerSession(authOptions);
  // if (!session || !session.user || !session.user.id) {
  //   return { success: false, message: 'Authentication required to add a product.' };
  // }
  // const sellerId = session.user.id;

  // For demonstration, we'll use a static placeholder UUID.
  // Make sure this UUID actually exists in your 'users' table for the product to be valid.
  const sellerId = 'a1b2c3d4-e5f6-7890-1234-567890abcdef'; // REPLACE WITH A VALID UUID FROM YOUR 'users' TABLE FOR TESTING
  // --- END AUTOMATIC SELLER ID HANDLING ---


  // Basic server-side validation (sellerId check removed as it's now internal)
  if (!name || !price || isNaN(price) || !quantity || isNaN(quantity)) {
    return { success: false, message: 'Please fill in all required fields (Name, Price, Quantity).' };
  }
  if (price <= 0 || quantity < 0) {
    return { success: false, message: 'Price must be positive, and Quantity cannot be negative.' };
  }

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
      imageUrl: imageUrl,
      sellerId, // Now sellerId comes from the server-side logic
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
