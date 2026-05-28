'use client';

import * as React from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Sparkles, 
  BookOpen, 
  Clock, 
  Calendar, 
  Eye, 
  ChevronLeft,
  ArrowRight,
  Loader2,
  Tag,
  TrendingUp
} from 'lucide-react';

// Mock data for development
const featuredArticles = [
  {
    id: '1',
    slug: 'ai-revolution-2025',
    title: 'ثورة الذكاء الاصطناعي في 2025: نظرة شاملة على أبرز التطورات',
    excerpt: 'استكشفنا في هذا المقال أبرز التطورات في مجال الذكاء الاصطناعي وتأثيرها على حياتنا اليومية، من النماذج اللغوية الكبيرة إلى أدوات الإنتاجية الذكية.',
    cover_image_url: null,
    category: { name: 'أخبار AI', color: '#6366f1' },
    author: { display_name: 'فريق المنصة', avatar_url: null },
    published_at: '2025-05-28',
    read_time: 5,
    views: 1234,
    featured: true,
  },
  {
    id: '2',
    slug: 'chatgpt-vs-claude',
    title: 'مقارنة شاملة: ChatGPT vs Claude أيهما أفضل لمشروعك؟',
    excerpt: 'نقدم لك مقارنة تفصيلية بين أقوى نموذجين لغويين من OpenAI و Anthropic من حيث القدرات والتكلفة وسهولة الاستخدام.',
    cover_image_url: null,
    category: { name: 'مراجعات', color: '#10b981' },
    author: { display_name: 'فريق المنصة', avatar_url: null },
    published_at: '2025-05-27',
    read_time: 8,
    views: 2341,
    featured: true,
  },
  {
    id: '3',
    slug: 'future-of-coding',
    title: 'مستقبل البرمجة مع AI: هل سيحل الذكاء الاصطناعي محل المبرمجين؟',
    excerpt: 'ناقشنا مع خبراء التكنولوجيا حول مستقبل البرمجة في عصر الذكاء الاصطناعي، وماذا يعني ذلك للمطورين العرب.',
    cover_image_url: null,
    category: { name: 'آراء', color: '#ec4899' },
    author: { display_name: 'فريق المنصة', avatar_url: null },
    published_at: '2025-05-25',
    read_time: 7,
    views: 3102,
    featured: true,
  },
  {
    id: '4',
    slug: 'ai-tools-for-business',
    title: 'أفضل 10 أدوات ذكاء اصطناعي لأعمالك في 2025',
    excerpt: 'اكتشف أقوى أدوات AI التي تساعدك على إنجاز مهامك بشكل أسرع وأكثر كفاءة، من كتابة المحتوى إلى تحليل البيانات.',
    cover_image_url: null,
    category: { name: 'شروحات', color: '#f59e0b' },
    author: { display_name: 'فريق المنصة', avatar_url: null },
    published_at: '2025-05-26',
    read_time: 6,
    views: 1876,
    featured: true,
  },
];

