'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ProductSearch from '@/components/pos/ProductSearch';
import Cart from '@/components/pos/Cart';
import PaymentModal from '@/components/pos/PaymentModal';
import CustomerSelect from '@/components/pos/CustomerSelect';
import RefundModal from '@/components/pos/RefundModal';
import ReceiptPreview from '@/components/pos/ReceiptPreview';
import BarcodeScanner from '@/components/BarcodeScanner';
import { useHotkeys } from '@/hooks/useHotkeys';
import type { CartItem } from '@/lib/cartUtils';
import { calcSubtotal, calcTax, calcTotal } from '@/lib/cartUtils';

interface Customer { _id: string; name: string; }

export default function PosPage() {
  const t = useTranslations('pos');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discountTotal, setDiscountTotal] = useState(0);
  const [taxPercent, setTaxPercent] = useState(11);
  const [showPayment, setShowPayment] = useState(false);
  const [showRefund, setShowRefund] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastTransaction, setLastTransaction] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [barcodeMode, setBarcodeMode] = useState<'hardware' | 'camera'>('hardware'); // nanti dari settings

  const subtotal = calcSubtotal(cart);
  const taxAmount = calcTax(subtotal - discountTotal, taxPercent);
  const total = calcTotal(subtotal, discountTotal, taxAmount);

  useHotkeys({
    'F2': () => document.querySelector<HTMLInputElement>('#product-search')?.focus(),
    'F4': () => { if (cart.length > 0) setShowPayment(true); },
  });

  const addToCart = (product: any) => {
    const existing = cart.find(i => i._id === product._id);
    if (existing) {
      if (existing.qty >= product.stock) return alert('Stok tidak mencukupi');
      setCart(cart.map(i => i._id === product._id ? { ...i, qty: i.qty + 1 } : i));
    } else {
      setCart([...cart, { _id: product._id, name: product.name, price: product.sellingPrice, qty: 1, discount: 0, stock: product.stock, barcode: product.barcode }]);
    }
  };

  const handleBarcodeScan = async (barcode: string) => {
    const res = await fetch(`/api/products?barcode=${encodeURIComponent(barcode)}`);
    const data = await res.json();
    if (data?.[0]) addToCart(data[0]);
  };

  const updateItem = (id: string, field: string, value: number) => {
    setCart(cart.map(i => i._id === id ? { ...i, [field]: value < 0 ? 0 : value } : i));
  };

  const removeItem = (id: string) => setCart(cart.filter(i => i._id !== id));
  const clearCart = () => { setCart([]); setDiscountTotal(0); setCustomer(null); };

  const handlePayment = async (payments: any[]) => {
    setLoading(true);
    const body = {
      items: cart.map(i => ({ product: i._id, qty: i.qty, price: i.price, discount: i.discount })),
      discountTotal,
      taxPercent,
      taxAmount,
      total,
      payments,
      customerId: customer?._id || null,
    };
    const res = await fetch('/api/transactions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      setLastTransaction({ ...body, _id: data._id });
      setShowPayment(false);
      setShowReceipt(true);
      clearCart();
    } else {
      alert(data.error || 'Gagal memproses transaksi');
    }
  };

  const handleRefund = async (reason: string) => {
    setLoading(true);
    const body = {
      items: cart.map(i => ({ product: i._id, qty: i.qty, price: i.price, discount: 0 })),
      discountTotal: 0,
      taxPercent: 0,
      taxAmount: 0,
      total: 0, // refund, customer tidak bayar
      payments: [{ method: 'cash', amount: 0 }],
      isRefund: true,
      refundReason: reason,
    };
    const res = await fetch('/api/transactions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    setLoading(false);
    if (res.ok) {
      setShowRefund(false);
      clearCart();
      alert('Retur berhasil diproses');
    } else {
      const data = await res.json();
      alert(data.error || 'Gagal retur');
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-full">
      {/* Kolom kiri - produk */}
      <div className="flex-1 p-4 overflow-auto">
        <h1 className="text-xl font-bold mb-3">{t('title')}</h1>

        {/* Barcode mode: hardware (auto-fokus input) atau kamera */}
        {barcodeMode === 'hardware' ? (
          <input
            id="product-search-hardware"
            type="text"
            className="w-full p-3 border rounded-lg mb-3 dark:bg-gray-800"
            placeholder="Scan barcode hardware... (auto-enter)"
            onKeyDown={e => { if (e.key === 'Enter') { handleBarcodeScan(e.currentTarget.value); e.currentTarget.value = ''; } }}
          />
        ) : (
          <BarcodeScanner enabled={barcodeMode === 'camera'} onScan={handleBarcodeScan} />
        )}

        <ProductSearch onSelect={addToCart} />

        {/* Diskon total & Pajak */}
        <div className="mt-3 flex gap-3 text-sm">
          <div>
            <label className="block text-xs mb-1">{t('discount')} Total (Rp)</label>
            <input type="number" value={discountTotal || ''} onChange={e => setDiscountTotal(Number(e.target.value) || 0)}
              className="w-28 p-2 border rounded dark:bg-gray-800" />
          </div>
          <div>
            <label className="block text-xs mb-1">{t('tax')} (%)</label>
            <input type="number" value={taxPercent || ''} onChange={e => setTaxPercent(Number(e.target.value) || 0)}
              className="w-20 p-2 border rounded dark:bg-gray-800" />
          </div>
          <div className="flex items-end pb-2">
            <CustomerSelect selected={customer} onSelect={setCustomer} />
          </div>
        </div>
      </div>

      {/* Kolom kanan - keranjang */}
      <Cart items={cart} discountTotal={discountTotal} taxPercent={taxPercent}
        onUpdateItem={updateItem} onRemoveItem={removeItem} onClearCart={clearCart}
        onOpenPayment={() => setShowPayment(true)} onOpenRefund={() => setShowRefund(true)} />

      {/* Modals */}
      <PaymentModal isOpen={showPayment} total={total} onClose={() => setShowPayment(false)} onConfirm={handlePayment} loading={loading} />
      <RefundModal isOpen={showRefund} onClose={() => setShowRefund(false)} onSubmit={handleRefund} />
      {showReceipt && lastTransaction && <ReceiptPreview data={lastTransaction} onClose={() => setShowReceipt(false)} />}
    </div>
  );
}
