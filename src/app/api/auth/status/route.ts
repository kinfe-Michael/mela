import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  userId: string;
  username: string;
  exp: number; 
}


export async function GET(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    console.error('JWT_SECRET is not defined in environment variables.');
    return NextResponse.json({ isLoggedIn: false, message: 'Server configuration error.' }, { status: 500 });
  }

  if (!token) {
    return NextResponse.json({ isLoggedIn: false, user: null }, { status: 200 });
  }

  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;

    if (decoded.exp * 1000 < Date.now()) {
      return NextResponse.json({ isLoggedIn: false, user: null, message: 'Token expired' }, { status: 200 });
    }

    return NextResponse.json({
      isLoggedIn: true,
      user: {
        userId: decoded.userId,
        username: decoded.username,
      },
    }, { status: 200 });
  } catch (error) {
    console.error('Failed to verify token in /api/auth/status:', error);
    return NextResponse.json({ isLoggedIn: false, user: null, message: 'Invalid token' }, { status: 200 });
  }
}
