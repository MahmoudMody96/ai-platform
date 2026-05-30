// =============================================
// API - Categories Endpoints (Supabase)
// =============================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const errorResponse = (message: string) => ({ success: false, error: message });

// GET /api/categories - List categories
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search');
  const featured = searchParams.get('featured');

  try {
    const supabase = await createClient();

    let query = supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true });

    if (featured === 'true') {
      query = query.eq('is_featured', true);
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,name_en.ilike.%${search}%`);
    }

    const { data: categories, error } = await query;

    if (error) {
      console.error('Categories fetch error:', error);
      return NextResponse.json(errorResponse('Failed to fetch categories'), { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: categories || [],
    });
  } catch (error) {
    console.error('Categories API error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(errorResponse(error.issues[0].message), { status: 400 });
    }
    return NextResponse.json(errorResponse('Internal server error'), { status: 500 });
  }
}

// POST /api/categories - Create category (Admin)
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
      name: z.string().min(1).max(100),
      name_en: z.string().max(100).optional(),
      slug: z.string().min(1).max(100).optional(),
      description: z.string().max(500).optional(),
      icon: z.string().max(50).optional(),
      color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
      sort_order: z.number().int().optional(),
      is_featured: z.boolean().optional(),
    });

    const validated = createSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(errorResponse(validated.error.issues[0].message), { status: 400 });
    }

    const slug = validated.data.slug || validated.data.name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    const { data: category, error } = await supabase
      .from('categories')
      .insert({
        name: validated.data.name,
        name_en: validated.data.name_en,
        slug,
        description: validated.data.description,
        icon: validated.data.icon,
        color: validated.data.color || '#6366f1',
        sort_order: validated.data.sort_order ?? 0,
        is_featured: validated.data.is_featured ?? false,
      })
      .select()
      .single();

    if (error) {
      console.error('Category create error:', error);
      return NextResponse.json(errorResponse('Failed to create category'), { status: 500 });
    }

    return NextResponse.json({ success: true, data: category }, { status: 201 });
  } catch (error) {
    console.error('Categories API error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(errorResponse(error.issues[0].message), { status: 400 });
    }
    return NextResponse.json(errorResponse('Internal server error'), { status: 500 });
  }
}