import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key';

interface DecodedToken {
  userId: string;
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