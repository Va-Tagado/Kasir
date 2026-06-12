import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { ThemeProvider } from 'next-themes';
import AuthProvider from '@/contexts/AuthContext';
import '../globals.css';

export default async function LocaleLayout({ children, params: { locale } }: any) {
  let messages;
  try { messages = (await import(`../../../messages/${locale}.json`)).default; } catch { notFound(); }

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <AuthProvider>{children}</AuthProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
