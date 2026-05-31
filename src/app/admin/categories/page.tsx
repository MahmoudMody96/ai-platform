// =============================================
// Admin - Categories Page
// =============================================

'use client';

import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/modal';
import { Plus, Edit, Trash2, Loader2, Check, AlertTriangle, ArrowUp, ArrowDown, GripVertical } from 'lucide-react';
import type { Category } from '@/types';

interface CategoryFormData {
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
}

const initialFormData: CategoryFormData = {
  name: '',
  slug: '',
  description: '',
  icon: '',
  color: '#6366f1',
};

const colorPresets = [
  '#6366F1', '#EC4899', '#10B981', '#F59E0B', 
  '#3B82F6', '#8B5CF6', '#14B8A6', '#F97316',
];

export default function AdminCategoriesPage() {
  // State
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [reordering, setReordering] = React.useState(false);
  
  // Dialogs
  const [showAddDialog, setShowAddDialog] = React.useState(false);
  const [showEditDialog, setShowEditDialog] = React.useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = React.useState<Category | null>(null);
  
  // Form state
  const [formData, setFormData] = React.useState<CategoryFormData>(initialFormData);

  // Fetch categories
  const fetchCategories = React.useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/categories');
      const data = await response.json();
      
      if (data.success) {
        setCategories(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(false);
    }
  }, []);

