// =============================================
// API Routes - Admin Comments Management
// GET: list comments with filters
// PUT: approve/reject comment
// DELETE: delete comment
// =============================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { successResponse, errorResponse, paginatedResponse } from '@/lib/api/response';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');
    const approved = searchParams.get('approved');
    const entityType = searchParams.get('entityType');
    const search = searchParams.get('search');
    const offset = (page - 1) * pageSize;

    // Build query
    let query = supabase
      .from('comments')
      .select(`
        *,
        author:profiles(id, display_name, email, avatar_url),
        article:articles(id, title, slug),
        tool:tools(id, name, slug)
      `, { count: 'exact' });

    // Apply filters
    if (approved !== undefined && approved !== null && approved !== '') {
      query = query.eq('is_approved', approved === 'true');
    }
    if (entityType === 'article') {
      query = query.not('article_id', 'is', null);
    } else if (entityType === 'tool') {
      query = query.not('tool_id', 'is', null);
    }
    if (search) {
      query = query.or(`content.ilike.%${search}%`);
    }

    // Order and paginate
    query = query.order('created_at', { ascending: false }).range(offset, offset + pageSize - 1);

    const { data: comments, error, count } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(errorResponse('Failed to fetch comments'), { status: 500 });
    }

    return NextResponse.json(paginatedResponse(comments || [], { page, pageSize, totalCount: count || 0 }));
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(errorResponse('Internal server error'), { status: 500 });
  }
}

// PUT /api/admin/comments - Update comment (approve/reject)
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check authentication and role
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(errorResponse('Unauthorized'), { status: 401 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (!profile || !['admin', 'editor'].includes(profile.role)) {
      return NextResponse.json(errorResponse('Admin or editor access required'), { status: 403 });
    }

    const body = await request.json();
    const { id, is_approved, content } = body;

    if (!id) {
      return NextResponse.json(errorResponse('Comment ID required'), { status: 400 });
    }

    // Update comment
    const updateData: Record<string, unknown> = {};
    if (is_approved !== undefined) updateData.is_approved = is_approved;
    if (content !== undefined) updateData.content = content;

    const { data: comment, error: updateError } = await supabase
      .from('comments')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Update error:', updateError);
      return NextResponse.json(errorResponse('Failed to update comment'), { status: 500 });
    }

    return NextResponse.json(successResponse(comment, 'Comment updated successfully'));
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(errorResponse('Internal server error'), { status: 500 });
  }
}

// DELETE /api/admin/comments - Delete comment
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const commentId = searchParams.get('id');

    if (!commentId) {
      return NextResponse.json(errorResponse('Comment ID required'), { status: 400 });
    }

    // Check authentication and role
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(errorResponse('Unauthorized'), { status: 401 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json(errorResponse('Admin access required'), { status: 403 });
    }

    // Delete comment
    const { error: deleteError } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId);

    if (deleteError) {
      console.error('Delete error:', deleteError);
      return NextResponse.json(errorResponse('Failed to delete comment'), { status: 500 });
    }

    return NextResponse.json(successResponse(null, 'Comment deleted successfully'));
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(errorResponse('Internal server error'), { status: 500 });
  }
}
