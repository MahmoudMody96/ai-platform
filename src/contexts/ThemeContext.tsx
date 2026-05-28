'use client';

import * as React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
}

const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = React.useState<Theme>('system');
  const [resolvedTheme, setResolvedTheme] = React.useState<'light' | 'dark'>('light');

  // Initialize theme from localStorage on mount
  React.useEffect(() => {
    const stored = localStorage.getItem('theme') as Theme | null;
    if (stored && ['light', 'dark', 'system'].includes(stored)) {
      setThemeState(stored);
    }
  }, []);

  // Resolve the actual theme
  const resolveTheme = React.useCallback((t: Theme): 'light' | 'dark' => {
    if (t === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return t;
  }, []);

  // Apply theme to document
  const applyTheme = React.useCallback((t: 'light' | 'dark') => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(t);
    setResolvedTheme(t);
  }, []);

  // Update resolved theme when theme or system preference changes
  React.useEffect(() => {
    const resolved = resolveTheme(theme);
    applyTheme(resolved);

    // Listen for system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      if (theme === 'system') {
        const newResolved = resolveTheme('system');
        applyTheme(newResolved);
      }
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [theme, resolveTheme, applyTheme]);

  // Persist theme preference
  const setTheme = React.useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
    const resolved = resolveTheme(newTheme);
    applyTheme(resolved);
  }, [resolveTheme, applyTheme]);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// ============================================================================
// Theme Toggle Component
// ============================================================================

export function ThemeToggle({ variant = 'ghost', size = 'icon' }: { variant?: 'ghost' | 'outline' | 'default'; size?: 'icon' | 'sm' | 'default' }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Avoid hydration mismatch
  if (!mounted) {
    return (
      <Button variant={variant} size={size} className="w-9 h-9">
        <span className="sr-only">تبديل السمة</span>
        <Sun className="w-4 h-4" />
      </Button>
    );
  }

  const cycleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  const Icon = theme === 'dark' ? Moon : theme === 'light' ? Sun : Monitor;
  const label = theme === 'dark' ? 'الوضع الداكن' : theme === 'light' ? 'الوضع الفاتح' : 'تلقائي';

  return (
    <Button
      variant={variant}
      size={size}
      onClick={cycleTheme}
      title={label}
      className="w-9 h-9"
      aria-label={label}
    >
      <Icon className="w-4 h-4" />
    </Button>
  );
}
