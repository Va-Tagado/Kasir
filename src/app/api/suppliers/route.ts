import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Supplier from '@/lib/models/Supplier';

export async function GET() {
  await dbConnect();
  const suppliers = await Supplier.find().sort({ name: 1 });
  return NextResponse.json(suppliers);
}

export async function POST(req: Request) {
  await dbConnect();
  const body = await req.json();
  const supplier = await Supplier.create(body);
  return NextResponse.json(supplier, { status: 201 });
}
