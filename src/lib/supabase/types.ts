// =============================================
// AI Platform - Supabase Database Types
// Derived from src/types/index.ts for Supabase compatibility
// =============================================

import type { SupabaseClient } from '@supabase/supabase-js';

// Database table names
export const Tables = {
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

// Row types for each table
export type ProfileRow = {
  id: string;
  user_id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  plan: 'free' | 'pro' | 'team';
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

export type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  parent_id: string | null;
  sort_order: number;
  created_at: string;
};

export type ArticleRow = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  cover_image_url: string | null;
  author_id: string;
  category_id: string | null;
  tags: string[] | null;
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  read_time: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type ToolRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  long_description: string | null;
  logo_url: string | null;
  website_url: string | null;
  documentation_url: string | null;
  pricing_model: 'free' | 'freemium' | 'paid' | 'contact';
  monthly_price: number | null;
  category_id: string | null;
  tags: string[] | null;
  features: string[] | null;
  alternatives: string[] | null;
  stats: {
    uses: number;
    rating: number;
    reviews: number;
  };
  is_featured: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
};

export type CommentRow = {
  id: string;
  content: string;
  article_id: string | null;
  tool_id: string | null;
  parent_id: string | null;
  author_id: string;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
};

export type FavoriteRow = {
  id: string;
  user_id: string;
  article_id: string | null;
  tool_id: string | null;
  created_at: string;
};

export type SubscriptionRow = {
  id: string;
  user_id: string;
  plan: 'free' | 'pro' | 'team';
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  stripe_subscription_id: string | null;
  stripe_customer_id: string | null;
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  created_at: string;
  updated_at: string;
};

export type ApiKeyRow = {
  id: string;
  name: string;
  key: string;
  prefix: string;
  user_id: string | null;
  permissions: string[];
  rate_limit: number;
  expires_at: string | null;
  last_used_at: string | null;
  usage_count: number;
  created_at: string;
  is_active: boolean;
};

export type ApiLogRow = {
  id: string;
  api_key_id: string;
  endpoint: string;
  method: string;
  status_code: number;
  ip_address: string;
  user_agent: string;
  request_body: Record<string, unknown> | null;
  response_body: Record<string, unknown> | null;
  duration_ms: number;
  created_at: string;
};

export type ApiEndpointRow = {
  id: string;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  description: string;
  category: 'tools' | 'articles' | 'categories' | 'search' | 'users';
  requires_auth: boolean;
  rate_limit: number;
  response_schema: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

export type NotificationRow = {
  id: string;
  user_id: string;
  type: 'comment' | 'favorite' | 'mention' | 'system' | 'update';
  title: string;
  body: string | null;
  data: Record<string, unknown>;
  is_read: boolean;
  created_at: string;
};

export type ActivityLogRow = {
  id: string;
  action: string;
  entity_type: 'tool' | 'article' | 'user' | 'category' | 'api_key';
  entity_id: string;
  user_id: string | null;
  details: Record<string, unknown>;
  created_at: string;
};

// Database views
export type ToolsWithCategory = ToolRow & {
  category: CategoryRow | null;
};

export type ArticlesWithDetails = ArticleRow & {
  author: ProfileRow | null;
  category: CategoryRow | null;
  comments_count?: number;
};

export type CommentsWithAuthor = CommentRow & {
  author: ProfileRow | null;
  replies?: CommentsWithAuthor[];
};

// Auth types
export type AuthUser = {
  id: string;
  email: string;
  created_at: string;
  email_confirmed_at: string | null;
  last_sign_in_at: string | null;
  role?: string;
  user_metadata?: Record<string, unknown>;
};

// Base Supabase client type
export type Database = {
  public: {
    Tables: Record<string, {
      Row: Record<string, unknown>;
      Insert: Record<string, unknown>;
      Update: Record<string, unknown>;
    }>;
    Views: Record<string, { Row: Record<string, unknown> }>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};

// Typed Supabase client for this app
export type SupabaseClientType = SupabaseClient;
