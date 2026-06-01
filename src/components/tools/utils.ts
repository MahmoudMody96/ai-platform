// =============================================
// ToolDetail - Utilities
// =============================================

import type { PricingType, ToolDetail } from './types';

// ============================================================================
// Pricing label resolution
// ============================================================================

export interface PricingBadge {
  label: string;
  badge: 'success' | 'info' | 'secondary' | 'outline';
}

export function getPricingLabel(
  model: PricingType,
  price?: number | null,
): PricingBadge {
  switch (model) {
    case 'free':
      return { label: 'مجاني', badge: 'success' };
    case 'freemium':
      return { label: 'مجاني + مدفوع', badge: 'info' };
    case 'paid':
      return { label: price ? `${price}$/شهر` : 'مدفوع', badge: 'secondary' };
    case 'enterprise':
      return { label: 'للشركات', badge: 'outline' };
    case 'contact':
      return { label: 'تواصل', badge: 'outline' };
    default:
      return { label: model, badge: 'secondary' };
  }
}

// ============================================================================
// Formatters
// ============================================================================

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function getInitials(name: string): string {
  return name.charAt(0).toUpperCase();
}

// ============================================================================
// Social share URLs
// ============================================================================

export function getShareUrl(
  platform: 'twitter' | 'facebook' | 'linkedin',
  tool: ToolDetail,
  pageUrl: string,
): string {
  const title = tool.name;
  const url = pageUrl;
  switch (platform) {
    case 'twitter':
      return `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
    case 'facebook':
      return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    case 'linkedin':
      return `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`;
  }
}
