// =============================================
// API - Single Article Endpoint
// =============================================

import { NextResponse } from 'next/server';

const mockArticles = [
  { id: '1', title: 'مراجعة شاملة لـ ChatGPT', slug: 'review-chatgpt', excerpt: 'نظرة متعمقة على نموذج ChatGPT وقدراته', content: 'مقال مفصل عن ChatGPT...', cover_image_url: null, category_id: '1', tags: ['chatgpt', 'review'], status: 'published', featured: true, read_time: 8, author_id: '1', created_at: '2026-05-01', updated_at: '2026-05-20' },
  { id: '2', title: 'أفضل أدوات توليد الصور بالذكاء الاصطناعي', slug: 'best-ai-image-generators', excerpt: 'قائمة بأفضل 10 أدوات لتوليد الصور', content: 'في هذا المقال نستعرض...', cover_image_url: null, category_id: '2', tags: ['images', 'ai'], status: 'published', featured: true, read_time: 12, author_id: '1', created_at: '2026-05-05', updated_at: '2026-05-18' },
  { id: '3', title: 'كيف تستخدم Claude في العمل', slug: 'using-claude-at-work', excerpt: 'دليل عملي لاستخدام Claude في بيئة العمل', content: 'Claude من Anthropic...', cover_image_url: null, category_id: '1', tags: ['claude', 'guide'], status: 'draft', featured: false, read_time: 6, author_id: '1', created_at: '2026-05-10', updated_at: '2026-05-15' },
];

let articlesStore = [...mockArticles];

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const article = articlesStore.find(a => a.id === id || a.slug === id);
  
  if (!article) {
    return NextResponse.json({
      success: false,
      error: 'Article not found',
    }, { status: 404 });
  }
  
  return NextResponse.json({
    success: true,
    data: article,
  });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const index = articlesStore.findIndex(a => a.id === id);
  
  if (index === -1) {
    return NextResponse.json({
      success: false,
      error: 'Article not found',
    }, { status: 404 });
  }
  
  try {
    const body = await request.json();
    
    const updatedArticle = {
      ...articlesStore[index],
      ...body,
      updated_at: new Date().toISOString(),
    };
    
    articlesStore[index] = updatedArticle;
    
    return NextResponse.json({
      success: true,
      data: updatedArticle,
    });
  } catch (error) {
    console.error('Error updating article:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update article',
    }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const index = articlesStore.findIndex(a => a.id === id);
  
  if (index === -1) {
    return NextResponse.json({
      success: false,
      error: 'Article not found',
    }, { status: 404 });
  }
  
  articlesStore.splice(index, 1);
  
  return NextResponse.json({
    success: true,
    message: 'Article deleted successfully',
  });
}