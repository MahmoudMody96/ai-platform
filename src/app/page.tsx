// =============================================
// Home Page - Modern Landing Page Redesign
// =============================================

'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge, PricingBadge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  ArrowRight,
  Sparkles,
  Search,
  Clock,
  Calendar,
  Eye,
  ChevronLeft,
  Layers,
  BookOpen,
  Wrench,
  Users,
  Zap,
  Shield,
  Star,
  Send,
  Mail,
  MapPin,
  Menu,
  X,
  Heart,
  MessageCircle,
  Code2,
  ImageIcon,
  Bot,
  FileText,
  Mic,
  Video,
  Globe,
} from 'lucide-react';
import { ThemeToggle } from '@/contexts/ThemeContext';
import { NewsletterForm } from '@/components/newsletter/NewsletterForm';
import { useAuth } from '@/contexts/AuthContext';

// Mock data - Replace with API calls
const latestArticles = [
  {
    id: '1',
    slug: 'ai-revolution-2025',
    title: 'ثورة الذكاء الاصطناعي في 2025: نظرة شاملة',
    excerpt: 'استكشفنا في هذا المقال أبرز التطورات في مجال الذكاء الاصطناعي وتأثيرها على حياتنا اليومية...',
    cover_image_url: null,
    category: { name: 'أخبار AI', color: '#6366f1' },
    author: { display_name: 'فريق المنصة' },
    published_at: '2025-05-28',
    read_time: 5,
    views: 1234,
  },
  {
    id: '2',
    slug: 'chatgpt-vs-claude',
    title: 'مقارنة شاملة: ChatGPT vs Claude أيهما أفضل؟',
    excerpt: 'نقدم لك مقارنة تفصيلية بين أقوى نموذجين لغويين من OpenAI و Anthropic...',
    cover_image_url: null,
    category: { name: 'مراجعات', color: '#10b981' },
    author: { display_name: 'فريق المنصة' },
    published_at: '2025-05-27',
    read_time: 8,
    views: 2341,
  },
  {
    id: '3',
    slug: 'ai-tools-for-business',
    title: 'أفضل 10 أدوات ذكاء اصطناعي لأعمالك',
    excerpt: 'اكتشف أقوى أدوات AI التي تساعدك على إنجاز مهامك بشكل أسرع وأكثر كفاءة...',
    cover_image_url: null,
    category: { name: 'شروحات', color: '#f59e0b' },
    author: { display_name: 'فريق المنصة' },
    published_at: '2025-05-26',
    read_time: 6,
    views: 1876,
  },
  {
    id: '4',
    slug: 'future-of-coding',
    title: 'مستقبل البرمجة مع AI: هل سيحل الذكاء الاصطناعي محل المبرمجين؟',
    excerpt: 'ناقشنا مع خبراء التكنولوجيا حول مستقبل البرمجة في عصر الذكاء الاصطناعي...',
    cover_image_url: null,
    category: { name: 'آراء', color: '#ec4899' },
    author: { display_name: 'فريق المنصة' },
    published_at: '2025-05-25',
    read_time: 7,
    views: 3102,
  },
];

const featuredTools = [
  {
    id: '1',
    slug: 'chatgpt',
    name: 'ChatGPT',
    description: 'نموذج لغوي متقدم من OpenAI للكتابة والمحادثة',
    logo_url: null,
    pricing_model: 'freemium' as const,
    is_featured: true,
    category: { name: 'كتابة', color: '#10b981' },
    icon: MessageCircle,
  },
  {
    id: '2',
    slug: 'midjourney',
    name: 'Midjourney',
    description: 'أداة توليد صور فنية بالذكاء الاصطناعي',
    logo_url: null,
    pricing_model: 'paid' as const,
    is_featured: true,
    category: { name: 'تصميم', color: '#ec4899' },
    icon: ImageIcon,
  },
  {
    id: '3',
    slug: 'claude',
    name: 'Claude',
    description: 'مساعد ذكي متقدم من Anthropic',
    logo_url: null,
    pricing_model: 'freemium' as const,
    is_featured: true,
    category: { name: 'تحليل', color: '#6366f1' },
    icon: Bot,
  },
  {
    id: '4',
    slug: 'github-copilot',
    name: 'GitHub Copilot',
    description: 'مساعد برمجة من GitHub وOpenAI',
    logo_url: null,
    pricing_model: 'paid' as const,
    is_featured: true,
    category: { name: 'برمجة', color: '#8b5cf6' },
    icon: Code2,
  },
  {
    id: '5',
    slug: 'eleven-labs',
    name: 'ElevenLabs',
    description: 'أداة تحويل النص إلى صوت بأصوات واقعية',
    logo_url: null,
    pricing_model: 'freemium' as const,
    is_featured: true,
    category: { name: 'صوت', color: '#06b6d4' },
    icon: Mic,
  },
  {
    id: '6',
    slug: 'runway',
    name: 'Runway',
    description: 'منصة إنتاج فيديو متقدمة بالذكاء الاصطناعي',
    logo_url: null,
    pricing_model: 'paid' as const,
    is_featured: true,
    category: { name: 'فيديو', color: '#f43f5e' },
    icon: Video,
  },
  {
    id: '7',
    slug: 'perplexity',
    name: 'Perplexity',
    description: 'محرك بحث ذكي يستخدم الذكاء الاصطناعي',
    logo_url: null,
    pricing_model: 'freemium' as const,
    is_featured: true,
    category: { name: 'بحث', color: '#22c55e' },
    icon: Globe,
  },
  {
    id: '8',
    slug: 'notion-ai',
    name: 'Notion AI',
    description: 'مساعد كتابة ذكي داخل Notion',
    logo_url: null,
    pricing_model: 'paid' as const,
    is_featured: true,
    category: { name: 'إنتاجية', color: '#a855f7' },
    icon: FileText,
  },
];

