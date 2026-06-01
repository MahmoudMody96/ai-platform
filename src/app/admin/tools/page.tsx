// =============================================
// Admin - Tools Management Page
// =============================================

'use client';

import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge, PricingBadge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/modal';
import { Plus, Search, Edit, Trash2, Eye, X, ExternalLink, Check, AlertTriangle, Loader2 } from 'lucide-react';
import type { Tool, Category } from '@/types';

const pricingOptions = [
  { value: 'free', label: 'مجاني' },
  { value: 'freemium', label: 'مجاني مع باقة مدفوعة' },
  { value: 'paid', label: 'مدفوع' },
  { value: 'contact', label: 'تواصل للسعر' },
];

interface ToolFormData {
  name: string;
  slug: string;
  description: string;
  website_url: string;
  documentation_url: string;
  category_id: string;
  pricing_model: 'free' | 'freemium' | 'paid' | 'contact';
  monthly_price: string;
  tags: string;
  is_featured: boolean;
  is_verified: boolean;
}

const initialFormData: ToolFormData = {
  name: '',
  slug: '',
  description: '',
  website_url: '',
  documentation_url: '',
  category_id: '',
  pricing_model: 'freemium',
  monthly_price: '',
  tags: '',
  is_featured: false,
  is_verified: false,
};

