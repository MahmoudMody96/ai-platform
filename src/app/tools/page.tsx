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
const pricingOptions = [
  { value: 'all', label: 'كل الأسعار' },
  { value: 'free', label: 'مجاني' },
  { value: 'freemium', label: 'مجاني + مدفوع' },
  { value: 'paid', label: 'مدفوع' },
];

const sortFunctions: Record<SortOption, (a: typeof allTools[0], b: typeof allTools[0]) => number> = {
  popular: (a, b) => b.rating - a.rating,
  newest: () => 0,
  rating: (a, b) => b.rating - a.rating,
  alphabetical: (a, b) => a.name.localeCompare(b.name),
};

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

  const [searchQuery, setSearchQuery] = React.useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = React.useState(initialCategory);
  const [selectedPricing, setSelectedPricing] = React.useState('all');
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');

  const getPricingBadge = (pricing: string) => {
    switch (pricing) {
      case 'free': return <Badge variant="success">مجاني</Badge>;
      case 'freemium': return <Badge variant="info">مجاني + مدفوع</Badge>;
      case 'paid': return <Badge variant="secondary">مدفوع</Badge>;
      default: return null;
    }
  };

  const filteredTools = allTools
    .filter(tool => {
      const matchesSearch = !searchQuery ||
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'الكل' || tool.category === selectedCategory;
      const matchesPricing = selectedPricing === 'all' || tool.pricing === selectedPricing;
      return matchesSearch && matchesCategory && matchesPricing;
    })
    .sort(sortFunctions.popular);

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
              <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">لوحة التحكم</Link>
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
          onSubmit={(q) => setSearchQuery(q)}
          placeholder="ابحث عن أي أداة... مثال: توليد صور، كتابة محتوى"
          className="mb-6"
        />

        {/* Filters */}
        <SearchFilters
          selectedCategory={selectedCategory}
          onCategoryChange={(cat) => {
            setSelectedCategory(cat);
            if (cat !== 'الكل') {
              router.push(`/tools?category=${encodeURIComponent(cat)}`, { scroll: false });
            } else {
              router.push('/tools', { scroll: false });
            }
          }}
          selectedPricing={selectedPricing}
          onPricingChange={setSelectedPricing}
          categories={categories}
          pricingOptions={pricingOptions}
          className="mb-6"
        />

        {/* Results bar */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-muted-foreground">
            تم العثور على <span className="font-semibold text-foreground">{filteredTools.length}</span> أداة
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
        {filteredTools.length > 0 ? (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {filteredTools.map((tool) => (
              <Card key={tool.id} className="group hover:shadow-lg hover:-translate-y-1 transition-all relative">
                <CardContent className={`p-6 ${viewMode === 'list' ? 'flex-row items-center' : ''}`}>
                  {viewMode === 'grid' ? (
                    <>
                      <div className="absolute top-4 left-4">
                        <SaveButton toolId={tool.id} variant="ghost" size="icon" className="w-8 h-8 bg-background/80 backdrop-blur" />
                      </div>
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center text-2xl font-bold text-primary flex-shrink-0">
                          {tool.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <h3 className="font-semibold text-lg group-hover:text-primary">{tool.name}</h3>
                            {tool.featured && <Badge variant="default" className="text-xs">مميز</Badge>}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{tool.description}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mb-4">
                        <Badge variant="outline">{tool.category}</Badge>
                        {getPricingBadge(tool.pricing)}
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <StarRating rating={tool.rating} size="sm" />
                        <a href={tool.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-primary hover:underline">
                          زيارة الموقع <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center text-xl font-bold text-primary flex-shrink-0">
                        {tool.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold group-hover:text-primary">{tool.name}</h3>
                        <p className="text-sm text-muted-foreground">{tool.description}</p>
                      </div>
                      <div className="flex items-center gap-4 flex-shrink-0">
                        <Badge variant="outline">{tool.category}</Badge>
                        {getPricingBadge(tool.pricing)}
                        <StarRating rating={tool.rating} size="sm" />
                        <SaveButton toolId={tool.id} variant="ghost" size="icon" />
                        <a href={tool.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-primary hover:underline">
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
