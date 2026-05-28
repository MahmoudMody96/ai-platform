'use client';

import * as React from 'react';
import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Star, 
  ExternalLink,
  Sparkles,
  Loader2,
  LayoutGrid,
  List
} from 'lucide-react';

// بيانات وهمية - في الإنتاج هتكون من Supabase
const allTools = [
  { id: '1', name: 'ChatGPT', description: 'نموذج لغوي متقدم للكتابة والتحليل', pricing: 'freemium', rating: 4.8, category: 'الكتابة', url: 'https://chat.openai.com', featured: true },
  { id: '2', name: 'Midjourney', description: 'توليد صور فنية مذهلة بالذكاء الاصطناعي', pricing: 'paid', rating: 4.7, category: 'التصميم', url: 'https://midjourney.com', featured: true },
  { id: '3', name: 'Claude', description: 'مساعد ذكي للتحليل والكتابة والإبداع', pricing: 'freemium', rating: 4.9, category: 'الكتابة', url: 'https://claude.ai', featured: true },
  { id: '4', name: 'GitHub Copilot', description: 'مساعد برمجة بالذكاء الاصطناعي', pricing: 'paid', rating: 4.6, category: 'التطوير', url: 'https://github.com/features/copilot', featured: false },
  { id: '5', name: 'DALL-E 3', description: 'توليد صور واقعية من النصوص', pricing: 'paid', rating: 4.7, category: 'التصميم', url: 'https://openai.com/dall-e-3', featured: true },
  { id: '6', name: 'ElevenLabs', description: 'أصوات AI واقعية للنصوص والكلام', pricing: 'freemium', rating: 4.8, category: 'الصوت', url: 'https://elevenlabs.io', featured: false },
  { id: '7', name: 'Notion AI', description: 'مساعد ذكي للعملاء وكتابة النصوص', pricing: 'paid', rating: 4.5, category: 'الكتابة', url: 'https://notion.so', featured: false },
  { id: '8', name: 'Canva AI', description: 'تصميم جرافيك بالذكاء الاصطناعي', pricing: 'freemium', rating: 4.4, category: 'التصميم', url: 'https://canva.com', featured: false },
  { id: '9', name: 'Jasper', description: 'كتابة محتوى تسويقي بالذكاء الاصطناعي', pricing: 'paid', rating: 4.3, category: 'التسويق', url: 'https://jasper.ai', featured: false },
  { id: '10', name: 'Runway', description: 'توليد وتحرير فيديوهات بالذكاء الاصطناعي', pricing: 'paid', rating: 4.6, category: 'الفيديو', url: 'https://runwayml.com', featured: false },
  { id: '11', name: 'Perplexity', description: 'محرك بحث ذكي بالإجابات المباشرة', pricing: 'freemium', rating: 4.7, category: 'البحث', url: 'https://perplexity.ai', featured: false },
  { id: '12', name: 'Gamma', description: 'عروض تقديمية احترافية بالذكاء الاصطناعي', pricing: 'freemium', rating: 4.5, category: 'العروض', url: 'https://gamma.app', featured: false },
];

const categories = ['الكل', 'الكتابة', 'التصميم', 'التطوير', 'التسويق', 'الفيديو', 'الصوت', 'البحث', 'العروض'];
const pricingOptions = ['الكل', 'مجاني', 'مجاني + مدفوع', 'مدفوع'];

// Loading component
function ToolsLoading() {
  return (
    <div className="flex items-center justify-center py-16">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
      <span className="ms-3 text-muted-foreground">جاري تحميل الأدوات...</span>
    </div>
  );
}

