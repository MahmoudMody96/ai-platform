'use client';

import * as React from 'react';
import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Sparkles, Loader2, LayoutGrid, List, Heart, Plus, Filter, X, ChevronLeft } from 'lucide-react';
import { StarRating } from '@/components/reviews/StarRating';
import { SaveButton } from '@/components/favorites/SaveButton';
import { useQuery } from '@tanstack/react-query';
import { ThemeToggle } from '@/contexts/ThemeContext';

// AL.AI.DY Colors
const colors = {
  violet: { primary: '#8B5CF6', light: '#A78BFA', dark: '#7C3AED' },
  cyan: { primary: '#06B6D4', light: '#22D3EE', dark: '#0891B2' },
  amber: { primary: '#F59E0B', light: '#FBBF24', dark: '#D97706' },
  emerald: { primary: '#10B981', light: '#34D399', dark: '#059669' },
  rose: { primary: '#EC4899', light: '#F472B6', dark: '#DB2777' },
};

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

const categories = ['الكل', 'مساعدون ذكيون', 'توليد الصور', 'أتمتة', 'برمجة', 'صوت', 'فيديو', 'بحث', 'كتابة'];
const pricingOptions = [
  { value: 'all', label: 'كل الأسعار' },
  { value: 'free', label: 'مجاني' },
  { value: 'freemium', label: 'مجاني + مدفوع' },
  { value: 'paid', label: 'مدفوع' },
];

// Mock data as fallback when API returns empty
const mockTools: Tool[] = [
  {
    id: '1', name: 'ChatGPT', slug: 'chatgpt',
    description: 'أذكى مساعد ذكي في العالم للمحادثة والكتابة والترجمة', tagline: 'أفضل مساعد ذكي',
    website_url: 'https://chat.openai.com', logo_url: null,
    pricing_type: 'freemium', starting_price: null,
    rating_avg: 4.9, rating_count: 15420, is_featured: true,
    category: { id: '1', name: 'مساعدون ذكيون', slug: 'ai-assistants', color: colors.violet.primary },
  },
  {
    id: '2', name: 'Claude', slug: 'claude',
    description: 'مساعدك الذكي للتأمل والتحليل من Anthropic', tagline: 'محادثة متقدمة',
    website_url: 'https://claude.ai', logo_url: null,
    pricing_type: 'freemium', starting_price: null,
    rating_avg: 4.8, rating_count: 8920, is_featured: true,
    category: { id: '1', name: 'مساعدون ذكيون', slug: 'ai-assistants', color: colors.violet.primary },
  },
  {
    id: '3', name: 'Midjourney', slug: 'midjourney',
    description: 'حوّل أفكارك إلى صور فنية مذهلة بالذكاء الاصطناعي', tagline: 'صور فنية',
    website_url: 'https://midjourney.com', logo_url: null,
    pricing_type: 'paid', starting_price: 10,
    rating_avg: 4.7, rating_count: 6540, is_featured: true,
    category: { id: '2', name: 'توليد الصور', slug: 'image-generation', color: colors.rose.primary },
  },
  {
    id: '4', name: 'Gemini', slug: 'gemini',
    description: 'من Google مع قوة البحث والذكاء الاصطناعي', tagline: 'بحث شامل',
    website_url: 'https://gemini.google.com', logo_url: null,
    pricing_type: 'free', starting_price: null,
    rating_avg: 4.6, rating_count: 4820, is_featured: true,
    category: { id: '1', name: 'مساعدون ذكيون', slug: 'ai-assistants', color: colors.cyan.primary },
  },
  {
    id: '5', name: 'DALL-E 3', slug: 'dall-e-3',
    description: 'صور من خيالك مع OpenAI', tagline: 'توليد صور',
    website_url: 'https://openai.com/dall-e-3', logo_url: null,
    pricing_type: 'paid', starting_price: 15,
    rating_avg: 4.5, rating_count: 3280, is_featured: false,
    category: { id: '2', name: 'توليد الصور', slug: 'image-generation', color: colors.rose.primary },
  },
  {
    id: '6', name: 'GitHub Copilot', slug: 'github-copilot',
    description: 'صديقك في البرمجة من GitHub وOpenAI', tagline: 'مساعد برمجي',
    website_url: 'https://github.com/features/copilot', logo_url: null,
    pricing_type: 'paid', starting_price: 10,
    rating_avg: 4.4, rating_count: 12850, is_featured: false,
    category: { id: '4', name: 'برمجة', slug: 'coding', color: colors.emerald.primary },
  },
  {
    id: '7', name: 'Perplexity', slug: 'perplexity',
    description: 'محرك البحث الذكي مع مصادر موثوقة', tagline: 'بحث ذكي',
    website_url: 'https://perplexity.ai', logo_url: null,
    pricing_type: 'freemium', starting_price: null,
    rating_avg: 4.5, rating_count: 3890, is_featured: false,
    category: { id: '7', name: 'بحث', slug: 'search', color: colors.cyan.primary },
  },
  {
    id: '8', name: 'ElevenLabs', slug: 'elevenlabs',
    description: 'أصوات طبيعية بالذكاء الاصطناعي', tagline: 'نصوص لصوت',
    website_url: 'https://elevenlabs.io', logo_url: null,
    pricing_type: 'freemium', starting_price: 5,
    rating_avg: 4.6, rating_count: 1820, is_featured: false,
    category: { id: '5', name: 'صوت', slug: 'audio', color: colors.amber.primary },
  },
];

