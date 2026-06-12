import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Customer from '@/lib/models/Customer';

export async function GET() {
  await dbConnect();
  const customers = await Customer.find().sort({ name: 1 });
  return NextResponse.json(customers);
}

export async function POST(req: Request) {
  await dbConnect();
  const body = await req.json();
  const customer = await Customer.create(body);
  return NextResponse.json(customer, { status: 201 });
}