export default function AdminToolsPage() {
  // State
  const [tools, setTools] = React.useState<Tool[]>([]);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  
  // Pagination
  const [page, setPage] = React.useState(1);
  const [pageSize] = React.useState(20);
  const [totalCount, setTotalCount] = React.useState(0);
  
  // Filters
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('');
  const [selectedPricing, setSelectedPricing] = React.useState('');
  
  // Dialogs
  const [showAddDialog, setShowAddDialog] = React.useState(false);
  const [showEditDialog, setShowEditDialog] = React.useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [showViewDialog, setShowViewDialog] = React.useState(false);
  const [selectedTool, setSelectedTool] = React.useState<Tool | null>(null);
  
  // Form state
  const [formData, setFormData] = React.useState<ToolFormData>(initialFormData);

  // Fetch tools
  const fetchTools = React.useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
      });
      if (searchQuery) params.append('search', searchQuery);
      if (selectedCategory) params.append('category', selectedCategory);
      if (selectedPricing) params.append('pricing', selectedPricing);

      const response = await fetch(`/api/tools?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setTools(data.data || []);
        setTotalCount(data.pagination?.totalCount || 0);
      }
    } catch (error) {
      console.error('Failed to fetch tools:', error);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, searchQuery, selectedCategory, selectedPricing]);

  React.useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [catsRes, toolsRes] = await Promise.all([
          fetch('/api/categories'),
          fetch(`/api/tools?page=${page}&pageSize=${pageSize}${searchQuery ? `&search=${searchQuery}` : ''}${selectedCategory ? `&category=${selectedCategory}` : ''}${selectedPricing ? `&pricing=${selectedPricing}` : ''}`)
        ]);
        const [catsData, toolsData] = await Promise.all([catsRes.json(), toolsRes.json()]);
        if (catsData.success) setCategories(catsData.data || []);
        if (toolsData.success) {
          setTools(toolsData.data || []);
          setTotalCount(toolsData.pagination?.totalCount || 0);
        }
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [page, pageSize, searchQuery, selectedCategory, selectedPricing]);

  // Filter tools client-side for immediate feedback
  const filteredTools = React.useMemo(() => {
    let result = tools;
    
    if (searchQuery) {
      result = result.filter(tool => 
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (selectedCategory) {
      result = result.filter(tool => tool.category_id === selectedCategory);
    }
    
    if (selectedPricing) {
      result = result.filter(tool => tool.pricing_model === selectedPricing);
    }
    
    return result;
  }, [tools, searchQuery, selectedCategory, selectedPricing]);

  // Handlers
  const handleAddTool = async () => {
    if (!formData.name || !formData.website_url) return;
    
    try {
      setSaving(true);
      const response = await fetch('/api/tools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-'),
          description: formData.description,
          website_url: formData.website_url,
          documentation_url: formData.documentation_url || null,
          category_id: formData.category_id || null,
          pricing_model: formData.pricing_model,
          monthly_price: formData.pricing_model === 'paid' ? parseFloat(formData.monthly_price) || null : null,
          tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
          is_featured: formData.is_featured,
        }),
      });
      
      const data = await response.json();
      if (data.success) {
        fetchTools();
        setShowAddDialog(false);
        resetForm();
      } else {
        alert(data.error || 'Failed to add tool');
      }
    } catch (error) {
      console.error('Failed to add tool:', error);
      alert('Failed to add tool');
    } finally {
      setSaving(false);
    }
  };

  const handleEditTool = async () => {
    if (!selectedTool) return;
    
    try {
      setSaving(true);
      const response = await fetch(`/api/tools?id=${selectedTool.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          slug: formData.slug,
          description: formData.description,
          website_url: formData.website_url,
          documentation_url: formData.documentation_url || null,
          category_id: formData.category_id || null,
          pricing_model: formData.pricing_model,
          monthly_price: formData.pricing_model === 'paid' ? parseFloat(formData.monthly_price) || null : null,
          tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
          is_featured: formData.is_featured,
          is_verified: formData.is_verified,
        }),
      });
      
      const data = await response.json();
      if (data.success) {
        fetchTools();
        setShowEditDialog(false);
        setSelectedTool(null);
        resetForm();
      } else {
        alert(data.error || 'Failed to update tool');
      }
    } catch (error) {
      console.error('Failed to update tool:', error);
      alert('Failed to update tool');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTool = async () => {
    if (!selectedTool) return;
    
    try {
      setSaving(true);
      const response = await fetch(`/api/tools?id=${selectedTool.id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      if (data.success) {
        fetchTools();
        setShowDeleteDialog(false);
        setSelectedTool(null);
      } else {
        alert(data.error || 'Failed to delete tool');
      }
    } catch (error) {
      console.error('Failed to delete tool:', error);
      alert('Failed to delete tool');
    } finally {
      setSaving(false);
    }
  };

  const handleViewTool = (tool: Tool) => {
    setSelectedTool(tool);
    setShowViewDialog(true);
  };

  const handleEditClick = (tool: Tool) => {
    setSelectedTool(tool);
    setFormData({
      name: tool.name,
      slug: tool.slug,
      description: tool.description || '',
      website_url: tool.website_url || '',
      documentation_url: tool.documentation_url || '',
      category_id: tool.category_id || '',
      pricing_model: (tool.pricing_model ?? 'freemium') as 'free' | 'freemium' | 'paid' | 'contact',
      monthly_price: tool.monthly_price?.toString() || '',
      tags: tool.tags?.join(', ') || '',
      is_featured: tool.is_featured,
      is_verified: tool.is_verified,
    });
    setShowEditDialog(true);
  };

  const handleDeleteClick = (tool: Tool) => {
    setSelectedTool(tool);
    setShowDeleteDialog(true);
  };

  const handleViewOnSite = (tool: Tool) => {
    window.open(`/tools/${tool.id}`, '_blank');
  };

  const resetForm = () => {
    setFormData(initialFormData);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedPricing('');
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
          <h2 className="text-2xl font-bold">إدارة الأدوات</h2>
          <p className="text-muted-foreground">{totalCount} أداة</p>
        </div>
        <Button onClick={() => { resetForm(); setShowAddDialog(true); }} className="gap-2">
          <Plus className="w-4 h-4" />
          إضافة أداة
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-end">
            {/* Search */}
            <div className="flex-1 min-w-[200px]">
              <label className="text-sm font-medium mb-2 block">بحث</label>
              <div className="relative">
                <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="ابحث عن أداة..." 
                  className="ps-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            {/* Category Filter */}
            <div className="w-40">
              <label className="text-sm font-medium mb-2 block">الفئة</label>
              <select 
                className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">جميع الفئات</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            
            {/* Pricing Filter */}
            <div className="w-44">
              <label className="text-sm font-medium mb-2 block">السعر</label>
              <select 
                className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm"
                value={selectedPricing}
                onChange={(e) => setSelectedPricing(e.target.value)}
              >
                <option value="">جميع الأسعار</option>
                {pricingOptions.map(p => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>
            
            {/* Clear Filters */}
            {(searchQuery || selectedCategory || selectedPricing) && (
              <Button variant="outline" onClick={clearFilters} className="gap-2">
                <X className="w-4 h-4" />
                مسح
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tools Table */}
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
                    <th className="text-start px-6 py-3 text-sm font-medium">الأداة</th>
                    <th className="text-start px-6 py-3 text-sm font-medium">الفئة</th>
                    <th className="text-start px-6 py-3 text-sm font-medium">التسعير</th>
                    <th className="text-start px-6 py-3 text-sm font-medium">الحالة</th>
                    <th className="text-start px-6 py-3 text-sm font-medium">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredTools.map((tool) => (
                    <tr key={tool.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center font-bold text-primary">
                            {tool.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium">{tool.name}</p>
                            <p className="text-xs text-muted-foreground">{tool.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="outline">{getCategoryName(tool.category_id)}</Badge>
                      </td>
                      <td className="px-6 py-4">
                        <PricingBadge pricing={(tool.pricing_model ?? 'freemium') as 'free' | 'freemium' | 'paid' | 'contact'} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {tool.is_featured && (
                            <Badge variant="default" className="text-xs">مميز</Badge>
                          )}
                          {tool.is_verified && (
                            <Badge variant="success" className="text-xs flex items-center gap-1">
                              <Check className="w-3 h-3" />
                              موثق
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon-sm"
                            onClick={() => handleViewTool(tool)}
                            title="عرض"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon-sm"
                            onClick={() => handleViewOnSite(tool)}
                            title="عرض على الموقع"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon-sm"
                            onClick={() => handleEditClick(tool)}
                            title="تعديل"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon-sm"
                            className="text-destructive hover:bg-destructive/10"
                            onClick={() => handleDeleteClick(tool)}
                            title="حذف"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            
            {filteredTools.length === 0 && !loading && (
              <div className="text-center py-12">
                <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">لم يتم العثور على أدوات</p>
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
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page <= 1}
                >
                  السابق
                </Button>
                <span className="text-sm">صفحة {page} من {totalPages}</span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                >
                  التالي
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>إضافة أداة جديدة</DialogTitle>
            <DialogDescription>املأ البيانات لإضافة أداة جديدة</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div>
              <label className="text-sm font-medium mb-2 block">اسم الأداة *</label>
              <Input 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
                placeholder="مثال: ChatGPT" 
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Slug</label>
              <Input 
                value={formData.slug} 
                onChange={e => setFormData({...formData, slug: e.target.value})} 
                placeholder="chatgpt" 
              />
            </div>
            <div className="col-span-2">
              <label className="text-sm font-medium mb-2 block">الوصف</label>
              <textarea 
                className="w-full px-3 py-2 rounded-lg border border-border bg-background min-h-[80px]"
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})} 
                placeholder="وصف مختصر للأداة..."
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">رابط الموقع *</label>
              <Input 
                value={formData.website_url} 
                onChange={e => setFormData({...formData, website_url: e.target.value})} 
                placeholder="https://..." 
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">رابط التوثيق</label>
              <Input 
                value={formData.documentation_url} 
                onChange={e => setFormData({...formData, documentation_url: e.target.value})} 
                placeholder="https://..." 
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
              <label className="text-sm font-medium mb-2 block">نموذج التسعير</label>
              <select 
                className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm"
                value={formData.pricing_model}
                onChange={e => setFormData({...formData, pricing_model: e.target.value as ToolFormData['pricing_model']})}
              >
                {pricingOptions.map(p => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>
            {formData.pricing_model === 'paid' && (
              <div>
                <label className="text-sm font-medium mb-2 block">السعر الشهري ($)</label>
                <Input 
                  type="number"
                  value={formData.monthly_price} 
                  onChange={e => setFormData({...formData, monthly_price: e.target.value})} 
                  placeholder="10" 
                />
              </div>
            )}
            <div className="col-span-2">
              <label className="text-sm font-medium mb-2 block">الوسوم (مفصولة بفواصل)</label>
              <Input 
                value={formData.tags} 
                onChange={e => setFormData({...formData, tags: e.target.value})} 
                placeholder="writing, chat, ai" 
              />
            </div>
            <div className="col-span-2 flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox"
                  checked={formData.is_featured}
                  onChange={e => setFormData({...formData, is_featured: e.target.checked})}
                  className="w-4 h-4"
                />
                <span className="text-sm">أداة مميزة</span>
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleAddTool} disabled={saving} className="gap-2">
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>تعديل الأداة</DialogTitle>
            <DialogDescription>تعديل بيانات الأداة: {selectedTool?.name}</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div>
              <label className="text-sm font-medium mb-2 block">اسم الأداة *</label>
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
            <div className="col-span-2">
              <label className="text-sm font-medium mb-2 block">الوصف</label>
              <textarea 
                className="w-full px-3 py-2 rounded-lg border border-border bg-background min-h-[80px]"
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})} 
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">رابط الموقع *</label>
              <Input 
                value={formData.website_url} 
                onChange={e => setFormData({...formData, website_url: e.target.value})} 
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">رابط التوثيق</label>
              <Input 
                value={formData.documentation_url} 
                onChange={e => setFormData({...formData, documentation_url: e.target.value})} 
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
              <label className="text-sm font-medium mb-2 block">نموذج التسعير</label>
              <select 
                className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm"
                value={formData.pricing_model}
                onChange={e => setFormData({...formData, pricing_model: e.target.value as ToolFormData['pricing_model']})}
              >
                {pricingOptions.map(p => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>
            {formData.pricing_model === 'paid' && (
              <div>
                <label className="text-sm font-medium mb-2 block">السعر الشهري ($)</label>
                <Input 
                  type="number"
                  value={formData.monthly_price} 
                  onChange={e => setFormData({...formData, monthly_price: e.target.value})} 
                />
              </div>
            )}
            <div className="col-span-2">
              <label className="text-sm font-medium mb-2 block">الوسوم (مفصولة بفواصل)</label>
              <Input 
                value={formData.tags} 
                onChange={e => setFormData({...formData, tags: e.target.value})} 
              />
            </div>
            <div className="col-span-2 flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox"
                  checked={formData.is_featured}
                  onChange={e => setFormData({...formData, is_featured: e.target.checked})}
                  className="w-4 h-4"
                />
                <span className="text-sm">أداة مميزة</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox"
                  checked={formData.is_verified}
                  onChange={e => setFormData({...formData, is_verified: e.target.checked})}
                  className="w-4 h-4"
                />
                <span className="text-sm">موثق</span>
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleEditTool} disabled={saving} className="gap-2">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              حفظ التغييرات
            </Button>
            <Button variant="outline" onClick={() => { setShowEditDialog(false); setSelectedTool(null); resetForm(); }}>
              إلغاء
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedTool?.name}</DialogTitle>
            <DialogDescription>تفاصيل الأداة</DialogDescription>
          </DialogHeader>
          {selectedTool && (
            <div className="space-y-4 py-4">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center text-2xl font-bold text-primary">
                  {selectedTool.name.charAt(0)}
                </div>
                <div>
                  <p className="text-lg font-medium">{selectedTool.name}</p>
                  <p className="text-muted-foreground">{selectedTool.slug}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">الفئة</p>
                  <p className="font-medium">{getCategoryName(selectedTool.category_id)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">التسعير</p>
                  <PricingBadge pricing={(selectedTool.pricing_model ?? 'freemium') as 'free' | 'freemium' | 'paid' | 'contact'} />
                </div>
                {selectedTool.monthly_price && (
                  <div>
                    <p className="text-sm text-muted-foreground">السعر الشهري</p>
                    <p className="font-medium">${selectedTool.monthly_price}</p>
                  </div>
                )}
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">الوصف</p>
                <p>{selectedTool.description || 'لا يوجد وصف'}</p>
              </div>
              
              {selectedTool.website_url && (
                <div>
                  <p className="text-sm text-muted-foreground">رابط الموقع</p>
                  <a href={selectedTool.website_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1">
                    {selectedTool.website_url}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
              
              {selectedTool.tags && selectedTool.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedTool.tags.map((tag, i) => (
                    <Badge key={i} variant="outline">{tag}</Badge>
                  ))}
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowViewDialog(false)}>
              إغلاق
            </Button>
            <Button onClick={() => { setShowViewDialog(false); handleViewOnSite(selectedTool!); }}>
              عرض على الموقع
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
              هل أنت متأكد من حذف الأداة؟
              هذا الإجراء لا يمكن التراجع عنه.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowDeleteDialog(false); setSelectedTool(null); }}>
              إلغاء
            </Button>
            <Button variant="destructive" onClick={handleDeleteTool} disabled={saving} className="gap-2">
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
