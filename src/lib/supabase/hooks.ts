// =============================================
// AI Platform - Supabase Data Hooks
// =============================================

'use client';

import * as React from 'react';
import { createBrowserClient } from '@supabase/ssr';
import type { Tool, Article, Category } from '@/types';

// Supabase client singleton
function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase not configured');
    return null;
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

// =============================================
// useArticles Hook
// =============================================

interface UseArticlesOptions {
  page?: number;
  pageSize?: number;
  category?: string;
  search?: string;
  featured?: boolean;
  status?: 'published' | 'draft' | 'archived';
}

export function useArticles(options: UseArticlesOptions = {}) {
  const { page = 1, pageSize = 9, category, search, featured, status = 'published' } = options;

  const [articles, setArticles] = React.useState<Article[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [totalCount, setTotalCount] = React.useState(0);

  const fetchArticles = React.useCallback(async () => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      // Fallback to mock data for development
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('articles')
        .select('*, author:profiles(*), category:categories(*)', { count: 'exact' })
        .eq('status', status)
        .order('published_at', { ascending: false })
        .range((page - 1) * pageSize, page * pageSize - 1);

      if (category) {
        query = query.eq('category_id', category);
      }
      if (featured !== undefined) {
        query = query.eq('featured', featured);
      }
      if (search) {
        query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%`);
      }

      const { data, error: fetchError, count } = await query;

      if (fetchError) throw fetchError;

      setArticles(data || []);
      setTotalCount(count || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل تحميل المقالات');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, category, search, featured, status]);

  React.useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  return { articles, loading, error, totalCount, refetch: fetchArticles };
}

// =============================================
// useArticleBySlug Hook
// =============================================

export function useArticleBySlug(slug: string) {
  const [article, setArticle] = React.useState<Article | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchArticle = React.useCallback(async () => {
    const supabase = getSupabaseClient();
    if (!supabase || !slug) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('articles')
        .select('*, author:profiles(*), category:categories(*)')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (fetchError) throw fetchError;
      setArticle(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'المقال غير موجود');
    } finally {
      setLoading(false);
    }
  }, [slug]);

  React.useEffect(() => {
    fetchArticle();
  }, [fetchArticle]);

  return { article, loading, error, refetch: fetchArticle };
}

// =============================================
// useTools Hook
// =============================================

interface UseToolsOptions {
  page?: number;
  pageSize?: number;
  category?: string;
  search?: string;
  featured?: boolean;
  pricing?: string;
}

export function useTools(options: UseToolsOptions = {}) {
  const { page = 1, pageSize = 9, category, search, featured, pricing } = options;

  const [tools, setTools] = React.useState<Tool[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [totalCount, setTotalCount] = React.useState(0);

  const fetchTools = React.useCallback(async () => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('tools')
        .select('*, category:categories(*)', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range((page - 1) * pageSize, page * pageSize - 1);

      if (category) {
        query = query.eq('category_id', category);
      }
      if (featured !== undefined) {
        query = query.eq('is_featured', featured);
      }
      if (pricing) {
        query = query.eq('pricing_model', pricing);
      }
      if (search) {
        query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
      }

      const { data, error: fetchError, count } = await query;

      if (fetchError) throw fetchError;

      setTools(data || []);
      setTotalCount(count || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل تحميل الأدوات');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, category, search, featured, pricing]);

  React.useEffect(() => {
    fetchTools();
  }, [fetchTools]);

  return { tools, loading, error, totalCount, refetch: fetchTools };
}

// =============================================
// useToolBySlug Hook
// =============================================

export function useToolBySlug(slug: string) {
  const [tool, setTool] = React.useState<Tool | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchTool = React.useCallback(async () => {
    const supabase = getSupabaseClient();
    if (!supabase || !slug) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('tools')
        .select('*, category:categories(*)')
        .neq('id', '00000000-0000-0000-0000-000000000000') // Exclude placeholder
        .limit(1)
        .single();

      if (fetchError) throw fetchError;
      setTool(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'الأداة غير موجودة');
    } finally {
      setLoading(false);
    }
  }, [slug]);

  React.useEffect(() => {
    fetchTool();
  }, [fetchTool]);

  return { tool, loading, error, refetch: fetchTool };
}

// =============================================
// useCategories Hook
// =============================================

export function useCategories() {
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchCategories = React.useCallback(async () => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order', { ascending: true });

      if (fetchError) throw fetchError;
      setCategories(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل تحميل الفئات');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return { categories, loading, error, refetch: fetchCategories };
}

/// =============================================
// useStats Hook
// =============================================

export function useStats() {
  const [stats, setStats] = React.useState({
    totalTools: 0,
    totalArticles: 0,
    totalUsers: 0,
  });
  const [loading, setLoading] = React.useState(true);

  const fetchStats = React.useCallback(async () => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const [toolsCount, articlesCount, usersCount] = await Promise.all([
        supabase.from('tools').select('*', { count: 'exact', head: true }),
        supabase.from('articles').select('*', { count: 'exact', head: true }).eq('status', 'published'),
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
      ]);

      setStats({
        totalTools: toolsCount.count || 0,
        totalArticles: articlesCount.count || 0,
        totalUsers: usersCount.count || 0,
      });
    } catch {
      // Silent fail
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, refetch: fetchStats };
}
