'use client';
import { useState } from 'react';
import { useRouter } from 'next-intl/client';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/hooks/useAuth';

export default function LoginPage() {
  const t = useTranslations('auth');
  const c = useTranslations('common');
  const router = useRouter();
  const { setUser } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!username || !password) return setError(t('errorRequired'));
    setLoading(true);
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) return setError(data.error || t('errorCredentials'));
    setUser(data.user);
    router.push('/pos');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-center">{t('loginTitle')}</h2>
        {error && <p className="text-red-500 text-sm mb-3 text-center">{error}</p>}
        <label className="block mb-2 text-sm">{t('username')}</label>
        <input type="text" className="w-full p-2 border rounded mb-4 dark:bg-gray-800" value={username} onChange={e => setUsername(e.target.value)} />
        <label className="block mb-2 text-sm">{t('password')}</label>
        <input type="password" className="w-full p-2 border rounded mb-6 dark:bg-gray-800" value={password} onChange={e => setPassword(e.target.value)} />
        <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50">
          {loading ? c('loading') : t('loginButton')}
        </button>
      </form>
    </div>
  );
}
