import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/lib/models/Product';

export async function GET(req: Request) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') || '';
  const barcode = searchParams.get('barcode') || '';
  const sort = searchParams.get('sort') || 'name';

  let filter: any = {};
  if (barcode) filter.barcode = barcode;
  else if (q) {
    filter.$or = [
      { name: { $regex: q, $options: 'i' } },
      { barcode: { $regex: q, $options: 'i' } },
      { sku: { $regex: q, $options: 'i' } },
    ];
  }

  const products = await Product.find(filter).populate('supplier').sort({ [sort]: 1 });
  return NextResponse.json(products);
}

export async function POST(req: Request) {
  await dbConnect();
  const body = await req.json();
  try {
    const product = await Product.create(body);
    return NextResponse.json(product, { status: 201 });
  } catch (err: any) {
    if (err.code === 11000) return NextResponse.json({ error: 'Barcode sudah ada' }, { status: 409 });
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
