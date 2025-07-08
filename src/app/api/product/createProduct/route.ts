// app/api/createProduct/route.ts

import { addProduct } from '@/util/dbUtil';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken'; // Import jsonwebtoken directly

// Initialize S3 Client
const s3Client = new S3Client({
  region: process.env.AWS_S3_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

// Define your JWT secret key
// IMPORTANT: Ensure process.env.JWT_SECRET is set in your .env.local and deployment environment
const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key'; // **CHANGE THIS IN PRODUCTION AND MAKE IT LONG/RANDOM**

export async function POST(req: NextRequest) {
  let sellerId: string | null = null;

  // --- Authentication directly from cookies using jsonwebtoken ---
  try {
    // Access cookies using NextRequest's .cookies API
    const authToken = req.cookies.get('auth_token')?.value;

    if (!authToken) {
      return NextResponse.json({ success: false, message: 'Authentication required: Auth token not found.' }, { status: 401 });
    }

    // Verify the JWT token using jsonwebtoken
    const decoded = jwt.verify(authToken, JWT_SECRET) as { userId: string; [key: string]: any }; // Adjust payload type as needed

    sellerId = decoded.userId; // Assuming your JWT payload has a 'userId' field

    if (!sellerId) {
      return NextResponse.json({ success: false, message: 'Authentication required: User ID not found in token payload.' }, { status: 401 });
    }

  } catch (error: any) {
    console.error('Error verifying JWT token:', error);
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ success: false, message: 'Authentication failed: Invalid token.' }, { status: 401 });
    }
    return NextResponse.json({ success: false, message: 'Failed to verify authentication status.' }, { status: 500 });
  }
  // --- END Authentication ---

  try {
    const formData = await req.formData(); // Handles multipart/form-data directly in App Router

    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const price = parseFloat(formData.get('price') as string);
    const quantity = parseInt(formData.get('quantity') as string, 10);
    const category = formData.get('category') as string;
    const imageFile = formData.get('imageFile') as File;

    // Basic server-side validation
    if (!name || !price || isNaN(price) || !quantity || isNaN(quantity) || !category || !sellerId) {
      return NextResponse.json({ success: false, message: 'Please fill in all required fields (Name, Price, Quantity, Category) and ensure you are logged in.' }, { status: 400 });
    }
    if (price <= 0 || quantity < 0) {
      return NextResponse.json({ success: false, message: 'Price must be positive, and Quantity cannot be negative.' }, { status: 400 });
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
        });

        await s3Client.send(uploadCommand);

        imageUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${uniqueFilename}`;

      } catch (uploadError: any) {
        console.error('Error uploading image to S3:', uploadError);
        return NextResponse.json({ success: false, message: `Failed to upload image to S3: ${uploadError.message}` }, { status: 500 });
      }
    }

    try {
      const result = await addProduct({
        name,
        description: description || null,
        price: price.toString(),
        quantity,
        category: category,
        imageUrl: imageUrl,
        sellerId,
      });

      if (result.success) {
        return NextResponse.json({ success: true, message: `Product "${result.product?.name}" added successfully!` }, { status: 200 });
      } else {
        return NextResponse.json({ success: false, message: result.error || 'Failed to add product.' }, { status: 500 });
      }
    } catch (error: any) {
      console.error('Error in API route (addProduct call):', error);
      return NextResponse.json({ success: false, message: error.message || 'An unexpected error occurred.' }, { status: 500 });
    }
  } catch (parseError: any) {
    console.error('Error parsing form data or unexpected error:', parseError);
    return NextResponse.json({ success: false, message: 'Invalid form data provided or an unexpected error occurred.' }, { status: 400 });
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 });
}