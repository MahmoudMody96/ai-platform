// =============================================
// API - Delete User Endpoint
// =============================================

import { NextResponse } from 'next/server';

const mockUsers = [
  { id: '1', email: 'admin@aiplatform.com', display_name: 'مدير النظام', username: 'admin', avatar_url: null, plan: 'pro', role: 'admin', created_at: '2026-01-01', updated_at: '2026-05-20' },
  { id: '2', email: 'ahmed@example.com', display_name: 'أحمد محمد', username: 'ahmed_m', avatar_url: null, plan: 'free', role: 'user', created_at: '2026-02-15', updated_at: '2026-05-18' },
  { id: '3', email: 'sara@example.com', display_name: 'سارة أحمد', username: 'sara_ah', avatar_url: null, plan: 'pro', role: 'editor', created_at: '2026-03-01', updated_at: '2026-05-15' },
  { id: '4', email: 'khaled@example.com', display_name: 'خالد علي', username: 'khaled', avatar_url: null, plan: 'team', role: 'user', created_at: '2026-03-10', updated_at: '2026-05-12' },
  { id: '5', email: 'fatma@example.com', display_name: 'فاطمة حسن', username: 'fatma_h', avatar_url: null, plan: 'free', role: 'user', created_at: '2026-04-05', updated_at: '2026-05-10' },
];

let usersStore = [...mockUsers];

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const index = usersStore.findIndex(u => u.id === id);
  
  if (index === -1) {
    return NextResponse.json({
      success: false,
      error: 'User not found',
    }, { status: 404 });
  }
  
  // Prevent deleting admin user
  if (id === '1') {
    return NextResponse.json({
      success: false,
      error: 'Cannot delete admin user',
    }, { status: 403 });
  }
  
  usersStore.splice(index, 1);
  
  return NextResponse.json({
    success: true,
    message: 'User deleted successfully',
  });
}