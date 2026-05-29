// =============================================
// API - Admin Users Endpoints
// =============================================

import { NextResponse } from 'next/server';

// Mock data
const mockUsers = [
  { id: '1', email: 'admin@aiplatform.com', display_name: 'مدير النظام', username: 'admin', avatar_url: null, plan: 'pro', role: 'admin', created_at: '2026-01-01', updated_at: '2026-05-20' },
  { id: '2', email: 'ahmed@example.com', display_name: 'أحمد محمد', username: 'ahmed_m', avatar_url: null, plan: 'free', role: 'user', created_at: '2026-02-15', updated_at: '2026-05-18' },
  { id: '3', email: 'sara@example.com', display_name: 'سارة أحمد', username: 'sara_ah', avatar_url: null, plan: 'pro', role: 'editor', created_at: '2026-03-01', updated_at: '2026-05-15' },
  { id: '4', email: 'khaled@example.com', display_name: 'خالد علي', username: 'khaled', avatar_url: null, plan: 'team', role: 'user', created_at: '2026-03-10', updated_at: '2026-05-12' },
  { id: '5', email: 'fatma@example.com', display_name: 'فاطمة حسن', username: 'fatma_h', avatar_url: null, plan: 'free', role: 'user', created_at: '2026-04-05', updated_at: '2026-05-10' },
];

let usersStore = [...mockUsers];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search');
  const plan = searchParams.get('plan');
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = parseInt(searchParams.get('pageSize') || '20');
  
  let filtered = [...usersStore];
  
  // Apply filters
  if (search) {
    const searchLower = search.toLowerCase();
    filtered = filtered.filter(u => 
      u.email.toLowerCase().includes(searchLower) ||
      u.display_name?.toLowerCase().includes(searchLower) ||
      u.username?.toLowerCase().includes(searchLower)
    );
  }
  
  if (plan) {
    filtered = filtered.filter(u => u.plan === plan);
  }
  
  // Pagination
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const paginatedUsers = filtered.slice(start, end);
  
  return NextResponse.json({
    success: true,
    data: paginatedUsers,
    pagination: {
      page,
      pageSize,
      totalCount: filtered.length,
      totalPages: Math.ceil(filtered.length / pageSize),
      hasNextPage: end < filtered.length,
      hasPrevPage: page > 1,
    },
  });
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;
    
    const index = usersStore.findIndex(u => u.id === id);
    
    if (index === -1) {
      return NextResponse.json({
        success: false,
        error: 'User not found',
      }, { status: 404 });
    }
    
    const updatedUser = {
      ...usersStore[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    
    usersStore[index] = updatedUser;
    
    return NextResponse.json({
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update user',
    }, { status: 500 });
  }
}