// =============================================
// API - Articles Endpoints (Supabase)
// =============================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const errorResponse = (message: string) => ({ success: false, error: message });

// GET /api/articles - List articles
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search');
  const category = searchParams.get('category');
  const status = searchParams.get('status') || 'published';
  const featured = searchParams.get('featured');
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = parseInt(searchParams.get('pageSize') || '12');

  try {
    const supabase = await createClient();

    let query = supabase
      .from('articles')
      .select(`
        id,
        title,
        slug,
        excerpt,
        cover_image_url,
        tags,
        views_count,
        reading_time,
        status,
        published_at,
        created_at,
        category:categories(id, name, slug, color),
        author:profiles(id, display_name, avatar_url)
      `, { count: 'exact' })
      .eq('status', status)
      .order('published_at', { ascending: false });

    // Apply filters
    if (category) {
      query = query.eq('category_id', category);
    }

    if (featured === 'true') {
      query = query.eq('featured', true);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%`);
    }

    // Pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);

    const { data: articles, error, count } = await query;

    if (error) {
      console.error('Articles fetch error:', error);
      // Return empty data instead of error to not crash the UI
      return NextResponse.json({
        success: true,
        data: [],
        meta: {
          total: 0,
          page,
          pageSize,
          totalPages: 0,
          hasNextPage: false,
          hasPrevPage: false,
        },
      });
    }

    const total = count || 0;
    const totalPages = Math.ceil(total / pageSize);

    return NextResponse.json({
      success: true,
      data: articles || [],
      meta: {
        total,
        page,
        pageSize,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error('Articles API error:', error);
    // Return empty data on any error
    return NextResponse.json({
      success: true,
      data: [],
      meta: {
        total: 0,
        page: 1,
        pageSize: 12,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false,
      },
    });
  }
}

// POST /api/articles - Create article (Admin)
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check admin role
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(errorResponse('Unauthorized'), { status: 401 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json(errorResponse('Admin access required'), { status: 403 });
    }

    const body = await request.json();

    const createSchema = z.object({
      title: z.string().min(1).max(200),
      slug: z.string().min(1).max(200).optional(),
      excerpt: z.string().max(500).optional(),
      content: z.string().optional(),
      cover_image_url: z.string().url().optional().nullable(),
      category_id: z.string().uuid().optional().nullable(),
      tags: z.array(z.string()).max(20).optional(),
      status: z.enum(['draft', 'published', 'archived']).optional(),
      reading_time: z.number().int().positive().optional(),
    });

    const validated = createSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(errorResponse(validated.error.issues[0].message), { status: 400 });
    }

    const slug = validated.data.slug || validated.data.title
      .toLowerCase()
      .replace(/[^\w\s\u0600-\u06FF-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    const { data: article, error } = await supabase
      .from('articles')
      .insert({
        title: validated.data.title,
        slug,
        excerpt: validated.data.excerpt,
        content: validated.data.content,
        cover_image_url: validated.data.cover_image_url,
        category_id: validated.data.category_id,
        tags: validated.data.tags || [],
        status: validated.data.status || 'draft',
        reading_time: validated.data.reading_time,
        author_id: user.id,
        published_at: validated.data.status === 'published' ? new Date().toISOString() : null,
      })
      .select(`
        id,
        title,
        slug,
        excerpt,
        cover_image_url,
        tags,
        views_count,
        reading_time,
        status,
        published_at,
        created_at,
        category:categories(id, name, slug, color),
        author:profiles(id, display_name, avatar_url)
      `)
      .single();

    if (error) {
      console.error('Article create error:', error);
      return NextResponse.json(errorResponse('Failed to create article'), { status: 500 });
    }

    return NextResponse.json({ success: true, data: article }, { status: 201 });
  } catch (error) {
    console.error('Articles API error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(errorResponse(error.issues[0].message), { status: 400 });
    }
    return NextResponse.json(errorResponse('Internal server error'), { status: 500 });
  }
}