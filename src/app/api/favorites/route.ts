// =============================================
// API Routes - Favorites
// GET: Get user's favorites
// POST: Add to favorites
// DELETE: Remove from favorites
// =============================================

import { NextRequest, NextResponse } from 'next/server';
import { successResponse, errorResponse } from '@/lib/api/response';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const favoriteSchema = z.object({
  tool_id: z.string().uuid().optional(),
  article_id: z.string().uuid().optional(),
});

export async function GET() {
  try {
    const supabase = await createClient();

    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      return NextResponse.json(errorResponse('يرجى تسجيل الدخول أولاً'), { status: 401 });
    }

    const { data: favorites, error } = await supabase
      .from('favorites')
      .select(`
        id,
        tool_id,
        article_id,
        created_at,
        tool:tools(id, name, slug, description, logo_url, stats),
        article:articles(id, title, slug, excerpt, cover_image_url)
      `)
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json(errorResponse(error.message), { status: 500 });
    }

    return NextResponse.json(successResponse({ favorites: favorites ?? [] }));
  } catch (error) {
    console.error('Favorites GET error:', error);
    return NextResponse.json(errorResponse('Internal server error'), { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      return NextResponse.json(errorResponse('يرجى تسجيل الدخول أولاً'), { status: 401 });
    }

    const body = await request.json();
    const validated = favoriteSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(errorResponse(validated.error.message), { status: 400 });
    }

    const { tool_id, article_id } = validated.data;

    if (!tool_id && !article_id) {
      return NextResponse.json(errorResponse('tool_id or article_id is required'), { status: 400 });
    }

    // Check for duplicate
    const { data: existing } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', session.user.id)
      .eq(tool_id ? 'tool_id' : 'article_id', tool_id ?? article_id!)
      .single();

    if (existing) {
      return NextResponse.json(
        successResponse({ message: 'موجود بالفعل في المفضلة', id: existing.id }),
        { status: 200 }
      );
    }

    const { data, error } = await supabase
      .from('favorites')
      .insert({
        user_id: session.user.id,
        tool_id: tool_id ?? undefined,
        article_id: article_id ?? undefined,
      })
      .select('id')
      .single();

    if (error) {
      return NextResponse.json(errorResponse(error.message), { status: 500 });
    }

    return NextResponse.json(successResponse({ id: data.id }), { status: 201 });
  } catch (error) {
    console.error('Favorites POST error:', error);
    return NextResponse.json(errorResponse('Internal server error'), { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      return NextResponse.json(errorResponse('يرجى تسجيل الدخول أولاً'), { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(errorResponse('id is required'), { status: 400 });
    }

    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('id', id)
      .eq('user_id', session.user.id);

    if (error) {
      return NextResponse.json(errorResponse(error.message), { status: 500 });
    }

    return NextResponse.json(successResponse({ message: 'تم الحذف' }));
  } catch (error) {
    console.error('Favorites DELETE error:', error);
    return NextResponse.json(errorResponse('Internal server error'), { status: 500 });
  }
}
