// =============================================
// API - Admin Comments Endpoints
// =============================================

import { NextResponse } from 'next/server';

// Mock data
const mockComments = [
  { id: '1', content: 'مقال رائع! شكراً على المعلومات المفيدة', article_id: '1', tool_id: null, parent_id: null, author_id: '2', is_approved: true, created_at: '2026-05-20T10:30:00Z', updated_at: '2026-05-20T10:30:00Z', author: { id: '2', display_name: 'أحمد محمد', email: 'ahmed@example.com', avatar_url: null } },
  { id: '2', content: 'هل تنصح باستخدام الإصدار المجاني أم المدفوع؟', article_id: null, tool_id: '1', parent_id: null, author_id: '3', is_approved: false, created_at: '2026-05-21T14:15:00Z', updated_at: '2026-05-21T14:15:00Z', author: { id: '3', display_name: 'سارة أحمد', email: 'sara@example.com', avatar_url: null } },
  { id: '3', content: 'أدوات رائعة! سأحاول استخدامها', article_id: '2', tool_id: null, parent_id: null, author_id: '4', is_approved: true, created_at: '2026-05-22T09:00:00Z', updated_at: '2026-05-22T09:00:00Z', author: { id: '4', display_name: 'خالد علي', email: 'khaled@example.com', avatar_url: null } },
];

const commentsStore = [...mockComments];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search');
  const approved = searchParams.get('approved');
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = parseInt(searchParams.get('pageSize') || '20');
  
  let filtered = [...commentsStore];
  
  // Apply filters
  if (search) {
    const searchLower = search.toLowerCase();
    filtered = filtered.filter(c => 
      c.content.toLowerCase().includes(searchLower) ||
      c.author?.display_name?.toLowerCase().includes(searchLower)
    );
  }
  
  if (approved !== null && approved !== undefined) {
    const isApproved = approved === 'true';
    filtered = filtered.filter(c => c.is_approved === isApproved);
  }
  
  // Pagination
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const paginatedComments = filtered.slice(start, end);
  
  return NextResponse.json({
    success: true,
    data: paginatedComments,
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

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;
    
    const index = commentsStore.findIndex(c => c.id === id);
    
    if (index === -1) {
      return NextResponse.json({
        success: false,
        error: 'Comment not found',
      }, { status: 404 });
    }
    
    const updatedComment = {
      ...commentsStore[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    
    commentsStore[index] = updatedComment;
    
    return NextResponse.json({
      success: true,
      data: updatedComment,
    });
  } catch (error) {
    console.error('Error updating comment:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update comment',
    }, { status: 500 });
  }
}