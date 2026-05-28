'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  BookOpen, 
  Clock, 
  Calendar, 
  Eye, 
  ChevronLeft,
  Link2,
  MessageCircle,
  User,
  ArrowRight,
  Loader2
} from 'lucide-react';

// Mock article data
const articlesData: Record<string, {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image_url: string | null;
  category: { name: string; color: string };
  author: { display_name: string; avatar_url: string | null; bio: string };
  published_at: string;
  read_time: number;
  views: number;
  tags: string[];
  featured: boolean;
}> = {
  'ai-revolution-2025': {
    id: '1',
    title: 'ثورة الذكاء الاصطناعي في 2025: نظرة شاملة على أبرز التطورات',
    slug: 'ai-revolution-2025',
    excerpt: 'استكشفنا في هذا المقال أبرز التطورات في مجال الذكاء الاصطناعي وتأثيرها على حياتنا اليومية، من النماذج اللغوية الكبيرة إلى أدوات الإنتاجية الذكية.',
    content: `
## مقدمة

شهد عام 2025 تطورات غير مسبوقة في مجال الذكاء الاصطناعي، حيث أصبحت التقنيات الذكية جزءاً لا يتجزأ من حياتنا اليومية. في هذا المقال، نستعرض معكم أبرز هذه التطورات.

## النماذج اللغوية الكبيرة (LLMs)

###chatgpt-5 والجيل الجديد

أطلقت OpenAI الإصدار الخامس من ChatGPT مع قدرات متقدمة في الفهم والتحليل والإبداع. يتميز هذا الإصدار بـ:

- **فهم أعمق للسياق**: قدرة محسنة على فهم النصوص المعقدة والمتطلبات الضمنية
- **إبداع أعلى**: قدرة على توليد محتوى أصلي بجودة قريبة من الإنسان
- **ذاكرة طويلة**: يمكنه تذكر محادثات أطول وتحليلها بشكل أفضل

### Claude 3.5 والتركيز على السلامة

ركزت Anthropic على تحسين قدرات Claude مع الحفاظ على معايير السلامة العالية:

- **Reasoning محسّن**: قدرة أفضل على حل المشاكل المعقدة خطوة بخطوة
- **تحليل أخلاقي**: يمكنه الآن تقييم القرارات من منظور أخلاقي
- **تكامل أفضل**: واجهات برمجة محسنة للتكامل مع الأنظمة المختلفة

## أدوات الإنتاجية الذكية

### Copilot في كل مكان

لم يعد GitHub Copilot قاصراً على كتابة الأكواد فقط، بل أصبح:

- **مساعد شامل**: يساعد في تحليل المشاريع وتصميم البنية
- **مراجعة أكواد**: يقدم اقتراحات لتحسين الأداء والأمان
- **توليد اختبارات**: ينشئ اختبارات تلقائية شاملة

### أدوات الكتابة الإبداعية

ظهرت أدوات جديدة متخصصة في:

- **كتابة القصص**: توليد قصص قصيرة وروايات بسيطة
- **الكتابة التسويقية**: إنشاء محتوى تسويقي جذاب
- **الترجمة المتقدمة**: ترجمة مع الحفاظ على السياق والأسلوب

## تأثير الذكاء الاصطناعي على سوق العمل

### الوظائف الجديدة

ظهرت تخصصات جديدة مرتبطة بالذكاء الاصطناعي:

1. مهندس prompts متخصص
2. مشرف ذكاء اصطناعي
3. محلل بيانات AI
4. مصمم تجارب AI

### تغيير طبيعة الوظائف

تغيرت متطلبات العديد من الوظائف التقليدية:

- أصبح **العمل مع AI** مهارة أساسية
- **التفكير النقدي** أصبح أكثر أهمية
- مهارات **التحليل والإبداع** مطلوبة أكثر

## التوقعات لعام 2026

نستشرف عاماً أكثر إشراقاً للذكاء الاصطناعي مع:

- **ذكاء اصطناعي عام (AGI)**: تقارب أكبر مع الذكاء البشري
- **أتمتة شاملة**: انتشار أوسع في جميع القطاعات
- **تنظيم أكثر**: قوانين وسياسات جديدة

## الخلاصة

الذكاء الاصطناعي يتطور بسرعة كبيرة، والسباق بين الشركات الكبرى مستمر لتقديم أفضل الحلول. المفتاح للنجاح هو **التكيف والتعلم المستمر** والاستفادة من هذه الأدوات لتحقيق أهدافنا.
    `,
    cover_image_url: null,
    category: { name: 'أخبار AI', color: '#6366f1' },
    author: { display_name: 'فريق المنصة', avatar_url: null, bio: 'فريق متخصص في تحليل أدوات وتقنيات الذكاء الاصطناعي' },
    published_at: '2025-05-28',
    read_time: 5,
    views: 1234,
    tags: ['ChatGPT', 'ذكاء اصطناعي', 'تطورات 2025'],
    featured: true,
  },
  'chatgpt-vs-claude': {
    id: '2',
    title: 'مقارنة شاملة: ChatGPT vs Claude أيهما أفضل لمشروعك؟',
    slug: 'chatgpt-vs-claude',
    excerpt: 'نقدم لك مقارنة تفصيلية بين أقوى نموذجين لغويين من OpenAI و Anthropic من حيث القدرات والتكلفة وسهولة الاستخدام.',
    content: `
## مقدمة

عند البحث عن مساعد ذكاء اصطناعي لمشروعك، ستصل سريعاً إلى خيارين رئيسيين: ChatGPT و Claude. في هذا المقال، نقدم مقارنة شاملة تساعدك في اتخاذ القرار الصحيح.

## نظرة عامة

### ChatGPT
- **الشركة**: OpenAI
- **الإصدار الحالي**: GPT-4o
- **التركيز**: نموذج عام متعدد الاستخدامات

### Claude
- **الشركة**: Anthropic
- **الإصدار الحالي**: Claude 3.5 Sonnet
- **التركيز**: السلامة والتحليل المعمق

## مقارنة القدرات

### الكتابة والتحليل

| المعيار | ChatGPT | Claude |
|---------|---------|--------|
| جودة الكتابة | ممتازة | ممتازة |
| الدقة في التحليل | جيد جداً | ممتاز |
| الإبداع | عالي | متوسط إلى عالي |
| الالتزام بالموضوع | جيد | ممتاز |

### البرمجة

عند اختبار كليهما في كتابة الأكواد:

**ChatGPT**:
- ممتاز في توليد أكواد سريعة
- يدعم مجموعة واسعة من اللغات
- مساعدة جيدة في debugging

**Claude**:
- تحليل كود أعمق
- اقتراحات تحسين أفضل
- فهم أفضل لهيكل المشاريع الكبيرة

### السياق والذاكرة

**ChatGPT**:
- نافذة سياق تصل إلى 128K توكن
- إدارة جيدة للمحادثات الطويلة

**Claude**:
- نافذة سياق أكبر (200K توكن)
- ذاكرة أفضل للمشاريع طويلة المدى

## التسعير

### ChatGPT
- **مجاني**: استخدام محدود
- **Plus**: 20$/شهر
- **Pro**: 200$/شهر

### Claude
- **مجاني**: استخدام سخي
- **Pro**: 20$/شهر
- **Team**: 25$/مستخدم/شهر

## متى تختار كلاً منهما؟

### اختر ChatGPT إذا:
- تحتاج نموذج عام متعدد الاستخدامات
- تريد مجتمع ودعم أكبر
- تستخدم خدمات Microsoft الأخرى

### اختر Claude إذا:
- السلامة والأمان أولوية قصوى
- تعمل على مشاريع تحليل معقدة
- تحتاج سياق طويل للمحادثات

## الخلاصة

كلا النموذجين ممتازان، والاختيار يعتمد على احتياجاتك المحددة. ننصح بتجربة كليهما واختبار أيهما يناسب أسلوب عملك بشكل أفضل.
    `,
    cover_image_url: null,
    category: { name: 'مراجعات', color: '#10b981' },
    author: { display_name: 'فريق المنصة', avatar_url: null, bio: 'فريق متخصص في تحليل أدوات وتقنيات الذكاء الاصطناعي' },
    published_at: '2025-05-27',
    read_time: 8,
    views: 2341,
    tags: ['ChatGPT', 'Claude', 'مقارنة', 'نماذج لغوية'],
    featured: true,
  },
};

