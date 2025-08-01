import { and, eq, ilike, InferInsertModel, not, or } from 'drizzle-orm';
import { products, users, } from '../db/schema';
import { db } from './db';
import { hashPassword } from './passwordHash';


interface PaginationOptions {
  limit?: number; 
  offset?: number; 
}

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
export async function getUserPhoneNumber(phoneNumber: number) {
  return db.query.users.findFirst({
    where: eq(users.phoneNumber, phoneNumber),
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


interface AddProductParams {
  name: string;
  description: string | null;
  price: string; 
  quantity: number;
  category: string; 
  imageUrl: string | null;
  sellerId: string;
}

export async function addProduct(params: AddProductParams) {
  try {
    const [newProduct] = await db.insert(products).values({
      name: params.name,
      description: params.description,
      price: params.price,
      quantity: params.quantity,
      category: params.category as any, 
      imageUrl: params.imageUrl,
      sellerId: params.sellerId,
    }).returning(); 

    return { success: true, product: newProduct };
  } catch (error: any) {
    console.error('Error adding product to DB:', error);
    return { success: false, error: error.message || 'Database error occurred.' };
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

export async function getProductsBySeller(sellerId: string, options?: PaginationOptions) {
  return db.query.products.findMany({
    where: eq(products.sellerId, sellerId),
    with: { 
      seller: true,
    },
    limit: options?.limit,
    offset: options?.offset,
  });
}

interface PaginationOptions {
  limit?: number; 
  offset?: number; 
}

export async function getAllProducts(options?: PaginationOptions) {
  return db.query.products.findMany({
    with: {
      seller: true, 
    },
    limit: options?.limit,   
    offset: options?.offset, 
  });
}



export async function deleteProduct(productId: string) {

  try {
    const [deletedProduct] = await db.delete(products).where(eq(products.id,productId )).returning();
    return deletedProduct;
  } catch (error) {
   
    throw error;
  }
}

export async function searchProducts(searchTerm: string, options?: PaginationOptions) {
  if (!searchTerm) {
    return [];
  }
  return db.query.products.findMany({
    where: or(
      ilike(products.name, `%${searchTerm}%`),
      ilike(products.description, `%${searchTerm}%`)
    ),
   
    limit: options?.limit,
    offset: options?.offset,
  });
}

export async function getProductsByCategory(category: string, currentProductId?: string, options?: PaginationOptions) {
  let whereClause: any = eq(products.category, category as any); // Initial condition for category

  if (currentProductId) {

    whereClause = and(
      eq(products.category, category as any),
      not(eq(products.id, currentProductId))
    );
  }

  return db.query.products.findMany({
    where: whereClause,
   
    limit: options?.limit,
    offset: options?.offset,
  });
}

export async function updateProduct(productId: string, updates: Partial<Omit<InferInsertModel<typeof products>, 'id' | 'createdAt' | 'updatedAt'>>) {
  try {
    const [updatedProduct] = await db.update(products)
      .set(updates)
      .where(eq(products.id, productId))
      .returning();
    return updatedProduct;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error; 
  }
}