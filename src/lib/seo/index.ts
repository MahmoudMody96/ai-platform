// =============================================
// SEO Utilities - Meta Tags, OG Images, Structured Data
// =============================================

import { type ClassValue } from 'clsx';

// Tailwind merge helper
function cn(...inputs: ClassValue[]): string {
  return inputs.filter(Boolean).join(' ');
}

// Default site configuration
const SITE_CONFIG = {
  name: 'منصة الذكاء الاصطناعي',
  nameEn: 'AI Platform',
  description: 'أفضل أدوات الذكاء الاصطناعي، مقالات يومية، شروحات تفصيلية بالعربية',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://aiplatform.example.com',
  locale: 'ar_EG',
  localeAlternate: 'en_US',
  twitterHandle: '@aiplatform',
  image: '/og-image.png',
  favicon: '/favicon.ico',
};

// ============================================================================
// Meta Tags Generation
// ============================================================================

export interface MetaTagOptions {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  tags?: string[];
  noindex?: boolean;
  canonical?: string;
}

export function generateMetaTags(options: MetaTagOptions = {}): Record<string, string> {
  const {
    title,
    description = SITE_CONFIG.description,
    image = SITE_CONFIG.image,
    url,
    type = 'website',
    publishedTime,
    modifiedTime,
    authors,
    tags,
    noindex = false,
    canonical,
  } = options;

  const fullTitle = title ? `${title} | ${SITE_CONFIG.name}` : SITE_CONFIG.name;
  const fullUrl = url ? `${SITE_CONFIG.url}${url}` : SITE_CONFIG.url;
  const fullImage = image.startsWith('http') ? image : `${SITE_CONFIG.url}${image}`;

  const meta: Record<string, string> = {
    title: fullTitle,
    description,
    // Basic
    'og:title': fullTitle,
    'og:description': description,
    'og:image': fullImage,
    'og:url': fullUrl,
    'og:type': type,
    'og:site_name': SITE_CONFIG.name,
    'og:locale': SITE_CONFIG.locale,
    'og:locale:alternate': SITE_CONFIG.localeAlternate,
    // Twitter
    'twitter:card': 'summary_large_image',
    'twitter:site': SITE_CONFIG.twitterHandle,
    'twitter:title': fullTitle,
    'twitter:description': description,
    'twitter:image': fullImage,
    // Article specific
    ...(type === 'article' && publishedTime && { 'article:published_time': publishedTime }),
    ...(type === 'article' && modifiedTime && { 'article:modified_time': modifiedTime }),
    ...(type === 'article' && authors && { 'article:author': authors.join(',') }),
    ...(type === 'article' && tags && { 'article:tag': tags.join(',') }),
    // Robots
    ...(noindex && { robots: 'noindex, nofollow' }),
    // Canonical
    ...(canonical && { 'canonical': canonical }),
  };

  return meta;
}

// ============================================================================
// Structured Data (JSON-LD)
// ============================================================================

export interface ArticleStructuredData {
  title: string;
  description: string;
  image?: string;
  url: string;
  publishedTime: string;
  modifiedTime?: string;
  authors: { name: string; url?: string }[];
  category?: string;
  tags?: string[];
  readTime?: number;
}

export function generateArticleStructuredData(article: ArticleStructuredData): string {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    image: article.image,
    url: article.url,
    datePublished: article.publishedTime,
    ...(article.modifiedTime && { dateModified: article.modifiedTime }),
    author: article.authors.map((author) => ({
      '@type': 'Person',
      name: author.name,
      ...(author.url && { url: author.url }),
    })),
    ...(article.category && { articleSection: article.category }),
    ...(article.tags && { keywords: article.tags.join(', ') }),
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_CONFIG.url}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': article.url,
    },
  };

  return JSON.stringify(schema);
}

export interface ToolStructuredData {
  name: string;
  description: string;
  image?: string;
  url: string;
  price?: number;
  priceCurrency?: string;
  category?: string;
  rating?: number;
  reviewCount?: number;
  pricingModel?: 'free' | 'freemium' | 'paid' | 'contact';
}

export function generateToolStructuredData(tool: ToolStructuredData): string {
  const priceSpecification = tool.pricingModel === 'free'
    ? { '@type': 'Offer', price: '0', priceCurrency: tool.priceCurrency || 'USD', availability: 'https://schema.org/InStock' }
    : tool.pricingModel === 'freemium'
      ? { '@type': 'Offer', price: '0', priceCurrency: tool.priceCurrency || 'USD', availability: 'https://schema.org/InStock' }
      : tool.price
          ? { '@type': 'Offer', price: tool.price.toString(), priceCurrency: tool.priceCurrency || 'USD', availability: 'https://schema.org/InStock' }
          : { '@type': 'Offer', availability: 'https://schema.org/InStock' };

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: tool.name,
    description: tool.description,
    image: tool.image,
    url: tool.url,
    applicationCategory: tool.category || 'BusinessApplication',
    offers: priceSpecification,
    ...(tool.rating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: tool.rating.toString(),
        reviewCount: (tool.reviewCount || 0).toString(),
      },
    }),
  };

  return JSON.stringify(schema);
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function generateBreadcrumbStructuredData(items: BreadcrumbItem[]): string {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_CONFIG.url}${item.url}`,
    })),
  };

  return JSON.stringify(schema);
}

// ============================================================================
// OG Image Generation (URL-based)
// ============================================================================

export interface OGImageOptions {
  title: string;
  description?: string;
  type?: 'article' | 'tool' | 'default';
  accentColor?: string;
}

export function generateOGImageUrl(options: OGImageOptions): string {
  const { title, description, type = 'default', accentColor = '#6366F1' } = options;

  // For now, return placeholder - in production you'd use a service like vercel/og
  const params = new URLSearchParams({
    title,
    ...(description && { description }),
    type,
    accentColor,
  });

  return `${SITE_CONFIG.url}/api/og?${params.toString()}`;
}

// ============================================================================
// Sitemap Types
// ============================================================================

export interface SitemapUrl {
  url: string;
  lastModified?: Date | string;
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export interface SitemapIndex {
  urls: SitemapUrl[];
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Calculate reading time for article content
 */
export function calculateReadTime(content: string, wordsPerMinute: number = 200): number {
  const text = content.replace(/<[^>]*>/g, ''); // Strip HTML tags
  const words = text.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

/**
 * Generate slug from title
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s\u0600-\u06FF-]/g, '') // Keep Arabic and English letters, numbers, spaces, and hyphens
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

// ============================================================================
// Export config for reuse
// ============================================================================

export { SITE_CONFIG };
export type { ClassValue };