// Mock related articles
const relatedArticles = [
  {
    id: '5',
    slug: 'midjourney-tutorial',
    title: 'دليل شامل لاستخدام Midjourney: من المبتدئ إلى المحترف',
    excerpt: 'تعلم كيفية إنشاء صور مذهلة باستخدام Midjourney مع نصائح وحيل متقدمة.',
    category: { name: 'شروحات', color: '#f59e0b' },
    published_at: '2025-05-24',
    read_time: 10,
    views: 1456,
  },
  {
    id: '6',
    slug: 'ai-writing-tools',
    title: 'أدوات الكتابة بالذكاء الاصطناعي: أيها يناسبك؟',
    excerpt: 'مراجعة مقارنة لأفضل أدوات الكتابة AI المتاحة حالياً.',
    category: { name: 'مراجعات', color: '#10b981' },
    published_at: '2025-05-23',
    read_time: 6,
    views: 987,
  },
  {
    id: '8',
    slug: 'claude-api-guide',
    title: 'دليل شامل لواجهة برمجة Claude API للمطورين',
    excerpt: 'كل ما تحتاج معرفته للبدء مع Claude API.',
    category: { name: 'برمجة', color: '#8b5cf6' },
    published_at: '2025-05-21',
    read_time: 12,
    views: 2156,
  },
];