const toolCategories = [
  { name: 'كتابة', icon: FileText, count: 45, color: '#10b981' },
  { name: 'تصميم', icon: ImageIcon, count: 32, color: '#ec4899' },
  { name: 'برمجة', icon: Code2, count: 28, color: '#8b5cf6' },
  { name: 'صوت', icon: Mic, count: 18, color: '#06b6d4' },
  { name: 'فيديو', icon: Video, count: 24, color: '#f43f5e' },
  { name: 'بحث', icon: Globe, count: 15, color: '#22c55e' },
];

const stats = [
  { value: '500+', label: 'أداة AI', icon: Layers },
  { value: '200+', label: 'مقال', icon: BookOpen },
  { value: '50K+', label: 'مستخدم', icon: Users },
  { value: '4.8/5', label: 'تقييم', icon: Star },
];

const features = [
  { icon: Zap, title: 'أدوات محدثة', desc: 'نحدث قائمة الأدوات باستمرار لتناسب أحدث التقنيات' },
  { icon: Shield, title: 'مراجعات صادقة', desc: 'نقدم لك تقييمات نزيهة وموضوعية لكل أداة' },
  { icon: Star, title: 'أفضل الاختيارات', desc: 'نختار لك أفضل الأدوات بناءً على جودة الأداء' },
  { icon: Heart, title: 'مجتمع نشط', desc: 'انضم لمجتمع عربي يشارك خبراته وتجاربه' },
];

const testimonials = [
  {
    id: '1',
    name: 'أحمد محمود',
    role: 'مطور ويب',
    avatar: null,
    content: 'منصة رائعة ساعدتني على اكتشاف أدوات جديدة تساعدني في عملي اليومي. أنصح بها بشدة!',
    rating: 5,
  },
  {
    id: '2',
    name: 'سارة علي',
    role: 'مصممة جرافيك',
    avatar: null,
    content: 'أفضل مصدر عربي للمقالات والشروحات عن أدوات الذكاء الاصطناعي. محتوى متميز ومتجدد.',
    rating: 5,
  },
  {
    id: '3',
    name: 'خالد عبدالله',
    role: 'صاحب مشروع',
    avatar: null,
    content: 'بفضل هذه المنصة، استطعت اختيار الأداة المناسبة لمشروعي بتكلفة أقل وأداء أفضل.',
    rating: 5,
  },
];

