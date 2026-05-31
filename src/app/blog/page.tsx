'use client';

import * as React from 'react';
import Link from 'next/link';
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
  TrendingUp,
  PenLine,
  FileText,
} from 'lucide-react';
import { ThemeToggle } from '@/contexts/ThemeContext';

// AL.AI.DY Colors
const colors = {
  violet: { primary: '#8B5CF6', light: '#A78BFA', dark: '#7C3AED' },
  cyan: { primary: '#06B6D4', light: '#22D3EE', dark: '#0891B2' },
  amber: { primary: '#F59E0B', light: '#FBBF24', dark: '#D97706' },
  emerald: { primary: '#10B981', light: '#34D399', dark: '#059669' },
  rose: { primary: '#EC4899', light: '#F472B6', dark: '#DB2777' },
};

const featuredArticles = [
  {
    id: '1',
    slug: 'ai-revolution-2026',
    title: 'ثورة الذكاء الاصطناعي في 2026: نظرة شاملة على أبرز التطورات',
    excerpt: 'استكشفنا في هذا المقال أبرز التطورات في مجال الذكاء الاصطناعي وتأثيرها على حياتنا اليومية، من النماذج اللغوية الكبيرة إلى أدوات الإنتاجية الذكية.',
    cover_image_url: null,
    category: { name: 'أخبار AI', color: colors.violet.primary },
    author: { display_name: 'فريق AL.AI.DY', avatar_url: null },
    published_at: '2026-05-28',
    read_time: 5,
    views: 2450,
    featured: true,
  },
  {
    id: '2',
    slug: 'chatgpt-vs-claude',
    title: 'مقارنة شاملة: ChatGPT vs Claude أيهما أفضل لمشروعك؟',
    excerpt: 'نقدم لك مقارنة تفصيلية بين أقوى نموذجين لغويين من OpenAI و Anthropic من حيث القدرات والتكلفة وسهولة الاستخدام.',
    cover_image_url: null,
    category: { name: 'مقارنات', color: colors.emerald.primary },
    author: { display_name: 'فريق AL.AI.DY', avatar_url: null },
    published_at: '2026-05-27',
    read_time: 8,
    views: 3890,
    featured: true,
  },
  {
    id: '3',
    slug: 'future-of-coding',
    title: 'مستقبل البرمجة مع AI: هل سيحل الذكاء الاصطناعي محل المبرمجين؟',
    excerpt: 'ناقشنا مع خبراء التكنولوجيا حول مستقبل البرمجة في عصر الذكاء الاصطناعي، وماذا يعني ذلك للمطورين العرب.',
    cover_image_url: null,
    category: { name: 'آراء', color: colors.rose.primary },
    author: { display_name: 'فريق AL.AI.DY', avatar_url: null },
    published_at: '2026-05-25',
    read_time: 7,
    views: 3102,
    featured: true,
  },
  {
    id: '4',
    slug: 'ai-tools-guide-2026',
    title: 'دليلك الشامل لأدوات الذكاء الاصطناعي في 2026',
    excerpt: 'اكتشف أحدث أدوات الذكاء الاصطناعي وأكثرها قوة في هذا الدليل الشامل.',
    cover_image_url: null,
    category: { name: 'شروحات', color: colors.amber.primary },
    author: { display_name: 'فريق AL.AI.DY', avatar_url: null },
    published_at: '2026-05-26',
    read_time: 10,
    views: 4560,
    featured: true,
  },
];

