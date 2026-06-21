'use client';

import { useEffect, type ReactNode } from 'react';
import { useStore } from '@/lib/store';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useStore((s) => s.theme);

  useEffect(() => {
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(theme);
  }, [theme]);

  return <>{children}</>;
}
