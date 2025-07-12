import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose'; 

export async function middleware(request: NextRequest) {
  console.log("MIDDLEWARE RUNNING FOR:", request.nextUrl.pathname);

  const token = request.cookies.get('auth_token')?.value;
  const protectedPaths = ['/user/products', '/orders'];

  const isProtectedPath = protectedPaths.some(path =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (isProtectedPath && !token) {
    console.log("No token found for protected path, redirecting to /auth/login");
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  if (token) {
    try {
      const secret = new TextEncoder().encode(
        process.env.JWT_SECRET || 'your_super_secret_key_please_change_this_in_production'
      );

      await jwtVerify(token, secret);
      console.log('Token successfully verified using jose.');

      

    } catch (error) {
      console.error('JWT verification failed (jose):', error);
      const response = NextResponse.redirect(new URL('/auth/login', request.url));
      response.cookies.delete('auth_token');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|auth/login|auth/register).*)',
  ],
};