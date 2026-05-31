// =============================================
// API - Single Category Endpoint
// =============================================

import { NextResponse } from 'next/server';

const mockCategories = [
  { id: '1', name: 'الكتابة', slug: 'writing', description: 'أدوات لكتابة المحتوى', icon: '✍️', color: '#6366F1', sort_order: 1, parent_id: null, created_at: '2026-01-01' },
  { id: '2', name: 'التصميم', slug: 'design', description: 'أدوات التصميم الجرافيكي', icon: '🎨', color: '#EC4899', sort_order: 2, parent_id: null, created_at: '2026-01-01' },
  { id: '3', name: 'التطوير', slug: 'development', description: 'أدوات البرمجة', icon: '💻', color: '#10B981', sort_order: 3, parent_id: null, created_at: '2026-01-01' },
  { id: '4', name: 'الأتمتة', slug: 'automation', description: 'أدوات أتمتة المهام', icon: '⚡', color: '#F59E0B', sort_order: 4, parent_id: null, created_at: '2026-01-01' },
  { id: '5', name: 'التسويق', slug: 'marketing', description: 'أدوات التسويق الرقمي', icon: '📊', color: '#3B82F6', sort_order: 5, parent_id: null, created_at: '2026-01-01' },
  { id: '6', name: 'الفيديو', slug: 'video', description: 'أدوات إنتاج الفيديو', icon: '🎬', color: '#8B5CF6', sort_order: 6, parent_id: null, created_at: '2026-01-01' },
  { id: '7', name: 'التعليم', slug: 'education', description: 'أدوات التعلم والتعليم', icon: '📚', color: '#14B8A6', sort_order: 7, parent_id: null, created_at: '2026-01-01' },
  { id: '8', name: 'البحث', slug: 'research', description: 'محركات بحث ذكية', icon: '🔍', color: '#F97316', sort_order: 8, parent_id: null, created_at: '2026-01-01' },
  { id: '9', name: 'الصوت', slug: 'audio', description: 'أدوات الصوت والكلام', icon: '🎙️', color: '#EF4444', sort_order: 9, parent_id: null, created_at: '2026-01-01' },
  { id: '10', name: 'العروض', slug: 'presentations', description: 'أدوات العروض التقديمية', icon: '📽️', color: '#84CC16', sort_order: 10, parent_id: null, created_at: '2026-01-01' },
];

const categoriesStore = [...mockCategories];

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const category = categoriesStore.find(c => c.id === id || c.slug === id);
  
  if (!category) {
    return NextResponse.json({
      success: false,
      error: 'Category not found',
    }, { status: 404 });
  }
  
  return NextResponse.json({
    success: true,
    data: category,
  });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const index = categoriesStore.findIndex(c => c.id === id);
  
  if (index === -1) {
    return NextResponse.json({
      success: false,
      error: 'Category not found',
    }, { status: 404 });
  }
  
  try {
    const body = await request.json();
    
    const updatedCategory = {
      ...categoriesStore[index],
      ...body,
    };
    
    categoriesStore[index] = updatedCategory;
    
    return NextResponse.json({
      success: true,
      data: updatedCategory,
    });
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update category',
    }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const index = categoriesStore.findIndex(c => c.id === id);
  
  if (index === -1) {
    return NextResponse.json({
      success: false,
      error: 'Category not found',
    }, { status: 404 });
  }
  
  categoriesStore.splice(index, 1);
  
  return NextResponse.json({
    success: true,
    message: 'Category deleted successfully',
  });
}