// =============================================
// API Routes - Users
// GET: list users (admin only)
// PUT: update user role
// =============================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { paginationSchema, updateUserRoleSchema } from '@/lib/validation/schemas';
import { successResponse, errorResponse, paginatedResponse } from '@/lib/api/response';
import type { Profile as User } from '@/types';

// GET /api/users - List users (admin only)
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
    const { searchParams } = new URL(request.url);

    // Check authentication
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

    // Parse pagination
    const filters = paginationSchema.safeParse({
      page: searchParams.get('page') || 1,
      pageSize: searchParams.get('pageSize') || 20,
    });

    if (!filters.success) {
      return NextResponse.json(errorResponse('Invalid pagination'), { status: 400 });
    }

    const { page, pageSize } = filters.data;
    const offset = (page - 1) * pageSize;

    // Query users with profiles
    const { data: users, error } = await supabase
      .from('profiles')
      .select('*, auth_user:user_id(id, email, created_at, last_sign_in_at)')
      .order('created_at', { ascending: false })
      .range(offset, offset + pageSize - 1);

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(errorResponse('Failed to fetch users'), { status: 500 });
    }

    // Get total count
    const { count } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    return NextResponse.json(
      paginatedResponse<User>(users || [], { page, pageSize, totalCount: count || 0 })
    );
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(errorResponse('Internal server error'), { status: 500 });
  }
}

// PUT /api/users - Update user role
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
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');

    if (!userId) {
      return NextResponse.json(errorResponse('User ID required'), { status: 400 });
    }

    // Check authentication
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

    // Prevent self-demotion
    if (userId === user.id) {
      return NextResponse.json(
        errorResponse('You cannot change your own role'),
        { status: 400 }
      );
    }

    // Parse and validate body
    const body = await request.json();
    const validated = updateUserRoleSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        errorResponse(`Validation error: ${validated.error.message}`),
        { status: 400 }
      );
    }

    // Update user role
    const { data: updatedProfile, error: updateError } = await supabase
      .from('profiles')
      .update({ role: validated.data.role, updated_at: new Date().toISOString() })
      .eq('user_id', userId)
      .select()
      .single();

    if (updateError) {
      console.error('Update error:', updateError);
      return NextResponse.json(errorResponse('Failed to update user role'), { status: 500 });
    }

    if (!updatedProfile) {
      return NextResponse.json(errorResponse('User not found'), { status: 404 });
    }

    return NextResponse.json(
      successResponse(updatedProfile, 'User role updated successfully')
    );
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(errorResponse('Internal server error'), { status: 500 });
  }
}