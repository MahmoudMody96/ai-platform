// =============================================
// API Routes - Admin Users Management
// GET: list users with filters
// PUT: update user role/plan
// DELETE: delete user
// =============================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { successResponse, errorResponse, paginatedResponse } from '@/lib/api/response';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');
    const plan = searchParams.get('plan');
    const search = searchParams.get('search');
    const offset = (page - 1) * pageSize;

    // Build query
    let query = supabase
      .from('profiles')
      .select('*', { count: 'exact' });

    // Apply filters
    if (plan) {
      query = query.eq('plan', plan);
    }
    if (search) {
      query = query.or(`display_name.ilike.%${search}%,email.ilike.%${search}%,username.ilike.%${search}%`);
    }

    // Order by created_at desc and paginate
    query = query.order('created_at', { ascending: false }).range(offset, offset + pageSize - 1);

    const { data: users, error, count } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(errorResponse('Failed to fetch users'), { status: 500 });
    }

    return NextResponse.json(paginatedResponse(users || [], { page, pageSize, totalCount: count || 0 }));
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(errorResponse('Internal server error'), { status: 500 });
  }
}

// PUT /api/admin/users - Update user role/plan
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check authentication and role
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(errorResponse('Unauthorized'), { status: 401 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json(errorResponse('Admin access required'), { status: 403 });
    }

    const body = await request.json();
    const { id, plan, role, display_name, username } = body;

    if (!id) {
      return NextResponse.json(errorResponse('User ID required'), { status: 400 });
    }

    // Prevent updating own role
    if (id === user.id && role && role !== profile.role) {
      return NextResponse.json(errorResponse('Cannot change your own role'), { status: 400 });
    }

    // Update profile
    const updateData: Record<string, unknown> = {};
    if (plan !== undefined) updateData.plan = plan;
    if (role !== undefined) updateData.role = role;
    if (display_name !== undefined) updateData.display_name = display_name;
    if (username !== undefined) updateData.username = username;

    const { data: updatedProfile, error: updateError } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Update error:', updateError);
      return NextResponse.json(errorResponse('Failed to update user'), { status: 500 });
    }

    return NextResponse.json(successResponse(updatedProfile, 'User updated successfully'));
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(errorResponse('Internal server error'), { status: 500 });
  }
}

// DELETE /api/admin/users - Delete user
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');

    if (!userId) {
      return NextResponse.json(errorResponse('User ID required'), { status: 400 });
    }

    // Check authentication and role
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(errorResponse('Unauthorized'), { status: 401 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json(errorResponse('Admin access required'), { status: 403 });
    }

    // Prevent deleting own account
    if (userId === user.id) {
      return NextResponse.json(errorResponse('Cannot delete your own account'), { status: 400 });
    }

    // Delete user from auth (this will cascade to profiles)
    const { error: deleteError } = await supabase.auth.admin.deleteUser(userId);

    if (deleteError) {
      console.error('Delete error:', deleteError);
      return NextResponse.json(errorResponse('Failed to delete user'), { status: 500 });
    }

    return NextResponse.json(successResponse(null, 'User deleted successfully'));
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(errorResponse('Internal server error'), { status: 500 });
  }
}
