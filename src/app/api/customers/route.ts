import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Customer from '@/lib/models/Customer';

export async function GET() {
  await dbConnect();
  const customers = await Customer.find().sort({ name: 1 });
  return NextResponse.json(customers);
}
