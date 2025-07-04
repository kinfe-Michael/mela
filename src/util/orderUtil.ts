import { db } from './db'; // Assuming your Drizzle client is exported from here
import { users, products, orders, orderItems, orderStatusEnum } from '../db/schema';
import { eq, and } from 'drizzle-orm';
import { hashPassword } from './passwordHash';





export async function createOrder(buyerId: string, items: { productId: string; quantity: number }[]) {
  return db.transaction(async (tx) => {
    let totalAmount = 0;
    // We'll store the necessary data for order items after fetching product details
    // to avoid re-fetching the product just for priceAtPurchase later.
    const collectedOrderItemsData: {
      productId: string;
      quantity: number;
      priceAtPurchase: string; // Store as string to match schema numeric type
    }[] = [];

    for (const item of items) {
      const product = await tx.query.products.findFirst({
        where: eq(products.id, item.productId),
      });

      if (!product) {
        throw new Error(`Product with ID ${item.productId} not found.`);
      }
      if (product.quantity < item.quantity) {
        throw new Error(`Not enough stock for product ${product.name}. Available: ${product.quantity}, Requested: ${item.quantity}`);
      }

      const priceAtPurchase = parseFloat(product.price);
      totalAmount += priceAtPurchase * item.quantity;

      // Collect data needed for order items insertion
      collectedOrderItemsData.push({
        productId: item.productId,
        quantity: item.quantity,
        priceAtPurchase: priceAtPurchase.toString(), // Store as string for numeric type
      });

      // Decrease product quantity within the same transaction
      await tx.update(products)
        .set({ quantity: product.quantity - item.quantity })
        .where(eq(products.id, product.id));
    }

    // Insert the new order first to get its ID
    const [newOrder] = await tx.insert(orders).values({
      buyerId: buyerId,
      totalAmount: totalAmount.toString(), // Store as string for numeric type
      status: 'pending',
    }).returning();

    if (!newOrder) {
      // This case should ideally not happen if insertion is successful
      throw new Error("Failed to create order.");
    }

    // Prepare the final order items data with the obtained orderId
    const finalOrderItemsToInsert = collectedOrderItemsData.map(itemData => ({
      ...itemData,
      orderId: newOrder.id,
    }));

    // Insert all order items
    await tx.insert(orderItems).values(finalOrderItemsToInsert);

    return newOrder;
  });
}

export async function getOrderById(orderId: string) {
  return db.query.orders.findFirst({
    where: eq(orders.id, orderId),
    with: {
      buyer: true,
      orderItems: {
        with: {
          product: true, // Assuming you add this relation to orderItemRelations
        },
      },
    },
  });
}

export async function getOrdersByBuyer(buyerId: string) {
  return db.query.orders.findMany({
    where: eq(orders.buyerId, buyerId),
    with: {
      orderItems: {
        with: {
          product: true,
        },
      },
    },
  });
}


export async function updateOrderStatus(
  orderId: string,
  // This is the correct way to get the union type from your pgEnum definition
  newStatus: typeof orderStatusEnum['enumValues'][number]
) {
  try {
    const [updatedOrder] = await db.update(orders).set({ status: newStatus }).where(eq(orders.id, orderId)).returning();
    return updatedOrder;
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
}

export async function cancelOrder(orderId: string) {
  return db.transaction(async (tx) => {
    const orderToCancel = await tx.query.orders.findFirst({
      where: eq(orders.id, orderId),
      with: {
        orderItems: true,
      },
    });

    if (!orderToCancel) {
      throw new Error(`Order with ID ${orderId} not found.`);
    }
    if (orderToCancel.status === 'cancelled') {
      throw new Error(`Order ${orderId} is already cancelled.`);
    }
    if (orderToCancel.status === 'completed' || orderToCancel.status === 'shipped') {
        throw new Error(`Order ${orderId} cannot be cancelled as it is already ${orderToCancel.status}.`);
    }

    // Revert product quantities
    for (const item of orderToCancel.orderItems) {
      if (item.productId) { // Check if product ID is not null (due to onDelete: 'set null')
        await tx.update(products)
          .set({ quantity: (products.quantity as any) + item.quantity }) // Drizzle might need type casting for arithmetic operations
          .where(eq(products.id, item.productId));
      }
    }

    const [cancelledOrder] = await tx.update(orders)
      .set({ status: 'cancelled' })
      .where(eq(orders.id, orderId))
      .returning();

    return cancelledOrder;
  });
}