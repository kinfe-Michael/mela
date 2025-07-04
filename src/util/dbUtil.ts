import { db } from './db'; // Assuming your Drizzle client is exported from here
import { users, products, orders, orderItems, orderStatusEnum } from '../db/schema';
import { eq, and } from 'drizzle-orm';
import { hashPassword } from './passwordHash';

export async function addUser(userData: Omit<typeof users.$inferInsert, 'id' | 'passwordHash' | 'createdAt' | 'updatedAt'> & { passwordPlain: string }) {
  const hashedPassword = await hashPassword(userData.passwordPlain);
  try {
    const [newUser] = await db.insert(users).values({
      userName: userData.userName,
      phoneNumber: userData.phoneNumber,
      passwordHash: hashedPassword,
    }).returning();
    return newUser;
  } catch (error) {
    console.error("Error adding user:", error);
    throw error;
  }
}

export async function getUserById(userId: string) {
  return db.query.users.findFirst({
    where: eq(users.id, userId),
  });
}

export async function getUserByUserName(userName: string) {
  return db.query.users.findFirst({
    where: eq(users.userName, userName),
  });
}

export async function updateUser(userId: string, updates: Partial<Omit<typeof users.$inferInsert, 'id' | 'createdAt' | 'updatedAt'>>) {
  try {
    const [updatedUser] = await db.update(users).set(updates).where(eq(users.id, userId)).returning();
    return updatedUser;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
}

export async function deleteUser(userId: string) {
  try {
    const [deletedUser] = await db.delete(users).where(eq(users.id, userId)).returning();
    return deletedUser;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
}

export async function addProduct(productData: Omit<typeof products.$inferInsert, 'id' | 'createdAt' | 'updatedAt'>) {
  try {
    const [newProduct] = await db.insert(products).values(productData).returning();
    return newProduct;
  } catch (error) {
    console.error("Error adding product:", error);
    throw error;
  }
}

export async function getProductById(productId: string) {
  return db.query.products.findFirst({
    where: eq(products.id, productId),
    with: {
      seller: true,
    },
  });
}

export async function getProductsBySeller(sellerId: string) {
  return db.query.products.findMany({
    where: eq(products.sellerId, sellerId),
  });
}

export async function getAllProducts() {
  return db.query.products.findMany({
    with: {
      seller: true,
    },
  });
}

export async function updateProduct(productId: string, updates: Partial<Omit<typeof products.$inferInsert, 'id' | 'createdAt' | 'updatedAt'>>) {
  try {
    const [updatedProduct] = await db.update(products).set(updates).where(eq(products.id, productId)).returning();
    return updatedProduct;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
}

export async function deleteProduct(productId: string) {
  try {
    const [deletedProduct] = await db.delete(products).where(eq(products.id, productId)).returning();
    return deletedProduct;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
}