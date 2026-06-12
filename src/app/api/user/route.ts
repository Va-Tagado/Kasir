import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';

export async function GET() {
  await dbConnect();
  const session = await getSession();
  if (!session) return NextResponse.json(null, { status: 401 });

  const user = await User.findById(session.userId).select('-password');
  return NextResponse.json(user);
}
