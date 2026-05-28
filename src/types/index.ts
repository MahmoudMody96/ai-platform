// =============================================
// AI Platform - TypeScript Types
// =============================================

export interface Profile {
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
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  parent_id: string | null;
  sort_order: number;
  created_at: string;
  children?: Category[];
  tools_count?: number;
  articles_count?: number;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content?: string | null;
  cover_image_url?: string | null;
  author_id: string;
  category_id: string | null;
  tags?: string[] | null;
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  read_time: number;
  published_at?: string | null;
  created_at: string;
  updated_at: string;
  author?: Profile;
  category?: Category;
  comments_count?: number;
}

export interface Tool {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  long_description?: string | null;
  logo_url: string | null;
  website_url: string | null;
  documentation_url?: string | null;
  pricing_model: 'free' | 'freemium' | 'paid' | 'contact';
  monthly_price?: number | null;
  category_id: string | null;
  tags?: string[] | null;
  features?: string[] | null;
  alternatives?: string[] | null;
  stats: {
    uses: number;
    rating: number;
    reviews: number;
  };
  is_featured: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
  category?: Category;
}

export interface Comment {
  id: string;
  content: string;
  article_id: string | null;
  tool_id: string | null;
  parent_id: string | null;
  author_id: string;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
  author?: Profile;
  replies?: Comment[];
}

export interface Favorite {
  id: string;
  user_id: string;
  article_id: string | null;
  tool_id: string | null;
  created_at: string;
}

export interface Subscription {
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
}

// API Keys for external integrations
export interface ApiKey {
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
}

// API Logs
export interface ApiLog {
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
}

// API Endpoints
export interface ApiEndpoint {
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
}

// Notifications
export interface Notification {
  id: string;
  user_id: string;
  type: 'comment' | 'favorite' | 'mention' | 'system' | 'update';
  title: string;
  body: string | null;
  data: Record<string, unknown>;
  is_read: boolean;
  created_at: string;
}

// User
export interface User {
  id: string;
  email: string;
  created_at: string;
  email_confirmed_at: string | null;
  last_sign_in_at: string | null;
  role?: string;
}

// Dashboard Stats
export interface DashboardStats {
  total_tools: number;
  total_articles: number;
  total_users: number;
  total_comments: number;
  tools_this_month: number;
  articles_this_month: number;
  users_this_month: number;
  page_views_today: number;
  api_calls_today: number;
}

export interface ChartData {
  date: string;
  value: number;
}

export interface ActivityLog {
  id: string;
  action: string;
  entity_type: 'tool' | 'article' | 'user' | 'category' | 'api_key';
  entity_id: string;
  user_id: string | null;
  details: Record<string, unknown>;
  created_at: string;
}

// Paginated Response
export interface PaginatedResponse<T> {
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