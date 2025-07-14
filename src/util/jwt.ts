// utils/jwt.ts (create this file if you don't have one)
import jwt from 'jsonwebtoken';

// Make sure your JWT secret is securely loaded from environment variables
// For production, never hardcode this.
const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key'; // CHANGE THIS IN PRODUCTION!

interface DecodedToken {
  userId: string;
  // Add other properties you might have in your JWT payload
  iat: number;
  exp: number;
}

export function verifyJwt(token: string): DecodedToken | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
    return decoded;
  } catch (error) {
    console.error("JWT verification failed:", error);
    return null;
  }
}