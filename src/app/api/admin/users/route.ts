// =============================================
// API - Admin Users Endpoints
// GET: List users with pagination
// PUT: Update user (plan, role, display_name)
// DELETE: Remove user
// =============================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { successResponse, errorResponse } from '@/lib/api/response';
import { z } from 'zod';

const updateUserSchema = z.object({
  id: z.string().uuid(),
  plan: z.enum(['free', 'pro', 'team']).optional(),
  role: z.enum(['admin', 'editor', 'user']).optional(),
  display_name: z.string().max(100).optional(),
});

// GET /api/admin/users - List all users
export async function GET(request: NextRequest) {
  try {
    const _supabaseClient = await createClient();
    if (!_supabaseClient) {
      return NextResponse.json(
        { success: false, error: 'Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your environment.' },
        { status: 503 }
      );
    }

    const supabase = _supabaseClient;

    // Check admin auth
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(errorResponse('Unauthorized'), { status: 401 });
    }

    // Verify admin role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json(errorResponse('Admin access required'), { status: 403 });
    }

    // Parse query params
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const plan = searchParams.get('plan') || '';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const pageSize = Math.min(50, Math.max(1, parseInt(searchParams.get('pageSize') || '20')));

    // Build query
    let query = supabase
      .from('profiles')
      .select('id, email, display_name, username, avatar_url, plan, role, created_at, updated_at', { count: 'exact' });

    // Apply filters
    if (search) {
      query = query.or(`email.ilike.%${search}%,display_name.ilike.%${search}%,username.ilike.%${search}%`);
    }

    if (plan) {
      query = query.eq('plan', plan);
    }

    // Pagination
    const start = (page - 1) * pageSize;
    const end = start + pageSize - 1;
    query = query.range(start, end).order('created_at', { ascending: false });

    const { data: users, error, count } = await query;

    if (error) {
      console.error('Admin users GET error:', error);
      return NextResponse.json(errorResponse(error.message), { status: 500 });
    }

    const totalCount = count || 0;
    const totalPages = Math.ceil(totalCount / pageSize);

    return NextResponse.json(successResponse({
      data: users || [],
      pagination: {
        page,
        pageSize,
        totalCount,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    }));
  } catch (error) {
    console.error('Admin users GET error:', error);
    return NextResponse.json(errorResponse('Internal server error'), { status: 500 });
  }
}

// PUT /api/admin/users - Update user
export async function PUT(request: NextRequest) {
  try {
    const _supabaseClient = await createClient();
    if (!_supabaseClient) {
      return NextResponse.json(
        { success: false, error: 'Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your environment.' },
        { status: 503 }
      );
    }

    const supabase = _supabaseClient;

    // Check admin auth
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(errorResponse('Unauthorized'), { status: 401 });
    }

    // Verify admin role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json(errorResponse('Admin access required'), { status: 403 });
    }

    // Parse and validate body
    const body = await request.json();
    const validated = updateUserSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        errorResponse(validated.error.issues[0].message),
        { status: 400 }
      );
    }

    const { id, plan, role, display_name } = validated.data;

    // Build update object
    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (plan !== undefined) updates.plan = plan;
    if (role !== undefined) updates.role = role;
    if (display_name !== undefined) updates.display_name = display_name;

    // Update profile
    const { data: updated, error: updateError } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select('id, email, display_name, username, avatar_url, plan, role, created_at, updated_at')
      .single();

    if (updateError) {
      console.error('Admin users PUT error:', updateError);
      return NextResponse.json(errorResponse(updateError.message), { status: 500 });
    }

    // Log activity
    await supabase.from('activity_logs').insert({
      action: 'user_updated',
      entity_type: 'user',
      entity_id: id,
      user_id: user.id,
      details: { plan, role, display_name },
    });

    return NextResponse.json(successResponse({ data: updated }));
  } catch (error) {
    console.error('Admin users PUT error:', error);
    return NextResponse.json(errorResponse('Internal server error'), { status: 500 });
  }
}

// DELETE /api/admin/users - Delete user
export async function DELETE(request: NextRequest) {
  try {
    const _supabaseClient = await createClient();
    if (!_supabaseClient) {
      return NextResponse.json(
        { success: false, error: 'Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your environment.' },
        { status: 503 }
      );
    }

    const supabase = _supabaseClient;

    // Check admin auth
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(errorResponse('Unauthorized'), { status: 401 });
    }

    // Verify admin role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json(errorResponse('Admin access required'), { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(errorResponse('User ID is required'), { status: 400 });
    }

    // Prevent self-deletion
    if (id === user.id) {
      return NextResponse.json(errorResponse('Cannot delete your own account'), { status: 400 });
    }

    // Delete user profile (CASCADE should handle related data)
    const { error: deleteError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Admin users DELETE error:', deleteError);
      return NextResponse.json(errorResponse(deleteError.message), { status: 500 });
    }

    // Also delete auth user
    const { error: authDeleteError } = await supabase.auth.admin.deleteUser(id);

    if (authDeleteError) {
      console.error('Auth user delete error:', authDeleteError);
      // Log but don't fail
    }

    // Log activity
    await supabase.from('activity_logs').insert({
      action: 'user_deleted',
      entity_type: 'user',
      entity_id: id,
      user_id: user.id,
      details: {},
    });

    return NextResponse.json(successResponse({ message: 'User deleted successfully' }));
  } catch (error) {
    console.error('Admin users DELETE error:', error);
    return NextResponse.json(errorResponse('Internal server error'), { status: 500 });
  }
}