'use client';
import { FiTrash2, FiPlus, FiMinus } from 'react-icons/fi';
import type { CartItem as CartItemType } from '@/lib/cartUtils';

export default function CartItem({ item, onUpdate, onRemove }: {
  item: CartItemType;
  onUpdate: (id: string, field: string, value: number) => void;
  onRemove: (id: string) => void;
}) {
  const subtotal = item.price * item.qty - item.discount;

  return (
    <div className="flex items-center gap-2 py-2 border-b dark:border-gray-700 text-sm">
      <div className="flex-1">
        <p className="font-medium truncate max-w-[140px]">{item.name}</p>
        <p className="text-xs text-gray-500">Rp {item.price.toLocaleString()}</p>
        {item.discount > 0 && <p className="text-xs text-red-400">Diskon: -Rp {item.discount.toLocaleString()}</p>}
      </div>
      <div className="flex items-center gap-1">
        <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded" onClick={() => onUpdate(item._id, 'qty', item.qty - 1)} disabled={item.qty <= 1}>
          <FiMinus size={12} />
        </button>
        <span className="w-6 text-center">{item.qty}</span>
        <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded" onClick={() => onUpdate(item._id, 'qty', item.qty + 1)} disabled={item.qty >= item.stock}>
          <FiPlus size={12} />
        </button>
      </div>
      <div className="w-20 text-right font-semibold">Rp {subtotal.toLocaleString()}</div>
      <button className="p-1 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded" onClick={() => onRemove(item._id)}>
        <FiTrash2 size={14} />
      </button>
    </div>
  );
}