function ToolsLoading() {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: colors.violet.primary + '20' }}>
        <Loader2 className="w-6 h-6 animate-spin" style={{ color: colors.violet.primary }} />
      </div>
      <span className="text-muted-foreground">جاري تحميل الأدوات...</span>
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
  const [showMobileFilters, setShowMobileFilters] = React.useState(false);

  // Fetch tools from API with fallback to mock data
  const { data: toolsData, isLoading, error } = useQuery<ToolsResponse>({
    queryKey: ['tools', selectedCategory, selectedPricing, searchQuery, currentPage],
    queryFn: async () => {
      try {
        const params = new URLSearchParams();
        params.set('page', String(currentPage));
        params.set('pageSize', '20');
        if (selectedCategory !== 'الكل') params.set('category', selectedCategory);
        if (selectedPricing !== 'all') params.set('pricing', selectedPricing);
        if (searchQuery) params.set('q', searchQuery);
        params.set('sort', 'rating');

        const res = await fetch(`/api/tools?${params.toString()}`);
        const json = await res.json();
        
        // If no data from API, use mock data
        if (!json.data || json.data.length === 0) {
          return {
            success: true,
            data: mockTools,
            meta: { total: mockTools.length, page: 1, limit: 20, total_pages: 1 },
          };
        }
        
        return json;
      } catch {
        // On error, return mock data
        return {
          success: true,
          data: mockTools,
          meta: { total: mockTools.length, page: 1, limit: 20, total_pages: 1 },
        };
      }
    },
    staleTime: 5 * 60 * 1000,
  });

  const getPricingBadge = (pricing: string) => {
    switch (pricing) {
      case 'free': return <span className="text-xs font-medium px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">مجاني</span>;
      case 'freemium': return <span className="text-xs font-medium px-3 py-1 rounded-full bg-cyan-500/15 text-cyan-600 dark:text-cyan-400">مجاني + مدفوع</span>;
      case 'paid': return <span className="text-xs font-medium px-3 py-1 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400">مدفوع</span>;
      case 'enterprise': return <span className="text-xs font-medium px-3 py-1 rounded-full bg-slate-500/15 text-slate-600 dark:text-slate-400">للشركات</span>;
      default: return null;
    }
  };

  const tools = toolsData?.data || mockTools;
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="container-custom">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${colors.violet.primary}, ${colors.cyan.primary})` }}
              >
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span 
                className="text-xl font-bold"
                style={{ background: `linear-gradient(135deg, ${colors.violet.primary}, ${colors.cyan.primary})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
              >
                AL.AI.DY
              </span>
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              <Link href="/" className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">الرئيسية</Link>
              <Link href="/tools" className="px-4 py-2 text-sm font-medium text-white" style={{ backgroundColor: colors.violet.primary }}>الأدوات</Link>
              <Link href="/blog" className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">المدونة</Link>
            </nav>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Link 
                href="/add-tool"
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg transition-all"
                style={{ background: `linear-gradient(135deg, ${colors.violet.primary}, ${colors.cyan.primary})` }}
              >
                <Plus className="w-4 h-4" />
                أضف أداة
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container-custom py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">أدوات الذكاء الاصطناعي</h1>
          <p className="text-muted-foreground">استكشف أكثر من 500 أداة AI مصنفة ومراجعة</p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="relative">
            <div className="absolute inset-0 rounded-xl blur-xl opacity-20" style={{ background: `linear-gradient(135deg, ${colors.violet.primary}, ${colors.cyan.primary})` }} />
            <div className="relative flex items-center bg-card rounded-xl border border-border/50 shadow-sm overflow-hidden">
              <Sparkles className="w-5 h-5 text-muted-foreground mr-4" />
              <input
                type="text"
                placeholder="ابحث عن أي أداة... مثال: ChatGPT، توليد صور"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 h-12 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              <button 
                type="submit" 
                className="h-full px-6 text-white font-medium transition-all"
                style={{ background: `linear-gradient(135deg, ${colors.violet.primary}, ${colors.cyan.primary})` }}
              >
                بحث
              </button>
            </div>
          </div>
        </form>

        {/* Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap transition-all ${
                  selectedCategory === cat 
                    ? 'text-white shadow-lg' 
                    : 'bg-card text-muted-foreground hover:text-foreground border border-border/50'
                }`}
                style={selectedCategory === cat ? { background: `linear-gradient(135deg, ${colors.violet.primary}, ${colors.cyan.primary})` } : {}}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {/* Pricing Filter */}
            <select
              value={selectedPricing}
              onChange={(e) => { setSelectedPricing(e.target.value); setCurrentPage(1); }}
              className="px-4 py-2 text-sm bg-card border border-border/50 rounded-lg focus:outline-none focus:ring-2 cursor-pointer"
              style={{ '--tw-ring-color': colors.violet.primary } as React.CSSProperties}
            >
              {pricingOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>

            {/* View Toggle */}
            <div className="flex items-center border border-border/50 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-violet-500 text-white' : 'bg-card text-muted-foreground hover:text-foreground'}`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-violet-500 text-white' : 'bg-card text-muted-foreground hover:text-foreground'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Loading/Error States */}
        {isLoading && <ToolsLoading />}
        
        {error && (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: colors.rose.primary + '15' }}>
              <Sparkles className="w-8 h-8" style={{ color: colors.rose.primary }} />
            </div>
            <h3 className="text-lg font-semibold mb-2">حدث خطأ</h3>
            <p className="text-muted-foreground mb-4">تعذر تحميل الأدوات. حاول مرة أخرى.</p>
            <Button onClick={() => window.location.reload()}>إعادة المحاولة</Button>
          </div>
        )}

        {/* Results */}
        {!isLoading && !error && (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-muted-foreground">
                تم العثور على <span className="font-semibold text-foreground">{toolsData?.meta?.total || 0}</span> أداة
              </p>
            </div>

            {/* Tools Grid */}
            {tools.length > 0 ? (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}>
                {tools.map((tool) => (
                  <Link
                    key={tool.id}
                    href={`/tools/${tool.slug}`}
                    className={`group relative rounded-2xl bg-card border border-border/50 overflow-hidden hover:shadow-xl hover:border-violet-500/30 transition-all duration-300 ${viewMode === 'list' ? 'flex items-center p-4' : ''}`}
                  >
                    {viewMode === 'grid' ? (
                      <>
                        {/* Grid View */}
                        <div className="p-6">
                          {/* Save Button */}
                          <div className="absolute top-4 left-4">
                            <SaveButton toolId={tool.id} variant="ghost" size="icon" className="w-8 h-8 bg-background/80 backdrop-blur" />
                          </div>

                          {/* Featured Badge */}
                          {tool.is_featured && (
                            <div className="absolute top-4 right-4">
                              <span className="text-xs font-medium px-3 py-1 rounded-full text-white" style={{ background: `linear-gradient(135deg, ${colors.violet.primary}, ${colors.cyan.primary})` }}>
                                مميز
                              </span>
                            </div>
                          )}

                          {/* Icon */}
                          <div 
                            className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold mb-4 mt-2"
                            style={{ backgroundColor: (tool.category?.color || colors.violet.primary) + '20', color: tool.category?.color || colors.violet.primary }}
                          >
                            {tool.logo_url ? (
                              <img src={tool.logo_url} alt={tool.name} className="w-8 h-8" />
                            ) : (
                              tool.name.charAt(0)
                            )}
                          </div>

                          {/* Content */}
                          <h3 className="font-bold text-lg text-foreground group-hover:text-violet-500 transition-colors mb-1">{tool.name}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                            {tool.tagline || tool.description?.slice(0, 80)}
                          </p>

                          {/* Tags */}
                          <div className="flex flex-wrap items-center gap-2 mb-4">
                            {tool.category && (
                              <span 
                                className="text-xs font-medium px-3 py-1 rounded-full"
                                style={{ backgroundColor: tool.category.color + '15', color: tool.category.color }}
                              >
                                {tool.category.name}
                              </span>
                            )}
                            {getPricingBadge(tool.pricing_type)}
                          </div>

                          {/* Footer */}
                          <div className="flex items-center justify-between pt-4 border-t border-border/50">
                            <div className="flex items-center gap-2">
                              <StarRating rating={tool.rating_avg} size="sm" />
                              <span className="text-xs text-muted-foreground">({tool.rating_count})</span>
                            </div>
                          </div>
                        </div>

                        {/* Hover Effect */}
                        <div className="h-1 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: `linear-gradient(90deg, ${colors.violet.primary}, ${colors.cyan.primary})` }} />
                      </>
                    ) : (
                      <>
                        {/* List View */}
                        <div 
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold flex-shrink-0 mr-4"
                          style={{ backgroundColor: (tool.category?.color || colors.violet.primary) + '20', color: tool.category?.color || colors.violet.primary }}
                        >
                          {tool.logo_url ? (
                            <img src={tool.logo_url} alt={tool.name} className="w-8 h-8" />
                          ) : (
                            tool.name.charAt(0)
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground group-hover:text-violet-500 transition-colors">{tool.name}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {tool.tagline || tool.description?.slice(0, 80)}
                          </p>
                        </div>
                        <div className="flex items-center gap-4 flex-shrink-0 mr-4">
                          {tool.category && (
                            <span 
                              className="text-xs font-medium px-3 py-1 rounded-full hidden sm:inline-block"
                              style={{ backgroundColor: tool.category.color + '15', color: tool.category.color }}
                            >
                              {tool.category.name}
                            </span>
                          )}
                          {getPricingBadge(tool.pricing_type)}
                          <StarRating rating={tool.rating_avg} size="sm" />
                          <SaveButton toolId={tool.id} variant="ghost" size="icon" />
                          <a href={tool.website_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-violet-500 hover:underline">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      </>
                    )}
                  </Link>
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
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-sm border border-border/50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:border-violet-500 transition-colors"
                >
                  السابق
                </button>
                <span className="px-4 py-2 text-sm text-muted-foreground">
                  صفحة {currentPage} من {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 text-sm border border-border/50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:border-violet-500 transition-colors"
                >
                  التالي
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-border mt-16 bg-card/50">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${colors.violet.primary}, ${colors.cyan.primary})` }}
              >
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span 
                className="text-xl font-bold"
                style={{ background: `linear-gradient(135deg, ${colors.violet.primary}, ${colors.cyan.primary})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
              >
                AL.AI.DY
              </span>
            </div>
            <p className="text-sm text-muted-foreground">© 2026 AL.AI.DY. جميع الحقوق محفوظة.</p>
          </div>
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
