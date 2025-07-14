// app/api/user/orders/route.ts
import { NextResponse } from 'next/server';
import { getOrdersByBuyer } from '@/util/orderUtil'; // Adjust this import path as needed
import { verifyJwt } from '@/util/jwt'; // Adjust this import path as needed
import { cookies } from 'next/headers'; // Used to read HTTP-only cookies

// Define the shape of the data that will be sent to the client
// This matches the interfaces defined in your OrdersPage component.
interface ClientOrderItem {
  productId: string;
  name: string;
  imageUrl: string;
  price: number;
  quantity: number;
}

interface ClientOrder {
  id: string;
  orderDate: string; // YYYY-MM-DD format
  totalAmount: number; // JavaScript number type
  status: 'Pending' | 'Completed' | 'Shipped' | 'Delivered' | 'Cancelled';
  items: ClientOrderItem[];
}

export async function GET(req: Request) {
  try {
    // 1. Authenticate User via HTTP-only Cookie
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      // If no token, user is not authenticated
      return NextResponse.json({ message: 'Authentication token not found.' }, { status: 401 });
    }

    const decodedToken = verifyJwt(token);

    if (!decodedToken || !decodedToken.userId) {
      // If token is invalid or expired
      return NextResponse.json({ message: 'Invalid or expired token.' }, { status: 401 });
    }

    const buyerId = decodedToken.userId; // Extract the buyerId from the decoded JWT

    // 2. Optional: Handle Pagination from Query Parameters
    const { searchParams } = new URL(req.url);
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit') as string, 10) : undefined;
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset') as string, 10) : undefined;

    // 3. Fetch Orders using your Drizzle ORM utility
    // getOrdersByBuyer already includes 'orderItems' and nested 'product' based on your relations.
    const drizzleOrders = await getOrdersByBuyer(buyerId, { limit, offset });

    // 4. Transform Drizzle Data to Client-Friendly Format
    const clientOrders: ClientOrder[] = drizzleOrders.map(order => ({
      id: order.id,
      // Format the Date object from Drizzle to a YYYY-MM-DD string
      orderDate: order.createdAt.toISOString().split('T')[0], // Assuming orderDate maps to createdAt
      // Convert Drizzle's numeric string to a JavaScript number
      totalAmount: parseFloat(order.totalAmount),
      // Capitalize the first letter of the status enum value for display
      status: (order.status.charAt(0).toUpperCase() + order.status.slice(1)) as ClientOrder['status'],
      items: order.orderItems.map(item => ({
        // Handle cases where product might be null due to onDelete: 'set null'
        productId: item.productId || 'unknown',
        name: item.product?.name || 'Unknown Product',
        imageUrl: item.product?.imageUrl || 'https://placehold.co/64x64/E0E0E0/808080?text=Item', // Fallback image
        price: parseFloat(item.priceAtPurchase), // Convert numeric string to number
        quantity: item.quantity,
      })),
    }));

    // 5. Send the Formatted Data as JSON Response
    return NextResponse.json(clientOrders, { status: 200 });

  } catch (error: any) {
    console.error("API Error fetching orders:", error);
    // Return a generic 500 error for unexpected server-side issues
    return NextResponse.json({ message: 'Failed to fetch orders.', error: error.message }, { status: 500 });
  }
}