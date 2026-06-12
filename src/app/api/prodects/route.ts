import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/lib/models/Product';

export async function GET(req: Request) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') || '';
  const barcode = searchParams.get('barcode') || '';

  let filter: any = {};
  if (barcode) {
    filter.barcode = barcode;
  } else if (q) {
    filter.$or = [
      { name: { $regex: q, $options: 'i' } },
      { barcode: { $regex: q, $options: 'i' } },
      { sku: { $regex: q, $options: 'i' } },
    ];
  }

  const products = await Product.find(filter).limit(50).populate('supplier');
  return NextResponse.json(products);
}
