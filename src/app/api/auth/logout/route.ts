import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';


export async function POST() {
  const cookieStore = await cookies();
  cookieStore.set('auth_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', 
    sameSite: 'strict',
    maxAge: 0, 
    path: '/', 
  });

  return NextResponse.json({ message: 'Logged out successfully' }, { status: 200 });
}
