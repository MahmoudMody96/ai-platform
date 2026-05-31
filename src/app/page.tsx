'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  Sparkles,
  Search,
  Zap,
  Shield,
  Star,
  Heart,
  Users,
  Layers,
  BookOpen,
  Code2,
  ImageIcon,
  Bot,
  Mic,
  Video,
  Globe,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Clock,
  CheckCircle,
  Menu,
  X,
} from 'lucide-react';
import { ThemeToggle } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';

// Mock data
const featuredTools = [
  {
    id: '1',
    slug: 'chatgpt',
    name: 'ChatGPT',
    description: 'نموذج لغوي متقدم من OpenAI للكتابة والمحادثة',
    logo_url: null,
    pricing_type: 'freemium',
    rating: 4.9,
    reviews: 12500,
    category: { name_ar: 'مساعدون ذكيون', color: '#7C3AED' },
    icon: Bot,
  },
  {
    id: '2',
    slug: 'midjourney',
    name: 'Midjourney',
    description: 'أداة توليد صور فنية بالذكاء الاصطناعي',
    logo_url: null,
    pricing_type: 'paid',
    rating: 4.8,
    reviews: 8200,
    category: { name_ar: 'توليد الصور', color: '#EC4899' },
    icon: ImageIcon,
  },
  {
    id: '3',
    slug: 'claude',
    name: 'Claude',
    description: 'مساعد ذكي متقدم من Anthropic',
    logo_url: null,
    pricing_type: 'freemium',
    rating: 4.9,
    reviews: 9800,
    category: { name_ar: 'مساعدون ذكيون', color: '#7C3AED' },
    icon: Bot,
  },
  {
    id: '4',
    slug: 'github-copilot',
    name: 'GitHub Copilot',
    description: 'مساعد برمجة من GitHub وOpenAI',
    logo_url: null,
    pricing_type: 'paid',
    rating: 4.7,
    reviews: 15000,
    category: { name_ar: 'أتمتة', color: '#06B6D4' },
    icon: Code2,
  },
];

const categories = [
  { name: 'مساعدون ذكيون', icon: Bot, count: 45, color: '#7C3AED', gradient: 'from-violet-500 to-purple-600' },
  { name: 'توليد الصور', icon: ImageIcon, count: 32, color: '#EC4899', gradient: 'from-pink-500 to-rose-600' },
  { name: 'أتمتة', icon: Zap, count: 28, color: '#06B6D4', gradient: 'from-cyan-500 to-blue-600' },
  { name: 'برمجة', icon: Code2, count: 25, color: '#10B981', gradient: 'from-emerald-500 to-teal-600' },
  { name: 'صوت', icon: Mic, count: 18, color: '#F59E0B', gradient: 'from-amber-500 to-orange-600' },
  { name: 'فيديو', icon: Video, count: 24, color: '#EF4444', gradient: 'from-red-500 to-pink-600' },
];

const stats = [
  { value: '500+', label: 'أداة AI', icon: Layers, color: '#7C3AED' },
  { value: '200+', label: 'مقال', icon: BookOpen, color: '#06B6D4' },
  { value: '50K+', label: 'مستخدم', icon: Users, color: '#EC4899' },
  { value: '4.9/5', label: 'تقييم', icon: Star, color: '#F59E0B' },
];

