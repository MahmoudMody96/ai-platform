// =============================================
// API Routes - Reviews
// GET: Get reviews for a tool or article
// POST: Create a review (authenticated)
// =============================================

import { NextRequest, NextResponse } from 'next/server';
import { successResponse, errorResponse } from '@/lib/api/response';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const reviewSchema = z.object({
  tool_id: z.string().uuid().optional(),
  article_id: z.string().uuid().optional(),
  rating: z.number().min(1).max(5).optional(),
  title: z.string().max(200).optional(),
  content: z.string().min(10).max(2000),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const toolId = searchParams.get('tool_id');
    const articleId = searchParams.get('article_id');
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '20'), 50);
    const offset = parseInt(searchParams.get('offset') ?? '0');

    if (!toolId && !articleId) {
      return NextResponse.json(errorResponse('tool_id or article_id is required'), { status: 400 });
    }
    const _supabaseClient = await createClient();
    if (!_supabaseClient) {
      return NextResponse.json(
        { success: false, error: 'Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your environment.' },
        { status: 503 }
      );
    }


    const supabase = _supabaseClient;

    let query = supabase
      .from('comments')
      .select(`
        id,
        content,
        created_at,
        author:profiles(id, display_name, avatar_url)
      `)
      .eq('is_approved', true)
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    if (toolId) {
      query = query.eq('tool_id', toolId);
    } else {
      query = query.eq('article_id', articleId!);
    }

    const { data: reviews, error } = await query;

    if (error) {
      return NextResponse.json(errorResponse(error.message), { status: 500 });
    }

    // Parse JSON content and extract ratings
    const parsedReviews = (reviews ?? []).map(r => {
      let parsed = { rating: 0, title: '', body: '' };
      try {
        parsed = JSON.parse(r.content);
      } catch {
        parsed = { rating: 0, title: '', body: r.content };
      }
      return {
        ...r,
        content: parsed.body,
        rating: parsed.rating,
        title: parsed.title,
      };
    });

    // Calculate average rating
    const ratings = parsedReviews.filter(r => r.rating > 0).map(r => r.rating);
    const averageRating = ratings.length > 0
      ? ratings.reduce((a, b) => a + b, 0) / ratings.length
      : 0;

    return NextResponse.json(successResponse({
      reviews: parsedReviews,
      average_rating: Math.round(averageRating * 10) / 10,
      total: parsedReviews.length,
    }));
  } catch (error) {
    console.error('Reviews GET error:', error);
    return NextResponse.json(errorResponse('Internal server error'), { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const _supabaseClient = await createClient();
    if (!_supabaseClient) {
      return NextResponse.json(
        { success: false, error: 'Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your environment.' },
        { status: 503 }
      );
    }

    const supabase = _supabaseClient;

    // Check authentication
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      return NextResponse.json(errorResponse('يرجى تسجيل الدخول أولاً'), { status: 401 });
    }

    const body = await request.json();
    const validated = reviewSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(errorResponse(validated.error.message), { status: 400 });
    }

    const { tool_id, article_id, rating, title, content } = validated.data;

    if (!tool_id && !article_id) {
      return NextResponse.json(errorResponse('tool_id or article_id is required'), { status: 400 });
    }

    // Check for existing review
    const { data: existing } = await supabase
      .from('comments')
      .select('id')
      .eq('author_id', session.user.id)
      .eq(tool_id ? 'tool_id' : 'article_id', tool_id ?? article_id!)
      .single();

    if (existing) {
      return NextResponse.json(
        errorResponse('لقد كتبت مراجعة سابقاً لهذا العنصر'),
        { status: 409 }
      );
    }

    // Create review
    const { data, error } = await supabase.from('comments').insert({
      author_id: session.user.id,
      tool_id: tool_id ?? undefined,
      article_id: article_id ?? undefined,
      content: JSON.stringify({ rating, title, body: content }),
      is_approved: true,
    }).select().single();

    if (error) {
      return NextResponse.json(errorResponse(error.message), { status: 500 });
    }

    return NextResponse.json(successResponse({ review: data }), { status: 201 });
  } catch (error) {
    console.error('Reviews POST error:', error);
    return NextResponse.json(errorResponse('Internal server error'), { status: 500 });
  }
}
