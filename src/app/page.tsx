// =============================================
// Home Page - Landing Page
// =============================================

'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Sparkles, Search, ArrowLeft, Layers, Users, Star, TrendingUp, Play } from 'lucide-react';

const categories = [
  { name: 'الكتابة', icon: '✍️', count: 150, color: '#6366F1' },
  { name: 'التصميم', icon: '🎨', count: 120, color: '#EC4899' },
  { name: 'التطوير', icon: '💻', count: 180, color: '#10B981' },
  { name: 'الأتمتة', icon: '⚡', count: 90, color: '#F59E0B' },
  { name: 'التسويق', icon: '📊', count: 110, color: '#3B82F6' },
  { name: 'الفيديو', icon: '🎬', count: 80, color: '#8B5CF6' },
  { name: 'التعليم', icon: '📚', count: 70, color: '#14B8A6' },
  { name: 'البحث', icon: '🔍', count: 60, color: '#F97316' },
];

const featuredTools = [
  { name: 'ChatGPT', description: 'نموذج لغوي متقدم للكتابة', pricing: 'freemium', rating: 4.8 },
  { name: 'Midjourney', description: 'توليد صور فنية بالذكاء الاصطناعي', pricing: 'paid', rating: 4.7 },
  { name: 'Claude', description: 'مساعد ذكي للتحليل والكتابة', pricing: 'freemium', rating: 4.9 },
  { name: 'GitHub Copilot', description: 'مساعد برمجة بالذكاء الاصطناعي', pricing: 'paid', rating: 4.6 },
  { name: 'DALL-E 3', description: 'توليد صور واقعية من النصوص', pricing: 'paid', rating: 4.7 },
  { name: 'ElevenLabs', description: 'أصوات AI واقعية جداً', pricing: 'freemium', rating: 4.8 },
];

const stats = [
  { value: '500+', label: 'أداة AI', icon: Layers },
  { value: '50K+', label: 'مستخدم نشط', icon: Users },
  { value: '1M+', label: 'استخدام شهري', icon: TrendingUp },
  { value: '4.8', label: 'تقييم متوسط', icon: Star },
];

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/tools?search=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push('/tools');
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
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-sm font-medium text-primary">الرئيسية</Link>
              <Link href="/tools" className="text-sm text-muted-foreground hover:text-foreground">الأدوات</Link>
              <Link href="/categories" className="text-sm text-muted-foreground hover:text-foreground">الفئات</Link>
              <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground">عن المنصة</Link>
              <Link href="/admin" className="text-sm text-muted-foreground hover:text-foreground">لوحة التحكم</Link>
            </nav>
            <div className="flex items-center gap-2">
              <Link href="/admin"><Button size="sm">الدخول للأدمن</Button></Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary-50 via-background to-background py-20 md:py-32">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary-200 rounded-full blur-3xl" />
        </div>
        <div className="container-custom relative text-center">
          <Badge variant="secondary" className="mb-4">🎉 أكبر منصة عربية لأدوات الذكاء الاصطناعي</Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            اكتشف قوة <span className="text-gradient">الذكاء الاصطناعي</span>
            <br />باللغة العربية
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            أكثر من 500 أداة AI مصنفة ومراجعة - الأخبار اليومية، المقالات، الدروس، والمقارنة الشاملة
          </p>
          <div className="max-w-2xl mx-auto mb-8">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground rtl:right-auto rtl:left-4" />
              <Input 
                placeholder="ابحث عن أي أداة... مثال: توليد صور، كتابة محتوى" 
                className="h-14 ps-12 pe-32 text-lg rtl:ps-32 rtl:pe-12" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button type="submit" className="absolute left-2 top-1/2 -translate-y-1/2 h-10 rtl:left-auto rtl:right-2">بحث</Button>
            </form>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-muted/50">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <Card key={i} className="text-center py-6">
                <stat.icon className="w-8 h-8 mx-auto mb-2 text-primary" />
                <div className="text-3xl font-bold text-gradient">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">تصفح حسب الفئة</h2>
              <p className="text-muted-foreground">اختر الفئة المناسبة لاحتياجك</p>
            </div>
            <Link href="/tools"><Button variant="outline" className="gap-2"><ArrowLeft className="w-4 h-4 rtl:rotate-180" />جميع الأدوات</Button></Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link key={cat.name} href={`/tools?category=${cat.name}`}>
                <Card className="group p-6 text-center hover:shadow-lg hover:-translate-y-1 cursor-pointer">
                  <div className="text-4xl mb-3">{cat.icon}</div>
                  <h3 className="font-semibold group-hover:text-primary">{cat.name}</h3>
                  <p className="text-sm text-muted-foreground">{cat.count} أداة</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Tools */}
      <section className="py-16 bg-muted/50">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">أدوات مميزة</h2>
              <p className="text-muted-foreground">الأدوات الأكثر شعبية</p>
            </div>
            <Link href="/tools"><Button variant="outline" className="gap-2"><ArrowLeft className="w-4 h-4 rtl:rotate-180" />عرض المزيد</Button></Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTools.map((tool) => (
              <Card key={tool.name} className="group hover:shadow-lg hover:-translate-y-1 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center text-2xl font-bold text-primary">{tool.name.charAt(0)}</div>
                    <div>
                      <h3 className="font-semibold text-lg group-hover:text-primary">{tool.name}</h3>
                      <p className="text-sm text-muted-foreground">{tool.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <Badge variant={tool.pricing === 'free' ? 'success' : tool.pricing === 'freemium' ? 'info' : 'secondary'}>{tool.pricing === 'free' ? 'مجاني' : tool.pricing === 'freemium' ? 'مجاني + مدفوع' : 'مدفوع'}</Badge>
                    <div className="flex items-center gap-1"><Star className="w-4 h-4 text-accent fill-accent" />{tool.rating}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600 text-white text-center">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto">
            <Sparkles className="w-16 h-16 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">ابدأ رحلتك مع الذكاء الاصطناعي</h2>
            <p className="text-lg opacity-90 mb-8">انضم لأكثر من 50,000 مستخدم</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/tools"><Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90 gap-2"><Layers className="w-4 h-4" />استكشف الأدوات</Button></Link>
              <Link href="/admin"><Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 gap-2"><Play className="w-4 h-4" />لوحة التحكم</Button></Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
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