'use client';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { FiX, FiPlus, FiTrash2 } from 'react-icons/fi';

interface Payment {
  method: 'cash' | 'qris' | 'card' | 'transfer';
  amount: number;
}

interface Props {
  isOpen: boolean;
  total: number;
  onClose: () => void;
  onConfirm: (payments: Payment[]) => void;
  loading?: boolean;
}

const methodLabels: Record<string, string> = {
  cash: 'Tunai', qris: 'QRIS', card: 'Kartu', transfer: 'Transfer',
};

export default function PaymentModal({ isOpen, total, onClose, onConfirm, loading }: Props) {
  const t = useTranslations('pos');
  const [payments, setPayments] = useState<Payment[]>([{ method: 'cash', amount: total }]);

  useEffect(() => {
    setPayments([{ method: 'cash', amount: total }]);
  }, [total, isOpen]);

  const remaining = total - payments.reduce((s, p) => s + p.amount, 0);
  const isLunas = remaining <= 0;
  const change = isLunas ? -remaining : 0;

  const addPayment = () => {
    if (remaining <= 0) return;
    setPayments([...payments, { method: 'cash', amount: remaining }]);
  };

  const updatePayment = (index: number, field: string, value: any) => {
    const updated = [...payments];
    (updated[index] as any)[field] = field === 'amount' ? Number(value) : value;
    setPayments(updated);
  };

  const removePayment = (index: number) => {
    if (payments.length <= 1) return;
    setPayments(payments.filter((_, i) => i !== index));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <h3 className="text-lg font-bold">{t('paymentMethod')}</h3>
          <button onClick={onClose}><FiX size={20} /></button>
        </div>

        <div className="p-4 space-y-3">
          <div className="flex justify-between text-lg font-bold">
            <span>{t('total')}</span>
            <span>Rp {total.toLocaleString()}</span>
          </div>

          {payments.map((p, i) => (
            <div key={i} className="flex gap-2 items-center">
              <select value={p.method} onChange={e => updatePayment(i, 'method', e.target.value)}
                className="p-2 border rounded dark:bg-gray-800 text-sm">
                {Object.entries(methodLabels).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
              <input type="number" value={p.amount || ''} onChange={e => updatePayment(i, 'amount', e.target.value)}
                className="flex-1 p-2 border rounded dark:bg-gray-800 text-sm" placeholder="Nominal" />
              {payments.length > 1 && (
                <button onClick={() => removePayment(i)} className="text-red-400"><FiTrash2 /></button>
              )}
            </div>
          ))}

          {!isLunas && (
            <button onClick={addPayment} className="flex items-center gap-1 text-indigo-600 text-sm">
              <FiPlus /> {t('addPayment')}
            </button>
          )}

          <div className="flex justify-between text-sm">
            <span>{t('splitRemaining')}</span>
            <span className={remaining > 0 ? 'text-red-500' : 'text-green-500'}>
              Rp {remaining > 0 ? remaining.toLocaleString() : `0`}
            </span>
          </div>
          {change > 0 && (
            <div className="flex justify-between text-sm font-semibold text-green-600">
              <span>{t('change')}</span>
              <span>Rp {change.toLocaleString()}</span>
            </div>
          )}
        </div>

        <div className="p-4 border-t dark:border-gray-700">
          <button disabled={!isLunas || loading} onClick={() => onConfirm(payments)}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? 'Memproses...' : `${t('pay')} - Rp ${total.toLocaleString()}`}
          </button>
        </div>
      </div>
    </div>
  );
}