const features = [
  {
    icon: Zap,
    title: 'أدوات محدثة',
    desc: 'نحدث قائمة الأدوات باستمرار لتناسب أحدث التقنيات والابتكارات في مجال الذكاء الاصطناعي.',
    color: '#7C3AED',
  },
  {
    icon: Shield,
    title: 'مراجعات صادقة',
    desc: 'نقدم لك تقييمات نزيهة وموضوعية لكل أداة بناءً على تجارب حقيقية.',
    color: '#06B6D4',
  },
  {
    icon: Star,
    title: 'أفضل الاختيارات',
    desc: 'نختار لك أفضل الأدوات بناءً على جودة الأداء وسهولة الاستخدام.',
    color: '#EC4899',
  },
  {
    icon: Heart,
    title: 'مجتمع نشط',
    desc: 'انضم لمجتمع عربي يشارك خبراته وتجاربه مع أدوات الذكاء الاصطناعي.',
    color: '#F59E0B',
  },
];

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/tools?search=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push('/tools');
    }
  };

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* ===== HEADER ===== */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="container-custom">
          <div className="flex h-16 md:h-20 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary via-primary-500 to-secondary flex items-center justify-center shadow-lg shadow-primary/30 group-hover:shadow-xl group-hover:shadow-primary/40 transition-all duration-300">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-pulse" />
              </div>
              <div>
                <span className="text-xl font-bold text-gradient">AI Platform</span>
                <p className="text-xs text-muted-foreground hidden sm:block">منصة الذكاء الاصطناعي</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              <Link href="/" className="px-4 py-2 text-sm font-medium text-primary bg-primary/10 rounded-lg">الرئيسية</Link>
              <Link href="/tools" className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all">الأدوات</Link>
              <Link href="/blog" className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all">المدونة</Link>
              <Link href="/categories" className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all">التصنيفات</Link>
            </nav>

            <div className="flex items-center gap-2">
              <ThemeToggle />
              {user ? (
                <Link href="/dashboard"><Button>لوحة التحكم</Button></Link>
              ) : (
                <>
                  <Link href="/auth/login"><Button variant="ghost" className="hidden sm:flex">دخول</Button></Link>
                  <Link href="/auth/register"><Button>ابدأ مجاناً</Button></Link>
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
          <div className="md:hidden bg-background/95 backdrop-blur-xl border-t border-border animate-fade-in">
            <div className="container-custom py-4 space-y-3">
              <nav className="flex flex-col gap-1">
                <Link href="/" className="px-4 py-3 text-sm font-medium text-primary bg-primary/10 rounded-lg">الرئيسية</Link>
                <Link href="/tools" className="px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-muted rounded-lg">الأدوات</Link>
                <Link href="/blog" className="px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-muted rounded-lg">المدونة</Link>
                <Link href="/categories" className="px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-muted rounded-lg">التصنيفات</Link>
              </nav>
            </div>
          </div>
        )}
      </header>

      {/* ===== HERO SECTION ===== */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary-500/20 rounded-full blur-3xl" />
        <div className="absolute top-40 right-1/4 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
        
        {/* Floating Elements */}
        <div className="absolute top-32 right-20 w-20 h-20 bg-primary-500/10 rounded-2xl rotate-12 animate-float hidden lg:block" />
        <div className="absolute bottom-40 left-20 w-16 h-16 bg-secondary-500/10 rounded-xl -rotate-12 animate-float hidden lg:block" style={{ animationDelay: '2s' }} />

        <div className="container-custom relative">
          <div className="max-w-4xl mx-auto text-center stagger-children">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20 mb-8">
              <Sparkles className="w-4 h-4 text-primary animate-pulse" />
              <span className="text-sm font-medium text-primary">أحدث تقنيات الذكاء الاصطناعي</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight">
              اكتشف أفضل{' '}
              <span className="text-gradient">أدوات AI</span>
              <br />
              في مكان واحد
            </h1>

            {/* Subtitle */}
            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              منصة عربية شاملة لاكتشاف وتقييم أفضل أدوات الذكاء الاصطناعي. أكثر من 500 أداة محدثة باستمرار.
            </p>

            {/* Search Box */}
            <form onSubmit={handleSearch} className="mt-10 max-w-xl mx-auto">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity" />
                <div className="relative flex items-center bg-card rounded-2xl border border-border shadow-xl overflow-hidden">
                  <Search className="w-5 h-5 text-muted-foreground mr-4 mr-auto pr-4 border-l border-border" />
                  <input
                    type="text"
                    placeholder="ابحث عن أي أداة ذكاء اصطناعي..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 h-14 px-4 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
                  />
                  <button type="submit" className="h-full px-6 bg-gradient-to-r from-primary to-primary-600 text-white font-medium hover:opacity-90 transition-opacity">
                    بحث
                  </button>
                </div>
              </div>
            </form>

            {/* Quick Stats */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-8">
              {stats.map((stat, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: stat.color + '15' }}>
                    <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== CATEGORIES SECTION ===== */}
      <section className="py-16 md:py-24">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="section-title">تصفح حسب التصنيف</h2>
            <p className="section-subtitle mx-auto">اختر التصنيف المناسب لاكتشاف الأدوات التي تناسب احتياجك</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat, i) => (
              <Link
                key={i}
                href={`/categories/${cat.name}`}
                className="group relative p-6 rounded-2xl bg-card border border-border/50 hover:border-transparent transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} opacity-0 group-hover:opacity-10 transition-opacity`} />
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <cat.icon className="w-6 h-6" style={{ color: cat.color }} />
                  </div>
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{cat.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{cat.count} أداة</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURED TOOLS SECTION ===== */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-transparent via-primary-50/30 to-transparent">
        <div className="container-custom">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="section-title">الأدوات المميزة</h2>
              <p className="section-subtitle">أفضل أدوات الذكاء الاصطناعي حسب تقييم المستخدمين</p>
            </div>
            <Link href="/tools" className="hidden md:flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all">
              عرض الكل <ChevronRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredTools.map((tool, i) => (
              <Link
                key={tool.id}
                href={`/tools/${tool.slug}`}
                className="group card card-hover overflow-hidden"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div 
                      className="w-14 h-14 rounded-2xl flex items-center justify-center"
                      style={{ backgroundColor: tool.category.color + '15' }}
                    >
                      <tool.icon className="w-7 h-7" style={{ color: tool.category.color }} />
                    </div>
                    <div className="flex items-center gap-1 px-2 py-1 bg-warning/10 rounded-lg">
                      <Star className="w-4 h-4 text-warning fill-warning" />
                      <span className="text-sm font-semibold text-warning">{tool.rating}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">{tool.name}</h3>
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{tool.description}</p>

                  {/* Footer */}
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/50">
                    <span 
                      className="text-xs font-medium px-3 py-1 rounded-full"
                      style={{ backgroundColor: tool.category.color + '15', color: tool.category.color }}
                    >
                      {tool.category.name_ar}
                    </span>
                    <span className="text-xs text-muted-foreground">{tool.reviews.toLocaleString()} تقييم</span>
                  </div>
                </div>

                {/* Hover Effect */}
                <div className="h-1 bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </div>

          <div className="mt-8 text-center md:hidden">
            <Link href="/tools" className="btn btn-outline">
              عرض كل الأدوات <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section className="py-16 md:py-24">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="section-title">ليش تختارنا؟</h2>
            <p className="section-subtitle mx-auto">نقدم لك تجربة فريدة لاكتشاف أدوات الذكاء الاصطناعي</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feat, i) => (
              <div key={i} className="relative p-8 rounded-2xl bg-card border border-border/50 group hover:border-primary/20 transition-all duration-300">
                <div 
                  className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: `linear-gradient(to right, ${feat.color}, ${feat.color}80)` }}
                />
                <div 
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                  style={{ backgroundColor: feat.color + '15' }}
                >
                  <feat.icon className="w-7 h-7" style={{ color: feat.color }} />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-3">{feat.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="py-16 md:py-24">
        <div className="container-custom">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary-600 to-secondary p-1">
            <div className="relative bg-gradient-to-br from-primary-900 to-slate-900 rounded-3xl p-8 md:p-16 text-center">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl" />
                <div className="absolute bottom-10 right-10 w-48 h-48 bg-white rounded-full blur-3xl" />
              </div>

              <div className="relative">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                  جاهز تكتشف أدوات AI الجديدة؟
                </h2>
                <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto">
                  انضم لأكثر من 50,000 مستخدم يكتشفون أفضل أدوات الذكاء الاصطناعي يومياً
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link href="/tools" className="btn btn-lg bg-white text-primary hover:bg-white/90 shadow-xl">
                    استكشف الأدوات <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link href="/auth/register" className="btn btn-lg bg-white/10 text-white border border-white/20 hover:bg-white/20">
                    إنشاء حساب مجاني
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="py-12 border-t border-border bg-card/50">
        <div className="container-custom">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <Link href="/" className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gradient">AI Platform</span>
              </Link>
              <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
                منصة عربية شاملة لاكتشاف وتقييم أفضل أدوات الذكاء الاصطناعي. نساعدك على البقاء على اطلاع بأحدث تقنيات AI.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">روابط سريعة</h4>
              <ul className="space-y-2">
                <li><Link href="/tools" className="text-sm text-muted-foreground hover:text-primary transition-colors">الأدوات</Link></li>
                <li><Link href="/blog" className="text-sm text-muted-foreground hover:text-primary transition-colors">المدونة</Link></li>
                <li><Link href="/categories" className="text-sm text-muted-foreground hover:text-primary transition-colors">التصنيفات</Link></li>
                <li><Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">عن المنصة</Link></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">قانوني</h4>
              <ul className="space-y-2">
                <li><Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">سياسة الخصوصية</Link></li>
                <li><Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">شروط الاستخدام</Link></li>
                <li><Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">تواصل معنا</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © 2026 AI Platform. جميع الحقوق محفوظة.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Button({ children, variant = 'primary', className = '', ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'destructive' }) {
  const variants = {
    primary: 'bg-gradient-to-r from-primary to-primary-600 text-white shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0',
    secondary: 'bg-gradient-to-r from-secondary to-secondary-600 text-white shadow-lg shadow-secondary/25',
    accent: 'bg-gradient-to-r from-accent to-accent-600 text-white shadow-lg shadow-accent/25',
    outline: 'border-2 border-border bg-transparent hover:bg-primary hover:text-white hover:border-primary',
    ghost: 'bg-transparent hover:bg-primary/10 hover:text-primary',
    destructive: 'bg-gradient-to-r from-error to-error-dark text-white',
  };

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 cursor-pointer ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
