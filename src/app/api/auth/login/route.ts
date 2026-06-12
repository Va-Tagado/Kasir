import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';
import { signToken } from '@/lib/auth';

export async function POST(req: Request) {
  await dbConnect();
  const { username, password } = await req.json();

  if (!username || !password) {
    return NextResponse.json({ error: 'All fields required' }, { status: 400 });
  }

  const user = await User.findOne({ username });
  if (!user) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const token = signToken({ userId: user._id.toString(), role: user.role });
  const response = NextResponse.json({ success: true, user: { id: user._id, name: user.name, role: user.role } });
  response.cookies.set('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 7 * 24 * 60 * 60 });
  return response;
}