const allArticles = [
  {
    id: '5',
    slug: 'midjourney-tutorial',
    title: 'دليل شامل لاستخدام Midjourney: من المبتدئ إلى المحترف',
    excerpt: 'تعلم كيفية إنشاء صور مذهلة باستخدام Midjourney مع نصائح وحيل متقدمة للحصول على أفضل النتائج.',
    cover_image_url: null,
    category: { name: 'شروحات', color: '#f59e0b' },
    author: { display_name: 'فريق المنصة', avatar_url: null },
    published_at: '2025-05-24',
    read_time: 10,
    views: 1456,
    featured: false,
  },
  {
    id: '6',
    slug: 'ai-writing-tools',
    title: 'أدوات الكتابة بالذكاء الاصطناعي: أيها يناسبك؟',
    excerpt: 'مراجعة مقارنة لأفضل أدوات الكتابة AI المتاحة حالياً، بما في ذلك ChatGPT و Jasper و Writesonic.',
    cover_image_url: null,
    category: { name: 'مراجعات', color: '#10b981' },
    author: { display_name: 'فريق المنصة', avatar_url: null },
    published_at: '2025-05-23',
    read_time: 6,
    views: 987,
    featured: false,
  },
  {
    id: '7',
    slug: 'localize-ai-arabic',
    title: 'كيف تستخدم الذكاء الاصطناعي في تعريب المحتوى العربي؟',
    excerpt: 'استراتيجيات وأدوات متقدمة لتوطين المحتوى العربي باستخدام تقنيات الذكاء الاصطناعي.',
    cover_image_url: null,
    category: { name: 'شروحات', color: '#f59e0b' },
    author: { display_name: 'فريق المنصة', avatar_url: null },
    published_at: '2025-05-22',
    read_time: 5,
    views: 723,
    featured: false,
  },
  {
    id: '8',
    slug: 'claude-api-guide',
    title: 'دليل شامل لواجهة برمجة Claude API للمطورين',
    excerpt: 'كل ما تحتاج معرفته للبدء مع Claude API: التسجيل، المصادقة، الأمثلة العملية، وأفضل الممارسات.',
    cover_image_url: null,
    category: { name: 'برمجة', color: '#8b5cf6' },
    author: { display_name: 'فريق المنصة', avatar_url: null },
    published_at: '2025-05-21',
    read_time: 12,
    views: 2156,
    featured: false,
  },
  {
    id: '9',
    slug: 'ai-ethics-debate',
    title: 'أخلاقيات الذكاء الاصطناعي: التحديات والجدل المستمر',
    excerpt: 'نظرة معمقة على التحديات الأخلاقية المرتبطة بالذكاء الاصطناعي، من التحيز إلى الخصوصية.',
    cover_image_url: null,
    category: { name: 'آراء', color: '#ec4899' },
    author: { display_name: 'فريق المنصة', avatar_url: null },
    published_at: '2025-05-20',
    read_time: 8,
    views: 654,
    featured: false,
  },
  {
    id: '10',
    slug: 'stable-diffusion-vs-dalle',
    title: 'Stable Diffusion vs DALL-E 3: أيهما أفضل لتوليد الصور؟',
    excerpt: 'مقارنة تفصيلية بين أقوى أداتي توليد الصور بالذكاء الاصطناعي من حيث الجودة والسهولة والتكلفة.',
    cover_image_url: null,
    category: { name: 'مراجعات', color: '#10b981' },
    author: { display_name: 'فريق المنصة', avatar_url: null },
    published_at: '2025-05-19',
    read_time: 7,
    views: 1823,
    featured: false,
  },
  {
    id: '11',
    slug: 'ai-automation-business',
    title: 'أتمتة عملك باستخدام الذكاء الاصطناعي: دليل عملي',
    excerpt: 'خطوات عملية لتطبيق الأتمتة في مشروعك الصغير أو المتوسط باستخدام أدوات AI المتاحة.',
    cover_image_url: null,
    category: { name: 'شروحات', color: '#f59e0b' },
    author: { display_name: 'فريق المنصة', avatar_url: null },
    published_at: '2025-05-18',
    read_time: 9,
    views: 1123,
    featured: false,
  },
  {
    id: '12',
    slug: 'ai-startup-egypt',
    title: 'مشاريع الذكاء الاصطناعي في مصر: فرص وتحديات',
    excerpt: 'استعراض للوضع الحالي لقطاع AI في السوق المصري، مع فرص الاستثمار والمشاريع الواعدة.',
    cover_image_url: null,
    category: { name: 'أخبار AI', color: '#6366f1' },
    author: { display_name: 'فريق المنصة', avatar_url: null },
    published_at: '2025-05-17',
    read_time: 6,
    views: 892,
    featured: false,
  },
];

const categories = [
  { name: 'الكل', count: 12 },
  { name: 'أخبار AI', count: 2, color: '#6366f1' },
  { name: 'مراجعات', count: 3, color: '#10b981' },
  { name: 'شروحات', count: 4, color: '#f59e0b' },
  { name: 'آراء', count: 2, color: '#ec4899' },
  { name: 'برمجة', count: 1, color: '#8b5cf6' },
];

const popularTags = ['ChatGPT', 'Midjourney', 'Claude', 'Stable Diffusion', 'أتمتة', 'برمجة', 'كتابة'];

