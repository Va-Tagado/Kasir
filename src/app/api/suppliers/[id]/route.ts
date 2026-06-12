import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Supplier from '@/lib/models/Supplier';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  const body = await req.json();
  const supplier = await Supplier.findByIdAndUpdate(params.id, body, { new: true });
  if (!supplier) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(supplier);
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  await Supplier.findByIdAndDelete(params.id);
  return NextResponse.json({ success: true });
}
