// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const protectedPaths = ['/user', '/orders']; // Define your protected paths

  const isProtectedPath = protectedPaths.some(path =>
    request.nextUrl.pathname.startsWith(path)
  );

  // If it's a protected path and no token is present, redirect to login
  if (isProtectedPath && !token) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  if (token) {
    try {
      const secret = process.env.JWT_SECRET || 'your_super_secret_key_please_change_this_in_production';
      const decoded = jwt.verify(token, secret);
      // You can attach decoded user info to the request for Server Components to use
      // Note: Directly modifying `request` in Middleware for propagation is tricky.
      // For Server Components, it's often better to fetch user from cookie again in the component
      // or use a context/session provider (like with Auth.js) if managing state more globally.
      // For simple JWTs, you might just rely on the redirect if not authenticated.
    } catch (error) {
      console.error('JWT verification failed:', error);
      // If token is invalid/expired, redirect to login and clear invalid cookie
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('auth_token');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|login|register).*)', // Apply middleware to all paths except these
  ],
};