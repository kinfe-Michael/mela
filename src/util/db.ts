import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg'; // Import the Pool from 'pg'
import * as schema from '../db/schema'; // Assuming you have your Drizzle schema defined here

// Load environment variables (e.g., from a .env file)
import 'dotenv/config';

// Create a new Pool instance for connection pooling
const pool = new Pool({
    connectionString: process.env.DATABASE_URL, // Your PostgreSQL connection string
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false, // Adjust SSL for production
});

// Initialize Drizzle ORM with the pool
export const db = drizzle(pool, { schema });

// Optional: Graceful shutdown of the pool
process.on('beforeExit', async () => {
    await pool.end();
    console.log('Database pool closed.');
});