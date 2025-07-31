import { getUserPhoneNumber } from "@/util/dbUtil";
import { verifyPassword } from "@/util/passwordHash";
import jwt from 'jsonwebtoken';
import { NextResponse } from "next/server";
 export async function POST(req:Request){
    const {phoneNumber,password} = await req.json();
    const phoneStripedOfCode = parseInt(phoneNumber,10)

    const user = await getUserPhoneNumber(phoneStripedOfCode)
    if (!user || !await verifyPassword(password, user.passwordHash)) {
    return NextResponse.json({isLogeIn:false,user:null, message: 'Invalid credentials' }, { status: 401 });
  }
  const secret = process.env.JWT_SECRET || 'your_super_secret_key_please_change_this_in_production';
  const token = jwt.sign({ userId: user.id, username: user.userName }, secret, { expiresIn: '1h' });
    const response = NextResponse.json({isLoggedIn: true, user: {userId:user.id,username:user.userName}, message: 'Logged in successfully' });
  response.cookies.set('auth_token', token, {
    httpOnly: true,
    secure: false,
    sameSite: 'strict',
    maxAge: 60 * 60,
    path: '/',
  });

  return response;
}