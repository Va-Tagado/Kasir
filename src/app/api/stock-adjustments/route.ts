import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import StockAdjustment from '@/lib/models/StockAdjustment';
import Product from '@/lib/models/Product';
import { getSession } from '@/lib/auth';

export async function GET() {
  await dbConnect();
  const adjustments = await StockAdjustment.find().populate('product user').sort({ createdAt: -1 });
  return NextResponse.json(adjustments);
}

export async function POST(req: Request) {
  await dbConnect();
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { productId, newStock, reason } = body;

  const product = await Product.findById(productId);
  if (!product) return NextResponse.json({ error: 'Produk tidak ditemukan' }, { status: 400 });

  const prevStock = product.stock;
  product.stock = newStock;
  await product.save();

  const adjustment = await StockAdjustment.create({
    product: productId,
    previousStock: prevStock,
    newStock,
    reason,
    user: session.userId,
  });

  return NextResponse.json(adjustment, { status: 201 });
}