// Load initial data
  React.useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/categories');
        const data = await response.json();
        if (data.success) {
          setCategories(data.data || []);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Flatten categories for display
  const flatCategories = React.useMemo(() => {
    const result: Category[] = [];
    const flatten = (cats: Category[], level = 0) => {
      cats.forEach(cat => {
        result.push({ ...cat });
        if (cat.children && cat.children.length > 0) {
          flatten(cat.children, level + 1);
        }
      });
    };
    flatten(categories);
    return result;
  }, [categories]);

  // Handlers
  const handleAddCategory = async () => {
    if (!formData.name) return;
    
    try {
      setSaving(true);
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-'),
          description: formData.description || null,
          icon: formData.icon || null,
          color: formData.color || '#6366f1',
          sort_order: flatCategories.length,
        }),
      });
      
      const data = await response.json();
      if (data.success) {
        fetchCategories();
        setShowAddDialog(false);
        resetForm();
      } else {
        alert(data.error || 'Failed to add category');
      }
    } catch (error) {
      console.error('Failed to add category:', error);
      alert('Failed to add category');
    } finally {
      setSaving(false);
    }
  };

  const handleEditCategory = async () => {
    if (!selectedCategory) return;
    
    try {
      setSaving(true);
      const response = await fetch(`/api/categories?id=${selectedCategory.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          slug: formData.slug,
          description: formData.description || null,
          icon: formData.icon || null,
          color: formData.color || '#6366f1',
        }),
      });
      
      const data = await response.json();
      if (data.success) {
        fetchCategories();
        setShowEditDialog(false);
        setSelectedCategory(null);
        resetForm();
      } else {
        alert(data.error || 'Failed to update category');
      }
    } catch (error) {
      console.error('Failed to update category:', error);
      alert('Failed to update category');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;
    
    try {
      setSaving(true);
      const response = await fetch(`/api/categories?id=${selectedCategory.id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      if (data.success) {
        fetchCategories();
        setShowDeleteDialog(false);
        setSelectedCategory(null);
      } else {
        alert(data.error || 'Failed to delete category');
      }
    } catch (error) {
      console.error('Failed to delete category:', error);
      alert('Failed to delete category');
    } finally {
      setSaving(false);
    }
  };

  const handleMoveUp = async (category: Category, index: number) => {
    if (index === 0) return;
    
    try {
      setReordering(true);
      const newOrder = [...flatCategories];
      const prevCat = newOrder[index - 1];
      
      // Swap sort_order
      await fetch(`/api/categories?id=${category.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sort_order: prevCat.sort_order,
        }),
      });
      
      await fetch(`/api/categories?id=${prevCat.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sort_order: category.sort_order,
        }),
      });
      
      fetchCategories();
    } catch (error) {
      console.error('Failed to reorder:', error);
    } finally {
      setReordering(false);
    }
  };

  const handleMoveDown = async (category: Category, index: number) => {
    if (index === flatCategories.length - 1) return;
    
    try {
      setReordering(true);
      const newOrder = [...flatCategories];
      const nextCat = newOrder[index + 1];
      
      // Swap sort_order
      await fetch(`/api/categories?id=${category.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sort_order: nextCat.sort_order,
        }),
      });
      
      await fetch(`/api/categories?id=${nextCat.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sort_order: category.sort_order,
        }),
      });
      
      fetchCategories();
    } catch (error) {
      console.error('Failed to reorder:', error);
    } finally {
      setReordering(false);
    }
  };

  const handleEditClick = (category: Category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      icon: category.icon || '',
      color: category.color || '#6366f1',
    });
    setShowEditDialog(true);
  };

  const handleDeleteClick = (category: Category) => {
    setSelectedCategory(category);
    setShowDeleteDialog(true);
  };

  const resetForm = () => {
    setFormData(initialFormData);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">إدارة الفئات</h2>
          <p className="text-muted-foreground">{flatCategories.length} فئة</p>
        </div>
        <Button onClick={() => { resetForm(); setShowAddDialog(true); }} className="gap-2">
          <Plus className="w-4 h-4" />
          إضافة فئة
        </Button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : flatCategories.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">لم يتم العثور على فئات</p>
          </div>
        ) : (
          flatCategories.map((cat, index) => (
            <Card key={cat.id} className="group hover:shadow-md transition-all">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  {/* Drag Handle */}
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => handleMoveUp(cat, index)}
                      disabled={index === 0 || reordering}
                      className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground disabled:opacity-50"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
                    <button
                      onClick={() => handleMoveDown(cat, index)}
                      disabled={index === flatCategories.length - 1 || reordering}
                      className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground disabled:opacity-50"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {/* Icon */}
                  <div className="p-3 rounded-xl" style={{ backgroundColor: `${cat.color}20` }}>
                    <span className="text-2xl">{cat.icon || '📁'}</span>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg">{cat.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{cat.description || 'لا يوجد وصف'}</p>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon-sm" onClick={() => handleEditClick(cat)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon-sm" className="text-destructive hover:bg-destructive/10" onClick={() => handleDeleteClick(cat)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Badges */}
                <div className="mt-4 flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">/{cat.slug}</Badge>
                  <Badge style={{ backgroundColor: cat.color || '#6366f1', color: 'white' }} className="text-xs">
                    {cat.color || '#6366f1'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Add Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>إضافة فئة جديدة</DialogTitle>
            <DialogDescription>أضف فئة جديدة لترتيب الأدوات والمقالات</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-2 block">اسم الفئة *</label>
              <Input 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
                placeholder="مثال: التصميم"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Slug</label>
              <Input 
                value={formData.slug} 
                onChange={e => setFormData({...formData, slug: e.target.value})} 
                placeholder="design"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">الأيقونة</label>
              <Input 
                value={formData.icon} 
                onChange={e => setFormData({...formData, icon: e.target.value})} 
                placeholder="🎨"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">الوصف</label>
              <Input 
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})} 
                placeholder="وصف مختصر للفئة"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">اللون</label>
              <div className="flex gap-2 flex-wrap">
                {colorPresets.map(color => (
                  <button
                    key={color}
                    onClick={() => setFormData({...formData, color})}
                    className={`w-10 h-10 rounded-lg border-2 transition-all ${
                      formData.color === color ? 'border-foreground scale-110' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
                <input
                  type="color"
                  value={formData.color}
                  onChange={e => setFormData({...formData, color: e.target.value})}
                  className="w-10 h-10 rounded-lg border border-input cursor-pointer"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleAddCategory} disabled={saving} className="gap-2">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              إضافة
            </Button>
            <Button variant="outline" onClick={() => { setShowAddDialog(false); resetForm(); }}>
              إلغاء
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تعديل الفئة</DialogTitle>
            <DialogDescription>تعديل بيانات الفئة: {selectedCategory?.name}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-2 block">اسم الفئة *</label>
              <Input 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Slug</label>
              <Input 
                value={formData.slug} 
                onChange={e => setFormData({...formData, slug: e.target.value})} 
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">الأيقونة</label>
              <Input 
                value={formData.icon} 
                onChange={e => setFormData({...formData, icon: e.target.value})} 
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">الوصف</label>
              <Input 
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})} 
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">اللون</label>
              <div className="flex gap-2 flex-wrap">
                {colorPresets.map(color => (
                  <button
                    key={color}
                    onClick={() => setFormData({...formData, color})}
                    className={`w-10 h-10 rounded-lg border-2 transition-all ${
                      formData.color === color ? 'border-foreground scale-110' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
                <input
                  type="color"
                  value={formData.color}
                  onChange={e => setFormData({...formData, color: e.target.value})}
                  className="w-10 h-10 rounded-lg border border-input cursor-pointer"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleEditCategory} disabled={saving} className="gap-2">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              حفظ التغييرات
            </Button>
            <Button variant="outline" onClick={() => { setShowEditDialog(false); setSelectedCategory(null); resetForm(); }}>
              إلغاء
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
              هل أنت متأكد من حذف الفئة؟
              سيتم نقل الأدوات والمقالات المرتبطة إلى غير مصنفة.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowDeleteDialog(false); setSelectedCategory(null); }}>
              إلغاء
            </Button>
            <Button variant="destructive" onClick={handleDeleteCategory} disabled={saving} className="gap-2">
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
