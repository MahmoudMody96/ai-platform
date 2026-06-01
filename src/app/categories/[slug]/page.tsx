// =============================================
// Category Detail Page - [slug]/page.tsx
// Sub-categories, filtering, tools list
// =============================================

'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Sparkles, 
  Search, 
  Star, 
  ChevronLeft,
  ArrowRight,
  Grid3X3,
  List,
  Filter,
  X,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';

// Types
interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
  color?: string | null;
  parent_id?: string | null;
  children?: Category[];
  tools_count?: number;
  articles_count?: number;
}

interface Tool {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  logo_url?: string | null;
  website_url?: string | null;
  pricing_model: 'free' | 'freemium' | 'paid' | 'contact';
  monthly_price?: number | null;
  category?: Category | null;
  stats: {
    uses: number;
    rating: number;
    reviews: number;
  };
  is_featured?: boolean;
  is_verified?: boolean;
  tags?: string[] | null;
}

// Mock data - in production this would come from Supabase
const mockCategories: Category[] = [
  { 
    id: '1', 
    name: 'الكتابة', 
    slug: 'writing', 
    description: 'أدوات لكتابة المحتوى، المقالات، والكتابة الإبداعية',
    icon: '✍️', 
    color: '#6366F1',
    tools_count: 25,
    articles_count: 15,
    children: [
      { id: '1-1', name: 'كتابة المقالات', slug: 'articles-writing', parent_id: '1', tools_count: 8 },
      { id: '1-2', name: 'الكتابة الإبداعية', slug: 'creative-writing', parent_id: '1', tools_count: 12 },
      { id: '1-3', name: 'الترجمة', slug: 'translation', parent_id: '1', tools_count: 5 },
    ]
  },
  { 
    id: '2', 
    name: 'التصميم', 
    slug: 'design', 
    description: 'أدوات تصميم الجرافيك وتوليد الصور',
    icon: '🎨', 
    color: '#EC4899',
    tools_count: 30,
    articles_count: 20,
    children: [
      { id: '2-1', name: 'توليد الصور', slug: 'image-generation', parent_id: '2', tools_count: 15 },
      { id: '2-2', name: 'تعديل الصور', slug: 'image-editing', parent_id: '2', tools_count: 10 },
      { id: '2-3', name: 'التصميم الجرافيكي', slug: 'graphic-design', parent_id: '2', tools_count: 5 },
    ]
  },
  { 
    id: '3', 
    name: 'التطوير', 
    slug: 'development', 
    description: 'أدوات البرمجة وتطوير البرمجيات',
    icon: '💻', 
    color: '#10B981',
    tools_count: 40,
    articles_count: 25,
    children: [
      { id: '3-1', name: 'اكمال الكود', slug: 'code-completion', parent_id: '3', tools_count: 12 },
      { id: '3-2', name: 'مراجعة الكود', slug: 'code-review', parent_id: '3', tools_count: 8 },
      { id: '3-3', name: 'الاختبار', slug: 'testing', parent_id: '3', tools_count: 10 },
      { id: '3-4', name: 'الوثائق', slug: 'documentation', parent_id: '3', tools_count: 10 },
    ]
  },
  { 
    id: '4', 
    name: 'الأتمتة', 
    slug: 'automation', 
    description: 'أدوات لأتمتة المهام والعمليات',
    icon: '⚡', 
    color: '#F59E0B',
    tools_count: 20,
    articles_count: 10,
    children: []
  },
  { 
    id: '5', 
    name: 'التسويق', 
    slug: 'marketing', 
    description: 'أدوات التسويق الرقمي والإعلانات',
    icon: '📊', 
    color: '#3B82F6',
    tools_count: 25,
    articles_count: 15,
    children: []
  },
  { 
    id: '6', 
    name: 'الفيديو', 
    slug: 'video', 
    description: 'أدوات إنتاج وتحرير الفيديو',
    icon: '🎬', 
    color: '#8B5CF6',
    tools_count: 18,
    articles_count: 12,
    children: []
  },
];

