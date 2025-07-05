import { NextResponse } from "next/server";
import {cookies} from 'next/headers';
import jwt from 'jsonwebtoken';
import { getUserPhoneNumber } from "@/util/dbUtil";
import { verifyPassword } from "@/util/passwordHash";
 export async function POST(req:Request){
    const {phoneNumber,password} = await req.json();
    const phoneStripedOfCode = parseInt(phoneNumber,10)

    const user = await getUserPhoneNumber(phoneStripedOfCode)
    if (!user || !await verifyPassword(password, user.passwordHash)) {
    return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
  }
  const secret = process.env.JWT_SECRET || 'your_super_secret_key_please_change_this_in_production';
  const token = jwt.sign({ userId: user.id, userName: user.userName }, secret, { expiresIn: '1h' });
    const response = NextResponse.json({ message: 'Logged in successfully' });
  response.cookies.set('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60,
    path: '/',
  });

  return response;
}