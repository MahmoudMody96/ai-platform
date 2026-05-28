'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Star, 
  ExternalLink, 
  Clock, 
  Users, 
  Globe,
  CheckCircle,
  XCircle,
  ChevronRight,
  Sparkles,
  Share2,
  Bookmark,
  ArrowLeft
} from 'lucide-react';

// بيانات وهمية - في الإنتاج هتكون من Supabase
const allTools = [
  { 
    id: '1', 
    name: 'ChatGPT', 
    description: 'نموذج لغوي متقدم للكتابة والتحليل', 
    fullDescription: 'ChatGPT هو نموذج لغوي متقدم طورته OpenAI يستخدم تقنية GPT-4. يقدر يساعدك في كتابة المقالات، تحليل البيانات، ترجمة النصوص، كتابة الأكواد البرمجية، والإجابة على أسئلتك بمختلف اللغات.',
    pricing: 'freemium', 
    rating: 4.8, 
    reviews: 2847,
    category: 'الكتابة',
    url: 'https://chat.openai.com', 
    featured: true,
    createdAt: '2023-01-01',
    lastUpdated: '2024-03-15',
    features: [
      'كتابة مقالات ومحتوى إبداعي',
      'تحليل البيانات والنصوص',
      'ترجمة بين أكثر من 100 لغة',
      'كتابة أكواد برمجية',
      'الإجابة على الأسئلة المعقدة',
      'مساعدة في البحث العلمي'
    ],
    pros: [
      'سهل الاستخدام',
      'يدعم العربية',
      'مجاني للتجربة',
      'يتعلم من المحادثات'
    ],
    cons: [
      'قد يعطي معلومات غير دقيقة',
      'المعرفة محدودة بـ 2024',
      'النسخة المجانية أبطأ'
    ],
    relatedTools: ['2', '3', '7']
  },
  { 
    id: '2', 
    name: 'Midjourney', 
    description: 'توليد صور فنية مذهلة بالذكاء الاصطناعي', 
    fullDescription: 'Midjourney هو أداة قوية لتوليد الصور باستخدام الذكاء الاصطناعي. يمكنك إنشاء صور فنية مذهلة من وصف نصي بسيط.',
    pricing: 'paid', 
    rating: 4.7, 
    reviews: 1523,
    category: 'التصميم',
    url: 'https://midjourney.com', 
    featured: true,
    createdAt: '2022-07-01',
    lastUpdated: '2024-03-10',
    features: [
      'توليد صور فنية عالية الجودة',
      'دعم أنماط فنية متنوعة',
      'تحسين الصور الناتجة',
      'مشاركة المجتمع'
    ],
    pros: ['جودة عالية', 'أنماط متعددة'],
    cons: ['مدفوع', 'يحتاج Discord'],
    relatedTools: ['5', '8']
  },
  { 
    id: '3', 
    name: 'Claude', 
    description: 'مساعد ذكي للتحليل والكتابة والإبداع', 
    fullDescription: 'Claude هو مساعد ذكي طورته Anthropic معروف بأخلاقياته العالية وقدراته المتقدمة.',
    pricing: 'freemium', 
    rating: 4.9, 
    reviews: 3421,
    category: 'الكتابة',
    url: 'https://claude.ai', 
    featured: true,
    createdAt: '2023-03-01',
    lastUpdated: '2024-03-12',
    features: ['تحليل النصوص', 'كتابة إبداعية', 'قراءة الملفات'],
    pros: ['آمن', 'دعم طويل', 'يفهم السياق'],
    cons: ['نسخة محدودة'],
    relatedTools: ['1', '7']
  },
  { 
    id: '4', 
    name: 'GitHub Copilot', 
    description: 'مساعد برمجة بالذكاء الاصطناعي', 
    fullDescription: 'GitHub Copilot يساعد المطورين في كتابة الأكواد بشكل أسرع.',
    pricing: 'paid', 
    rating: 4.6, 
    reviews: 4521,
    category: 'التطوير',
    url: 'https://github.com/features/copilot', 
    featured: false,
    createdAt: '2022-06-01',
    lastUpdated: '2024-02-28',
    features: ['اكمال الأكواد', 'اقتراح حلول', 'كتابة اختبارات'],
    pros: ['سريع', 'يدعم عدة لغات'],
    cons: ['مدفوع', 'ليس مثالياً دائماً'],
    relatedTools: ['11']
  },
  { 
    id: '5', 
    name: 'DALL-E 3', 
    description: 'توليد صور واقعية من النصوص', 
    fullDescription: 'DALL-E 3 يولّد صور واقعية ومبتكرة من أوصاف نصية.',
    pricing: 'paid', 
    rating: 4.7, 
    reviews: 2156,
    category: 'التصميم',
    url: 'https://openai.com/dall-e-3', 
    featured: true,
    createdAt: '2023-09-01',
    lastUpdated: '2024-03-08',
    features: ['جودة عالية', 'فهم النص', 'تعديل الصور'],
    pros: ['واقعي', 'دقيق'],
    cons: ['مكلف', 'بطيء أحياناً'],
    relatedTools: ['2', '8']
  },
  { 
    id: '6', 
    name: 'ElevenLabs', 
    description: 'أصوات AI واقعية للنصوص والكلام', 
    fullDescription: 'ElevenLabs ينشئ أصوات بشرية واقعية من النصوص.',
    pricing: 'freemium', 
    rating: 4.8, 
    reviews: 1876,
    category: 'الصوت',
    url: 'https://elevenlabs.io', 
    featured: false,
    createdAt: '2023-01-01',
    lastUpdated: '2024-03-14',
    features: ['أصوات طبيعية', 'دعم العربية', 'استنساخ الصوت'],
    pros: ['واقعي جداً', 'يدعم العربية'],
    cons: ['مجاني محدود'],
    relatedTools: ['10']
  },
  { 
    id: '7', 
    name: 'Notion AI', 
    description: 'مساعد ذكي للعملاء وكتابة النصوص', 
    fullDescription: 'Notion AI مساعدك الذكي داخل Notion.',
    pricing: 'paid', 
    rating: 4.5, 
    reviews: 2341,
    category: 'الكتابة',
    url: 'https://notion.so', 
    featured: false,
    createdAt: '2022-11-01',
    lastUpdated: '2024-03-01',
    features: ['تلخيص', 'كتابة', 'ترجمة'],
    pros: ['متكامل مع Notion'],
    cons: ['يحتاج Notion'],
    relatedTools: ['1', '3']
  },
  { 
    id: '8', 
    name: 'Canva AI', 
    description: 'تصميم جرافيك بالذكاء الاصطناعي', 
    fullDescription: 'Canva AI يضيف قوة الذكاء الاصطناعي لتصميم الجرافيك.',
    pricing: 'freemium', 
    rating: 4.4, 
    reviews: 5678,
    category: 'التصميم',
    url: 'https://canva.com', 
    featured: false,
    createdAt: '2023-02-01',
    lastUpdated: '2024-03-10',
    features: ['قوالب', 'توليد صور', 'حذف خلفيات'],
    pros: ['سهل', 'مجاني'],
    cons: ['أقل مرونة'],
    relatedTools: ['2', '5']
  },
  { 
    id: '9', 
    name: 'Jasper', 
    description: 'كتابة محتوى تسويقي بالذكاء الاصطناعي', 
    fullDescription: 'Jasper مساعد متخصص في كتابة المحتوى التسويقي.',
    pricing: 'paid', 
    rating: 4.3, 
    reviews: 1234,
    category: 'التسويق',
    url: 'https://jasper.ai', 
    featured: false,
    createdAt: '2022-08-01',
    lastUpdated: '2024-02-25',
    features: ['كتابة إعلانية', 'محتوى سوشيال ميديا'],
    pros: ['متخصص'],
    cons: ['مكلف'],
    relatedTools: ['7', '1']
  },
  { 
    id: '10', 
    name: 'Runway', 
    description: 'توليد وتحرير فيديوهات بالذكاء الاصطناعي', 
    fullDescription: 'Runway منصة متكاملة لتحرير وتوليد الفيديو بالـ AI.',
    pricing: 'paid', 
    rating: 4.6, 
    reviews: 987,
    category: 'الفيديو',
    url: 'https://runwayml.com', 
    featured: false,
    createdAt: '2023-04-01',
    lastUpdated: '2024-03-05',
    features: ['توليد فيديو', 'حذف خلفيات', 'تأثيرات'],
    pros: ['قوي', 'متطور'],
    cons: ['مكلف', 'يحتاج تعلم'],
    relatedTools: ['6', '8']
  },
  { 
    id: '11', 
    name: 'Perplexity', 
    description: 'محرك بحث ذكي بالإجابات المباشرة', 
    fullDescription: 'Perplexity محرك بحث يستخدم AI للإجابة المباشرة.',
    pricing: 'freemium', 
    rating: 4.7, 
    reviews: 3456,
    category: 'البحث',
    url: 'https://perplexity.ai', 
    featured: false,
    createdAt: '2023-01-01',
    lastUpdated: '2024-03-15',
    features: ['إجابات مباشرة', 'مصادر', 'متابعة'],
    pros: ['سريع', 'موثوق'],
    cons: ['ليس مثالياً'],
    relatedTools: ['1', '4']
  },
  { 
    id: '12', 
    name: 'Gamma', 
    description: 'عروض تقديمية احترافية بالذكاء الاصطناعي', 
    fullDescription: 'Gamma ينشئ عروض تقديمية احترافية من نصوص بسيطة.',
    pricing: 'freemium', 
    rating: 4.5, 
    reviews: 1567,
    category: 'العروض',
    url: 'https://gamma.app', 
    featured: false,
    createdAt: '2023-05-01',
    lastUpdated: '2024-03-12',
    features: ['قوالب', 'نصوص AI', 'تصدير'],
    pros: ['سهل', 'جميل'],
    cons: ['خيارات محدودة'],
    relatedTools: ['7', '9']
  },
];

