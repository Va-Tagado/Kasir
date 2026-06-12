import { redirect } from 'next/navigation';
export default function Home({ params: { locale } }: any) {
  redirect(`/${locale}/pos`);
}
