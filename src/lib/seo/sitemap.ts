// =============================================
// Sitemap Generation Utilities
// =============================================

import { type SitemapUrl } from './index';

// Site configuration
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://aiplatform.example.com';

// Static pages that should always be included
const STATIC_PAGES: SitemapUrl[] = [
  {
    url: '/',
    changeFrequency: 'daily',
    priority: 1.0,
  },
  {
    url: '/tools',
    changeFrequency: 'daily',
    priority: 0.9,
  },
  {
    url: '/blog',
    changeFrequency: 'daily',
    priority: 0.9,
  },
  {
    url: '/categories',
    changeFrequency: 'weekly',
    priority: 0.8,
  },
  {
    url: '/about',
    changeFrequency: 'monthly',
    priority: 0.6,
  },
];

// ============================================================================
// Sitemap XML Generation
// ============================================================================

export interface SitemapEntry {
  loc: string;
  lastmod?: string;
  changefreq?: string;
  priority?: number;
}

function formatSitemapUrl(entry: SitemapEntry): string {
  let xml = '  <url>';
  xml += `<loc>${escapeXml(entry.loc)}</loc>`;
  
  if (entry.lastmod) {
    const date = new Date(entry.lastmod);
    xml += `<lastmod>${date.toISOString().split('T')[0]}</lastmod>`;
  }
  
  if (entry.changefreq) {
    xml += `<changefreq>${entry.changefreq}</changefreq>`;
  }
  
  if (entry.priority !== undefined) {
    xml += `<priority>${entry.priority.toFixed(1)}</priority>`;
  }
  
  xml += '</url>';
  return xml;
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// ============================================================================
// Generate Sitemap XML
// ============================================================================

export function generateSitemapXml(
  staticPages: SitemapUrl[] = STATIC_PAGES,
  dynamicPages: SitemapUrl[] = []
): string {
  const allPages = [...staticPages, ...dynamicPages];
  
  const urls = allPages.map((page) => ({
    loc: `${SITE_URL}${page.url}`,
    lastmod: page.lastModified 
      ? new Date(page.lastModified).toISOString() 
      : undefined,
    changefreq: page.changeFrequency,
    priority: page.priority,
  }));
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(formatSitemapUrl).join('\n')}
</urlset>`;
}

// ============================================================================
// Generate Robots.txt
// ============================================================================

export function generateRobotsTxt(): string {
  return `# https://www.robotstxt.org/robotstxt.html
User-agent: *
Allow: /

# Sitemap
Sitemap: ${SITE_URL}/sitemap.xml

# Crawl-delay for polite bots
Crawl-delay: 1
`;
}

// ============================================================================
// Generate Article Sitemap
// ============================================================================

export interface ArticleForSitemap {
  slug: string;
  published_at?: string | null;
  updated_at?: string;
}

export function generateArticleSitemap(articles: ArticleForSitemap[]): SitemapUrl[] {
  return articles.map((article) => ({
    url: `/blog/${article.slug}`,
    lastModified: article.updated_at || article.published_at || new Date().toISOString(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));
}

// ============================================================================
// Generate Tools Sitemap
// ============================================================================

export interface ToolForSitemap {
  slug: string;
  updated_at?: string;
}

export function generateToolSitemap(tools: ToolForSitemap[]): SitemapUrl[] {
  return tools.map((tool) => ({
    url: `/tools/${tool.slug}`,
    lastModified: tool.updated_at || new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));
}

// ============================================================================
// Generate Categories Sitemap
// ============================================================================

export interface CategoryForSitemap {
  slug: string;
  updated_at?: string;
}

export function generateCategorySitemap(categories: CategoryForSitemap[]): SitemapUrl[] {
  return categories.map((category) => ({
    url: `/categories/${category.slug}`,
    lastModified: category.updated_at || new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));
}

// ============================================================================
// Export
// ============================================================================

export { STATIC_PAGES };
