'use client';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next-intl/client';
import { FiShoppingCart, FiBox, FiUsers, FiBarChart2, FiSettings, FiX } from 'react-icons/fi';

const menu = [
  { key: 'pos', icon: FiShoppingCart, href: '/pos' },
  { key: 'inventory', icon: FiBox, href: '/inventory' },
  { key: 'customers', icon: FiUsers, href: '/customers' },
  { key: 'reports', icon: FiBarChart2, href: '/reports' },
  { key: 'settings', icon: FiSettings, href: '/settings' },
];

export default function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const t = useTranslations('sidebar');
  const pathname = usePathname();

  return (
    <>
      {/* Overlay untuk mobile */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 z-50 transition-transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:z-0`}>
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <h1 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">ApexPOS</h1>
          <button className="lg:hidden p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800" onClick={onClose}>
            <FiX size={20} />
          </button>
        </div>
        <nav className="p-2 space-y-1">
          {menu.map(item => {
            const active = pathname.startsWith(`/${item.key}`) || (item.key === 'pos' && pathname === '/');
            return (
              <Link key={item.key} href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  active ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-semibold' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
                onClick={onClose}
              >
                <item.icon size={18} />
                {t(item.key)}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
