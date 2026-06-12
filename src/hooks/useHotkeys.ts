'use client';
import { useEffect } from 'react';

type KeyMap = Record<string, () => void>;

export function useHotkeys(keyMap: KeyMap) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Hindari trigger saat user mengetik di input teks kecuali kombinasi khusus
      const target = e.target as HTMLElement;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) && e.key !== 'F4' && e.key !== 'F2') return;
      
      const key = e.key;
      if (keyMap[key]) {
        e.preventDefault();
        keyMap[key]();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [keyMap]);
}
