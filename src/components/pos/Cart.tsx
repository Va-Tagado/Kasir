'use client';
import { useTranslations } from 'next-intl';
import CartItem from './CartItem';
import type { CartItem as CartItemType } from '@/lib/cartUtils';
import { calcSubtotal, calcTax, calcTotal } from '@/lib/cartUtils';
import { FiTrash2 } from 'react-icons/fi';

interface Props {
  items: CartItemType[];
  discountTotal: number;
  taxPercent: number;
  onUpdateItem: (id: string, field: string, value: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onOpenPayment: () => void;
  onOpenRefund: () => void;
}

export default function Cart({ items, discountTotal, taxPercent, onUpdateItem, onRemoveItem, onClearCart, onOpenPayment, onOpenRefund }: Props) {
  const t = useTranslations('pos');
  const subtotal = calcSubtotal(items);
  const taxAmount = calcTax(subtotal - discountTotal, taxPercent);
  const total = calcTotal(subtotal, discountTotal, taxAmount);

  if (items.length === 0) {
    return (
      <div className="w-full lg:w-96 bg-gray-50 dark:bg-gray-900 border-l p-4 flex flex-col items-center justify-center text-gray-400">
        <p>{t('emptyCart')}</p>
      </div>
    );
  }

  return (
    <div className="w-full lg:w-96 bg-gray-50 dark:bg-gray-900 border-l flex flex-col">
      <div className="flex items-center justify-between p-3 border-b dark:border-gray-700">
        <h3 className="font-semibold">Keranjang ({items.length})</h3>
        <button onClick={onClearCart} className="text-red-400 hover:text-red-600 text-sm flex items-center gap-1">
          <FiTrash2 size={14} /> {t('clearCart')}
        </button>
      </div>

      <div className="flex-1 overflow-auto p-3 space-y-1">
        {items.map(item => (
          <CartItem key={item._id} item={item} onUpdate={onUpdateItem} onRemove={onRemoveItem} />
        ))}
      </div>

      <div className="p-3 border-t dark:border-gray-700 space-y-1 text-sm">
        <div className="flex justify-between"><span>{t('subtotal')}</span><span>Rp {subtotal.toLocaleString()}</span></div>
        <div className="flex justify-between text-red-500"><span>{t('discount')}</span><span>-Rp {discountTotal.toLocaleString()}</span></div>
        <div className="flex justify-between"><span>{t('tax')} ({taxPercent}%)</span><span>Rp {taxAmount.toLocaleString()}</span></div>
        <div className="flex justify-between font-bold text-lg border-t pt-1"><span>{t('total')}</span><span>Rp {total.toLocaleString()}</span></div>
      </div>

      <div className="p-3 flex gap-2">
        <button onClick={onOpenPayment} className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
          {t('pay')}
        </button>
        <button onClick={onOpenRefund} className="px-4 py-3 border border-red-300 text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20">
          {t('refund')}
        </button>
      </div>
    </div>
  );
}
