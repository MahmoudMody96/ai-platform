'use client';

import * as React from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { FavoritesProvider } from '@/contexts/FavoritesContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <FavoritesProvider>
          {children}
        </FavoritesProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
