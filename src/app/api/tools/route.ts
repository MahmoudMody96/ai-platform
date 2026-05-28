// =============================================
// API Routes - Tools
// GET: list tools with filters
// POST: create tool (admin only)
// PUT: update tool (admin/editor)
// DELETE: delete tool (admin only)
// =============================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { toolFilterSchema, createToolSchema, updateToolSchema } from '@/lib/validation/schemas';
import { successResponse, errorResponse, paginatedResponse } from '@/lib/api/response';
import type { Tool } from '@/types';

// GET /api/tools - List tools with filters
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);

    // Parse and validate filters
    const filters = toolFilterSchema.safeParse({
      page: searchParams.get('page') || 1,
      pageSize: searchParams.get('pageSize') || 20,
      category: searchParams.get('category'),
      pricing: searchParams.get('pricing'),
      search: searchParams.get('search'),
      featured: searchParams.get('featured'),
    });

    if (!filters.success) {
      return NextResponse.json(
        errorResponse('Invalid query parameters'),
        { status: 400 }
      );
    }

    const { page, pageSize, category, pricing, search, featured } = filters.data;
    const offset = (page - 1) * pageSize;

    // Build query
    let query = supabase
      .from('tools')
      .select('*, category:categories(*)', { count: 'exact' });

    // Apply filters
    if (category) {
      query = query.eq('category_id', category);
    }
    if (pricing) {
      query = query.eq('pricing_model', pricing);
    }
    if (featured !== undefined) {
      query = query.eq('is_featured', featured);
    }
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    // Order by created_at desc and paginate
    query = query.order('created_at', { ascending: false }).range(offset, offset + pageSize - 1);

    const { data: tools, error, count } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        errorResponse('Failed to fetch tools'),
        { status: 500 }
      );
    }

    return NextResponse.json(
      paginatedResponse<Tool>(tools || [], { page, pageSize, totalCount: count || 0 })
    );
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      errorResponse('Internal server error'),
      { status: 500 }
    );
  }
}

// POST /api/tools - Create tool (admin only)
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
    const validated = createToolSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        errorResponse(`Validation error: ${validated.error.message}`),
        { status: 400 }
      );
    }

    // Insert tool
    const { data: tool, error: insertError } = await supabase
      .from('tools')
      .insert({
        ...validated.data,
        is_verified: false,
        stats: { uses: 0, rating: 0, reviews: 0 },
      })
      .select()
      .single();

    if (insertError) {
      console.error('Insert error:', insertError);
      return NextResponse.json(
        errorResponse('Failed to create tool'),
        { status: 500 }
      );
    }

    return NextResponse.json(successResponse<Tool>(tool, 'Tool created successfully'), { status: 201 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(errorResponse('Internal server error'), { status: 500 });
  }
}

// PUT /api/tools - Update tool (admin/editor)
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const toolId = searchParams.get('id');

    if (!toolId) {
      return NextResponse.json(errorResponse('Tool ID required'), { status: 400 });
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
    const validated = updateToolSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        errorResponse(`Validation error: ${validated.error.message}`),
        { status: 400 }
      );
    }

    // Update tool
    const { data: tool, error: updateError } = await supabase
      .from('tools')
      .update(validated.data)
      .eq('id', toolId)
      .select()
      .single();

    if (updateError) {
      console.error('Update error:', updateError);
      return NextResponse.json(errorResponse('Failed to update tool'), { status: 500 });
    }

    if (!tool) {
      return NextResponse.json(errorResponse('Tool not found'), { status: 404 });
    }

    return NextResponse.json(successResponse<Tool>(tool, 'Tool updated successfully'));
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(errorResponse('Internal server error'), { status: 500 });
  }
}

// DELETE /api/tools - Delete tool (admin only)
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const toolId = searchParams.get('id');

    if (!toolId) {
      return NextResponse.json(errorResponse('Tool ID required'), { status: 400 });
    }

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

    // Delete tool
    const { error: deleteError } = await supabase
      .from('tools')
      .delete()
      .eq('id', toolId);

    if (deleteError) {
      console.error('Delete error:', deleteError);
      return NextResponse.json(errorResponse('Failed to delete tool'), { status: 500 });
    }

    return NextResponse.json(successResponse(null, 'Tool deleted successfully'));
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(errorResponse('Internal server error'), { status: 500 });
  }
}