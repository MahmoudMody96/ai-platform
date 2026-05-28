// =============================================
// API Routes - Articles
// GET: list articles with filters
// POST: create article
// PUT: update article
// DELETE: delete article
// =============================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { articleFilterSchema, createArticleSchema, updateArticleSchema } from '@/lib/validation/schemas';
import { successResponse, errorResponse, paginatedResponse } from '@/lib/api/response';
import type { Article } from '@/types';

// GET /api/articles - List articles with filters
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);

    // Parse and validate filters
    const filters = articleFilterSchema.safeParse({
      page: searchParams.get('page') || 1,
      pageSize: searchParams.get('pageSize') || 20,
      category: searchParams.get('category'),
      status: searchParams.get('status'),
      search: searchParams.get('search'),
      featured: searchParams.get('featured'),
      author: searchParams.get('author'),
    });

    if (!filters.success) {
      return NextResponse.json(
        errorResponse('Invalid query parameters'),
        { status: 400 }
      );
    }

    const { page, pageSize, category, status, search, featured, author } = filters.data;
    const offset = (page - 1) * pageSize;

    // Build query
    let query = supabase
      .from('articles')
      .select('*, author:profiles(*), category:categories(*)', { count: 'exact' });

    // Apply filters
    if (category) {
      query = query.eq('category_id', category);
    }
    if (status) {
      query = query.eq('status', status);
    } else {
      // Default to published only for public access
      query = query.eq('status', 'published');
    }
    if (featured !== undefined) {
      query = query.eq('featured', featured);
    }
    if (author) {
      query = query.eq('author_id', author);
    }
    if (search) {
      query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%`);
    }

    // Order by published_at desc and paginate
    query = query
      .order('published_at', { ascending: false, nullsFirst: false })
      .range(offset, offset + pageSize - 1);

    const { data: articles, error, count } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        errorResponse('Failed to fetch articles'),
        { status: 500 }
      );
    }

    return NextResponse.json(
      paginatedResponse<Article>(articles || [], { page, pageSize, totalCount: count || 0 })
    );
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      errorResponse('Internal server error'),
      { status: 500 }
    );
  }
}

// POST /api/articles - Create article
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(errorResponse('Unauthorized'), { status: 401 });
    }

    // Parse and validate body
    const body = await request.json();
    const validated = createArticleSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        errorResponse(`Validation error: ${validated.error.message}`),
        { status: 400 }
      );
    }

    // Verify user owns the article or is admin
    if (validated.data.author_id !== user.id) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      if (profile?.role !== 'admin') {
        return NextResponse.json(
          errorResponse('You can only create articles as yourself'),
          { status: 403 }
        );
      }
    }

    // Insert article
    const { data: article, error: insertError } = await supabase
      .from('articles')
      .insert({
        ...validated.data,
        read_time: validated.data.content
          ? Math.ceil(validated.data.content.trim().split(/\s+/).length / 200)
          : 0,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Insert error:', insertError);
      return NextResponse.json(
        errorResponse('Failed to create article'),
        { status: 500 }
      );
    }

    return NextResponse.json(
      successResponse<Article>(article, 'Article created successfully'),
      { status: 201 }
    );
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(errorResponse('Internal server error'), { status: 500 });
  }
}

// PUT /api/articles - Update article
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const articleId = searchParams.get('id');

    if (!articleId) {
      return NextResponse.json(errorResponse('Article ID required'), { status: 400 });
    }

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(errorResponse('Unauthorized'), { status: 401 });
    }

    // Parse and validate body
    const body = await request.json();
    const validated = updateArticleSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        errorResponse(`Validation error: ${validated.error.message}`),
        { status: 400 }
      );
    }

    // Get current article to check ownership
    const { data: currentArticle } = await supabase
      .from('articles')
      .select('author_id')
      .eq('id', articleId)
      .single();

    if (!currentArticle) {
      return NextResponse.json(errorResponse('Article not found'), { status: 404 });
    }

    // Check permission: author or admin/editor
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    const isOwner = currentArticle.author_id === user.id;
    const isPrivileged = profile && ['admin', 'editor'].includes(profile.role);

    if (!isOwner && !isPrivileged) {
      return NextResponse.json(
        errorResponse('You do not have permission to update this article'),
        { status: 403 }
      );
    }

    // Update article
    const { data: article, error: updateError } = await supabase
      .from('articles')
      .update({
        ...validated.data,
        read_time: validated.data.content
          ? Math.ceil(validated.data.content.trim().split(/\s+/).length / 200)
          : undefined,
      })
      .eq('id', articleId)
      .select()
      .single();

    if (updateError) {
      console.error('Update error:', updateError);
      return NextResponse.json(errorResponse('Failed to update article'), { status: 500 });
    }

    return NextResponse.json(successResponse<Article>(article, 'Article updated successfully'));
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(errorResponse('Internal server error'), { status: 500 });
  }
}

// DELETE /api/articles - Delete article
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const articleId = searchParams.get('id');

    if (!articleId) {
      return NextResponse.json(errorResponse('Article ID required'), { status: 400 });
    }

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(errorResponse('Unauthorized'), { status: 401 });
    }

    // Get current article to check ownership
    const { data: currentArticle } = await supabase
      .from('articles')
      .select('author_id')
      .eq('id', articleId)
      .single();

    if (!currentArticle) {
      return NextResponse.json(errorResponse('Article not found'), { status: 404 });
    }

    // Check permission: author or admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    const isOwner = currentArticle.author_id === user.id;
    const isAdmin = profile?.role === 'admin';

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        errorResponse('You do not have permission to delete this article'),
        { status: 403 }
      );
    }

    // Delete article
    const { error: deleteError } = await supabase
      .from('articles')
      .delete()
      .eq('id', articleId);

    if (deleteError) {
      console.error('Delete error:', deleteError);
      return NextResponse.json(errorResponse('Failed to delete article'), { status: 500 });
    }

    return NextResponse.json(successResponse(null, 'Article deleted successfully'));
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(errorResponse('Internal server error'), { status: 500 });
  }
}