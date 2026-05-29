// =============================================
// API - Delete Comment Endpoint
// =============================================

import { NextResponse } from 'next/server';

const mockComments = [
  { id: '1', content: 'مقال رائع! شكراً على المعلومات المفيدة', article_id: '1', tool_id: null, parent_id: null, author_id: '2', is_approved: true, created_at: '2026-05-20T10:30:00Z', updated_at: '2026-05-20T10:30:00Z', author: { id: '2', display_name: 'أحمد محمد', email: 'ahmed@example.com', avatar_url: null } },
  { id: '2', content: 'هل تنصح باستخدام الإصدار المجاني أم المدفوع؟', article_id: null, tool_id: '1', parent_id: null, author_id: '3', is_approved: false, created_at: '2026-05-21T14:15:00Z', updated_at: '2026-05-21T14:15:00Z', author: { id: '3', display_name: 'سارة أحمد', email: 'sara@example.com', avatar_url: null } },
  { id: '3', content: 'أدوات رائعة! سأحاول استخدامها', article_id: '2', tool_id: null, parent_id: null, author_id: '4', is_approved: true, created_at: '2026-05-22T09:00:00Z', updated_at: '2026-05-22T09:00:00Z', author: { id: '4', display_name: 'خالد علي', email: 'khaled@example.com', avatar_url: null } },
];

let commentsStore = [...mockComments];

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const index = commentsStore.findIndex(c => c.id === id);
  
  if (index === -1) {
    return NextResponse.json({
      success: false,
      error: 'Comment not found',
    }, { status: 404 });
  }
  
  commentsStore.splice(index, 1);
  
  return NextResponse.json({
    success: true,
    message: 'Comment deleted successfully',
  });
}