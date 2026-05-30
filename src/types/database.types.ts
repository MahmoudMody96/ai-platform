// =============================================
// AI Platform - Database Types
// Auto-generated from Supabase schema
// =============================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name: string
          name_en: string | null
          slug: string
          description: string | null
          icon: string | null
          color: string
          tools_count: number
          is_featured: boolean
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['categories']['Row'], 'id' | 'created_at' | 'updated_at' | 'tools_count'>
        Update: Partial<Database['public']['Tables']['categories']['Insert']>
      }
      tools: {
        Row: {
          id: string
          name: string
          slug: string
          tagline: string | null
          description: string | null
          description_en: string | null
          website_url: string
          logo_url: string | null
          screenshot_url: string | null
          category_id: string | null
          tags: string[]
          pricing_type: 'free' | 'freemium' | 'paid' | 'enterprise' | 'contact'
          starting_price: number | null
          pricing_currency: string
          has_free_trial: boolean
          trial_days: number | null
          rating_avg: number
          rating_count: number
          meta_title: string | null
          meta_description: string | null
          views_count: number
          clicks_count: number
          favorites_count: number
          status: 'pending' | 'published' | 'rejected' | 'archived'
          is_featured: boolean
          is_sponsored: boolean
          sponsored_until: string | null
          features: Json
          pricing_plans: Json
          submitted_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['tools']['Row'], 'id' | 'rating_avg' | 'rating_count' | 'views_count' | 'clicks_count' | 'favorites_count' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['tools']['Insert']>
      }
      profiles: {
        Row: {
          id: string
          display_name: string | null
          username: string | null
          avatar_url: string | null
          bio: string | null
          role: 'user' | 'moderator' | 'admin'
          is_verified: boolean
          website_url: string | null
          country: string
          reviews_count: number
          favorites_count: number
          email_newsletter: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'reviews_count' | 'favorites_count' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
      }
      reviews: {
        Row: {
          id: string
          tool_id: string
          user_id: string
          rating: number
          title: string | null
          content: string | null
          pros: string[]
          cons: string[]
          use_case: string | null
          status: 'pending' | 'approved' | 'rejected'
          helpful_count: number
          not_helpful_count: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['reviews']['Row'], 'id' | 'helpful_count' | 'not_helpful_count' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['reviews']['Insert']>
      }
      articles: {
        Row: {
          id: string
          title: string
          slug: string
          excerpt: string | null
          content: string | null
          cover_image_url: string | null
          author_id: string | null
          category_id: string | null
          tags: string[]
          related_tools: string[]
          meta_title: string | null
          meta_description: string | null
          views_count: number
          reading_time: number | null
          status: 'draft' | 'published' | 'archived'
          published_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['articles']['Row'], 'id' | 'views_count' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['articles']['Insert']>
      }
      favorites: {
        Row: {
          id: string
          user_id: string
          tool_id: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['favorites']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['favorites']['Insert']>
      }
      newsletter_subscribers: {
        Row: {
          id: string
          email: string
          name: string | null
          status: 'active' | 'unsubscribed'
          source: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['newsletter_subscribers']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['newsletter_subscribers']['Insert']>
      }
      api_keys: {
        Row: {
          id: string
          user_id: string
          name: string
          key_hash: string
          key_prefix: string
          plan: 'free' | 'pro' | 'enterprise'
          rate_limit: number
          requests_count: number
          last_used_at: string | null
          expires_at: string | null
          is_active: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['api_keys']['Row'], 'id' | 'requests_count' | 'created_at'>
        Update: Partial<Database['public']['Tables']['api_keys']['Insert']>
      }
    }
    Functions: {
      search_tools: {
        Args: {
          query: string
          p_category?: string
          p_limit?: number
          p_offset?: number
        }
        Returns: Database['public']['Tables']['tools']['Row'][]
      }
      generate_slug: {
        Args: { title: string }
        Returns: string
      }
      calculate_reading_time: {
        Args: { content: string }
        Returns: number
      }
    }
  }
}

// =============================================
// Type Aliases for convenience
// =============================================

export type Category = Database['public']['Tables']['categories']['Row']
export type Tool = Database['public']['Tables']['tools']['Row']
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Review = Database['public']['Tables']['reviews']['Row']
export type Article = Database['public']['Tables']['articles']['Row']
export type Favorite = Database['public']['Tables']['favorites']['Row']
export type NewsletterSubscriber = Database['public']['Tables']['newsletter_subscribers']['Row']
export type ApiKey = Database['public']['Tables']['api_keys']['Row']

// =============================================
// Extended Types (with relations)
// =============================================

export interface ToolWithCategory extends Tool {
  category: Category | null
}

export interface ReviewWithAuthor extends Review {
  author: Profile
}

export interface ArticleWithAuthor extends Article {
  author: Profile | null
  category: Category | null
}

export interface ToolDetail extends ToolWithCategory {
  recent_reviews: ReviewWithAuthor[]
  alternatives: Tool[]
  stats: {
    rating_avg: number
    rating_count: number
    rating_breakdown: Record<1 | 2 | 3 | 4 | 5, number>
  }
}

// =============================================
// API Response Types
// =============================================

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    total: number
    page: number
    limit: number
    total_pages: number
  }
}

export interface ApiError {
  error: string
  details?: Record<string, string[]>
}

// =============================================
// Pricing Types
// =============================================

export type PricingType = 'free' | 'freemium' | 'paid' | 'enterprise' | 'contact'

export const PRICING_LABELS: Record<PricingType, string> = {
  free: 'مجاني',
  freemium: 'مجاني + مدفوع',
  paid: 'مدفوع',
  enterprise: 'للشركات',
  contact: 'تواصل للسعر'
}

// =============================================
// Tool Status Types
// =============================================

export type ToolStatus = 'pending' | 'published' | 'rejected' | 'archived'

// =============================================
// Review Status Types
// =============================================

export type ReviewStatus = 'pending' | 'approved' | 'rejected'

// =============================================
// Article Status Types
// =============================================

export type ArticleStatus = 'draft' | 'published' | 'archived'

// =============================================
// User Role Types
// =============================================

export type UserRole = 'user' | 'moderator' | 'admin'

// =============================================
// Sort Options
// =============================================

export type ToolSortOption = 'newest' | 'rating' | 'popular' | 'name'
export type ReviewSortOption = 'newest' | 'helpful' | 'rating_high' | 'rating_low'

// =============================================
// Feature & Pricing Plan Types
// =============================================

export interface ToolFeature {
  title: string
  desc: string
}

export interface PricingPlan {
  name: string
  price: number
  period: 'monthly' | 'yearly'
  features: string[]
  is_popular?: boolean
}