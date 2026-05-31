// =============================================
// API - Tools Endpoints
// Connected to Supabase
// =============================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { successResponse, errorResponse } from '@/lib/api/response';
import { z } from 'zod';

// Validation schema
const toolsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  category: z.string().optional(),
  pricing: z.enum(['free', 'freemium', 'paid', 'enterprise', 'contact']).optional(),
  sort: z.enum(['newest', 'rating', 'popular', 'name']).default('newest'),
  q: z.string().optional(),
  tags: z.string().optional(),
  featured: z.coerce.boolean().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);

    // Parse and validate query params
    const params = toolsQuerySchema.safeParse({
      page: searchParams.get('page') || 1,
      pageSize: searchParams.get('pageSize') || 20,
      category: searchParams.get('category') || undefined,
      pricing: searchParams.get('pricing') || undefined,
      sort: searchParams.get('sort') || 'newest',
      q: searchParams.get('q') || undefined,
      featured: searchParams.get('featured') || undefined,
    });

    if (!params.success) {
      return NextResponse.json(errorResponse(params.error.issues[0].message), { status: 400 });
    }

    const { page, pageSize, category, pricing, sort, q, featured } = params.data;
    const offset = (page - 1) * pageSize;

    // Build query
    let query = supabase
      .from('tools')
      .select(`
        id,
        name,
        slug,
        tagline,
        description,
        website_url,
        logo_url,
        pricing_type,
        starting_price,
        rating_avg,
        rating_count,
        is_featured,
        created_at,
        category:categories(id, name, slug, color)
      `, { count: 'exact' })
      .eq('status', 'published');

    // Apply filters
    if (category) {
      // Get category by slug first
      const { data: cat } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', category)
        .single();
      
      if (cat) {
        query = query.eq('category_id', cat.id);
      }
    }

    if (pricing) {
      query = query.eq('pricing_type', pricing);
    }

    if (featured !== undefined) {
      query = query.eq('is_featured', featured);
    }

    if (q) {
      query = query.or(`name.ilike.%${q}%,description.ilike.%${q}%,tagline.ilike.%${q}%`);
    }

    // Apply sorting
    switch (sort) {
      case 'newest':
        query = query.order('created_at', { ascending: false });
        break;
      case 'rating':
        query = query.order('rating_avg', { ascending: false });
        break;
      case 'popular':
        query = query.order('rating_count', { ascending: false });
        break;
      case 'name':
        query = query.order('name', { ascending: true });
        break;
    }

    // Apply pagination
    query = query.range(offset, offset + pageSize - 1);

    const { data: tools, error, count } = await query;

    if (error) {
      console.error('Error fetching tools:', error);
      // Return empty data instead of error to not crash the UI
      return NextResponse.json(successResponse({
        data: [],
        meta: {
          total: 0,
          page,
          limit: pageSize,
          total_pages: 0,
        },
      }));
    }

    const totalPages = Math.ceil((count || 0) / pageSize);

    return NextResponse.json(successResponse({
      data: tools || [],
      meta: {
        total: count || 0,
        page,
        limit: pageSize,
        total_pages: totalPages,
      },
    }));
  } catch (error) {
    console.error('Tools API error:', error);
    // Return empty data on any error
    return NextResponse.json(successResponse({
      data: [],
      meta: {
        total: 0,
        page: 1,
        limit: 20,
        total_pages: 0,
      },
    }));
  }
}

// POST - Create new tool (Admin only)
export async function POST(request: NextRequest) {
  try {
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

    // Validation
    const createSchema = z.object({
      name: z.string().min(2).max(100),
      slug: z.string().min(2).max(200).regex(/^[a-z0-9-]+$/).optional(),
      tagline: z.string().max(150).optional(),
      description: z.string().min(50).optional(),
      website_url: z.string().url(),
      logo_url: z.string().url().optional().nullable(),
      category_id: z.string().uuid().optional().nullable(),
      pricing_type: z.enum(['free', 'freemium', 'paid', 'enterprise', 'contact']).default('freemium'),
      starting_price: z.number().min(0).optional().nullable(),
      tags: z.array(z.string()).max(10).default([]),
      features: z.array(z.object({ title: z.string(), desc: z.string() })).default([]),
      is_featured: z.boolean().default(false),
    });

    const validated = createSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(errorResponse(validated.error.issues[0].message), { status: 400 });
    }

    // Generate slug if not provided
    const slug = validated.data.slug || validated.data.name
      .toLowerCase()
      .replace(/[^a-z0-9\u0600-\u06FF]+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    // Create tool
    const { data: tool, error } = await supabase
      .from('tools')
      .insert({
        name: validated.data.name,
        slug,
        tagline: validated.data.tagline || null,
        description: validated.data.description || null,
        website_url: validated.data.website_url,
        logo_url: validated.data.logo_url || null,
        category_id: validated.data.category_id || null,
        pricing_type: validated.data.pricing_type,
        starting_price: validated.data.starting_price || null,
        tags: validated.data.tags,
        features: validated.data.features,
        is_featured: validated.data.is_featured,
        status: 'pending',
        submitted_by: session.user.id,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating tool:', error);
      return NextResponse.json(errorResponse(error.message), { status: 500 });
    }

    return NextResponse.json(
      successResponse({ data: tool, message: 'تم إضافة الأداة بنجاح' }),
      { status: 201 }
    );
  } catch (error) {
    console.error('Create tool error:', error);
    return NextResponse.json(errorResponse('Internal server error'), { status: 500 });
  }
}