// =============================================
// Admin - Articles Page
// =============================================

'use client';

import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/modal';
import { Plus, Search, Edit, Trash2, Eye, Star, X, Loader2, Check, AlertTriangle } from 'lucide-react';
import type { Article, Category } from '@/types';

interface ArticleFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image_url: string;
  category_id: string;
  tags: string;
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  read_time: number;
}

const initialFormData: ArticleFormData = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  cover_image_url: '',
  category_id: '',
  tags: '',
  status: 'draft',
  featured: false,
  read_time: 5,
};

export default function AdminArticlesPage() {
  // State
  const [articles, setArticles] = React.useState<Article[]>([]);
  const [categories, setCategories] = React.useState<Category[]>([]);
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
  const [showAddDialog, setShowAddDialog] = React.useState(false);
  const [showEditDialog, setShowEditDialog] = React.useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [showViewDialog, setShowViewDialog] = React.useState(false);
  const [selectedArticle, setSelectedArticle] = React.useState<Article | null>(null);
  
  // Form state
  const [formData, setFormData] = React.useState<ArticleFormData>(initialFormData);

  // Fetch articles
  const fetchArticles = React.useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
      });
      if (searchQuery) params.append('search', searchQuery);
      if (statusFilter) params.append('status', statusFilter);

      const response = await fetch(`/api/articles?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setArticles(data.data || []);
        setTotalCount(data.pagination?.totalCount || 0);
      }
    } catch (error) {
      console.error('Failed to fetch articles:', error);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, searchQuery, statusFilter]);

  // Load initial data
  React.useEffect(() => {
    const loadData = async () => {
      try {
        const [catsRes, artsRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/articles')
        ]);
        const [catsData, artsData] = await Promise.all([catsRes.json(), artsRes.json()]);
        if (catsData.success) setCategories(catsData.data || []);
        if (artsData.success) setArticles(artsData.data || []);
      } catch (error) {
        console.error('Failed to load data:', error);
      }
    };
    loadData();
  }, []);

  // Handlers
  const handleAddArticle = async () => {
    if (!formData.title) return;
    
    try {
      setSaving(true);
      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          slug: formData.slug || formData.title.toLowerCase().replace(/\s+/g, '-'),
          excerpt: formData.excerpt || null,
          content: formData.content || null,
          cover_image_url: formData.cover_image_url || null,
          category_id: formData.category_id || null,
          tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
          status: formData.status,
          featured: formData.featured,
          read_time: formData.read_time,
        }),
      });
      
      const data = await response.json();
      if (data.success) {
        fetchArticles();
        setShowAddDialog(false);
        resetForm();
      } else {
        alert(data.error || 'Failed to add article');
      }
    } catch (error) {
      console.error('Failed to add article:', error);
      alert('Failed to add article');
    } finally {
      setSaving(false);
    }
  };

  const handleEditArticle = async () => {
    if (!selectedArticle) return;
    
    try {
      setSaving(true);
      const response = await fetch(`/api/articles?id=${selectedArticle.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          slug: formData.slug,
          excerpt: formData.excerpt || null,
          content: formData.content || null,
          cover_image_url: formData.cover_image_url || null,
          category_id: formData.category_id || null,
          tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
          status: formData.status,
          featured: formData.featured,
          read_time: formData.read_time,
        }),
      });
      
      const data = await response.json();
      if (data.success) {
        fetchArticles();
        setShowEditDialog(false);
        setSelectedArticle(null);
        resetForm();
      } else {
        alert(data.error || 'Failed to update article');
      }
    } catch (error) {
      console.error('Failed to update article:', error);
      alert('Failed to update article');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteArticle = async () => {
    if (!selectedArticle) return;
    
    try {
      setSaving(true);
      const response = await fetch(`/api/articles?id=${selectedArticle.id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      if (data.success) {
        fetchArticles();
        setShowDeleteDialog(false);
        setSelectedArticle(null);
      } else {
        alert(data.error || 'Failed to delete article');
      }
    } catch (error) {
      console.error('Failed to delete article:', error);
      alert('Failed to delete article');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleFeatured = async (article: Article) => {
    try {
      const response = await fetch(`/api/articles?id=${article.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          featured: !article.featured,
        }),
      });
      
      const data = await response.json();
      if (data.success) {
        fetchArticles();
      }
    } catch (error) {
      console.error('Failed to toggle featured:', error);
    }
  };

  const handleViewClick = (article: Article) => {
    setSelectedArticle(article);
    setShowViewDialog(true);
  };

  const handleEditClick = (article: Article) => {
    setSelectedArticle(article);
    setFormData({
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt || '',
      content: article.content || '',
      cover_image_url: article.cover_image_url || '',
      category_id: article.category_id || '',
      tags: article.tags?.join(', ') || '',
      status: article.status,
      featured: article.featured,
      read_time: article.read_time,
    });
    setShowEditDialog(true);
  };

  const handleDeleteClick = (article: Article) => {
    setSelectedArticle(article);
    setShowDeleteDialog(true);
  };

  const resetForm = () => {
    setFormData(initialFormData);
  };

  const getCategoryName = (id: string | null) => {
    if (!id) return '-';
    return categories.find(c => c.id === id)?.name || '-';
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">إدارة المقالات</h2>
          <p className="text-muted-foreground">{totalCount} مقال</p>
        </div>
        <Button onClick={() => { resetForm(); setShowAddDialog(true); }} className="gap-2">
          <Plus className="w-4 h-4" />
          إضافة مقال
        </Button>
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
                  placeholder="ابحث في المقالات..." 
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
                <option value="">جميع الحالات</option>
                <option value="published">منشور</option>
                <option value="draft">مسودة</option>
                <option value="archived">أرشيف</option>
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

      {/* Articles Table */}
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
                    <th className="text-start px-6 py-3 text-sm font-medium">العنوان</th>
                    <th className="text-start px-6 py-3 text-sm font-medium">الفئة</th>
                    <th className="text-start px-6 py-3 text-sm font-medium">الحالة</th>
                    <th className="text-start px-6 py-3 text-sm font-medium">مميز</th>
                    <th className="text-start px-6 py-3 text-sm font-medium">وقت القراءة</th>
                    <th className="text-start px-6 py-3 text-sm font-medium">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {articles.map((article) => (
                    <tr key={article.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium">{article.title}</p>
                          <p className="text-xs text-muted-foreground">/{article.slug}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="outline">{getCategoryName(article.category_id)}</Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={
                          article.status === 'published' ? 'success' : 
                          article.status === 'draft' ? 'warning' : 'secondary'
                        }>
                          {article.status === 'published' ? 'منشور' : 
                           article.status === 'draft' ? 'مسودة' : 'أرشيف'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggleFeatured(article)}
                          className="p-1 hover:bg-muted rounded"
                        >
                          <Star className={`w-5 h-5 ${article.featured ? 'text-accent fill-accent' : 'text-muted-foreground'}`} />
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        {article.read_time} دقيقة
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon-sm" onClick={() => handleViewClick(article)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon-sm" onClick={() => handleEditClick(article)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon-sm" className="text-destructive hover:bg-destructive/10" onClick={() => handleDeleteClick(article)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            
            {articles.length === 0 && !loading && (
              <div className="text-center py-12">
                <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">لم يتم العثور على مقالات</p>
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

      {/* Add/Edit Dialog */}
      <Dialog open={showAddDialog || showEditDialog} onOpenChange={(open) => {
        if (!open) {
          setShowAddDialog(false);
          setShowEditDialog(false);
          setSelectedArticle(null);
          resetForm();
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{showEditDialog ? 'تعديل المقال' : 'إضافة مقال جديد'}</DialogTitle>
            <DialogDescription>
              {showEditDialog ? `تعديل: ${selectedArticle?.title}` : 'املأ البيانات لإضافة مقال جديد'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="col-span-2">
              <label className="text-sm font-medium mb-2 block">العنوان *</label>
              <Input 
                value={formData.title} 
                onChange={e => setFormData({...formData, title: e.target.value})} 
                placeholder="عنوان المقال"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Slug</label>
              <Input 
                value={formData.slug} 
                onChange={e => setFormData({...formData, slug: e.target.value})} 
                placeholder="article-slug"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">الفئة</label>
              <select 
                className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm"
                value={formData.category_id}
                onChange={e => setFormData({...formData, category_id: e.target.value})}
              >
                <option value="">اختر الفئة</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">الحالة</label>
              <select 
                className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm"
                value={formData.status}
                onChange={e => setFormData({...formData, status: e.target.value as ArticleFormData['status']})}
              >
                <option value="draft">مسودة</option>
                <option value="published">منشور</option>
                <option value="archived">أرشيف</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">وقت القراءة (دقائق)</label>
              <Input 
                type="number"
                value={formData.read_time} 
                onChange={e => setFormData({...formData, read_time: parseInt(e.target.value) || 5})} 
              />
            </div>
            <div className="col-span-2">
              <label className="text-sm font-medium mb-2 block">الوصف المختصر</label>
              <textarea 
                className="w-full px-3 py-2 rounded-lg border border-border bg-background min-h-[60px]"
                value={formData.excerpt} 
                onChange={e => setFormData({...formData, excerpt: e.target.value})} 
                placeholder="وصف مختصر للمقال..."
              />
            </div>
            <div className="col-span-2">
              <label className="text-sm font-medium mb-2 block">المحتوى</label>
              <textarea 
                className="w-full px-3 py-2 rounded-lg border border-border bg-background min-h-[150px]"
                value={formData.content} 
                onChange={e => setFormData({...formData, content: e.target.value})} 
                placeholder="محتوى المقال الكامل..."
              />
            </div>
            <div className="col-span-2">
              <label className="text-sm font-medium mb-2 block">رابط الصورة</label>
              <Input 
                value={formData.cover_image_url} 
                onChange={e => setFormData({...formData, cover_image_url: e.target.value})} 
                placeholder="https://..."
              />
            </div>
            <div className="col-span-2">
              <label className="text-sm font-medium mb-2 block">الوسوم (مفصولة بفواصل)</label>
              <Input 
                value={formData.tags} 
                onChange={e => setFormData({...formData, tags: e.target.value})} 
                placeholder="ai, tutorial, review"
              />
            </div>
            <div className="col-span-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox"
                  checked={formData.featured}
                  onChange={e => setFormData({...formData, featured: e.target.checked})}
                  className="w-4 h-4"
                />
                <span className="text-sm">مقال مميز</span>
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={showEditDialog ? handleEditArticle : handleAddArticle} disabled={saving} className="gap-2">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              {showEditDialog ? 'حفظ التغييرات' : 'إضافة'}
            </Button>
            <Button variant="outline" onClick={() => { 
              setShowAddDialog(false);
              setShowEditDialog(false);
              setSelectedArticle(null);
              resetForm();
            }}>
              إلغاء
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedArticle?.title}</DialogTitle>
            <DialogDescription>/{selectedArticle?.slug}</DialogDescription>
          </DialogHeader>
          {selectedArticle && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-4">
                <Badge variant={
                  selectedArticle.status === 'published' ? 'success' : 
                  selectedArticle.status === 'draft' ? 'warning' : 'secondary'
                }>
                  {selectedArticle.status === 'published' ? 'منشور' : 
                   selectedArticle.status === 'draft' ? 'مسودة' : 'أرشيف'}
                </Badge>
                {selectedArticle.featured && (
                  <Badge variant="default" className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" />
                    مميز
                  </Badge>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">الفئة</p>
                  <p className="font-medium">{getCategoryName(selectedArticle.category_id)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">وقت القراءة</p>
                  <p className="font-medium">{selectedArticle.read_time} دقيقة</p>
                </div>
              </div>
              
              {selectedArticle.excerpt && (
                <div>
                  <p className="text-sm text-muted-foreground">الوصف المختصر</p>
                  <p>{selectedArticle.excerpt}</p>
                </div>
              )}
              
              {selectedArticle.tags && selectedArticle.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedArticle.tags.map((tag, i) => (
                    <Badge key={i} variant="outline">{tag}</Badge>
                  ))}
                </div>
              )}
              
              {selectedArticle.content && (
                <div>
                  <p className="text-sm text-muted-foreground">المحتوى</p>
                  <p className="text-sm whitespace-pre-wrap">{selectedArticle.content}</p>
                </div>
              )}
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
              هل أنت متأكد من حذف المقال؟
              هذا الإجراء لا يمكن التراجع عنه.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowDeleteDialog(false); setSelectedArticle(null); }}>
              إلغاء
            </Button>
            <Button variant="destructive" onClick={handleDeleteArticle} disabled={saving} className="gap-2">
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
