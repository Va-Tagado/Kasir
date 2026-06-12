import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Transaction from '@/lib/models/Transaction';
import Product from '@/lib/models/Product';
import { getSession } from '@/lib/auth';

export async function POST(req: Request) {
  await dbConnect();
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { items, discountTotal, taxPercent, taxAmount, total, payments, customerId, isRefund, refundReason } = body;

  // Validasi stok
  if (!isRefund) {
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) return NextResponse.json({ error: `Produk tidak ditemukan` }, { status: 400 });
      if (product.stock < item.qty) {
        return NextResponse.json({ error: `Stok ${product.name} tidak mencukupi (tersedia: ${product.stock})` }, { status: 400 });
      }
    }
  }

  // Kurangi stok (atau tambah untuk refund)
  for (const item of items) {
    const qtyChange = isRefund ? item.qty : -item.qty;
    await Product.findByIdAndUpdate(item.product, { $inc: { stock: qtyChange } });
  }

  const transaction = await Transaction.create({
    user: session.userId,
    customer: customerId || null,
    items,
    subtotal: items.reduce((s: number, i: any) => s + i.price * i.qty - i.discount, 0),
    discountTotal,
    taxPercent,
    taxAmount,
    total,
    payments,
    isRefund: isRefund || false,
    refundReason: refundReason || '',
    status: 'completed',
  });

  return NextResponse.json(transaction, { status: 201 });
}
