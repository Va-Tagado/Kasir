import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';

export async function POST(req: Request) {
  await dbConnect();
  const { username, password, name } = await req.json();
  if (!username || !password || !name) {
    return NextResponse.json({ error: 'All fields required' }, { status: 400 });
  }

  const exists = await User.findOne({ username });
  if (exists) return NextResponse.json({ error: 'Username exists' }, { status: 409 });

  const hash = await bcrypt.hash(password, 12);
  const user = await User.create({ username, password: hash, name, role: 'admin' });
  return NextResponse.json({ id: user._id, name: user.name }, { status: 201 });
}
