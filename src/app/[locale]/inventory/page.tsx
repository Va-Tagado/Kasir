'use client';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next-intl/client';
import { FiPlus, FiEdit2, FiTrash2, FiAlertTriangle, FiSearch } from 'react-icons/fi';

interface Product {
  _id: string;
  name: string;
  barcode?: string;
  sku?: string;
  category?: string;
  sellingPrice: number;
  stock: number;
  minStock: number;
  supplier?: { name: string };
}

export default function InventoryPage() {
  const t = useTranslations('inventory');
  const c = useTranslations('common');
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const router = useRouter();

  const fetchProducts = async () => {
    const res = await fetch(`/api/products?q=${search}&sort=${sortBy}`);
    const data = await res.json();
    setProducts(data);
  };

  useEffect(() => { fetchProducts(); }, [search, sortBy]);

  const deleteProduct = async (id: string) => {
    if (!confirm(c('confirm') + ' hapus produk?')) return;
    await fetch(`/api/products/${id}`, { method: 'DELETE' });
    fetchProducts();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        <Link href="/inventory/add" className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
          <FiPlus /> {t('addProduct')}
        </Link>
      </div>

      <div className="flex gap-3 mb-4">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-800"
            placeholder={`${c('search')}...`}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select className="border rounded-lg px-3 dark:bg-gray-800" value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="name">Nama</option>
          <option value="stock">Stok</option>
          <option value="sellingPrice">Harga</option>
        </select>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="p-3 text-left">Produk</th>
              <th className="p-3 text-left">SKU/Barcode</th>
              <th className="p-3 text-right">Harga Jual</th>
              <th className="p-3 text-right">Stok</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y dark:divide-gray-700">
            {products.map(p => (
              <tr key={p._id} className={`hover:bg-gray-50 dark:hover:bg-gray-800 ${p.stock <= p.minStock ? 'bg-red-50 dark:bg-red-900/10' : ''}`}>
                <td className="p-3 font-medium">
                  {p.name}
                  {p.supplier && <div className="text-xs text-gray-500">{p.supplier.name}</div>}
                </td>
                <td className="p-3 text-gray-500 text-xs">
                  {p.sku && <div>SKU: {p.sku}</div>}
                  {p.barcode && <div>Barcode: {p.barcode}</div>}
                </td>
                <td className="p-3 text-right">Rp {p.sellingPrice.toLocaleString()}</td>
                <td className="p-3 text-right font-semibold">{p.stock}</td>
                <td className="p-3 text-center">
                  {p.stock <= p.minStock ? (
                    <span className="inline-flex items-center gap-1 text-red-600 text-xs">
                      <FiAlertTriangle size={14} /> Menipis
                    </span>
                  ) : (
                    <span className="text-green-600 text-xs">● Aman</span>
                  )}
                </td>
                <td className="p-3 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => router.push(`/inventory/${p._id}`)} className="p-1 hover:text-indigo-600"><FiEdit2 /></button>
                    <button onClick={() => deleteProduct(p._id)} className="p-1 hover:text-red-600"><FiTrash2 /></button>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr><td colSpan={6} className="p-6 text-center text-gray-400">{c('noData')}</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