// Mock comments
const mockComments = [
  {
    id: '1',
    author: 'أحمد محمد',
    content: 'مقال رائع ومفصل جداً! شكراً على المجهود.',
    created_at: '2025-05-28T10:30:00Z',
    replies: [
      {
        id: '2',
        author: 'فريق المنصة',
        content: 'شكراً لك! نسعد بتقييمك.',
        created_at: '2025-05-28T11:00:00Z',
      },
    ],
  },
  {
    id: '3',
    author: 'سارة علي',
    content: 'هل يمكنكم كتابة مقال عن مقارنة مماثلة لـ Gemini؟',
    created_at: '2025-05-28T14:20:00Z',
    replies: [],
  },
];

export default function ArticleDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [isLoading, setIsLoading] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  // Get article data (mock)
  const article = articlesData[slug] || {
    id: '1',
    title: 'المقال غير موجود',
    slug: slug,
    excerpt: 'عذراً، هذا المقال غير موجود أو تم حذفه.',
    content: '',
    cover_image_url: null,
    category: { name: 'غير مصنف', color: '#6b7280' },
    author: { display_name: 'غير معروف', avatar_url: null, bio: '' },
    published_at: new Date().toISOString(),
    read_time: 0,
    views: 0,
    tags: [],
    featured: false,
  };

  const isNotFound = !articlesData[slug];

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ar-EG', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ar-EG', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = article.title;
    
    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`);
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`);
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        break;
    }
  };

  // Parse content to handle markdown-like formatting
  const renderContent = (content: string) => {
    if (!content) return null;
    
    const lines = content.trim().split('\n');
    return lines.map((line, index) => {
      const trimmed = line.trim();
      
      if (!trimmed) {
        return <div key={index} className="h-4" />;
      }
      
      // Headings
      if (trimmed.startsWith('## ')) {
        return <h2 key={index} className="text-2xl font-bold mt-8 mb-4 text-foreground">{trimmed.slice(3)}</h2>;
      }
      if (trimmed.startsWith('### ')) {
        return <h3 key={index} className="text-xl font-semibold mt-6 mb-3 text-foreground">{trimmed.slice(4)}</h3>;
      }
      
      // Lists
      if (trimmed.startsWith('- ')) {
        return <li key={index} className="mr-6 mb-2 text-muted-foreground">{trimmed.slice(2)}</li>;
      }
      if (/^\d+\.\s/.test(trimmed)) {
        const num = trimmed.match(/^(\d+)\.\s/)?.[1];
        return <li key={index} className="mr-6 mb-2 text-muted-foreground list-decimal">{trimmed.slice(trimmed.indexOf(' ') + 1)}</li>;
      }
      
      // Tables (simple rendering)
      if (trimmed.startsWith('|')) {
        return <p key={index} className="text-muted-foreground font-mono text-sm overflow-x-auto">{trimmed.replace(/\|/g, ' │ ')}</p>;
      }
      
      // Bold text markers
      if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
        return <p key={index} className="font-semibold mb-2">{trimmed.slice(2, -2)}</p>;
      }
      
      // Default paragraph
      return <p key={index} className="text-muted-foreground leading-relaxed mb-4">{trimmed}</p>;
    });
  };

  if (isNotFound) {
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
          <h1 className="text-3xl font-bold mb-4">المقال غير موجود</h1>
          <p className="text-muted-foreground mb-8">عذراً، هذا المقال غير موجود أو تم حذفه.</p>
          <Link href="/blog">
            <Button>
              <ArrowRight className="w-4 h-4 ms-2 rtl:rotate-180" />
              العودة للمدونة
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
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">الرئيسية</Link>
              <Link href="/blog" className="text-sm font-medium text-primary">المدونة</Link>
              <Link href="/tools" className="text-sm text-muted-foreground hover:text-foreground">الأدوات</Link>
            </nav>
            <div className="flex items-center gap-2">
              <Link href="/admin">
                <Button size="sm">الدخول للأدمن</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Article Header */}
      <div className="bg-gradient-to-b from-primary-50 to-background py-12">
        <div className="container-custom max-w-4xl">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link href="/" className="hover:text-foreground">الرئيسية</Link>
            <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
            <Link href="/blog" className="hover:text-foreground">المدونة</Link>
            <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
            <span className="text-foreground">{article.category.name}</span>
          </div>

          {/* Category Badge */}
          <Badge 
            className="mb-4"
            style={{ backgroundColor: article.category.color + '20', color: article.category.color }}
          >
            {article.category.name}
          </Badge>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
            {article.title}
          </h1>

          {/* Excerpt */}
          <p className="text-lg text-muted-foreground mb-6">
            {article.excerpt}
          </p>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
            {/* Author */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-foreground">{article.author.display_name}</p>
                {article.author.bio && (
                  <p className="text-xs text-muted-foreground">{article.author.bio}</p>
                )}
              </div>
            </div>

            {/* Date */}
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(article.published_at)}</span>
            </div>

            {/* Read Time */}
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{article.read_time} دقيقة قراءة</span>
            </div>

            {/* Views */}
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{article.views} مشاهدة</span>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <main className="container-custom max-w-4xl py-12">
        {/* Cover Image Placeholder */}
        {!isNotFound && (
          <div 
            className="aspect-video rounded-xl flex items-center justify-center mb-8"
            style={{ backgroundColor: article.category.color + '15' }}
          >
            <BookOpen className="w-20 h-20 text-primary/30" />
          </div>
        )}

        {/* Content */}
        <article className="prose prose-lg max-w-none mb-12">
          {renderContent(article.content)}
        </article>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-8 pt-8 border-t border-border">
            <span className="text-sm font-medium text-muted-foreground">الوسوم:</span>
            {article.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                #{tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Share Buttons */}
        <div className="bg-muted/30 rounded-xl p-6 mb-12">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="font-semibold mb-1">شارك المقال</h3>
              <p className="text-sm text-muted-foreground">ساعد الآخرين في اكتشاف هذا المحتوى</p>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleShare('twitter')}
                className="gap-1"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                تويتر
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleShare('facebook')}
                className="gap-1"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                فيسبوك
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleShare('linkedin')}
                className="gap-1"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                لينكد إن
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleShare('copy')}
                className="gap-1"
              >
                <Link2 className="w-4 h-4" />
                {copied ? 'تم!' : 'نسخ الرابط'}
              </Button>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <MessageCircle className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold">التعليقات ({mockComments.length})</h2>
          </div>

          {/* Comment Form Placeholder */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shrink-0">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <textarea
                    className="w-full min-h-24 p-3 rounded-lg border border-border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="اكتب تعليقك هنا..."
                  />
                  <div className="flex justify-end mt-3">
                    <Button>إرسال التعليق</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Comments List */}
          <div className="space-y-6">
            {mockComments.map((comment) => (
              <Card key={comment.id}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                      <User className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold">{comment.author}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatDateTime(comment.created_at)}
                        </span>
                      </div>
                      <p className="text-muted-foreground mb-4">{comment.content}</p>

                      {/* Replies */}
                      {comment.replies && comment.replies.length > 0 && (
                        <div className="space-y-4 me-6 border-s-2 border-border ps-4">
                          {comment.replies.map((reply) => (
                            <div key={reply.id} className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shrink-0">
                                <User className="w-4 h-4 text-white" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="font-semibold text-sm">{reply.author}</span>
                                  <span className="text-xs text-muted-foreground">
                                    {formatDateTime(reply.created_at)}
                                  </span>
                                </div>
                                <p className="text-sm text-muted-foreground">{reply.content}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Related Articles */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">مقالات ذات صلة</h2>
            <Link href="/blog">
              <Button variant="ghost" size="sm" className="gap-1">
                عرض الكل
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {relatedArticles.map((related) => (
              <Link key={related.id} href={`/blog/${related.slug}`}>
                <Card className="h-full hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group cursor-pointer overflow-hidden">
                  <div 
                    className="aspect-video flex items-center justify-center relative"
                    style={{ backgroundColor: related.category.color + '15' }}
                  >
                    <BookOpen className="w-10 h-10 text-primary/30 group-hover:text-primary/50 transition-colors" />
                    <Badge 
                      className="absolute top-3 start-3"
                      style={{ backgroundColor: related.category.color + '20', color: related.category.color }}
                    >
                      {related.category.name}
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-base mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {related.title}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{formatDate(related.published_at)}</span>
                      <span>•</span>
                      <span>{related.read_time} دقيقة</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
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
