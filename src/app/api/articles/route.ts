// =============================================
// API - Articles Endpoints
// =============================================

import { NextResponse } from 'next/server';

// Mock data
const mockArticles = [
  { id: '1', title: 'مراجعة شاملة لـ ChatGPT', slug: 'review-chatgpt', excerpt: 'نظرة متعمقة على نموذج ChatGPT وقدراته', content: 'مقال مفصل عن ChatGPT...', cover_image_url: null, category_id: '1', tags: ['chatgpt', 'review'], status: 'published', featured: true, read_time: 8, author_id: '1', created_at: '2026-05-01', updated_at: '2026-05-20' },
  { id: '2', title: 'أفضل أدوات توليد الصور بالذكاء الاصطناعي', slug: 'best-ai-image-generators', excerpt: 'قائمة بأفضل 10 أدوات لتوليد الصور', content: 'في هذا المقال نستعرض...', cover_image_url: null, category_id: '2', tags: ['images', 'ai'], status: 'published', featured: true, read_time: 12, author_id: '1', created_at: '2026-05-05', updated_at: '2026-05-18' },
  { id: '3', title: 'كيف تستخدم Claude في العمل', slug: 'using-claude-at-work', excerpt: 'دليل عملي لاستخدام Claude في بيئة العمل', content: 'Claude من Anthropic...', cover_image_url: null, category_id: '1', tags: ['claude', 'guide'], status: 'draft', featured: false, read_time: 6, author_id: '1', created_at: '2026-05-10', updated_at: '2026-05-15' },
];

let articlesStore = [...mockArticles];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search');
  const category = searchParams.get('category');
  const status = searchParams.get('status');
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = parseInt(searchParams.get('pageSize') || '20');
  
  let filtered = [...articlesStore];
  
  // Apply filters
  if (search) {
    const searchLower = search.toLowerCase();
    filtered = filtered.filter(a => 
      a.title.toLowerCase().includes(searchLower) || 
      a.excerpt?.toLowerCase().includes(searchLower)
    );
  }
  
  if (category) {
    filtered = filtered.filter(a => a.category_id === category);
  }
  
  if (status) {
    filtered = filtered.filter(a => a.status === status);
  }
  
  // Pagination
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const paginatedArticles = filtered.slice(start, end);
  
  return NextResponse.json({
    success: true,
    data: paginatedArticles,
    pagination: {
      page,
      pageSize,
      totalCount: filtered.length,
      totalPages: Math.ceil(filtered.length / pageSize),
      hasNextPage: end < filtered.length,
      hasPrevPage: page > 1,
    },
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const newArticle = {
      id: String(Date.now()),
      title: body.title || 'Untitled Article',
      slug: body.slug || body.title?.toLowerCase().replace(/\s+/g, '-') || `article-${Date.now()}`,
      excerpt: body.excerpt || null,
      content: body.content || null,
      cover_image_url: body.cover_image_url || null,
      category_id: body.category_id || null,
      tags: body.tags || [],
      status: body.status || 'draft',
      featured: body.featured || false,
      read_time: body.read_time || 5,
      author_id: body.author_id || '1',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    articlesStore.unshift(newArticle);
    
    return NextResponse.json({
      success: true,
      data: newArticle,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating article:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create article',
    }, { status: 500 });
  }
}