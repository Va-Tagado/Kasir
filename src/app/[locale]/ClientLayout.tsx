'use client';
import { useState } from 'react';
import { ThemeProvider } from 'next-themes';
import AuthProvider from '@/contexts/AuthContext';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { usePathname } from 'next-intl/client';
import '../globals.css';

export default function ClientLayout({ children, locale }: any) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const isLogin = pathname.includes('/login');

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            {isLogin ? children : (
              <div className="flex h-screen">
                <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                <div className="flex-1 flex flex-col overflow-hidden">
                  <Header onMenuClick={() => setSidebarOpen(true)} />
                  <main className="flex-1 overflow-auto">{children}</main>
                </div>
              </div>
            )}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
