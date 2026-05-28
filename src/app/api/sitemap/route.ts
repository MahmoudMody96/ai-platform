// =============================================
// Sitemap API Route - /api/sitemap
// =============================================

import { NextResponse } from 'next/server';
import { 
  generateSitemapXml,
  generateArticleSitemap,
  generateToolSitemap,
  generateCategorySitemap,
  STATIC_PAGES 
} from '@/lib/seo/sitemap';

// Mock data for development - in production this would come from Supabase
const mockArticles = [
  { slug: 'ai-revolution-2025', published_at: '2025-05-28', updated_at: '2025-05-28' },
  { slug: 'chatgpt-vs-claude', published_at: '2025-05-27', updated_at: '2025-05-27' },
  { slug: 'future-of-coding', published_at: '2025-05-25', updated_at: '2025-05-25' },
  { slug: 'ai-tools-for-business', published_at: '2025-05-26', updated_at: '2025-05-26' },
  { slug: 'midjourney-tutorial', published_at: '2025-05-24', updated_at: '2025-05-24' },
  { slug: 'ai-writing-tools', published_at: '2025-05-23', updated_at: '2025-05-23' },
  { slug: 'claude-api-guide', published_at: '2025-05-21', updated_at: '2025-05-21' },
  { slug: 'stable-diffusion-vs-dalle', published_at: '2025-05-19', updated_at: '2025-05-19' },
];

const mockTools = [
  { slug: 'chatgpt', updated_at: '2025-05-28' },
  { slug: 'midjourney', updated_at: '2025-05-28' },
  { slug: 'claude', updated_at: '2025-05-28' },
  { slug: 'github-copilot', updated_at: '2025-05-27' },
  { slug: 'dall-e-3', updated_at: '2025-05-27' },
  { slug: 'perplexity', updated_at: '2025-05-26' },
];

const mockCategories = [
  { slug: 'writing', updated_at: '2025-05-01' },
  { slug: 'design', updated_at: '2025-05-01' },
  { slug: 'development', updated_at: '2025-05-01' },
  { slug: 'automation', updated_at: '2025-05-01' },
  { slug: 'marketing', updated_at: '2025-05-01' },
  { slug: 'video', updated_at: '2025-05-01' },
];

export async function GET() {
  try {
    // Generate dynamic pages
    const articlePages = generateArticleSitemap(mockArticles);
    const toolPages = generateToolSitemap(mockTools);
    const categoryPages = generateCategorySitemap(mockCategories);
    
    // Combine all pages
    const dynamicPages = [...articlePages, ...toolPages, ...categoryPages];
    
    // Generate sitemap XML
    const sitemapXml = generateSitemapXml(STATIC_PAGES, dynamicPages);
    
    // Return XML response
    return new NextResponse(sitemapXml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (error) {
    console.error('Sitemap generation error:', error);
    return new NextResponse('Error generating sitemap', { status: 500 });
  }
}