// Mock reviews
const mockReviews = [
  { id: '1', user: 'أحمد م.', rating: 5, date: '2024-03-10', text: 'أداة ممتازة! ساعدتني في كتابة مقالاتي بسرعة.' },
  { id: '2', user: 'سارة ع.', rating: 4, date: '2024-03-08', text: 'جيد جداً لكن أحياناً يخطئ في المعلومات.' },
  { id: '3', user: 'محمد ك.', rating: 5, date: '2024-03-05', text: 'أفضل أداة استخدمتها للبحث.' },
];

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('ar-EG');
}

function ToolNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">الأداة غير موجودة</h1>
        <Link href="/tools">
          <Button>العودة للأدوات</Button>
        </Link>
      </div>
    </div>
  );
}

export default function ToolDetailPage() {
  const params = useParams();
  const router = useRouter();
  const toolId = params.id as string;
  
  const tool = allTools.find(t => t.id === toolId);
  const relatedTools = tool ? allTools.filter(t => tool.relatedTools.includes(t.id)) : [];

  if (!tool) {
    return <ToolNotFound />;
  }

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
            <Link href="/admin"><Button size="sm">الدخول للأدمن</Button></Link>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="bg-muted/50 py-4">
        <div className="container-custom">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">الرئيسية</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/tools" className="hover:text-foreground">الأدوات</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground">{tool.name}</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="container-custom py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Tool Header */}
            <Card>
              <CardContent className="p-8">
                <div className="flex items-start gap-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center text-4xl font-bold text-primary">
                    {tool.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-3xl font-bold">{tool.name}</h1>
                      {tool.featured && <Badge variant="default">مميز</Badge>}
                    </div>
                    <p className="text-lg text-muted-foreground mb-4">{tool.description}</p>
                    <div className="flex flex-wrap items-center gap-4">
                      {getPricingBadge(tool.pricing)}
                      <Badge variant="outline">{tool.category}</Badge>
                      <div className="flex items-center gap-1">
                        <Star className="w-5 h-5 text-accent fill-accent" />
                        <span className="font-semibold">{tool.rating}</span>
                        <span className="text-muted-foreground">({tool.reviews.toLocaleString()} تقييم)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-border">
                  <a href={tool.url} target="_blank" rel="noopener noreferrer">
                    <Button className="gap-2">
                      <Globe className="w-4 h-4" />
                      زيارة الموقع
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  </a>
                  <Button variant="outline" className="gap-2">
                    <Bookmark className="w-4 h-4" />
                    حفظ
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Share2 className="w-4 h-4" />
                    مشاركة
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList>
                <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
                <TabsTrigger value="features">المميزات</TabsTrigger>
                <TabsTrigger value="reviews">التقييمات</TabsTrigger>
                <TabsTrigger value="related">أدوات مشابهة</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <Card>
                  <CardHeader>
                    <CardTitle>عن الأداة</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <p className="text-lg leading-relaxed">{tool.fullDescription}</p>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 text-sm">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">تاريخ الإضافة:</span>
                        <span>{formatDate(tool.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">آخر تحديث:</span>
                        <span>{formatDate(tool.lastUpdated)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="features">
                <Card>
                  <CardHeader>
                    <CardTitle>المميزات</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {tool.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews">
                <Card>
                  <CardHeader>
                    <CardTitle>التقييمات ({tool.reviews.toLocaleString()})</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {mockReviews.map((review) => (
                      <div key={review.id} className="pb-6 border-b border-border last:border-0 last:pb-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{review.user}</span>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`w-4 h-4 ${i < review.rating ? 'text-accent fill-accent' : 'text-muted'}`} 
                                />
                              ))}
                            </div>
                          </div>
                          <span className="text-sm text-muted-foreground">{formatDate(review.date)}</span>
                        </div>
                        <p className="text-muted-foreground">{review.text}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="related">
                <Card>
                  <CardHeader>
                    <CardTitle>أدوات مشابهة</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      {relatedTools.map((relatedTool) => (
                        <Link 
                          key={relatedTool.id} 
                          href={`/tools/${relatedTool.id}`}
                          className="flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                        >
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center text-xl font-bold text-primary">
                            {relatedTool.name.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold hover:text-primary">{relatedTool.name}</h4>
                            <p className="text-sm text-muted-foreground">{relatedTool.description}</p>
                          </div>
                          <ChevronRight className="w-5 h-5 text-muted-foreground" />
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pros & Cons */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">المميزات والعيوب</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-5 h-5" />
                    المميزات
                  </h4>
                  <ul className="space-y-2">
                    {tool.pros.map((pro, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2 text-red-600">
                    <XCircle className="w-5 h-5" />
                    العيوب
                  </h4>
                  <ul className="space-y-2">
                    {tool.cons.map((con, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">إحصائيات</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">التقييم</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-accent fill-accent" />
                    <span className="font-semibold">{tool.rating}/5</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">عدد التقييمات</span>
                  <span className="font-semibold">{tool.reviews.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">الفئة</span>
                  <Badge variant="outline">{tool.category}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">نوع التسعير</span>
                  {getPricingBadge(tool.pricing)}
                </div>
              </CardContent>
            </Card>

            {/* Back Button */}
            <Link href="/tools">
              <Button variant="outline" className="w-full gap-2">
                <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
                العودة للأدوات
              </Button>
            </Link>
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
