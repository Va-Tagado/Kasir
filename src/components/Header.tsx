'use client';
import { FiMenu, FiMoon, FiSun, FiLogOut, FiGlobe } from 'react-icons/fi';
import { useTheme } from 'next-themes';
import { useAuth } from '@/hooks/useAuth';
import { useRouter, usePathname } from 'next-intl/client';

export default function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLang = () => {
    const newLocale = pathname.startsWith('/id') ? 'en' : 'id';
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <header className="h-14 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex items-center justify-between px-4">
      <button className="lg:hidden p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800" onClick={onMenuClick}>
        <FiMenu size={20} />
      </button>
      <div className="flex-1" />
      <div className="flex items-center gap-2">
        <button onClick={toggleLang} className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800" title="Ganti bahasa">
          <FiGlobe size={18} />
        </button>
        <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
          {theme === 'dark' ? <FiSun size={18} /> : <FiMoon size={18} />}
        </button>
        <span className="text-sm hidden sm:inline text-gray-600 dark:text-gray-400">{user?.name}</span>
        <button onClick={logout} className="p-2 rounded hover:bg-red-50 dark:hover:bg-red-900/30 text-red-500" title="Logout">
          <FiLogOut size={18} />
        </button>
      </div>
    </header>
  );
}
