// =============================================
// Admin - Users Page
// =============================================

'use client';

import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/modal';
import { UserAvatar } from '@/components/ui/avatar';
import { Search, Edit, Trash2, Eye, Loader2, X, Check, AlertTriangle } from 'lucide-react';

interface UserProfile {
  id: string;
  email: string;
  display_name: string | null;
  username: string | null;
  avatar_url: string | null;
  plan: 'free' | 'pro' | 'team';
  role?: string;
  created_at: string;
  updated_at: string;
}

  const planLabels: Record<string, { label: string; variant: 'success' | 'secondary' | 'accent' | 'default' | 'warning' | 'error' }> = {
  free: { label: 'مجاني', variant: 'success' },
  pro: { label: 'Pro', variant: 'secondary' },
  team: { label: 'Team', variant: 'accent' },
};

const roleLabels: Record<string, { label: string; variant: 'default' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'info' | 'outline' | 'ghost' | 'destructive' }> = {
  admin: { label: 'مدير', variant: 'error' },
  editor: { label: 'محرر', variant: 'warning' },
  user: { label: 'مستخدم', variant: 'default' },
};

export default function AdminUsersPage() {
  // State
  const [users, setUsers] = React.useState<UserProfile[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  
  // Pagination
  const [page, setPage] = React.useState(1);
  const [pageSize] = React.useState(20);
  const [totalCount, setTotalCount] = React.useState(0);
  
  // Filters
  const [searchQuery, setSearchQuery] = React.useState('');
  const [planFilter, setPlanFilter] = React.useState('');
  
  // Dialogs
  const [showEditDialog, setShowEditDialog] = React.useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [showViewDialog, setShowViewDialog] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<UserProfile | null>(null);
  
  // Form state
  const [editData, setEditData] = React.useState({
    plan: 'free' as 'free' | 'pro' | 'team',
    role: 'user' as 'admin' | 'editor' | 'user',
    display_name: '',
  });

  // Load users function
  const loadUsers = React.useCallback(async () => {
    try {
      queueMicrotask(() => setLoading(true));
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
      });
      if (searchQuery) params.append('search', searchQuery);
      if (planFilter) params.append('plan', planFilter);

      const response = await fetch(`/api/admin/users?${params}`);
      const data = await response.json();
      
      if (data.success) {
        queueMicrotask(() => {
          setUsers(data.data || []);
          setTotalCount(data.pagination?.totalCount || 0);
          setLoading(false);
        });
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
      queueMicrotask(() => setLoading(false));
    }
  }, [page, pageSize, searchQuery, planFilter]);

  // Initial load
  React.useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Handlers

  const handleEditUser = async () => {
    if (!selectedUser) return;
    
    try {
      setSaving(true);
      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedUser.id,
          plan: editData.plan,
          role: editData.role,
          display_name: editData.display_name,
        }),
      });
      
      const data = await response.json();
      if (data.success) {
        loadUsers();
        setShowEditDialog(false);
        setSelectedUser(null);
      } else {
        alert(data.error || 'Failed to update user');
      }
    } catch (error) {
      console.error('Failed to update user:', error);
      alert('Failed to update user');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    
    try {
      setSaving(true);
      const response = await fetch(`/api/admin/users?id=${selectedUser.id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      if (data.success) {
        loadUsers();
        setShowDeleteDialog(false);
        setSelectedUser(null);
      } else {
        alert(data.error || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Failed to delete user:', error);
      alert('Failed to delete user');
    } finally {
      setSaving(false);
    }
  };

  const handleViewClick = (user: UserProfile) => {
    setSelectedUser(user);
    setShowViewDialog(true);
  };

  const handleEditClick = (user: UserProfile) => {
    setSelectedUser(user);
    setEditData({
      plan: user.plan,
      role: (user.role as 'admin' | 'editor' | 'user') || 'user',
      display_name: user.display_name || '',
    });
    setShowEditDialog(true);
  };

  const handleDeleteClick = (user: UserProfile) => {
    setSelectedUser(user);
    setShowDeleteDialog(true);
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">إدارة المستخدمين</h2>
          <p className="text-muted-foreground">{totalCount} مستخدم مسجل</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="text-sm font-medium mb-2 block">بحث</label>
              <div className="relative">
                <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="ابحث عن مستخدم..." 
                  className="ps-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">الباقة</label>
              <select 
                className="h-10 px-3 rounded-lg border border-border bg-background text-sm"
                value={planFilter}
                onChange={(e) => setPlanFilter(e.target.value)}
              >
                <option value="">جميع الباقات</option>
                <option value="free">Free</option>
                <option value="pro">Pro</option>
                <option value="team">Team</option>
              </select>
            </div>
            {(searchQuery || planFilter) && (
              <Button variant="outline" onClick={() => { setSearchQuery(''); setPlanFilter(''); }}>
                <X className="w-4 h-4" />
                مسح
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-start px-6 py-3 text-sm font-medium">المستخدم</th>
                    <th className="text-start px-6 py-3 text-sm font-medium">الباقة</th>
                    <th className="text-start px-6 py-3 text-sm font-medium">الدور</th>
                    <th className="text-start px-6 py-3 text-sm font-medium">تاريخ التسجيل</th>
                    <th className="text-start px-6 py-3 text-sm font-medium">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <UserAvatar 
                            name={user.display_name || user.email} 
                            image={user.avatar_url}
                            size="sm" 
                          />
                          <div>
                            <p className="font-medium">{user.display_name || 'غير محدد'}</p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={planLabels[user.plan]?.variant || 'outline'}>
                          {planLabels[user.plan]?.label || user.plan}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={roleLabels[user.role || 'user']?.variant || 'default'}>
                          {user.role ? (
                            roleLabels[user.role]?.label || user.role
                          ) : (
                            'مستخدم'
                          )}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        {new Date(user.created_at).toLocaleDateString('ar-EG')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon-sm" onClick={() => handleViewClick(user)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon-sm" onClick={() => handleEditClick(user)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon-sm" className="text-destructive hover:bg-destructive/10" onClick={() => handleDeleteClick(user)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            
            {users.length === 0 && !loading && (
              <div className="text-center py-12">
                <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">لم يتم العثور على مستخدمين</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-border">
              <span className="text-sm text-muted-foreground">
                Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, totalCount)} of {totalCount}
              </span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}>
                  السابق
                </Button>
                <span className="text-sm">صفحة {page} من {totalPages}</span>
                <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages}>
                  التالي
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تعديل المستخدم</DialogTitle>
            <DialogDescription>{selectedUser?.email}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-2 block">الاسم</label>
              <Input 
                value={editData.display_name} 
                onChange={e => setEditData({...editData, display_name: e.target.value})} 
                placeholder="اسم المستخدم"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">الباقة</label>
              <select 
                className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm"
                value={editData.plan}
                onChange={e => setEditData({...editData, plan: e.target.value as typeof editData.plan})}
              >
                <option value="free">Free</option>
                <option value="pro">Pro</option>
                <option value="team">Team</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">الدور</label>
              <select 
                className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm"
                value={editData.role}
                onChange={e => setEditData({...editData, role: e.target.value as typeof editData.role})}
              >
                <option value="user">مستخدم</option>
                <option value="editor">محرر</option>
                <option value="admin">مدير</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleEditUser} disabled={saving} className="gap-2">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              حفظ التغييرات
            </Button>
            <Button variant="outline" onClick={() => { setShowEditDialog(false); setSelectedUser(null); }}>
              إلغاء
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedUser?.display_name || 'غير محدد'}</DialogTitle>
            <DialogDescription>{selectedUser?.email}</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4 py-4">
              <div className="flex items-center justify-center">
                <UserAvatar 
                  name={selectedUser.display_name || selectedUser.email} 
                  image={selectedUser.avatar_url}
                  size="lg" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">الباقة</p>
                  <Badge variant={planLabels[selectedUser.plan]?.variant || 'outline'}>
                    {planLabels[selectedUser.plan]?.label || selectedUser.plan}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">الدور</p>
                  <Badge variant={roleLabels[selectedUser.role || 'user']?.variant || 'default'}>
                    {selectedUser.role ? roleLabels[selectedUser.role]?.label : 'مستخدم'}
                  </Badge>
                </div>
                {selectedUser.username && (
                  <div>
                    <p className="text-sm text-muted-foreground">اسم المستخدم</p>
                    <p className="font-medium">@{selectedUser.username}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-muted-foreground">تاريخ التسجيل</p>
                  <p className="font-medium">{new Date(selectedUser.created_at).toLocaleDateString('ar-EG')}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowViewDialog(false)}>
              إغلاق
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تأكيد الحذف</DialogTitle>
          <DialogDescription>
              هل أنت متأكد من حذف المستخدم؟
              هذا الإجراء لا يمكن التراجع عنه وسيحذف جميع بيانات المستخدم.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowDeleteDialog(false); setSelectedUser(null); }}>
              إلغاء
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser} disabled={saving} className="gap-2">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              <Trash2 className="w-4 h-4" />
              حذف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