// Main tools content with search params
function ToolsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'الكل';
  const initialSearch = searchParams.get('search') || '';
  
  const [searchQuery, setSearchQuery] = React.useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = React.useState(initialCategory);
  const [selectedPricing, setSelectedPricing] = React.useState('الكل');
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = React.useState(false);

  // Filter tools based on search and filters
  const filteredTools = allTools.filter((tool) => {
    // Search filter
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Category filter
    const matchesCategory = selectedCategory === 'الكل' || tool.category === selectedCategory;
    
    // Pricing filter
    let matchesPricing = true;
    if (selectedPricing === 'مجاني') matchesPricing = tool.pricing === 'free';
    if (selectedPricing === 'مجاني + مدفوع') matchesPricing = tool.pricing === 'freemium';
    if (selectedPricing === 'مدفوع') matchesPricing = tool.pricing === 'paid';
    
    return matchesSearch && matchesCategory && matchesPricing;
  });

  const getPricingBadge = (pricing: string) => {
    switch (pricing) {
      case 'free': return <Badge variant="success">مجاني</Badge>;
      case 'freemium': return <Badge variant="info">مجاني + مدفوع</Badge>;
      case 'paid': return <Badge variant="secondary">مدفوع</Badge>;
      default: return null;
    }
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
              <Link href="/admin" className="text-sm text-muted-foreground hover:text-foreground">لوحة التحكم</Link>
            </nav>
            <div className="flex items-center gap-2">
              <Link href="/admin"><Button size="sm">الدخول للأدمن</Button></Link>
            </div>
          </div>
        </div>
      </header>

      {/* Page Content */}
      <main className="container-custom py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">أدوات الذكاء الاصطناعي</h1>
          <p className="text-muted-foreground">استكشف أكثر من 500 أداة AI مصنفة ومراجعة</p>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4 mb-8">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground rtl:right-auto rtl:left-3" />
            <Input 
              placeholder="ابحث عن أي أداة... مثال: توليد صور، كتابة محتوى" 
              className="h-12 ps-12 pe-4 text-lg rtl:ps-4 rtl:pe-12"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">الفئة:</span>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <Button
                    key={cat}
                    variant={selectedCategory === cat ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            </div>

            {/* Pricing Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">السعر:</span>
              <select 
                className="h-9 px-3 rounded-lg border border-border bg-background text-sm"
                value={selectedPricing}
                onChange={(e) => setSelectedPricing(e.target.value)}
              >
                {pricingOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            {/* View Mode */}
            <div className="flex items-center gap-1 me-auto">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('grid')}
                aria-label="عرض شبكي"
              >
                <LayoutGrid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('list')}
                aria-label="عرض قائمة"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Results Count */}
          <div className="text-sm text-muted-foreground">
            تم العثور على {filteredTools.length} أداة
          </div>
        </div>

        {/* Tools Grid/List */}
        {filteredTools.length > 0 ? (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4'
          }>
            {filteredTools.map((tool) => (
              <Card 
                key={tool.id} 
                className={`group hover:shadow-lg hover:-translate-y-1 transition-all ${viewMode === 'list' ? 'flex-row' : ''}`}
              >
                <CardContent className={`p-6 ${viewMode === 'list' ? 'flex-1 flex items-center gap-4' : ''}`}>
                  {viewMode === 'grid' ? (
                    // Grid View
                    <>
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center text-2xl font-bold text-primary">
                          {tool.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <h3 className="font-semibold text-lg group-hover:text-primary">{tool.name}</h3>
                            {tool.featured && (
                              <Badge variant="default" className="text-xs">مميز</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{tool.description}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-4">
                        <Badge variant="outline">{tool.category}</Badge>
                        {getPricingBadge(tool.pricing)}
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-accent fill-accent" />
                          <span className="text-sm font-medium">{tool.rating}</span>
                        </div>
                        <a 
                          href={tool.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-sm text-primary hover:underline"
                        >
                          زيارة الموقع
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </>
                  ) : (
                    // List View
                    <>
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center text-xl font-bold text-primary">
                        {tool.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold group-hover:text-primary">{tool.name}</h3>
                          {tool.featured && (
                            <Badge variant="default" className="text-xs">مميز</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{tool.description}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant="outline">{tool.category}</Badge>
                        {getPricingBadge(tool.pricing)}
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-accent fill-accent" />
                          <span className="text-sm font-medium">{tool.rating}</span>
                        </div>
                        <a 
                          href={tool.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-sm text-primary hover:underline"
                        >
                          زيارة
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          // Empty State
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">لم يتم العثور على أدوات</h3>
            <p className="text-muted-foreground mb-4">جرب البحث بكلمات مختلفة أو غير الفلاتر</p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('الكل');
                setSelectedPricing('الكل');
              }}
            >
              إعادة تعيين الفلاتر
            </Button>
          </div>
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

// Main page component with Suspense
export default function ToolsPage() {
  return (
    <Suspense fallback={<ToolsLoading />}>
      <ToolsContent />
    </Suspense>
  );
}
