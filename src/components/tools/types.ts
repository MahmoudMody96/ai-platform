// =============================================
// ToolDetail - Types
// =============================================
// Local shapes consumed by the ToolDetailClient tree.
// Kept separate so the components stay focused on UI and
// can be unit-tested without pulling in the full DB Row type.
// =============================================

export type PricingType = 'free' | 'freemium' | 'paid' | 'enterprise' | 'contact';

export interface ToolCategory {
  id: string;
  name: string;
  slug: string;
  color: string;
}

export interface ToolAuthor {
  id: string;
  display_name: string;
  avatar_url: string | null;
}

export interface ToolFeature {
  title: string;
  desc: string;
}

export interface ToolReview {
  id: string;
  rating: number;
  title: string | null;
  content: string | null;
  pros: string[];
  cons: string[];
  created_at: string;
  author: ToolAuthor;
  helpful_count: number;
}

export interface ToolAlternative {
  id: string;
  name: string;
  slug: string;
  tagline: string | null;
  logo_url: string | null;
  pricing_type: string;
  rating_avg: number;
  category: { name: string; color: string } | null;
}

export interface ToolStats {
  rating_avg: number;
  rating_count: number;
  rating_breakdown: Record<number, number>;
}

export interface ToolDetail {
  id: string;
  name: string;
  slug: string;
  tagline: string | null;
  description: string | null;
  website_url: string;
  logo_url: string | null;
  pricing_type: PricingType;
  starting_price: number | null;
  pricing_currency: string;
  tags: string[];
  features: ToolFeature[];
  rating_avg: number;
  rating_count: number;
  views_count: number;
  is_featured: boolean;
  is_verified: boolean;
  created_at: string;
  category: ToolCategory | null;
  recent_reviews: ToolReview[];
  alternatives: ToolAlternative[];
  stats: ToolStats;
}
