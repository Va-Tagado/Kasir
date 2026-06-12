'use client';
import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { FiSearch } from 'react-icons/fi';

interface Product {
  _id: string;
  name: string;
  barcode?: string;
  sellingPrice: number;
  stock: number;
  unit?: string;
}

export default function ProductSearch({ onSelect }: { onSelect: (p: Product) => void }) {
  const t = useTranslations('pos');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const search = async (q: string, barcode?: string) => {
    if (!q && !barcode) { setResults([]); return; }
    setLoading(true);
    const params = new URLSearchParams(barcode ? { barcode } : { q });
    const res = await fetch(`/api/products?${params}`);
    const data = await res.json();
    setResults(data);
    setLoading(false);
  };

  // Keyboard shortcut F2 sudah di page level, input akan auto-fokus
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleScan = (barcode: string) => {
    setQuery(barcode);
    search('', barcode);
  };

  return (
    <div className="relative">
      <div className="relative">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          placeholder={t('searchPlaceholder')}
          className="w-full pl-10 pr-4 py-3 border rounded-lg dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 outline-none"
          value={query}
          onChange={e => { setQuery(e.target.value); search(e.target.value); }}
          onKeyDown={e => { if (e.key === 'Enter' && results.length === 1) onSelect(results[0]); }}
        />
      </div>
      {loading && <p className="text-sm text-gray-500 mt-1">Mencari...</p>}
      {results.length > 0 && (
        <ul className="absolute z-20 w-full bg-white dark:bg-gray-800 border rounded-lg mt-1 max-h-60 overflow-auto shadow-lg">
          {results.map(p => (
            <li key={p._id} className="px-4 py-2 hover:bg-indigo-50 dark:hover:bg-gray-700 cursor-pointer flex justify-between"
              onClick={() => { onSelect(p); setQuery(''); setResults([]); }}>
              <span>{p.name} <span className="text-xs text-gray-400">({p.barcode})</span></span>
              <span className="text-sm text-gray-500">Rp {p.sellingPrice.toLocaleString()} | Stok: {p.stock}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
