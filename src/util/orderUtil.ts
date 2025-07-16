import { db } from './db'; // Assuming your Drizzle client is exported from here
import {  products, orders, orderItems, orderStatusEnum,reviews } from '../db/schema';
import { eq, and, InferSelectModel, sql, InferInsertModel, or } from 'drizzle-orm';

interface PaginationOptions {
  limit?: number;
  offset?: number;
}



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



export async function getOrdersByBuyer(buyerId: string, options?: PaginationOptions) {
  return db.query.orders.findMany({
    where: eq(orders.buyerId, buyerId),
    with: {
      orderItems: {
        with: {
          product: true, // Assuming you've added the product relation to orderItemRelations
        },
      },
    },
    limit: options?.limit,
    offset: options?.offset,
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

interface SellerOrderedProduct {
  product: InferSelectModel<typeof products>;
  totalOrderedQuantity: number;
}

export async function getSellerOrderedProducts(sellerId: string, options?: PaginationOptions): Promise<SellerOrderedProduct[]> {
  try {
    const orderedProducts = await db
      .select({
        product: products,
        totalOrderedQuantity: sql<number>`sum(${orderItems.quantity})`.as('totalOrderedQuantity'),
      })
      .from(products)
      .innerJoin(orderItems, eq(products.id, orderItems.productId))
      .innerJoin(orders, eq(orderItems.orderId, orders.id))
      .where(
        eq(products.sellerId, sellerId),
      )
      .groupBy(products.id)
      // .limit(options?.limit)
      // .offset(options?.offset);
      console.log("orderedProducts")
      console.log("orderedProducts")
      console.log("orderedProducts")
      console.log(orderedProducts)
      console.log(orderedProducts)
      console.log(orderedProducts)
      console.log("orderedProducts")
      console.log("orderedProducts")
      console.log("orderedProducts")
    return orderedProducts;
  } catch (error) {
    console.error("Error fetching seller's ordered products:", error);
    throw error;
  }
}

// ===========================================
// NEW: Functions for Reviews and Ratings
// ===========================================

export async function addProductReview(
  reviewData: Omit<InferInsertModel<typeof reviews>, 'id' | 'createdAt'>
) {
  try {
    const [newReview] = await db.insert(reviews).values(reviewData).returning();
    return newReview;
  } catch (error) {
    console.error("Error adding product review:", error);
    throw error;
  }
}

export async function getReviewsByProductId(productId: string, options?: PaginationOptions) {
  return db.query.reviews.findMany({
    where: eq(reviews.productId, productId),
    with: {
      user: {
        columns: {
          id: true,
          userName: true,
        },
      },
    },
    limit: options?.limit,
    offset: options?.offset,
    orderBy: (reviews, { desc }) => [desc(reviews.createdAt)],
  });
}

export async function getAverageRatingForProduct(productId: string) {
  // console.log statements are for debugging and can be removed in production
  console.log("productId from getAverageRatingForProduct:", productId);

  try {
    const result = await db
      .select({
        // The AVG function will likely return a string for numeric types in Drizzle
        averageRating: sql<string>`avg(${reviews.rating})`.as('averageRating'),
      })
      .from(reviews)
      .where(eq(reviews.productId, productId));

    const avgRatingString = result[0]?.averageRating;

    // Parse the string to a floating-point number
    if (avgRatingString !== undefined && avgRatingString !== null) {
      const parsedRating = parseFloat(avgRatingString);
      // Ensure it's a valid number, otherwise return 0
      return isNaN(parsedRating) ? 0 : parsedRating;
    }

    return 0; // Return 0 if no reviews or averageRating is null/undefined
  } catch (error) {
    console.error("Error calculating average rating:", error);
    return 0; // Return 0 or handle error appropriately
  }
}