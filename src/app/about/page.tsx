'use client';

import * as React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Users, Target, Heart, CheckCircle, Layers, Shield, ChevronRight } from 'lucide-react';

const features = [
  {
    icon: Layers,
    title: 'أكثر من 500 أداة',
    description: 'نقدم أكبر مجموعة من أدوات الذكاء الاصطناعي مصنفة حسب الوظيفة'
  },
  {
    icon: Shield,
    title: 'مراجعات موثوقة',
    description: 'كل أداة يتم مراجعتها وتقييمها من فريق متخصص'
  },
  {
    icon: Zap,
    title: 'تحديثات يومية',
    description: 'نواكب أحدث أدوات AI وأخبار الذكاء الاصطناعي'
  },
  {
    icon: Users,
    title: 'مجتمع نشط',
    description: 'انضم لأكثر من 50,000 مستخدم يشاركون تجاربهم'
  }
];

const team = [
  { name: 'فريق التطوير', role: 'فريق التقنية', avatar: '👨‍💻' },
  { name: 'فريق المحتوى', role: 'مراجعة وتحليل', avatar: '✍️' },
  { name: 'فريق الدعم', role: 'خدمة العملاء', avatar: '🎧' },
];

const stats = [
  { value: '500+', label: 'أداة AI' },
  { value: '50K+', label: 'مستخدم نشط' },
  { value: '1M+', label: 'استخدام شهري' },
  { value: '4.8', label: 'تقييم متوسط' },
];

export default function AboutPage() {
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
              <Link href="/categories" className="text-sm text-muted-foreground hover:text-foreground">الفئات</Link>
              <Link href="/about" className="text-sm font-medium text-primary">عن المنصة</Link>
              <Link href="/admin" className="text-sm text-muted-foreground hover:text-foreground">لوحة التحكم</Link>
            </nav>
            <Link href="/admin"><Button size="sm">الدخول للأدمن</Button></Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 bg-gradient-to-b from-primary-50 to-background text-center">
        <div className="container-custom">
          <Badge variant="secondary" className="mb-4">من نحن</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            أكبر منصة عربية لأدوات
            <br />
            <span className="text-gradient">الذكاء الاصطناعي</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            نساعد المستخدمين العرب على اكتشاف أفضل أدوات الذكاء الاصطناعي 
            واستخدامها بفعالية في عملهم وحياتهم اليومية
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/tools">
              <Button size="lg" className="gap-2">
                استكشف الأدوات
                <ChevronRight className="w-4 h-4 rtl:rotate-180" />
              </Button>
            </Link>
            <Link href="/categories">
              <Button size="lg" variant="outline" className="gap-2">
                تصفح الفئات
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-muted/50">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <Card key={i} className="text-center">
                <CardContent className="py-6">
                  <div className="text-3xl md:text-4xl font-bold text-gradient mb-2">{stat.value}</div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="outline" className="mb-4">مهمتنا</Badge>
              <h2 className="text-3xl font-bold mb-6">نؤمن بأن الذكاء الاصطناعي للجميع</h2>
              <p className="text-lg text-muted-foreground mb-6">
                مهمتنا هي تسهيل الوصول إلى أدوات الذكاء الاصطناعي للمستخدمين العرب. 
                نؤمن بأن كل شخص يستحق أن يستفيد من قوة AI دون الحاجة لتجارب مطولة 
                أو مصادر متعددة.
              </p>
              <ul className="space-y-3">
                {[
                  'مراجعات شاملة ومفصلة لكل أداة',
                  'تصنيف دقيق حسب الوظيفة والفئة',
                  'مقارنات مساعدة في اتخاذ القرار',
                  'تغطية شاملة لأحدث أدوات AI'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="absolute -top-4 -right-4 w-72 h-72 bg-primary-200 rounded-full blur-3xl opacity-50" />
              <Card className="relative">
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                      <Target className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">هدفنا</h3>
                      <p className="text-muted-foreground">نحو مجتمع عربي متعلم</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground">
                    نسعى لبناء مجتمع عربي متعلم يستخدم الذكاء الاصطناعي 
                    بكفاءة في مختلف المجالات العملية.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-muted/50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">لماذا نحن؟</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              نقدم تجربة فريدة في اكتشاف وتقييم أدوات الذكاء الاصطناعي
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <Card key={i}>
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-bold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">فريقنا</h2>
            <p className="text-muted-foreground">
              فريق متخصص يعمل على تقديم أفضل المحتوى
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {team.map((member, i) => (
              <Card key={i}>
                <CardContent className="p-6 text-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center text-4xl mx-auto mb-4">
                    {member.avatar}
                  </div>
                  <h3 className="font-bold mb-1">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
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
            <Heart className="w-16 h-16 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">انضم لمجتمعنا</h2>
            <p className="text-lg opacity-90 mb-8">
              شاركنا تجربتك مع أدوات AI وساعد الآخرين على اتخاذ قرارات أفضل
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/tools">
                <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90 gap-2">
                  <Layers className="w-4 h-4" />
                  استكشف الأدوات
                </Button>
              </Link>
              <Link href="/categories">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 gap-2">
                  تصفح الفئات
                </Button>
              </Link>
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
