import { NextResponse } from 'next/server';
import { createOrder } from '@/util/orderUtil';
import { verifyJwt } from '@/util/jwt';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const cookieStore =await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ message: 'Authentication token not found.' }, { status: 401 });
    }

    const decodedToken = verifyJwt(token);

    if (!decodedToken || !decodedToken.userId) {
      return NextResponse.json({ message: 'Invalid or expired token.' }, { status: 401 });
    }

    const userId = decodedToken.userId;

    const { items } = await req.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ message: 'No items provided for the order.' }, { status: 400 });
    }

    const orderItems = items.map((item: any) => ({
      productId: item.id,
      quantity: item.quantity,
    }));

    const newOrder = await createOrder(userId, orderItems);

    return NextResponse.json({ message: 'Order placed successfully!', order: newOrder }, { status: 201 });

  } catch (error: any) {
    console.error("Failed to create order:", error);
    if (error.message.includes('Not enough stock')) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
    return NextResponse.json({ message: 'Failed to place order.', error: error.message }, { status: 500 });
  }
}