const partners = [
  { name: 'OpenAI', logo: Sparkles },
  { name: 'Anthropic', logo: Bot },
  { name: 'Google', logo: Globe },
  { name: 'Microsoft', logo: Layers },
  { name: 'Meta', logo: MessageCircle },
];

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [newsletterEmail, setNewsletterEmail] = React.useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/tools?search=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push('/tools');
    }
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterEmail('');
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* ===== HEADER ===== */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="container-custom">
          <div className="flex h-16 md:h-20 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/25">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gradient">AI Platform</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-sm font-medium text-primary">الرئيسية</Link>
              <Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">المدونة</Link>
              <Link href="/tools" className="text-sm text-muted-foreground hover:text-foreground transition-colors">الأدوات</Link>
              <Link href="/categories" className="text-sm text-muted-foreground hover:text-foreground transition-colors">التصنيفات</Link>
              <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">عن المنصة</Link>
            </nav>

            <div className="flex items-center gap-2">
              <ThemeToggle variant="ghost" />
              {user ? (
                <Link href="/dashboard"><Button size="sm">لوحة التحكم</Button></Link>
              ) : (
                <>
                  <Link href="/auth/login"><Button size="sm" variant="ghost">تسجيل الدخول</Button></Link>
                  <Link href="/auth/register"><Button size="sm">إنشاء حساب</Button></Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-background border-t border-border animate-fade-in">
            <div className="container-custom py-4 space-y-4">
              <nav className="flex flex-col gap-3">
                <Link href="/" className="text-sm font-medium text-primary">الرئيسية</Link>
                <Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground">المدونة</Link>
                <Link href="/tools" className="text-sm text-muted-foreground hover:text-foreground">الأدوات</Link>
                <Link href="/categories" className="text-sm text-muted-foreground hover:text-foreground">التصنيفات</Link>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground">عن المنصة</Link>
              </nav>
              <div className="flex gap-3">
                <Link href="/tools" className="flex-1">
                  <Button size="sm" variant="outline" className="w-full">تصفح الأدوات</Button>
                </Link>
                <Link href="/admin" className="flex-1">
                  <Button size="sm" className="w-full">الدخول للأدمن</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* ===== HERO SECTION ===== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary-50 via-background to-background pt-16 md:pt-24 pb-20 md:pb-32">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 ltr:left-10 rtl:right-10 w-72 h-72 bg-primary-200 rounded-full blur-3xl opacity-40" />
          <div className="absolute bottom-20 ltr:right-10 rtl:left-10 w-96 h-96 bg-secondary-200 rounded-full blur-3xl opacity-30" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-100 rounded-full blur-3xl opacity-20" />
        </div>

        <div className="container-custom relative">
          <div className="text-center max-w-3xl mx-auto">
            {/* Badge */}
            <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-sm animate-fade-in">
              🎉 أكبر منصة عربية لأدوات الذكاء الاصطناعي
            </Badge>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight animate-fade-in" style={{ animationDelay: '0.1s' }}>
              اكتشف قوة{' '}
              <span className="text-gradient">الذكاء الاصطناعي</span>
              <br />
              في مكان واحد
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
              مقالات يومية، شروحات تفصيلية، ومراجعات صادقة لأفضل أدوات AI بالعربية.
              <br className="hidden md:block" />
              ابدأ رحلتك الآن!
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative max-w-xl mx-auto mb-8 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <Search className="absolute ltr:left-4 rtl:right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
              <Input
                placeholder="ابحث عن أدوات AI، مقالات، أو شروحات..."
                className="h-14 ltr:ps-12 rtl:pe-12 text-lg shadow-lg shadow-primary/10 border-2 border-transparent focus:border-primary transition-all rounded-2xl"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button type="submit" size="lg" className="absolute ltr:left-2 rtl:right-2 top-1/2 -translate-y-1/2 h-11 rounded-xl px-6">
                بحث
              </Button>
            </form>

            {/* Quick Links */}
            <div className="flex flex-wrap items-center justify-center gap-3 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <span className="text-sm text-muted-foreground">الأكثر بحثاً:</span>
              <Link href="/tools/chatgpt" className="text-sm text-primary hover:underline">ChatGPT</Link>
              <Link href="/tools/midjourney" className="text-sm text-primary hover:underline">Midjourney</Link>
              <Link href="/tools/claude" className="text-sm text-primary hover:underline">Claude</Link>
              <Link href="/tools/github-copilot" className="text-sm text-primary hover:underline">GitHub Copilot</Link>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10 animate-fade-in" style={{ animationDelay: '0.5s' }}>
              <Link href="/tools">
                <Button size="xl" className="gap-2 shadow-lg shadow-primary/25 w-full sm:w-auto">
                  <Wrench className="w-5 h-5" />
                  استكشف الأدوات
                </Button>
              </Link>
              <Link href="/blog">
                <Button size="xl" variant="outline" className="gap-2 w-full sm:w-auto">
                  <BookOpen className="w-5 ICON-CLASS" />
                  اقرأ المقالات
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section className="py-16 md:py-24">
        <div className="container-custom">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">لماذا نحن؟</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">ليش تختار منصتنا؟</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              نقدم لك تجربة فريدة لاكتشاف وتعلم أدوات الذكاء الاصطناعي مع محتوى عربي متميز
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURED TOOLS GRID ===== */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
            <div>
              <Badge variant="secondary" className="mb-4">🔥 الأدوات المميزة</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">أفضل أدوات الذكاء الاصطناعي</h2>
              <p className="text-muted-foreground">اختر من بين أفضل الأدوات الاحترافية</p>
            </div>
            <Link href="/tools">
              <Button variant="outline" className="gap-2">
                عرض جميع الأدوات
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </Button>
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredTools.map((tool) => {
              const IconComponent = tool.icon;
              return (
                <Link key={tool.id} href={`/tools/${tool.slug}`}>
                  <Card className="h-full hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group cursor-pointer border-2 hover:border-primary/20 overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4 mb-4">
                        <div
                          className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform"
                          style={{ backgroundColor: tool.category.color + '20', color: tool.category.color }}
                        >
                          {tool.logo_url ? (
                            <img src={tool.logo_url} alt={tool.name} className="w-8 h-8" />
                          ) : (
                            <IconComponent className="w-7 h-7" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{tool.name}</h3>
                          <Badge
                            variant="secondary"
                            className="mt-1 text-xs"
                            style={{ backgroundColor: tool.category.color + '15', color: tool.category.color }}
                          >
                            {tool.category.name}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                        {tool.description}
                      </p>
                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <PricingBadge pricing={tool.pricing_model} />
                        <ChevronLeft className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 rtl:rotate-180 transition-all" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== CATEGORIES SECTION ===== */}
      <section className="py-16 md:py-24">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
            <div>
              <Badge variant="secondary" className="mb-4">📁 التصنيفات</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">تصفح حسب التصنيف</h2>
              <p className="text-muted-foreground">اختر المجال الذي يهمك واكتشف الأدوات المناسبة</p>
            </div>
            <Link href="/categories">
              <Button variant="outline" className="gap-2">
                جميع التصنيفات
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {toolCategories.map((cat) => {
              const IconComponent = cat.icon;
              return (
                <Link key={cat.name} href={`/tools?category=${cat.name}`}>
                  <Card className="hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group cursor-pointer text-center py-6">
                    <div
                      className="w-16 h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform"
                      style={{ backgroundColor: cat.color + '20', color: cat.color }}
                    >
                      <IconComponent className="w-7 h-7" />
                    </div>
                    <h3 className="font-semibold mb-1">{cat.name}</h3>
                    <p className="text-sm text-muted-foreground">{cat.count}+ أداة</p>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== STATS SECTION ===== */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-primary via-primary-600 to-secondary text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-20 -left-20 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>
        <div className="container-custom relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <IconComponent className="w-8 h-8 mx-auto mb-3 opacity-80" />
                  <div className="text-4xl md:text-5xl font-bold mb-2">{stat.value}</div>
                  <div className="text-white/80">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== LATEST ARTICLES SECTION ===== */}
      <section className="py-16 md:py-24">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
            <div>
              <Badge variant="secondary" className="mb-4">📝 أحدث المقالات</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">ابق على اطلاع بكل جديد</h2>
              <p className="text-muted-foreground">نشرنا يومياً شروحات ومراجعات وأخبار عن عالم AI</p>
            </div>
            <Link href="/blog">
              <Button variant="outline" className="gap-2">
                جميع المقالات
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {latestArticles.map((article) => (
              <Link key={article.id} href={`/blog/${article.slug}`}>
                <Card className="h-full hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group cursor-pointer overflow-hidden">
                  {/* Article Image Placeholder */}
                  <div className="aspect-video bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center relative overflow-hidden">
                    <BookOpen className="w-12 h-12 text-primary/30 group-hover:text-primary/50 transition-all group-hover:scale-110" />
                    <div className="absolute top-3 ltr:right-3 rtl:left-3">
                      <Badge
                        variant="secondary"
                        className="text-xs backdrop-blur-sm"
                        style={{ backgroundColor: article.category.color + '30', color: article.category.color }}
                      >
                        {article.category.name}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-5">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t border-border">
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
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SOCIAL PROOF - TESTIMONIALS ===== */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container-custom">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">💬 آراء المستخدمين</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">ماذا يقول عنا المستخدمون؟</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              انضم لأكثر من 50,000 مستخدم يثقون بمنصتنا لاكتشاف أدوات الذكاء الاصطناعي
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                    ))}
                  </div>
                  {/* Content */}
                  <p className="text-muted-foreground mb-6 leading-relaxed">"{testimonial.content}"</p>
                  {/* Author */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center text-primary font-bold">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SOCIAL PROOF - PARTNERS ===== */}
      <section className="py-12 md:py-16 border-t border-b border-border">
        <div className="container-custom">
          <p className="text-center text-sm text-muted-foreground mb-8">الأدوات والتقنيات التي نغطيها</p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 opacity-60">
            {partners.map((partner) => (
              <div key={partner.name} className="flex items-center gap-2 text-muted-foreground hover:opacity-100 transition-opacity">
                <partner.logo className="w-6 h-6" />
                <span className="font-medium">{partner.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== NEWSLETTER CTA ===== */}
      <section className="py-20 md:py-28">
        <div className="container-custom">
          <Card className="bg-gradient-to-br from-primary-50 to-secondary-50 border-primary/20 overflow-hidden">
            <CardContent className="p-8 md:p-12 text-center">
              <div className="max-w-2xl mx-auto">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/25">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">انضم نشرتنا البريدية</h2>
                <p className="text-muted-foreground mb-8">
                  احصل على آخر الأخبار، الشروحات، والمقالات المميزة مباشرة في بريدك الإلكتروني
                </p>
                <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <Input
                    type="email"
                    placeholder="أدخل بريدك الإلكتروني"
                    className="flex-1"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    required
                  />
                  <Button type="submit" className="gap-2">
                    <Send className="w-4 h-4" />
                    اشتراك
                  </Button>
                </form>
                <p className="text-xs text-muted-foreground mt-4">
                  لا نرسل رسائل مزعجة. يمكنك إلغاء الاشتراك في أي وقت.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="py-20 md:py-28 bg-muted/30">
        <div className="container-custom text-center">
          <div className="max-w-2xl mx-auto">
            <Sparkles className="w-12 h-12 mx-auto mb-6 text-primary" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">ابدأ رحلتك مع الذكاء الاصطناعي الآن</h2>
            <p className="text-lg text-muted-foreground mb-10">
              انضم لأكثر من 50,000 مستخدم يستفيدون من أقوى أدوات ومقالات الذكاء الاصطناعي بالعربية
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/tools">
                <Button size="lg" className="gap-2 shadow-lg shadow-primary/25 w-full sm:w-auto">
                  <Wrench className="w-5 h-5" />
                  استكشف الأدوات
                </Button>
              </Link>
              <Link href="/blog">
                <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto">
                  <BookOpen className="w-5 h-5" />
                  اقرأ المقالات
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="py-16 border-t border-border bg-muted/10">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div className="lg:col-span-1">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gradient">AI Platform</span>
              </Link>
|              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                أكبر منصة عربية متخصصة في أدوات ومراجعات الذكاء الاصطناعي. نساعدك على اكتشاف أفضل أدوات AI لتحسين إنتاجيتك.
              </p>
              <div className="flex items-center gap-3">
                <a href="#" className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745v.017c-.001.758-.001 1.508 0 2.184.001 1.833 1.333 1.756 1.333 1.756 1.089.745 1.667 1.755 1.667 1.755v2.953c0 .316.193.69.799.575 4.767-2.547 8.197-6.085 8.197-11.385 0-6.627-5.373-12-12-12z"/></svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold mb-4">روابط سريعة</h3>
              <nav className="space-y-3 text-sm">
                <Link href="/" className="block text-muted-foreground hover:text-foreground transition-colors">الرئيسية</Link>
                <Link href="/blog" className="block text-muted-foreground hover:text-foreground transition-colors">المدونة</Link>
                <Link href="/tools" className="block text-muted-foreground hover:text-foreground transition-colors">الأدوات</Link>
                <Link href="/categories" className="block text-muted-foreground hover:text-foreground transition-colors">التصنيفات</Link>
                <Link href="/about" className="block text-muted-foreground hover:text-foreground transition-colors">عن المنصة</Link>
              </nav>
            </div>

            {/* Categories */}
            <div>
              <h3 className="font-semibold mb-4">التصنيفات</h3>
              <nav className="space-y-3 text-sm">
                <Link href="/tools?category=writing" className="block text-muted-foreground hover:text-foreground transition-colors">كتابة</Link>
                <Link href="/tools?category=design" className="block text-muted-foreground hover:text-foreground transition-colors">تصميم</Link>
                <Link href="/tools?category=coding" className="block text-muted-foreground hover:text-foreground transition-colors">برمجة</Link>
                <Link href="/tools?category=audio" className="block text-muted-foreground hover:text-foreground transition-colors">صوت</Link>
                <Link href="/tools?category=video" className="block text-muted-foreground hover:text-foreground transition-colors">فيديو</Link>
              </nav>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-semibold mb-4">تواصل معنا</h3>
              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="text-muted-foreground">البريد الإلكتروني</div>
                    <a href="mailto:contact@aiplatform.com" className="hover:text-primary transition-colors">contact@aiplatform.com</a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="text-muted-foreground">الموقع</div>
                    <span>القاهرة، مصر</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">© 2025 AI Platform. جميع الحقوق محفوظة.</p>
            <div className="flex items-center gap-6 text-sm">
              <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">سياسة الخصوصية</Link>
              <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">الشروط والأحكام</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
