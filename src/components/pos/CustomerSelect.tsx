'use client';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { FiUser, FiX } from 'react-icons/fi';

interface Customer { _id: string; name: string; phone?: string; }

export default function CustomerSelect({ selected, onSelect }: {
  selected: Customer | null;
  onSelect: (c: Customer | null) => void;
}) {
  const t = useTranslations('pos');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => { fetch('/api/customers').then(r => r.json()).then(setCustomers); }, []);

  return (
    <div className="relative">
      {selected ? (
        <div className="flex items-center gap-2 text-sm">
          <FiUser className="text-indigo-500" />
          <span>{selected.name}</span>
          <button onClick={() => onSelect(null)} className="text-red-400"><FiX size={14} /></button>
        </div>
      ) : (
        <button onClick={() => setOpen(true)} className="flex items-center gap-1 text-indigo-600 text-sm hover:underline">
          <FiUser /> {t('selectCustomer')}
        </button>
      )}
      {open && (
        <div className="fixed inset-0 bg-black/40 z-40 flex items-center justify-center" onClick={() => setOpen(false)}>
          <div className="bg-white dark:bg-gray-900 rounded-xl p-4 w-80 max-h-96 overflow-auto shadow-xl" onClick={e => e.stopPropagation()}>
            <h4 className="font-semibold mb-2">Pilih Pelanggan</h4>
            {customers.map(c => (
              <div key={c._id} className="py-2 px-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer"
                onClick={() => { onSelect(c); setOpen(false); }}>
                <p className="font-medium">{c.name}</p>
                {c.phone && <p className="text-xs text-gray-500">{c.phone}</p>}
              </div>
            ))}
            <button className="mt-2 text-sm text-gray-500 w-full text-center" onClick={() => setOpen(false)}>Tutup</button>
          </div>
        </div>
      )}
    </div>
  );
}
