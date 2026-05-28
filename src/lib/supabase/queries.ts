// =============================================
// AI Platform - Pre-built Supabase Queries
// Ready-to-use query functions for common data operations
// =============================================

import { createClient } from '@supabase/supabase-js';

// Supabase client type
type ClientType = ReturnType<typeof createClient>;

// ============================================================================
// Pagination Types
// ============================================================================

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    totalPages: number;
    totalCount: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

// ============================================================================
// Table names
// ============================================================================

const Tables = {
  PROFILES: 'profiles',
  CATEGORIES: 'categories',
  ARTICLES: 'articles',
  TOOLS: 'tools',
  COMMENTS: 'comments',
  FAVORITES: 'favorites',
  SUBSCRIPTIONS: 'subscriptions',
  API_KEYS: 'api_keys',
  API_LOGS: 'api_logs',
  API_ENDPOINTS: 'api_endpoints',
  NOTIFICATIONS: 'notifications',
  ACTIVITY_LOGS: 'activity_logs',
} as const;

// ============================================================================
// Tools Queries
// ============================================================================

/**
 * Get all tools with optional filtering and pagination
 */
export async function getTools(
  supabase: ClientType,
  options: {
    categoryId?: string;
    featured?: boolean;
    search?: string;
    pricing?: string;
    page?: number;
    pageSize?: number;
  } = {}
) {
  const { page = 1, pageSize = 20, categoryId, featured, search, pricing } = options;
  const start = (page - 1) * pageSize;
  const end = start + pageSize - 1;

  let query = supabase
    .from(Tables.TOOLS)
    .select(`*, category:categories(*)`, { count: 'exact' });

  if (categoryId) {
    query = query.eq('category_id', categoryId);
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

  query = query
    .order('created_at', { ascending: false })
    .range(start, end);

  const { data, error, count } = await query;

  if (error) throw error;

  const totalCount = count ?? 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    data,
    pagination: {
      page,
      pageSize,
      totalPages,
      totalCount,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
}

/**
 * Get a single tool by ID
 */
export async function getToolById(
  supabase: ClientType,
  toolId: string
) {
  const { data, error } = await supabase
    .from(Tables.TOOLS)
    .select(`*, category:categories(*)`)
    .eq('id', toolId)
    .single();

  if (error || !data) return null;
  return data;
}

/**
 * Get a single tool by slug
 */
export async function getToolBySlug(
  supabase: ClientType,
  slug: string
) {
  const { data, error } = await supabase
    .from(Tables.TOOLS)
    .select(`*, category:categories(*)`)
    .eq('slug', slug)
    .single();

  if (error || !data) return null;
  return data;
}

/**
 * Get featured tools
 */
export async function getFeaturedTools(
  supabase: ClientType,
  limit: number = 10
) {
  const { data, error } = await supabase
    .from(Tables.TOOLS)
    .select(`*, category:categories(*)`)
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}

/**
 * Create a new tool
 */
export async function createTool(
  supabase: ClientType,
  tool: Record<string, unknown>
) {
  const { data, error } = await supabase
    .from(Tables.TOOLS)
    .insert(tool as never)
    .select()
    .single();

  if (error) {
    return { success: false, tool: null, error: error.message };
  }

  return { success: true, tool: data, error: null };
}

/**
 * Update a tool
 */
export async function updateTool(
  supabase: ClientType,
  toolId: string,
  updates: Record<string, unknown>
) {
  const { data, error } = await supabase
    .from(Tables.TOOLS)
    .update(updates as never)
    .eq('id', toolId)
    .select()
    .single();

  if (error) {
    return { success: false, tool: null, error: error.message };
  }

  return { success: true, tool: data, error: null };
}

/**
 * Delete a tool
 */
export async function deleteTool(
  supabase: ClientType,
  toolId: string
) {
  const { error } = await supabase
    .from(Tables.TOOLS)
    .delete()
    .eq('id', toolId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}

// ============================================================================
// Articles Queries
// ============================================================================

/**
 * Get all articles with filtering and pagination
 */
export async function getArticles(
  supabase: ClientType,
  options: {
    categoryId?: string;
    authorId?: string;
    status?: string;
    featured?: boolean;
    search?: string;
    page?: number;
    pageSize?: number;
  } = {}
) {
  const { page = 1, pageSize = 20, categoryId, authorId, status, featured, search } = options;
  const start = (page - 1) * pageSize;
  const end = start + pageSize - 1;

  let query = supabase
    .from(Tables.ARTICLES)
    .select(`*, author:profiles!author_id(*), category:categories(*)`, { count: 'exact' });

  if (categoryId) {
    query = query.eq('category_id', categoryId);
  }
  if (authorId) {
    query = query.eq('author_id', authorId);
  }
  if (status) {
    query = query.eq('status', status);
  }
  if (featured !== undefined) {
    query = query.eq('featured', featured);
  }
  if (search) {
    query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%`);
  }

  query = query
    .order('created_at', { ascending: false })
    .range(start, end);

  const { data, error, count } = await query;

  if (error) throw error;

  const totalCount = count ?? 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    data,
    pagination: {
      page,
      pageSize,
      totalPages,
      totalCount,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
}

/**
 * Get a single article by ID
 */
export async function getArticleById(
  supabase: ClientType,
  articleId: string
) {
  const { data, error } = await supabase
    .from(Tables.ARTICLES)
    .select(`*, author:profiles!author_id(*), category:categories(*)`)
    .eq('id', articleId)
    .single();

  if (error || !data) return null;
  return data;
}

/**
 * Get a single article by slug
 */
export async function getArticleBySlug(
  supabase: ClientType,
  slug: string
) {
  const { data, error } = await supabase
    .from(Tables.ARTICLES)
    .select(`*, author:profiles!author_id(*), category:categories(*)`)
    .eq('slug', slug)
    .single();

  if (error || !data) return null;
  return data;
}

/**
 * Create a new article
 */
export async function createArticle(
  supabase: ClientType,
  article: Record<string, unknown>
) {
  const { data, error } = await supabase
    .from(Tables.ARTICLES)
    .insert(article as never)
    .select()
    .single();

  if (error) {
    return { success: false, article: null, error: error.message };
  }

  return { success: true, article: data, error: null };
}

/**
 * Update an article
 */
export async function updateArticle(
  supabase: ClientType,
  articleId: string,
  updates: Record<string, unknown>
) {
  const { data, error } = await supabase
    .from(Tables.ARTICLES)
    .update(updates as never)
    .eq('id', articleId)
    .select()
    .single();

  if (error) {
    return { success: false, article: null, error: error.message };
  }

  return { success: true, article: data, error: null };
}

/**
 * Delete an article
 */
export async function deleteArticle(
  supabase: ClientType,
  articleId: string
) {
  const { error } = await supabase
    .from(Tables.ARTICLES)
    .delete()
    .eq('id', articleId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}

// ============================================================================
// Categories Queries
// ============================================================================

/**
 * Get all categories
 */
export async function getCategories(
  supabase: ClientType,
  options: {
    parentId?: string | null;
    includeCount?: boolean;
  } = {}
) {
  let query = supabase.from(Tables.CATEGORIES).select('*');

  if (options.parentId !== undefined) {
    if (options.parentId === null) {
      query = query.is('parent_id', null);
    } else {
      query = query.eq('parent_id', options.parentId);
    }
  }

  const { data, error } = await query.order('sort_order', { ascending: true });

  if (error) throw error;
  return data;
}

/**
 * Get category by ID
 */
export async function getCategoryById(
  supabase: ClientType,
  categoryId: string
) {
  const { data, error } = await supabase
    .from(Tables.CATEGORIES)
    .select('*')
    .eq('id', categoryId)
    .single();

  if (error || !data) return null;
  return data;
}

/**
 * Get category by slug
 */
export async function getCategoryBySlug(
  supabase: ClientType,
  slug: string
) {
  const { data, error } = await supabase
    .from(Tables.CATEGORIES)
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !data) return null;
  return data;
}

/**
 * Get category tree (categories with their children)
 */
export async function getCategoryTree(
  supabase: ClientType
) {
  // Get all root categories (no parent)
  const { data: rootCategories, error: rootError } = await supabase
    .from(Tables.CATEGORIES)
    .select('*')
    .is('parent_id', null)
    .order('sort_order', { ascending: true });

  if (rootError) throw rootError;

  // Get children for each root
  const categoriesWithChildren = await Promise.all(
    rootCategories.map(async (parent: Record<string, unknown>) => {
      const directChildren = await getCategories(supabase, { parentId: parent.id as string });
      return { ...parent, children: directChildren };
    })
  );

  return categoriesWithChildren;
}

/**
 * Create a category
 */
export async function createCategory(
  supabase: ClientType,
  category: Record<string, unknown>
) {
  const { data, error } = await supabase
    .from(Tables.CATEGORIES)
    .insert(category as never)
    .select()
    .single();

  if (error) {
    return { success: false, category: null, error: error.message };
  }

  return { success: true, category: data, error: null };
}

/**
 * Update a category
 */
export async function updateCategory(
  supabase: ClientType,
  categoryId: string,
  updates: Record<string, unknown>
) {
  const { data, error } = await supabase
    .from(Tables.CATEGORIES)
    .update(updates as never)
    .eq('id', categoryId)
    .select()
    .single();

  if (error) {
    return { success: false, category: null, error: error.message };
  }

  return { success: true, category: data, error: null };
}

/**
 * Delete a category
 */
export async function deleteCategory(
  supabase: ClientType,
  categoryId: string
) {
  const { error } = await supabase
    .from(Tables.CATEGORIES)
    .delete()
    .eq('id', categoryId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}

// ============================================================================
// Comments Queries
// ============================================================================

/**
 * Get comments for an article or tool
 */
export async function getComments(
  supabase: ClientType,
  options: {
    articleId?: string;
    toolId?: string;
    approved?: boolean;
    page?: number;
    pageSize?: number;
  } = {}
) {
  const { page = 1, pageSize = 20, articleId, toolId, approved = true } = options;
  const start = (page - 1) * pageSize;
  const end = start + pageSize - 1;

  let query = supabase
    .from(Tables.COMMENTS)
    .select(`*, author:profiles!author_id(*)`, { count: 'exact' });

  if (articleId) {
    query = query.eq('article_id', articleId);
  }
  if (toolId) {
    query = query.eq('tool_id', toolId);
  }
  if (approved !== undefined) {
    query = query.eq('is_approved', approved);
  }

  query = query
    .is('parent_id', null)
    .order('created_at', { ascending: false })
    .range(start, end);

  const { data, error, count } = await query;

  if (error) throw error;

  const totalCount = count ?? 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  const commentsWithReplies = await Promise.all(
    data.map(async (comment: Record<string, unknown>) => {
      const replies = await getCommentReplies(supabase, comment.id as string);
      return { ...comment, replies };
    })
  );

  return {
    data: commentsWithReplies,
    pagination: {
      page,
      pageSize,
      totalPages,
      totalCount,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
}

/**
 * Get replies for a comment
 */
export async function getCommentReplies(
  supabase: ClientType,
  parentId: string
) {
  const { data, error } = await supabase
    .from(Tables.COMMENTS)
    .select(`*, author:profiles!author_id(*)`)
    .eq('parent_id', parentId)
    .eq('is_approved', true)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data;
}

/**
 * Create a comment
 */
export async function createComment(
  supabase: ClientType,
  comment: Record<string, unknown>
) {
  const { data, error } = await supabase
    .from(Tables.COMMENTS)
    .insert({ ...comment, is_approved: false } as never)
    .select()
    .single();

  if (error) {
    return { success: false, comment: null, error: error.message };
  }

  return { success: true, comment: data, error: null };
}

/**
 * Approve a comment
 */
export async function approveComment(
  supabase: ClientType,
  commentId: string
) {
  const { error } = await supabase
    .from(Tables.COMMENTS)
    .update({ is_approved: true } as never)
    .eq('id', commentId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}

/**
 * Delete a comment
 */
export async function deleteComment(
  supabase: ClientType,
  commentId: string
) {
  const { error } = await supabase
    .from(Tables.COMMENTS)
    .delete()
    .eq('id', commentId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}

// ============================================================================
// Favorites Queries
// ============================================================================

/**
 * Get user's favorites
 */
export async function getUserFavorites(
  supabase: ClientType,
  userId: string
) {
  const { data, error } = await supabase
    .from(Tables.FAVORITES)
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * Add to favorites
 */
export async function addFavorite(
  supabase: ClientType,
  userId: string,
  options: { articleId?: string; toolId?: string }
) {
  const { data, error } = await supabase
    .from(Tables.FAVORITES)
    .insert({
      user_id: userId,
      article_id: options.articleId ?? null,
      tool_id: options.toolId ?? null,
    } as never)
    .select()
    .single();

  if (error) {
    return { success: false, favorite: null, error: error.message };
  }

  return { success: true, favorite: data, error: null };
}

/**
 * Remove from favorites
 */
export async function removeFavorite(
  supabase: ClientType,
  userId: string,
  options: { articleId?: string; toolId?: string }
) {
  let query = supabase
    .from(Tables.FAVORITES)
    .delete()
    .eq('user_id', userId);

  if (options.articleId) {
    query = query.eq('article_id', options.articleId);
  }
  if (options.toolId) {
    query = query.eq('tool_id', options.toolId);
  }

  const { error } = await query;

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}

/**
 * Check if item is in favorites
 */
export async function isFavorited(
  supabase: ClientType,
  userId: string,
  options: { articleId?: string; toolId?: string }
) {
  let query = supabase
    .from(Tables.FAVORITES)
    .select('id')
    .eq('user_id', userId);

  if (options.articleId) {
    query = query.eq('article_id', options.articleId);
  }
  if (options.toolId) {
    query = query.eq('tool_id', options.toolId);
  }

  const { data, error } = await query.single();
  return !error && !!data;
}

// ============================================================================
// Notifications Queries
// ============================================================================

/**
 * Get user's notifications
 */
export async function getNotifications(
  supabase: ClientType,
  userId: string,
  options: {
    unreadOnly?: boolean;
    limit?: number;
  } = {}
) {
  const { unreadOnly = false, limit = 50 } = options;

  let query = supabase
    .from(Tables.NOTIFICATIONS)
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (unreadOnly) {
    query = query.eq('is_read', false);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data;
}

/**
 * Mark notification as read
 */
export async function markNotificationRead(
  supabase: ClientType,
  notificationId: string
) {
  const { error } = await supabase
    .from(Tables.NOTIFICATIONS)
    .update({ is_read: true } as never)
    .eq('id', notificationId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}

/**
 * Mark all notifications as read
 */
export async function markAllNotificationsRead(
  supabase: ClientType,
  userId: string
) {
  const { error } = await supabase
    .from(Tables.NOTIFICATIONS)
    .update({ is_read: true } as never)
    .eq('user_id', userId)
    .eq('is_read', false);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}

/**
 * Create a notification
 */
export async function createNotification(
  supabase: ClientType,
  notification: Record<string, unknown>
) {
  const { data, error } = await supabase
    .from(Tables.NOTIFICATIONS)
    .insert({ ...notification, is_read: false } as never)
    .select()
    .single();

  if (error) {
    return { success: false, notification: null, error: error.message };
  }

  return { success: true, notification: data, error: null };
}

// ============================================================================
// Activity Logs Queries
// ============================================================================

/**
 * Log an activity
 */
export async function logActivity(
  supabase: ClientType,
  activity: Record<string, unknown>
) {
  const { error } = await supabase
    .from(Tables.ACTIVITY_LOGS)
    .insert(activity as never);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}

/**
 * Get recent activity
 */
export async function getRecentActivity(
  supabase: ClientType,
  options: {
    entityType?: string;
    entityId?: string;
    limit?: number;
  } = {}
) {
  const { limit = 50 } = options;

  const { data, error } = await supabase
    .from(Tables.ACTIVITY_LOGS)
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}

// ============================================================================
// Dashboard Stats Queries
// ============================================================================

/**
 * Get dashboard statistics
 */
export async function getDashboardStats(
  supabase: ClientType
) {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const [toolsCount, articlesCount, commentsCount, toolsThisMonth, articlesThisMonth] = await Promise.all([
    supabase.from(Tables.TOOLS).select('id', { count: 'exact', head: true }),
    supabase.from(Tables.ARTICLES).select('id', { count: 'exact', head: true }),
    supabase.from(Tables.COMMENTS).select('id', { count: 'exact', head: true }),
    supabase.from(Tables.TOOLS).select('id', { count: 'exact', head: true }).gte('created_at', startOfMonth),
    supabase.from(Tables.ARTICLES).select('id', { count: 'exact', head: true }).gte('created_at', startOfMonth),
  ]);

  return {
    total_tools: toolsCount.count ?? 0,
    total_articles: articlesCount.count ?? 0,
    total_comments: commentsCount.count ?? 0,
    tools_this_month: toolsThisMonth.count ?? 0,
    articles_this_month: articlesThisMonth.count ?? 0,
  };
}

// ============================================================================
// Search Queries
// ============================================================================

/**
 * Global search across tools and articles
 */
export async function globalSearch(
  supabase: ClientType,
  query: string,
  options: {
    limit?: number;
    includeTools?: boolean;
    includeArticles?: boolean;
  } = {}
) {
  const { limit = 10, includeTools = true, includeArticles = true } = options;

  const results: { tools: unknown[]; articles: unknown[] } = {
    tools: [],
    articles: [],
  };

  if (includeTools) {
    const { data: tools } = await supabase
      .from(Tables.TOOLS)
      .select('*, category:categories(*)')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      .limit(limit);
    results.tools = tools ?? [];
  }

  if (includeArticles) {
    const { data: articles } = await supabase
      .from(Tables.ARTICLES)
      .select('*, author:profiles!author_id(*), category:categories(*)')
      .or(`title.ilike.%${query}%,excerpt.ilike.%${query}%`)
      .eq('status', 'published')
      .limit(limit);
    results.articles = articles ?? [];
  }

  return results;
}