const allArticles = [
  {
    id: '5',
    slug: 'midjourney-tutorial',
    title: 'كيف تستخدم Midjourney لإنشاء صور مذهلة',
    excerpt: 'دليل خطوة بخطوة لاستخدام Midjourney لإنشاء صور فنية بالذكاء الاصطناعي.',
    cover_image_url: null,
    category: { name: 'شروحات', color: colors.amber.primary },
    author: { display_name: 'فريق AL.AI.DY', avatar_url: null },
    published_at: '2026-05-24',
    read_time: 7,
    views: 2450,
    featured: false,
  },
  {
    id: '6',
    slug: 'ai-writing-tools',
    title: 'أدوات الكتابة بالذكاء الاصطناعي: أيها يناسبك؟',
    excerpt: 'مراجعة مقارنة لأفضل أدوات الكتابة AI المتاحة حالياً، بما في ذلك ChatGPT و Jasper و Writesonic.',
    cover_image_url: null,
    category: { name: 'مقارنات', color: colors.emerald.primary },
    author: { display_name: 'فريق AL.AI.DY', avatar_url: null },
    published_at: '2026-05-23',
    read_time: 6,
    views: 1890,
    featured: false,
  },
  {
    id: '7',
    slug: 'localize-ai-arabic',
    title: 'كيف تستخدم الذكاء الاصطناعي في تعريب المحتوى العربي؟',
    excerpt: 'استراتيجيات وأدوات متقدمة لتوطين المحتوى العربي باستخدام تقنيات الذكاء الاصطناعي.',
    cover_image_url: null,
    category: { name: 'شروحات', color: colors.amber.primary },
    author: { display_name: 'فريق AL.AI.DY', avatar_url: null },
    published_at: '2026-05-22',
    read_time: 5,
    views: 1230,
    featured: false,
  },
  {
    id: '8',
    slug: 'claude-api-guide',
    title: 'دليل شامل لواجهة برمجة Claude API للمطورين',
    excerpt: 'كل ما تحتاج معرفته للبدء مع Claude API: التسجيل، المصادقة، الأمثلة العملية، وأفضل الممارسات.',
    cover_image_url: null,
    category: { name: 'شروحات', color: colors.violet.primary },
    author: { display_name: 'فريق AL.AI.DY', avatar_url: null },
    published_at: '2026-05-21',
    read_time: 12,
    views: 3450,
    featured: false,
  },
  {
    id: '9',
    slug: 'ai-ethics-debate',
    title: 'أخلاقيات الذكاء الاصطناعي: التحديات والجدل المستمر',
    excerpt: 'نظرة معمقة على التحديات الأخلاقية المرتبطة بالذكاء الاصطناعي، من التحيز إلى الخصوصية.',
    cover_image_url: null,
    category: { name: 'آراء', color: colors.rose.primary },
    author: { display_name: 'فريق AL.AI.DY', avatar_url: null },
    published_at: '2026-05-20',
    read_time: 8,
    views: 1650,
    featured: false,
  },
  {
    id: '10',
    slug: 'stable-diffusion-vs-dalle',
    title: 'Stable Diffusion vs DALL-E 3: أيهما أفضل لتوليد الصور؟',
    excerpt: 'مقارنة تفصيلية بين أقوى أداتي توليد الصور بالذكاء الاصطناعي من حيث الجودة والسهولة والتكلفة.',
    cover_image_url: null,
    category: { name: 'مقارنات', color: colors.emerald.primary },
    author: { display_name: 'فريق AL.AI.DY', avatar_url: null },
    published_at: '2026-05-19',
    read_time: 7,
    views: 2890,
    featured: false,
  },
];

const categories = [
  { name: 'الكل', count: 10 },
  { name: 'أخبار AI', count: 1, color: colors.violet.primary },
  { name: 'مقارنات', count: 3, color: colors.emerald.primary },
  { name: 'شروحات', count: 4, color: colors.amber.primary },
  { name: 'آراء', count: 2, color: colors.rose.primary },
];

const popularTags = ['ChatGPT', 'Midjourney', 'Claude', 'Stable Diffusion', 'أتمتة', 'برمجة', 'كتابة'];

