// =============================================
// API - Single Tool Endpoint
// Connected to Supabase
// =============================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { successResponse, errorResponse } from '@/lib/api/response';
import { z } from 'zod';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    // Try to find by ID or slug
    const { data: tool, error } = await supabase
      .from('tools')
      .select(`
        *,
        category:categories(id, name, slug, color, icon)
      `)
      .or(`id.eq.${id},slug.eq.${id}`)
      .eq('status', 'published')
      .single();

    if (error || !tool) {
      return NextResponse.json(errorResponse('الأداة غير موجودة'), { status: 404 });
    }

    // Get recent reviews
    const { data: reviews } = await supabase
      .from('reviews')
      .select(`
        id,
        rating,
        title,
        content,
        pros,
        cons,
        created_at,
        author:profiles(id, display_name, avatar_url)
      `)
      .eq('tool_id', tool.id)
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .limit(10);

    // Get similar tools (same category)
    const { data: similarTools } = await supabase
      .from('tools')
      .select(`
        id,
        name,
        slug,
        tagline,
        logo_url,
        pricing_type,
        rating_avg
      `)
      .eq('category_id', tool.category_id)
      .eq('status', 'published')
      .neq('id', tool.id)
      .order('rating_avg', { ascending: false })
      .limit(4);

    // Get rating breakdown
    const { data: ratingStats } = await supabase
      .from('reviews')
      .select('rating')
      .eq('tool_id', tool.id)
      .eq('status', 'approved');

    const ratingBreakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } as Record<number, number>;
    ratingStats?.forEach(r => {
      if (r.rating >= 1 && r.rating <= 5) {
        ratingBreakdown[r.rating]++;
      }
    });

    return NextResponse.json(successResponse({
      data: {
        ...tool,
        recent_reviews: reviews || [],
        alternatives: similarTools || [],
        stats: {
          rating_avg: tool.rating_avg,
          rating_count: tool.rating_count,
          rating_breakdown: ratingBreakdown,
        },
      },
    }));
  } catch (error) {
    console.error('Tool detail error:', error);
    return NextResponse.json(errorResponse('Internal server error'), { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    // Check auth
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      return NextResponse.json(errorResponse('يرجى تسجيل الدخول أولاً'), { status: 401 });
    }

    // Check admin role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json(errorResponse('غير مصرح'), { status: 403 });
    }

    const body = await request.json();

    // Validation (all fields optional)
    const updateSchema = z.object({
      name: z.string().min(2).max(100).optional(),
      slug: z.string().min(2).max(200).regex(/^[a-z0-9-]+$/).optional(),
      tagline: z.string().max(150).optional().nullable(),
      description: z.string().min(50).optional().nullable(),
      website_url: z.string().url().optional(),
      logo_url: z.string().url().optional().nullable(),
      category_id: z.string().uuid().optional().nullable(),
      pricing_type: z.enum(['free', 'freemium', 'paid', 'enterprise', 'contact']).optional(),
      starting_price: z.number().min(0).optional().nullable(),
      tags: z.array(z.string()).max(10).optional(),
      features: z.array(z.object({ title: z.string(), desc: z.string() })).optional(),
      is_featured: z.boolean().optional(),
      status: z.enum(['pending', 'published', 'rejected', 'archived']).optional(),
    });

    const validated = updateSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(errorResponse(validated.error.issues[0].message), { status: 400 });
    }

    // Update tool
    const { data: tool, error } = await supabase
      .from('tools')
      .update({
        ...validated.data,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating tool:', error);
      return NextResponse.json(errorResponse(error.message), { status: 500 });
    }

    return NextResponse.json(successResponse({ data: tool }));
  } catch (error) {
    console.error('Update tool error:', error);
    return NextResponse.json(errorResponse('Internal server error'), { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    // Check auth
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      return NextResponse.json(errorResponse('يرجى تسجيل الدخول أولاً'), { status: 401 });
    }

    // Check admin role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json(errorResponse('غير مصرح'), { status: 403 });
    }

    const { error } = await supabase
      .from('tools')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting tool:', error);
      return NextResponse.json(errorResponse(error.message), { status: 500 });
    }

    return NextResponse.json(successResponse({ message: 'تم حذف الأداة بنجاح' }));
  } catch (error) {
    console.error('Delete tool error:', error);
    return NextResponse.json(errorResponse('Internal server error'), { status: 500 });
  }
}