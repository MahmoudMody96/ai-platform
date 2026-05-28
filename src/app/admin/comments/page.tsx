// =============================================
// Admin - Comments Page
// =============================================

'use client';

import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/modal';
import { Search, Check, X, Eye, Reply, Loader2, XCircle, CheckCircle2, AlertTriangle } from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils';

interface CommentData {
  id: string;
  content: string;
  article_id: string | null;
  tool_id: string | null;
  parent_id: string | null;
  author_id: string | null;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
  author?: {
    id: string;
    display_name: string | null;
    email: string;
    avatar_url: string | null;
  };
  article?: {
    id: string;
    title: string;
    slug: string;
  };
  tool?: {
    id: string;
    name: string;
    slug: string;
  };
}

export default function AdminCommentsPage() {
  // State
  const [comments, setComments] = React.useState<CommentData[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  
  // Pagination
  const [page, setPage] = React.useState(1);
  const [pageSize] = React.useState(20);
  const [totalCount, setTotalCount] = React.useState(0);
  
  // Filters
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('');
  
  // Dialogs
  const [showViewDialog, setShowViewDialog] = React.useState(false);
  const [showReplyDialog, setShowReplyDialog] = React.useState(false);
  const [selectedComment, setSelectedComment] = React.useState<CommentData | null>(null);
  const [replyContent, setReplyContent] = React.useState('');

  // Fetch comments
  const fetchComments = React.useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
      });
      if (searchQuery) params.append('search', searchQuery);
      if (statusFilter) params.append('approved', statusFilter === 'approved' ? 'true' : 'false');

      const response = await fetch(`/api/admin/comments?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setComments(data.data || []);
        setTotalCount(data.pagination?.totalCount || 0);
      }
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, searchQuery, statusFilter]);

  React.useEffect(() => {
    fetchComments();
  }, []);

  // Handlers
  const handleApprove = async (comment: CommentData) => {
    try {
      setSaving(true);
      const response = await fetch('/api/admin/comments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: comment.id,
          is_approved: true,
        }),
      });
      
      const data = await response.json();
      if (data.success) {
        fetchComments();
      } else {
        alert(data.error || 'Failed to approve comment');
      }
    } catch (error) {
      console.error('Failed to approve comment:', error);
      alert('Failed to approve comment');
    } finally {
      setSaving(false);
    }
  };

  const handleReject = async (comment: CommentData) => {
    try {
      setSaving(true);
      const response = await fetch('/api/admin/comments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: comment.id,
          is_approved: false,
        }),
      });
      
      const data = await response.json();
      if (data.success) {
        fetchComments();
      } else {
        alert(data.error || 'Failed to reject comment');
      }
    } catch (error) {
      console.error('Failed to reject comment:', error);
      alert('Failed to reject comment');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (comment: CommentData) => {
    if (!confirm('هل أنت متأكد من حذف هذا التعليق؟')) return;
    
    try {
      setSaving(true);
      const response = await fetch(`/api/admin/comments?id=${comment.id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      if (data.success) {
        fetchComments();
      } else {
        alert(data.error || 'Failed to delete comment');
      }
    } catch (error) {
      console.error('Failed to delete comment:', error);
      alert('Failed to delete comment');
    } finally {
      setSaving(false);
    }
  };

  const handleViewClick = (comment: CommentData) => {
    setSelectedComment(comment);
    setShowViewDialog(true);
  };

  const handleReplyClick = (comment: CommentData) => {
    setSelectedComment(comment);
    setReplyContent('');
    setShowReplyDialog(true);
  };

  const handleReplySubmit = async () => {
    if (!selectedComment || !replyContent.trim()) return;
    
    try {
      setSaving(true);
      // In a real app, this would create a reply via the API
      alert('تم حفظ الرد (هذه الميزة قيد التطوير)');
      setShowReplyDialog(false);
      setSelectedComment(null);
      setReplyContent('');
    } catch (error) {
      console.error('Failed to submit reply:', error);
    } finally {
      setSaving(false);
    }
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">إدارة التعليقات</h2>
          <p className="text-muted-foreground">{totalCount} تعليق</p>
        </div>
        
        {/* Quick Stats */}
        <div className="flex gap-4">
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span>معتمد: {comments.filter(c => c.is_approved).length}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <XCircle className="w-4 h-4 text-yellow-600" />
            <span>معلق: {comments.filter(c => !c.is_approved).length}</span>
          </div>
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
                  placeholder="ابحث في التعليقات..." 
                  className="ps-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">الحالة</label>
              <select 
                className="h-10 px-3 rounded-lg border border-border bg-background text-sm"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">جميع التعليقات</option>
                <option value="approved">معتمد</option>
                <option value="pending">معلق</option>
              </select>
            </div>
            {(searchQuery || statusFilter) && (
              <Button variant="outline" onClick={() => { setSearchQuery(''); setStatusFilter(''); }}>
                <X className="w-4 h-4" />
                مسح
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Comments List */}
      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center py-12">
                <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">لم يتم العثور على تعليقات</p>
              </div>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="p-4 hover:bg-muted/30 transition-colors">
                  <div className="flex items-start gap-4">
                    {/* Status Icon */}
                    <div className="pt-1">
                      {comment.is_approved ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-yellow-600" />
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {/* Author */}
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium">
                          {comment.author?.display_name || 'زائر'}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          ({comment.author?.email || 'غير معروف'})
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatRelativeTime(comment.created_at)}
                        </span>
                      </div>
                      
                      {/* Comment Text */}
                      <p className="text-sm mb-2">{comment.content}</p>
                      
                      {/* Entity */}
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">
                          {comment.article ? 'مقال' : comment.tool ? 'أداة' : 'غير محدد'}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {comment.article?.title || comment.tool?.name || '-'}
                        </span>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        {comment.is_approved ? (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-destructive hover:bg-destructive/10"
                            onClick={() => handleReject(comment)}
                            disabled={saving}
                          >
                            <X className="w-4 h-4" />
                            رفض
                          </Button>
                        ) : (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-green-600 hover:bg-green-50"
                            onClick={() => handleApprove(comment)}
                            disabled={saving}
                          >
                            <Check className="w-4 h-4" />
                            قبول
                          </Button>
                        )}
                        <Button variant="ghost" size="sm" onClick={() => handleReplyClick(comment)}>
                          <Reply className="w-4 h-4" />
                          رد
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleViewClick(comment)}>
                          <Eye className="w-4 h-4" />
                          عرض
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-destructive hover:bg-destructive/10"
                          onClick={() => handleDelete(comment)}
                          disabled={saving}
                        >
                          <X className="w-4 h-4" />
                          حذف
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
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

      {/* View Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>تفاصيل التعليق</DialogTitle>
            <DialogDescription>
              {selectedComment?.author?.display_name || 'زائر'}
            </DialogDescription>
          </DialogHeader>
          {selectedComment && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-4">
                <Badge variant={selectedComment.is_approved ? 'success' : 'warning'}>
                  {selectedComment.is_approved ? 'معتمد' : 'معلق'}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {formatRelativeTime(selectedComment.created_at)}
                </span>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground mb-1">المحتوى</p>
                <p className="whitespace-pre-wrap">{selectedComment.content}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">النوع</p>
                  <p className="font-medium">
                    {selectedComment.article ? 'مقال' : selectedComment.tool ? 'أداة' : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">العنصر</p>
                  <p className="font-medium">
                    {selectedComment.article?.title || selectedComment.tool?.name || '-'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">البريد الإلكتروني</p>
                  <p className="font-medium">{selectedComment.author?.email || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">تاريخ الإنشاء</p>
                  <p className="font-medium">
                    {new Date(selectedComment.created_at).toLocaleDateString('ar-EG', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowViewDialog(false)}>
              إغلاق
            </Button>
            {selectedComment && !selectedComment.is_approved && (
              <Button onClick={() => { handleApprove(selectedComment); setShowViewDialog(false); }} className="gap-2">
                <Check className="w-4 h-4" />
                قبول
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reply Dialog */}
      <Dialog open={showReplyDialog} onOpenChange={setShowReplyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>رد على التعليق</DialogTitle>
            <DialogDescription>
              اكتب ردك على تعليق {selectedComment?.author?.display_name || 'هذا المستخدم'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Original Comment */}
            <div className="p-3 rounded-lg bg-muted text-sm">
              <p className="font-medium mb-1">التعليق الأصلي:</p>
              <p className="text-muted-foreground">{selectedComment?.content}</p>
            </div>
            
            {/* Reply Input */}
            <div>
              <label className="text-sm font-medium mb-2 block">ردك</label>
              <textarea
                className="w-full px-3 py-2 rounded-lg border border-border bg-background min-h-[120px]"
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="اكتب ردك هنا..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowReplyDialog(false); setSelectedComment(null); }}>
              إلغاء
            </Button>
            <Button onClick={handleReplySubmit} disabled={saving || !replyContent.trim()} className="gap-2">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Reply className="w-4 h-4" />}
              إرسال الرد
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
