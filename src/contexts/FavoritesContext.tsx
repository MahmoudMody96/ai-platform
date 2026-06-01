'use client';

import * as React from 'react';
import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types';

interface Favorite {
  id: string;
  tool_id: string | null;
  article_id: string | null;
  created_at: string;
}

interface FavoritesContextType {
  favorites: Favorite[];
  isLoading: boolean;
  addFavorite: (toolId?: string, articleId?: string) => Promise<{ success: boolean; error?: string }>;
  removeFavorite: (id: string) => Promise<{ success: boolean; error?: string }>;
  isFavorite: (toolId?: string, articleId?: string) => boolean;
  getFavoriteId: (toolId?: string, articleId?: string) => string | null;
  toggleFavorite: (toolId?: string, articleId?: string) => Promise<void>;
  refreshFavorites: () => Promise<void>;
}

const FavoritesContext = React.createContext<FavoritesContextType | undefined>(undefined);

function createSupabaseBrowserClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
  if (!supabaseUrl || !supabaseAnonKey) return null;
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = React.useState<Favorite[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const supabaseRef = React.useRef<ReturnType<typeof createSupabaseBrowserClient> | null>(null);

  if (supabaseRef.current == null) {
    supabaseRef.current = createSupabaseBrowserClient();
  }

  const fetchFavorites = React.useCallback(async () => {
    if (!supabaseRef.current) return;

    setIsLoading(true);
    try {
      const { data: { session } } = await supabaseRef.current.auth.getSession();
      if (!session?.user) {
        setFavorites([]);
        return;
      }

      const { data, error } = await supabaseRef.current
        .from('favorites')
        .select('*')
        .eq('user_id', session.user.id);

      if (!error && data) {
        setFavorites(data);
      }
    } catch {
      // Ignore errors
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load favorites on mount and on auth change
  React.useEffect(() => {
    fetchFavorites();

    if (!supabaseRef.current) return;

    const { data: { subscription } } = supabaseRef.current.auth.onAuthStateChange(() => {
      fetchFavorites();
    });

    return () => subscription.unsubscribe();
  }, [fetchFavorites]);

  const addFavorite = React.useCallback(async (toolId?: string, articleId?: string) => {
    if (!supabaseRef.current) {
      return { success: false, error: 'Supabase not configured' };
    }

    const { data: { session } } = await supabaseRef.current.auth.getSession();
    if (!session?.user) {
      return { success: false, error: 'يرجى تسجيل الدخول أولاً' };
    }

    try {
      // Note: we only set tool_id OR article_id per the favorites_target CHECK
      // constraint, so we cast to the partial Insert type that allows both.
      const { error } = await supabaseRef.current.from('favorites').insert({
        user_id: session.user.id,
        tool_id: toolId ?? null,
        article_id: articleId ?? null,
      } as unknown as Database['public']['Tables']['favorites']['Insert']);

      if (error && !error.message.includes('duplicate')) {
        return { success: false, error: error.message };
      }

      await fetchFavorites();
      return { success: true };
    } catch {
      return { success: false, error: 'حدث خطأ غير متوقع' };
    }
  }, [fetchFavorites]);

  const removeFavorite = React.useCallback(async (id: string) => {
    if (!supabaseRef.current) {
      return { success: false, error: 'Supabase not configured' };
    }

    try {
      const { error } = await supabaseRef.current.from('favorites').delete().eq('id', id);

      if (error) {
        return { success: false, error: error.message };
      }

      setFavorites(prev => prev.filter(f => f.id !== id));
      return { success: true };
    } catch {
      return { success: false, error: 'حدث خطأ غير متوقع' };
    }
  }, []);

  const isFavorite = React.useCallback((toolId?: string, articleId?: string) => {
    return favorites.some(f =>
      (toolId && f.tool_id === toolId) || (articleId && f.article_id === articleId)
    );
  }, [favorites]);

  const getFavoriteId = React.useCallback((toolId?: string, articleId?: string) => {
    const found = favorites.find(f =>
      (toolId && f.tool_id === toolId) || (articleId && f.article_id === articleId)
    );
    return found?.id ?? null;
  }, [favorites]);

  const toggleFavorite = React.useCallback(async (toolId?: string, articleId?: string) => {
    const id = getFavoriteId(toolId, articleId);
    if (id) {
      await removeFavorite(id);
    } else {
      await addFavorite(toolId, articleId);
    }
  }, [getFavoriteId, removeFavorite, addFavorite]);

  return (
    <FavoritesContext.Provider value={{
      favorites, isLoading, addFavorite, removeFavorite,
      isFavorite, getFavoriteId, toggleFavorite, refreshFavorites: fetchFavorites,
    }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = React.useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
