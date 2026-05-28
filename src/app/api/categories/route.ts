// =============================================
// API Routes - Categories
// GET: list categories
// POST: create category (admin only)
// PUT: update category
// =============================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createCategorySchema, updateCategorySchema } from '@/lib/validation/schemas';
import { successResponse, errorResponse } from '@/lib/api/response';
import type { Category } from '@/types';

// GET /api/categories - List all categories
export async function GET() {
  try {
    const supabase = await createClient();

    const { data: categories, error } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        errorResponse('Failed to fetch categories'),
        { status: 500 }
      );
    }

    // Build tree structure
    const categoryMap = new Map<string, Category & { children: Category[] }>();
    const rootCategories: (Category & { children: Category[] })[] = [];

    // First pass: create all categories with children array
    categories?.forEach(cat => {
      categoryMap.set(cat.id, { ...cat, children: [] });
    });

    // Second pass: build tree
    categories?.forEach(cat => {
      const category = categoryMap.get(cat.id)!;
      if (cat.parent_id && categoryMap.has(cat.parent_id)) {
        categoryMap.get(cat.parent_id)!.children.push(category);
      } else {
        rootCategories.push(category);
      }
    });

    return NextResponse.json(successResponse<Category[]>(rootCategories));
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      errorResponse('Internal server error'),
      { status: 500 }
    );
  }
}

// POST /api/categories - Create category (admin only)
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check authentication and role
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(errorResponse('Unauthorized'), { status: 401 });
    }

    // Check if user has admin role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json(errorResponse('Admin access required'), { status: 403 });
    }

    // Parse and validate body
    const body = await request.json();
    const validated = createCategorySchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        errorResponse(`Validation error: ${validated.error.message}`),
        { status: 400 }
      );
    }

    // Check for duplicate slug
    const { data: existing } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', validated.data.slug)
      .single();

    if (existing) {
      return NextResponse.json(
        errorResponse('Category with this slug already exists'),
        { status: 409 }
      );
    }

    // Insert category
    const { data: category, error: insertError } = await supabase
      .from('categories')
      .insert(validated.data)
      .select()
      .single();

    if (insertError) {
      console.error('Insert error:', insertError);
      return NextResponse.json(
        errorResponse('Failed to create category'),
        { status: 500 }
      );
    }

    return NextResponse.json(
      successResponse<Category>(category, 'Category created successfully'),
      { status: 201 }
    );
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(errorResponse('Internal server error'), { status: 500 });
  }
}

// PUT /api/categories - Update category
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('id');

    if (!categoryId) {
      return NextResponse.json(errorResponse('Category ID required'), { status: 400 });
    }

    // Check authentication and role
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(errorResponse('Unauthorized'), { status: 401 });
    }

    // Check if user has admin or editor role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (!profile || !['admin', 'editor'].includes(profile.role)) {
      return NextResponse.json(errorResponse('Admin or editor access required'), { status: 403 });
    }

    // Parse and validate body
    const body = await request.json();
    const validated = updateCategorySchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        errorResponse(`Validation error: ${validated.error.message}`),
        { status: 400 }
      );
    }

    // Prevent setting self as parent
    if (validated.data.parent_id === categoryId) {
      return NextResponse.json(
        errorResponse('Category cannot be its own parent'),
        { status: 400 }
      );
    }

    // Update category
    const { data: category, error: updateError } = await supabase
      .from('categories')
      .update(validated.data)
      .eq('id', categoryId)
      .select()
      .single();

    if (updateError) {
      console.error('Update error:', updateError);
      return NextResponse.json(errorResponse('Failed to update category'), { status: 500 });
    }

    if (!category) {
      return NextResponse.json(errorResponse('Category not found'), { status: 404 });
    }

    return NextResponse.json(successResponse<Category>(category, 'Category updated successfully'));
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(errorResponse('Internal server error'), { status: 500 });
  }
}