const mockTools: Tool[] = [
  { id: '1', name: 'ChatGPT', slug: 'chatgpt', description: 'نموذج لغوي متقدم للكتابة والتحليل', pricing_model: 'freemium', monthly_price: 20, stats: { uses: 150000, rating: 4.8, reviews: 12500 }, is_verified: true, tags: ['نموذج لغوي', 'محادثة'] },
  { id: '2', name: 'Midjourney', slug: 'midjourney', description: 'توليد صور فنية مذهلة بالذكاء الاصطناعي', pricing_model: 'paid', monthly_price: 10, stats: { uses: 80000, rating: 4.7, reviews: 8200 }, is_verified: true, tags: ['صور', 'فن'] },
  { id: '3', name: 'Claude', slug: 'claude', description: 'مساعد ذكي للتحليل والكتابة', pricing_model: 'freemium', monthly_price: 20, stats: { uses: 95000, rating: 4.9, reviews: 9800 }, is_verified: true, tags: ['مساعد ذكي', 'تحليل'] },
  { id: '4', name: 'GitHub Copilot', slug: 'github-copilot', description: 'مساعد برمجة من GitHub وOpenAI', pricing_model: 'paid', monthly_price: 10, stats: { uses: 60000, rating: 4.6, reviews: 5600 }, is_verified: true, tags: ['برمجة', 'كود'] },
  { id: '5', name: 'DALL-E 3', slug: 'dall-e-3', description: 'توليد صور واقعية من النصوص', pricing_model: 'paid', monthly_price: 20, stats: { uses: 70000, rating: 4.7, reviews: 7100 }, is_verified: true, tags: ['صور', 'توليد'] },
  { id: '6', name: 'Perplexity', slug: 'perplexity', description: 'محرك بحث ذكي بالإجابات المباشرة', pricing_model: 'freemium', monthly_price: 20, stats: { uses: 45000, rating: 4.7, reviews: 4200 }, is_verified: true, tags: ['بحث', 'معلومات'] },
  { id: '7', name: 'Notion AI', slug: 'notion-ai', description: 'مساعد ذكي لبيئة العمل', pricing_model: 'paid', monthly_price: 10, stats: { uses: 55000, rating: 4.5, reviews: 4800 }, is_verified: true, tags: ['إنتاجية', 'كتابة'] },
  { id: '8', name: 'Jasper', slug: 'jasper', description: 'منصة كتابة محتوى تسويقي', pricing_model: 'paid', monthly_price: 49, stats: { uses: 35000, rating: 4.4, reviews: 3200 }, is_verified: true, tags: ['تسويق', 'محتوى'] },
  { id: '9', name: 'Runway', slug: 'runway', description: 'أدوات إنتاج فيديو متقدمة', pricing_model: 'paid', monthly_price: 12, stats: { uses: 28000, rating: 4.6, reviews: 2500 }, is_verified: true, tags: ['فيديو', 'إنتاج'] },
  { id: '10', name: 'ElevenLabs', slug: 'elevenlabs', description: 'توليد صوت طبيعي بالذكاء الاصطناعي', pricing_model: 'freemium', monthly_price: 5, stats: { uses: 40000, rating: 4.8, reviews: 3800 }, is_verified: true, tags: ['صوت', 'نص-to-speech'] },
];

// Get pricing label
function getPricingLabel(model: string, price?: number | null) {
  switch (model) {
    case 'free': return { label: 'مجاني', badge: 'success' as const };
    case 'freemium': return { label: 'مجاني + مدفوع', badge: 'info' as const };
    case 'paid': return { label: price ? `${price}$/شهر` : 'مدفوع', badge: 'secondary' as const };
    case 'contact': return { label: 'تواصل', badge: 'outline' as const };
    default: return { label: model, badge: 'secondary' as const };
  }
}

// Get all subcategories (flat list)
function getAllSubcategories(category: Category): Category[] {
  const subs: Category[] = [];
  if (category.children) {
    category.children.forEach(child => {
      subs.push(child);
      subs.push(...getAllSubcategories(child));
    });
  }
  return subs;
}

