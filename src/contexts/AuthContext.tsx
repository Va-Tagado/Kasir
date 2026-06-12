'use client';
import { createContext, useState, useEffect, ReactNode } from 'react';

interface User { _id: string; name: string; role: string; }
interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => void;
  setUser: (u: User | null) => void;
}
export const AuthContext = createContext<AuthContextType>({ user: null, loading: true, logout: () => {}, setUser: () => {} });

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/user').then(r => r.json()).then(data => {
      setUser(data?._id ? data : null);
    }).catch(() => setUser(null)).finally(() => setLoading(false));
  }, []);

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, loading, logout, setUser }}>{children}</AuthContext.Provider>;
}
