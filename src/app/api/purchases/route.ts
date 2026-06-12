import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Purchase from '@/lib/models/Purchase';
import Product from '@/lib/models/Product';
import { getSession } from '@/lib/auth';

export async function GET() {
  await dbConnect();
  const purchases = await Purchase.find().populate('supplier items.product').sort({ createdAt: -1 });
  return NextResponse.json(purchases);
}

export async function POST(req: Request) {
  await dbConnect();
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { supplier, items } = body;

  // Hitung total & tambah stok
  let total = 0;
  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product) return NextResponse.json({ error: 'Produk tidak ditemukan' }, { status: 400 });
    product.stock += item.qty;
    await product.save();
    total += item.qty * item.price;
  }

  const purchase = await Purchase.create({
    supplier,
    items,
    total,
    user: session.userId,
  });

  return NextResponse.json(purchase, { status: 201 });
}
