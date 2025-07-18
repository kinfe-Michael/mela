import { NextResponse } from 'next/server';
import { getOrdersByBuyer } from '@/util/orderUtil';
import { verifyJwt } from '@/util/jwt';
import { cookies } from 'next/headers';

interface ClientOrderItem {
  productId: string;
  name: string;
  imageUrl: string;
  price: number;
  quantity: number;
}

interface ClientOrder {
  id: string;
  orderDate: string;
  totalAmount: number;
  status: 'Pending' | 'Completed' | 'Shipped' | 'Delivered' | 'Cancelled';
  items: ClientOrderItem[];
}

export async function GET(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ message: 'Authentication token not found.' }, { status: 401 });
    }

    const decodedToken = verifyJwt(token);

    if (!decodedToken || !decodedToken.userId) {
      return NextResponse.json({ message: 'Invalid or expired token.' }, { status: 401 });
    }

    const buyerId = decodedToken.userId;

    const { searchParams } = new URL(req.url);
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit') as string, 10) : undefined;
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset') as string, 10) : undefined;

    const drizzleOrders = await getOrdersByBuyer(buyerId, { limit, offset });

    const clientOrders: ClientOrder[] = drizzleOrders.map(order => ({
      id: order.id,
      orderDate: order.createdAt.toISOString().split('T')[0],
      totalAmount: parseFloat(order.totalAmount),
      status: (order.status.charAt(0).toUpperCase() + order.status.slice(1)) as ClientOrder['status'],
      items: order.orderItems.map(item => ({
        productId: item.productId || 'unknown',
        name: item.product?.name || 'Unknown Product',
        imageUrl: item.product?.imageUrl || 'https://placehold.co/64x64/E0E0E0/808080?text=Item',
        price: parseFloat(item.priceAtPurchase),
        quantity: item.quantity,
      })),
    }));

    return NextResponse.json(clientOrders, { status: 200 });

  } catch (error: any) {
    console.error("API Error fetching orders:", error);
    return NextResponse.json({ message: 'Failed to fetch orders.', error: error.message }, { status: 500 });
  }
}