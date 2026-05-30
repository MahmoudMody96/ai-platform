'use client';

import * as React from 'react';
import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Sparkles, Loader2, LayoutGrid, List, Heart } from 'lucide-react';
import { SearchBar } from '@/components/search/SearchBar';
import { SearchFilters, SortOption } from '@/components/search/SearchFilters';
import { StarRating } from '@/components/reviews/StarRating';
import { SaveButton } from '@/components/favorites/SaveButton';
import { useQuery } from '@tanstack/react-query';

interface Tool {
  id: string;
  name: string;
  slug: string;
  description: string;
  tagline: string | null;
  website_url: string;
  logo_url: string | null;
  pricing_type: 'free' | 'freemium' | 'paid' | 'enterprise' | 'contact';
  starting_price: number | null;
  rating_avg: number;
  rating_count: number;
  is_featured: boolean;
  category?: {
    id: string;
    name: string;
    slug: string;
    color: string;
  } | null;
}

interface ToolsResponse {
  success: boolean;
  data: Tool[];
  meta: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  };
}

const categories = ['الكل', 'كتابة', 'تصميم', 'برمجة', 'صوت', 'فيديو', 'بحث'];
const pricingOptions = [
  { value: 'all', label: 'كل الأسعار' },
  { value: 'free', label: 'مجاني' },
  { value: 'freemium', label: 'مجاني + مدفوع' },
  { value: 'paid', label: 'مدفوع' },
];

function ToolsLoading() {
  return (
    <div className="flex items-center justify-center py-16">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
      <span className="ms-3 text-muted-foreground">جاري تحميل الأدوات...</span>
    </div>
  );
}

function ToolsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialCategory = searchParams.get('category') || 'الكل';
  const initialSearch = searchParams.get('search') || '';
  const initialPage = parseInt(searchParams.get('page') || '1');

  const [searchQuery, setSearchQuery] = React.useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = React.useState(initialCategory);
  const [selectedPricing, setSelectedPricing] = React.useState('all');
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = React.useState(initialPage);

  // Fetch tools from API
  const { data: toolsData, isLoading, error } = useQuery<ToolsResponse>({
    queryKey: ['tools', selectedCategory, selectedPricing, searchQuery, currentPage],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set('page', String(currentPage));
      params.set('pageSize', '20');
      if (selectedCategory !== 'الكل') params.set('category', selectedCategory);
      if (selectedPricing !== 'all') params.set('pricing', selectedPricing);
      if (searchQuery) params.set('q', searchQuery);
      params.set('sort', 'rating');

      const res = await fetch(`/api/tools?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const getPricingBadge = (pricing: string) => {
    switch (pricing) {
      case 'free': return <Badge variant="success">مجاني</Badge>;
      case 'freemium': return <Badge variant="info">مجاني + مدفوع</Badge>;
      case 'paid': return <Badge variant="secondary">مدفوع</Badge>;
      case 'enterprise': return <Badge variant="outline">للشركات</Badge>;
      default: return null;
    }
  };

  const tools = toolsData?.data || [];
  const totalPages = toolsData?.meta?.total_pages || 1;

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
    if (cat !== 'الكل') {
      router.push(`/tools?category=${encodeURIComponent(cat)}`, { scroll: false });
    } else {
      router.push('/tools', { scroll: false });
    }
  };

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="container-custom">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gradient">AI Platform</span>
            </Link>
            <nav className="flex items-center gap-6">
              <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">الرئيسية</Link>
              <Link href="/tools" className="text-sm font-medium text-primary">الأدوات</Link>
              <Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground">المدونة</Link>
            </nav>
            <div className="flex items-center gap-2">
              <Link href="/auth/login"><Button size="sm" variant="ghost">تسجيل الدخول</Button></Link>
              <Link href="/auth/register"><Button size="sm">إنشاء حساب</Button></Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container-custom py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">أدوات الذكاء الاصطناعي</h1>
          <p className="text-muted-foreground">استكشف أكثر من 500 أداة AI مصنفة ومراجعة</p>
        </div>

        {/* Search */}
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          onSubmit={handleSearch}
          placeholder="ابحث عن أي أداة... مثال: توليد صور، كتابة محتوى"
          className="mb-6"
        />

        {/* Filters */}
        <SearchFilters
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          selectedPricing={selectedPricing}
          onPricingChange={(p) => { setSelectedPricing(p); setCurrentPage(1); }}
          categories={categories}
          pricingOptions={pricingOptions}
          className="mb-6"
        />

        {/* Loading/Error States */}
        {isLoading && <ToolsLoading />}
        
        {error && (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-destructive" />
            </div>
            <h3 className="text-lg font-semibold mb-2">حدث خطأ</h3>
            <p className="text-muted-foreground mb-4">تعذر تحميل الأدوات. حاول مرة أخرى.</p>
            <Button onClick={() => window.location.reload()}>إعادة المحاولة</Button>
          </div>
        )}

        {/* Results bar */}
        {!isLoading && !error && (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">
                تم العثور على <span className="font-semibold text-foreground">{toolsData?.meta?.total || 0}</span> أداة
              </p>
              <div className="flex items-center gap-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setViewMode('grid')}
                  aria-label="عرض شبكي"
                  className="w-8 h-8"
                >
                  <LayoutGrid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setViewMode('list')}
                  aria-label="عرض قائمة"
                  className="w-8 h-8"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Tools Grid */}
            {tools.length > 0 ? (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
                {tools.map((tool) => (
                  <Card key={tool.id} className="group hover:shadow-lg hover:-translate-y-1 transition-all relative">
                    <CardContent className={`p-6 ${viewMode === 'list' ? 'flex-row items-center' : ''}`}>
                      {viewMode === 'grid' ? (
                        <>
                          <div className="absolute top-4 left-4">
                            <SaveButton toolId={tool.id} variant="ghost" size="icon" className="w-8 h-8 bg-background/80 backdrop-blur" />
                          </div>
                          <div className="flex items-start gap-4 mb-4">
                            <div 
                              className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-bold text-primary flex-shrink-0"
                              style={{ backgroundColor: (tool.category?.color || '#6366f1') + '20' }}
                            >
                              {tool.logo_url ? (
                                <img src={tool.logo_url} alt={tool.name} className="w-8 h-8" />
                              ) : (
                                tool.name.charAt(0)
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <Link href={`/tools/${tool.slug}`} className="hover:text-primary">
                                  <h3 className="font-semibold text-lg">{tool.name}</h3>
                                </Link>
                                {tool.is_featured && <Badge variant="default" className="text-xs">مميز</Badge>}
                              </div>
                              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                {tool.tagline || tool.description?.slice(0, 100)}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 mb-4">
                            {tool.category && (
                              <Badge 
                                variant="secondary"
                                style={{ backgroundColor: tool.category.color + '15', color: tool.category.color }}
                              >
                                {tool.category.name}
                              </Badge>
                            )}
                            {getPricingBadge(tool.pricing_type)}
                          </div>

                          <div className="flex items-center justify-between pt-4 border-t border-border">
                            <div className="flex items-center gap-2">
                              <StarRating rating={tool.rating_avg} size="sm" />
                              <span className="text-xs text-muted-foreground">({tool.rating_count})</span>
                            </div>
                            <a href={tool.website_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-primary hover:underline">
                              زيارة الموقع <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </>
                      ) : (
                        <>
                          <div 
                            className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold text-primary flex-shrink-0"
                            style={{ backgroundColor: (tool.category?.color || '#6366f1') + '20' }}
                          >
                            {tool.logo_url ? (
                              <img src={tool.logo_url} alt={tool.name} className="w-8 h-8" />
                            ) : (
                              tool.name.charAt(0)
                            )}
                          </div>
                          <div className="flex-1">
                            <Link href={`/tools/${tool.slug}`}>
                              <h3 className="font-semibold hover:text-primary">{tool.name}</h3>
                            </Link>
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {tool.tagline || tool.description?.slice(0, 80)}
                            </p>
                          </div>
                          <div className="flex items-center gap-4 flex-shrink-0">
                            {tool.category && (
                              <Badge variant="secondary">{tool.category.name}</Badge>
                            )}
                            {getPricingBadge(tool.pricing_type)}
                            <StarRating rating={tool.rating_avg} size="sm" />
                            <SaveButton toolId={tool.id} variant="ghost" size="icon" />
                            <a href={tool.website_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-primary hover:underline">
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">لم يتم العثور على أدوات</h3>
                <p className="text-muted-foreground mb-4">جرب البحث بكلمات مختلفة أو غير الفلاتر</p>
                <Button onClick={() => { setSearchQuery(''); setSelectedCategory('الكل'); setSelectedPricing('all'); }}>
                  إعادة تعيين الفلاتر
                </Button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  السابق
                </Button>
                <span className="px-4 py-2 text-sm">
                  صفحة {currentPage} من {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  التالي
                </Button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-border mt-16">
        <div className="container-custom text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold">AI Platform</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2026 AI Platform. جميع الحقوق محفوظة.</p>
        </div>
      </footer>
    </div>
  );
}

export default function ToolsPage() {
  return (
    <Suspense fallback={<ToolsLoading />}>
      <ToolsContent />
    </Suspense>
  );
}