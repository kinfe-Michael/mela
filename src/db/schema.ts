import { pgTable,uuid,varchar,text,numeric,integer,timestamp,pgEnum } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"

export const orderStatusEnum = pgEnum('order_status',['pending','completed', 'shipped', 'cancelled'])

export const users = pgTable('users',{
    id:uuid('id').primaryKey().defaultRandom(),
    userName:varchar('user_name',{length:256}).notNull().unique(),
    phoneNumber:integer('phone_number').notNull().unique(),
    passwordHash: varchar('password_hash',{length:256}).notNull(),
    createdAt:timestamp('created_at').notNull().defaultNow(),
    updatedAt:timestamp('updated_at').notNull().$onUpdateFn(()=>new Date()),
})
export const products = pgTable('products',{
    id:uuid('id').primaryKey().defaultRandom(),
    sellerId: uuid('seller_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    name:varchar('name',{length:256}).notNull(),
    description:text('description'),
    price:numeric('price',{precision:10,scale:2}).notNull(),
    quantity:integer('quantity').notNull().default(0),
    imageUrl:varchar('image_url',{length:512}),
      createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdateFn(() => new Date()),
})

export const orders = pgTable('orders',{
    id:uuid('id').primaryKey().defaultRandom(),
    buyerId:uuid('buyer_id').notNull().references(()=>users.id,{onDelete:'cascade'}),
    totalAmount:numeric('total_amount',{precision:10,scale:2}).notNull(),
    status:orderStatusEnum('status').notNull().default('pending'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdateFn(() => new Date()),
})

export const orderItems = pgTable('order_items',{
    orderId:uuid('order_id').notNull().references(()=> orders.id,{onDelete:'cascade'}),
    productId:uuid('product_id').references(()=> products.id,{onDelete:'set null'}),
    quantity:integer('quantity').notNull().default(1),
    priceAtPurchase:numeric('price_at_purchase',{precision:10,scale:2}).notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdateFn(() => new Date()),
})

export const userRelations = relations(users,({many})=>({
    products:many(products),
    orders:many(orders)
}))

export const productRelations = relations(products,({one,many})=>({
    seller: one(users,{
        fields:[products.sellerId],
        references:[users.id]
    }),
    orderItems:many(orderItems),
}))

export const orderRelations = relations(orders,({one,many})=>({
    buyer:one(users,{
        fields:[orders.buyerId],
        references:[users.id]
    }),
    orderItems:many(orderItems)
}))

export const orderItemRelations = relations(orderItems,({one})=>({
    order:one(orders,{
        fields:[orderItems.orderId],
        references:[orders.id]
    }),
      product: one(products, { // This is the new part
        fields: [orderItems.productId],
        references: [products.id]
    })
}))