const ARTICLES_PER_PAGE = 6;

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('الكل');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(false);

  // Filter articles based on search and category
  const filteredArticles = allArticles.filter((article) => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'الكل' || 
                          article.category.name === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Pagination
  const totalPages = Math.ceil(filteredArticles.length / ARTICLES_PER_PAGE);
  const paginatedArticles = filteredArticles.slice(
    (currentPage - 1) * ARTICLES_PER_PAGE,
    currentPage * ARTICLES_PER_PAGE
  );

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
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
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">الرئيسية</Link>
              <Link href="/blog" className="text-sm font-medium text-primary">المدونة</Link>
              <Link href="/tools" className="text-sm text-muted-foreground hover:text-foreground">الأدوات</Link>
              <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground">عن المنصة</Link>
            </nav>
            <div className="flex items-center gap-2">
              <Link href="/admin">
                <Button size="sm">الدخول للأدمن</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary-50 via-background to-background py-16 md:py-20">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 left-10 w-72 h-72 bg-primary-200 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary-200 rounded-full blur-3xl" />
        </div>
        <div className="container-custom relative text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <BookOpen className="w-6 h-6 text-primary" />
            <span className="text-primary font-medium">المدونة</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
            اكتشف عالم <span className="text-gradient">الذكاء الاصطناعي</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            مقالات يومية، شروحات تفصيلية، ومراجعات صادقة لأفضل أدوات AI بالعربية
          </p>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-xl mx-auto relative">
            <Search className="absolute end-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input 
              placeholder="ابحث عن مقالات... مثال: ChatGPT، أدوات الكتابة" 
              className="h-12 pe-12 text-lg" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button type="submit" className="absolute end-2 top-1/2 -translate-y-1/2 h-9">
              بحث
            </Button>
          </form>
        </div>
      </section>

      {/* Main Content */}
      <main className="container-custom py-12">
        {/* Featured Articles */}
        <section className="mb-16">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h2 className="text-2xl font-bold">المقالات المميزة</h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredArticles.map((article) => (
              <Link key={article.id} href={`/blog/${article.slug}`}>
                <Card className="h-full hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group cursor-pointer overflow-hidden">
                  {/* Cover Image Placeholder */}
                  <div 
                    className="aspect-video flex items-center justify-center relative"
                    style={{ backgroundColor: article.category.color + '15' }}
                  >
                    <BookOpen className="w-12 h-12 text-primary/30 group-hover:text-primary/50 transition-colors" />
                    <Badge 
                      className="absolute top-3 start-3"
                      style={{ backgroundColor: article.category.color + '20', color: article.category.color }}
                    >
                      {article.category.name}
                    </Badge>
                  </div>
                  <CardContent className="p-5">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(article.published_at)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{article.read_time} دقيقة</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Categories Filter */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Tag className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">التصنيفات</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Button
                key={cat.name}
                variant={selectedCategory === cat.name ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleCategoryChange(cat.name)}
                className="gap-1"
              >
                {cat.name}
                <span className="text-xs opacity-70">({cat.count})</span>
              </Button>
            ))}
          </div>
        </section>

        {/* Articles Grid */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">
              {selectedCategory === 'الكل' ? 'جميع المقالات' : `مقالات ${selectedCategory}`}
              <span className="text-muted-foreground text-base font-normal ms-2">
                ({filteredArticles.length} مقال)
              </span>
            </h2>
          </div>

          {paginatedArticles.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedArticles.map((article) => (
                <Link key={article.id} href={`/blog/${article.slug}`}>
                  <Card className="h-full hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group cursor-pointer overflow-hidden">
                    {/* Cover Image Placeholder */}
                    <div 
                      className="aspect-video flex items-center justify-center relative"
                      style={{ backgroundColor: article.category.color + '15' }}
                    >
                      <BookOpen className="w-10 h-10 text-primary/30 group-hover:text-primary/50 transition-colors" />
                      <Badge 
                        className="absolute top-3 start-3"
                        style={{ backgroundColor: article.category.color + '20', color: article.category.color }}
                      >
                        {article.category.name}
                      </Badge>
                    </div>
                    <CardContent className="p-5">
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(article.published_at)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{article.read_time} دقيقة</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            // Empty State
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">لم يتم العثور على مقالات</h3>
              <p className="text-muted-foreground mb-4">جرب البحث بكلمات مختلفة أو تغيير التصنيف</p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('الكل');
                }}
              >
                إعادة تعيين البحث
              </Button>
            </div>
          )}
        </section>

        {/* Pagination */}
        {totalPages > 1 && (
          <section className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1 || isLoading}
            >
              <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
              السابق
            </Button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCurrentPage(page)}
                disabled={isLoading}
              >
                {page}
              </Button>
            ))}
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || isLoading}
            >
              التالي
              <ChevronLeft className="w-4 h-4 rtl:rotate-0" />
            </Button>
          </section>
        )}

        {/* Popular Tags */}
        <section className="mt-16 pt-12 border-t border-border">
          <div className="flex items-center gap-2 mb-4">
            <Tag className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">الوسوم الشائعة</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {popularTags.map((tag) => (
              <Badge key={tag} variant="outline" className="cursor-pointer hover:bg-muted transition-colors">
                #{tag}
              </Badge>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-border bg-muted/20 mt-16">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold">AI Platform</span>
            </div>
            <nav className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-foreground">الرئيسية</Link>
              <Link href="/blog" className="hover:text-foreground">المدونة</Link>
              <Link href="/tools" className="hover:text-foreground">الأدوات</Link>
              <Link href="/about" className="hover:text-foreground">عن المنصة</Link>
            </nav>
            <p className="text-sm text-muted-foreground">© 2025 AI Platform. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