const ARTICLES_PER_PAGE = 6;

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('الكل');
  const [currentPage, setCurrentPage] = React.useState(1);

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
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
              <Link href="/tools" className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">الأدوات</Link>
              <Link href="/blog" className="px-4 py-2 text-sm font-medium text-white" style={{ backgroundColor: colors.violet.primary }}>المدونة</Link>
            </nav>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 md:py-20" style={{ background: `linear-gradient(180deg, ${colors.violet.primary}08, transparent)` }}>
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-72 h-72 rounded-full blur-3xl" style={{ background: `${colors.violet.primary}20` }} />
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full blur-3xl" style={{ background: `${colors.cyan.primary}20` }} />
        </div>
        <div className="container-custom relative">
          <div className="max-w-2xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ backgroundColor: colors.violet.primary + '15' }}>
              <BookOpen className="w-4 h-4" style={{ color: colors.violet.primary }} />
              <span className="text-sm font-medium" style={{ color: colors.violet.primary }}>المدونة</span>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
              اكتشف عالم{' '}
              <span 
                className="font-bold"
                style={{ background: `linear-gradient(135deg, ${colors.violet.primary}, ${colors.cyan.primary})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
              >
                الذكاء الاصطناعي
              </span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              مقالات يومية، شروحات تفصيلية، ومراجعات صادقة لأفضل أدوات AI بالعربية
            </p>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-xl mx-auto">
              <div className="relative">
                <div className="absolute inset-0 rounded-xl blur-xl opacity-20" style={{ background: `linear-gradient(135deg, ${colors.violet.primary}, ${colors.cyan.primary})` }} />
                <div className="relative flex items-center bg-card rounded-xl border border-border/50 shadow-sm overflow-hidden">
                  <Search className="w-5 h-5 text-muted-foreground mr-4" />
                  <input
                    type="text"
                    placeholder="ابحث عن مقالات... مثال: ChatGPT، أدوات الكتابة"
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
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container-custom py-12">
        {/* Featured Articles */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: colors.violet.primary + '20' }}>
              <TrendingUp className="w-5 h-5" style={{ color: colors.violet.primary }} />
            </div>
            <h2 className="text-2xl font-bold text-foreground">المقالات المميزة</h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredArticles.map((article) => (
              <Link key={article.id} href={`/blog/${article.slug}`}>
                <article className="group h-full rounded-2xl bg-card border border-border/50 overflow-hidden hover:shadow-xl hover:border-violet-500/30 transition-all duration-300">
                  {/* Cover Image Placeholder */}
                  <div 
                    className="aspect-video flex items-center justify-center relative"
                    style={{ backgroundColor: article.category.color + '15' }}
                  >
                    <BookOpen className="w-12 h-12" style={{ color: article.category.color, opacity: 0.3 }} />
                    <span 
                      className="absolute top-3 right-3 text-xs font-medium px-3 py-1 rounded-full"
                      style={{ backgroundColor: article.category.color + '20', color: article.category.color }}
                    >
                      {article.category.name}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-violet-500 transition-colors">
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
                  </div>
                  {/* Hover Effect */}
                  <div className="h-1 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: `linear-gradient(90deg, ${colors.violet.primary}, ${colors.cyan.primary})` }} />
                </article>
              </Link>
            ))}
          </div>
        </section>

        {/* Categories Filter */}
        <section className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: colors.cyan.primary + '20' }}>
              <Tag className="w-5 h-5" style={{ color: colors.cyan.primary }} />
            </div>
            <h3 className="text-lg font-semibold text-foreground">التصنيفات</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => handleCategoryChange(cat.name)}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${
                  selectedCategory === cat.name 
                    ? 'text-white shadow-lg' 
                    : 'bg-card text-muted-foreground hover:text-foreground border border-border/50'
                }`}
                style={selectedCategory === cat.name ? { background: `linear-gradient(135deg, ${colors.violet.primary}, ${colors.cyan.primary})` } : {}}
              >
                {cat.name}
                <span className="text-xs opacity-70 mr-1">({cat.count})</span>
              </button>
            ))}
          </div>
        </section>

        {/* Articles Grid */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground">
              {selectedCategory === 'الكل' ? 'جميع المقالات' : `مقالات ${selectedCategory}`}
              <span className="text-muted-foreground text-base font-normal mr-2">
                ({filteredArticles.length} مقال)
              </span>
            </h2>
          </div>

          {paginatedArticles.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedArticles.map((article) => (
                <Link key={article.id} href={`/blog/${article.slug}`}>
                  <article className="group h-full rounded-2xl bg-card border border-border/50 overflow-hidden hover:shadow-xl hover:border-violet-500/30 transition-all duration-300">
                    {/* Cover Image Placeholder */}
                    <div 
                      className="aspect-video flex items-center justify-center relative"
                      style={{ backgroundColor: article.category.color + '15' }}
                    >
                      <FileText className="w-10 h-10" style={{ color: article.category.color, opacity: 0.3 }} />
                      <span 
                        className="absolute top-3 right-3 text-xs font-medium px-3 py-1 rounded-full"
                        style={{ backgroundColor: article.category.color + '20', color: article.category.color }}
                      >
                        {article.category.name}
                      </span>
                    </div>
                    <div className="p-5">
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-violet-500 transition-colors">
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
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{article.read_time} د</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            <span>{article.views}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Hover Effect */}
                    <div className="h-1 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: `linear-gradient(90deg, ${colors.violet.primary}, ${colors.cyan.primary})` }} />
                  </article>
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
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('الكل');
                }}
                className="px-6 py-2 rounded-xl font-medium border border-border/50 hover:border-violet-500 transition-colors"
              >
                إعادة تعيين البحث
              </button>
            </div>
          )}
        </section>

        {/* Pagination */}
        {totalPages > 1 && (
          <section className="flex items-center justify-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-2 px-4 py-2 text-sm border border-border/50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:border-violet-500 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              السابق
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 text-sm rounded-lg transition-all ${
                  currentPage === page 
                    ? 'text-white' 
                    : 'border border-border/50 hover:border-violet-500'
                }`}
                style={currentPage === page ? { background: `linear-gradient(135deg, ${colors.violet.primary}, ${colors.cyan.primary})` } : {}}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-2 px-4 py-2 text-sm border border-border/50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:border-violet-500 transition-colors"
            >
              التالي
              <ChevronLeft className="w-4 h-4 rotate-180" />
            </button>
          </section>
        )}

        {/* Popular Tags */}
        <section className="mt-16 pt-12 border-t border-border">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: colors.amber.primary + '20' }}>
              <Tag className="w-5 h-5" style={{ color: colors.amber.primary }} />
            </div>
            <h3 className="text-lg font-semibold text-foreground">الوسوم الشائعة</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {popularTags.map((tag) => (
              <span 
                key={tag} 
                className="px-4 py-2 text-sm rounded-full bg-card border border-border/50 hover:border-violet-500 hover:text-violet-500 transition-colors cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-border bg-card/50 mt-16">
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
