import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import ClientLayout from './ClientLayout';

export default async function LocaleLayout({ children, params: { locale } }: any) {
  let messages;
  try { messages = (await import(`../../../messages/${locale}.json`)).default; } catch { notFound(); }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <ClientLayout locale={locale}>{children}</ClientLayout>
    </NextIntlClientProvider>
  );
}