export default function CategoryDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedSubcategory, setSelectedSubcategory] = React.useState<string | null>(null);
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = React.useState<'rating' | 'uses' | 'name'>('rating');
  const [priceFilter, setPriceFilter] = React.useState<string | null>(null);

  // Find category
  const category = mockCategories.find(c => c.slug === slug);
  const allSubcategories = category ? getAllSubcategories(category) : [];
  
  // Filter tools
  const filteredTools = React.useMemo(() => {
    let tools = [...mockTools];
    
    // Apply subcategory filter
    if (selectedSubcategory) {
      // In production, filter by subcategory slug
      tools = tools.filter(t => t.tags?.some(tag => 
        tag.includes(selectedSubcategory) || 
        selectedSubcategory.includes(tag)
      ));
    }
    
    // Apply price filter
    if (priceFilter) {
      tools = tools.filter(t => t.pricing_model === priceFilter);
    }
    
    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      tools = tools.filter(t => 
        t.name.toLowerCase().includes(query) ||
        t.description?.toLowerCase().includes(query) ||
        t.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'rating':
        tools.sort((a, b) => b.stats.rating - a.stats.rating);
        break;
      case 'uses':
        tools.sort((a, b) => b.stats.uses - a.stats.uses);
        break;
      case 'name':
        tools.sort((a, b) => a.name.localeCompare(b.name, 'ar'));
        break;
    }
    
    return tools;
  }, [selectedSubcategory, priceFilter, searchQuery, sortBy]);

  if (!category) {
    return (
      <div className="min-h-screen">
        <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
          <div className="container-custom">
            <div className="flex h-16 items-center justify-between">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gradient">AI Platform</span>
              </Link>
            </div>
          </div>
        </header>
        
        <main className="container-custom py-20 text-center">
          <h1 className="text-3xl font-bold mb-4">الفئة غير موجودة</h1>
          <p className="text-muted-foreground mb-8">عذراً، هذه الفئة غير موجودة أو تم حذفها.</p>
          <Link href="/categories">
            <Button>
              <ArrowRight className="w-4 h-4 ms-2 rtl:rotate-180" />
              العودة للفئات
            </Button>
          </Link>
        </main>
      </div>
    );
  }

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
              <Link href="/tools" className="text-sm text-muted-foreground hover:text-foreground">الأدوات</Link>
              <Link href="/categories" className="text-sm font-medium text-primary">الفئات</Link>
            </nav>
            {/* Admin link removed: no public UI for /admin. Access at /admin/login directly. */}
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="border-b border-border bg-muted/20">
        <div className="container-custom py-3">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">الرئيسية</Link>
            <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
            <Link href="/categories" className="hover:text-foreground">الفئات</Link>
            <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
            <span className="text-foreground font-medium">{category.name}</span>
          </nav>
        </div>
      </div>

      {/* Category Header */}
      <section className="bg-gradient-to-b from-primary-50 to-background py-12">
        <div className="container-custom">
          <div className="flex items-start gap-6">
            <div 
              className="w-20 h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center text-4xl md:text-5xl"
              style={{ backgroundColor: (category.color || '#6366f1') + '20' }}
            >
              {category.icon || category.name.charAt(0)}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{category.name}</h1>
              {category.description && (
                <p className="text-lg text-muted-foreground mb-4">{category.description}</p>
              )}
              <div className="flex items-center gap-4">
                <Badge variant="outline">{category.tools_count || 0} أداة</Badge>
                <Badge variant="outline">{category.articles_count || 0} مقال</Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container-custom py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-72 shrink-0">
            <div className="sticky top-24 space-y-6">
              {/* Subcategories */}
              {category.children && category.children.length > 0 && (
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Grid3X3 className="w-4 h-4" />
                      الفئات الفرعية
                    </h3>
                    <div className="space-y-1">
                      <button
                        onClick={() => setSelectedSubcategory(null)}
                        className={`
                          w-full text-start px-4 py-2.5 rounded-lg transition-colors text-sm
                          ${!selectedSubcategory 
                            ? 'bg-primary text-white' 
                            : 'hover:bg-muted'}
                        `}
                      >
                        <div className="flex items-center justify-between">
                          <span>الكل</span>
                          <Badge variant="secondary" className="text-xs">
                            {mockTools.length}
                          </Badge>
                        </div>
                      </button>
                      {category.children.map((sub) => (
                        <button
                          key={sub.slug}
                          onClick={() => setSelectedSubcategory(
                            selectedSubcategory === sub.slug ? null : sub.slug
                          )}
                          className={`
                            w-full text-start px-4 py-2.5 rounded-lg transition-colors text-sm
                            ${selectedSubcategory === sub.slug 
                              ? 'bg-primary text-white' 
                              : 'hover:bg-muted'}
                          `}
                        >
                          <div className="flex items-center justify-between">
                            <span>{sub.name}</span>
                            <Badge variant="secondary" className="text-xs">
                              {sub.tools_count || 0}
                            </Badge>
                          </div>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Price Filter */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    السعر
                  </h3>
                  <div className="space-y-1">
                    {[
                      { value: null, label: 'الكل' },
                      { value: 'free', label: 'مجاني' },
                      { value: 'freemium', label: 'مجاني + مدفوع' },
                      { value: 'paid', label: 'مدفوع' },
                    ].map((option) => (
                      <button
                        key={option.value || 'all'}
                        onClick={() => setPriceFilter(option.value)}
                        className={`
                          w-full text-start px-4 py-2.5 rounded-lg transition-colors text-sm
                          ${priceFilter === option.value 
                            ? 'bg-primary text-white' 
                            : 'hover:bg-muted'}
                        `}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </aside>

          {/* Tools Grid */}
          <div className="flex-1">
            {/* Search and Controls */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input 
                  placeholder="ابحث في الفئة..."
                  className="ps-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex items-center gap-2">
                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="h-10 px-3 rounded-lg border border-border bg-background text-sm"
                >
                  <option value="rating">الأعلى تقييماً</option>
                  <option value="uses">الأكثر استخداماً</option>
                  <option value="name">أبجدي</option>
                </select>

                {/* View Mode */}
                <div className="flex items-center border border-border rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2.5 transition-colors ${viewMode === 'grid' ? 'bg-primary text-white' : 'bg-background hover:bg-muted'}`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2.5 transition-colors ${viewMode === 'list' ? 'bg-primary text-white' : 'bg-background hover:bg-muted'}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {(selectedSubcategory || priceFilter || searchQuery) && (
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <span className="text-sm text-muted-foreground">الفلاتر:</span>
                
                {searchQuery && (
                  <Badge variant="secondary" className="gap-1">
                    بحث: {searchQuery}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => setSearchQuery('')} />
                  </Badge>
                )}
                
                {selectedSubcategory && (
                  <Badge variant="secondary" className="gap-1">
                    {category.children?.find(c => c.slug === selectedSubcategory)?.name || selectedSubcategory}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedSubcategory(null)} />
                  </Badge>
                )}
                
                {priceFilter && (
                  <Badge variant="secondary" className="gap-1">
                    {getPricingLabel(priceFilter).label}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => setPriceFilter(null)} />
                  </Badge>
                )}

                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedSubcategory(null);
                    setPriceFilter(null);
                  }}
                >
                  مسح الكل
                </Button>
              </div>
            )}

            {/* Results Count */}
            <div className="mb-4">
              <p className="text-muted-foreground">
                تم العثور على {filteredTools.length} أداة
              </p>
            </div>

            {/* Tools */}
            {filteredTools.length > 0 ? (
              <div className={viewMode === 'grid' 
                ? 'grid md:grid-cols-2 xl:grid-cols-3 gap-6'
                : 'space-y-4'
              }>
                {filteredTools.map((tool) => {
                  const pricing = getPricingLabel(tool.pricing_model, tool.monthly_price);
                  const toolColor = tool.category?.color || '#6366f1';
                  
                  if (viewMode === 'list') {
                    return (
                      <Link key={tool.id} href={`/tools/${tool.slug}`}>
                        <Card className="hover:shadow-lg transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-center gap-4">
                              <div 
                                className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-bold shrink-0"
                                style={{ backgroundColor: toolColor + '20', color: toolColor }}
                              >
                                {tool.name.charAt(0)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-semibold hover:text-primary transition-colors truncate">
                                    {tool.name}
                                  </h3>
                                  {tool.is_verified && (
                                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-1">
                                  {tool.description}
                                </p>
                              </div>
                              <div className="flex items-center gap-4 shrink-0">
                                <div className="flex items-center gap-1">
                                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                  <span className="font-medium text-sm">{tool.stats.rating}</span>
                                </div>
                                <Badge variant={pricing.badge}>{pricing.label}</Badge>
                                <ExternalLink className="w-4 h-4 text-muted-foreground" />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    );
                  }

                  return (
                    <Link key={tool.id} href={`/tools/${tool.slug}`}>
                      <Card className="h-full hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4 mb-4">
                            <div 
                              className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-bold"
                              style={{ backgroundColor: toolColor + '20', color: toolColor }}
                            >
                              {tool.name.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold group-hover:text-primary transition-colors truncate">
                                  {tool.name}
                                </h3>
                                {tool.is_verified && (
                                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {tool.description}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between pt-4 border-t border-border">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                              <span className="font-medium text-sm">{tool.stats.rating}</span>
                              <span className="text-xs text-muted-foreground">
                                ({tool.stats.reviews.toLocaleString()})
                              </span>
                            </div>
                            <Badge variant={pricing.badge}>{pricing.label}</Badge>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Search className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">لم يتم العثور على أدوات</h3>
                  <p className="text-muted-foreground mb-4">جرب البحث بكلمات مختلفة أو تغيير الفئة</p>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedSubcategory(null);
                      setPriceFilter(null);
                    }}
                  >
                    مسح البحث
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
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
