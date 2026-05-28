// =============================================
// Tools Detail Page - Enhanced with Reviews
// Pricing Info, Alternatives, User Reviews
// =============================================

'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Sparkles,
  ExternalLink,
  BookOpen,
  Star,
  Users,
  CheckCircle2,
  ArrowRight,
  ChevronLeft,
  ThumbsUp,
  Filter,
  ArrowUpRight,
  Zap,
  MessageCircle,
  Loader2
} from 'lucide-react';

// Types
interface Tool {
  id: string;
  name: string;
  slug: string;
  description: string;
  long_description: string;
  logo_url: string | null;
  website_url: string;
  documentation_url: string;
  pricing_model: 'free' | 'freemium' | 'paid' | 'contact';
  monthly_price: number | null;
  category: { name: string; slug: string; color: string };
  tags: string[];
  features: string[];
  alternatives: string[];
  stats: { uses: number; rating: number; reviews: number };
  is_featured: boolean;
  is_verified: boolean;
}

interface Review {
  id: string;
  content: string;
  rating: number;
  author: { id: string; display_name: string; avatar_url?: string | null };
  created_at: string;
  helpful_count: number;
  is_helpful?: boolean;
}

// Mock data
const toolsData: Record<string, Tool> = {
  'chatgpt': {
    id: '1',
    name: 'ChatGPT',
    slug: 'chatgpt',
    description: 'نموذج لغوي متقدم من OpenAI للكتابة والمحادثة',
    long_description: 'ChatGPT هو مساعد ذكي يعتمد على نموذج GPT-4 من OpenAI، يوفر تجربة محادثة طبيعية مع القدرة على فهم السياق وتقديم إجابات دقيقة ومفصلة. يمكن استخدامه في مجموعة واسعة من المهام مثل الكتابة الإبداعية، التحليل، الترجمة، التلخيص، والإجابة على الأسئلة التقنية المعقدة. يتميز بقدرته على تعلم من المحادثات السابقة وتحسين استجاباته مع الوقت.',
    logo_url: null,
    website_url: 'https://chat.openai.com',
    documentation_url: 'https://platform.openai.com/docs',
    pricing_model: 'freemium',
    monthly_price: 20,
    category: { name: 'كتابة', slug: 'writing', color: '#10b981' },
    tags: ['نموذج لغوي', 'محادثة', 'كتابة', 'تحليل'],
    features: [
      'دعم أكثر من 50 لغة بما فيها العربية',
      'فهم السياق والحوار المستمر',
      'كتابة محتوى إبداعي ومقالات',
      'ترجمة ونصوص متعددة اللغات',
      'تلخيص مستندات طويلة',
      'مساعدة في البرمجة وكتابة الكود',
      'العصف الذهني والأفكار الإبداعية',
      'الإجابة على الأسئلة المعقدة'
    ],
    alternatives: ['claude', 'gemini', 'perplexity'],
    stats: { uses: 150000, rating: 4.8, reviews: 12500 },
    is_featured: true,
    is_verified: true
  },
  'midjourney': {
    id: '2',
    name: 'Midjourney',
    slug: 'midjourney',
    description: 'أداة توليد صور فنية مذهلة بالذكاء الاصطناعي',
    long_description: 'Midjourney هو أداة متقدمة لتوليد الصور باستخدام الذكاء الاصطناعي، تتميز بقدرتها على إنتاج صور فنية عالية الجودة من أوصاف نصية بسيطة. تدعم الأداة أنماط فنية متعددة تشمل الواقعية والتعبيرية والتجريدية، مع إمكانية التحكم في نسبة التفاصيل والجودة.',
    logo_url: null,
    website_url: 'https://midjourney.com',
    documentation_url: 'https://docs.midjourney.com',
    pricing_model: 'paid',
    monthly_price: 10,
    category: { name: 'تصميم', slug: 'design', color: '#ec4899' },
    tags: ['صور', 'فن', 'تصميم', 'AI Art'],
    features: [
      'توليد صور بجودة عالية جداً',
      'دعم أنماط فنية متعددة',
      'تحكم في نسبة التفاصيل',
      'إمكانية تحسين الصور الناتجة',
      'مجتمع فني نشط للتعلم',
      'دعم الطباعة بأحجام كبيرة',
      'أنماط متنوعة للفن الرقمي'
    ],
    alternatives: ['dall-e-3', 'stable-diffusion', 'adobe-firefly'],
    stats: { uses: 80000, rating: 4.7, reviews: 8200 },
    is_featured: true,
    is_verified: true
  },
  'claude': {
    id: '3',
    name: 'Claude',
    slug: 'claude',
    description: 'مساعد ذكي متقدم من Anthropic للتحليل والكتابة',
    long_description: 'Claude هو مساعد ذكي متطور من شركة Anthropic، يتميز بقدراته المتقدمة في التحليل والكتابة والتفكير المنطقي. يبني Claude علاقات أقوى مع المستخدمين من خلال فهم السياق بشكل أعمق وتقديم استجابات أكثر دقة وطبيعية.',
    logo_url: null,
    website_url: 'https://claude.ai',
    documentation_url: 'https://docs.anthropic.com',
    pricing_model: 'freemium',
    monthly_price: 20,
    category: { name: 'تحليل', slug: 'analysis', color: '#6366f1' },
    tags: ['مساعد ذكي', 'تحليل', 'كتابة', 'تفكير'],
    features: [
      'قدرات تحليلية متقدمة',
      'كتابة إبداعية ومقالات متخصصة',
      'فهم سياقي عميق',
      'مساعدة في البرمجة',
      'تحليل المستندات الطويلة',
      'حوار طبيعي ومتسلسل',
      'دعم العربية بشكل ممتاز',
      'أمان محسّن في المحادثات'
    ],
    alternatives: ['chatgpt', 'gemini', 'perplexity'],
    stats: { uses: 95000, rating: 4.9, reviews: 9800 },
    is_featured: true,
    is_verified: true
  },
};

// Mock reviews
const mockReviews: Record<string, Review[]> = {
  'chatgpt': [
    { id: '1', content: 'أفضل أداة استخدمتها للكتابة والتحليل. الواجهة سهلة جداً والنتائج ممتازة.', rating: 5, author: { id: '1', display_name: 'أحمد محمد', avatar_url: null }, created_at: '2025-05-28T10:30:00Z', helpful_count: 24 },
    { id: '2', content: 'ممتاز في البرمجة والكتابة. ساعدني في إنهاء مشاريعي بشكل أسرع بكثير.', rating: 5, author: { id: '2', display_name: 'سارة علي', avatar_url: null }, created_at: '2025-05-27T14:20:00Z', helpful_count: 18 },
    { id: '3', content: 'جيد لكن أحياناً يعطي معلومات غير دقيقة. يجب التحقق دائماً من النتائج.', rating: 4, author: { id: '3', display_name: 'محمد خالد', avatar_url: null }, created_at: '2025-05-26T09:15:00Z', helpful_count: 12 },
    { id: '4', content: 'أفضل بديل مجاني لـ Claude. النتائج قريبة جداً.', rating: 4, author: { id: '4', display_name: 'فاطمة أحمد', avatar_url: null }, created_at: '2025-05-25T16:45:00Z', helpful_count: 8 },
  ],
  'midjourney': [
    { id: '1', content: 'الصور الناتجة مذهلة! جودة عالية جداً.', rating: 5, author: { id: '1', display_name: 'منى سعيد', avatar_url: null }, created_at: '2025-05-28T11:00:00Z', helpful_count: 32 },
    { id: '2', content: 'ال مجتمع ممتاز والدعم رائع. تعلمت الكثير منه.', rating: 5, author: { id: '2', display_name: 'عمر يوسف', avatar_url: null }, created_at: '2025-05-27T08:30:00Z', helpful_count: 15 },
  ],
  'claude': [
    { id: '1', content: 'أفضل مساعد للكتابة والتحليل المعمق. يفهم السياق بشكل أفضل بكثير.', rating: 5, author: { id: '1', display_name: 'ليلى Hassan', avatar_url: null }, created_at: '2025-05-28T13:45:00Z', helpful_count: 28 },
    { id: '2', content: 'ممتاز في البرمجة. قدم لي حلول إبداعية لمشاكل صعبة.', rating: 5, author: { id: '2', display_name: 'ياسر Ibrahim', avatar_url: null }, created_at: '2025-05-27T10:20:00Z', helpful_count: 20 },
    { id: '3', content: 'السلامة ممتازة. لا يعطي معلومات ضارة أو مضللة.', rating: 5, author: { id: '3', display_name: 'نورا محمود', avatar_url: null }, created_at: '2025-05-26T15:00:00Z', helpful_count: 14 },
  ],
};

// Related tools data
const relatedToolsData = [
  { id: '1', name: 'ChatGPT', slug: 'chatgpt', description: 'نموذج لغوي متقدم للكتابة والتحليل', pricing: 'freemium', category: 'الكتابة', color: '#10b981' },
  { id: '3', name: 'Claude', slug: 'claude', description: 'مساعد ذكي للتحليل والكتابة', pricing: 'freemium', category: 'تحليل', color: '#6366f1' },
  { id: '11', name: 'Perplexity', slug: 'perplexity', description: 'محرك بحث ذكي', pricing: 'freemium', category: 'البحث', color: '#f59e0b' },
  { id: '5', name: 'DALL-E 3', slug: 'dall-e-3', description: 'توليد صور بالذكاء الاصطناعي', pricing: 'paid', category: 'التصميم', color: '#ec4899' },
];

// Helper functions
function getPricingLabel(model: string, price?: number | null) {
  switch (model) {
    case 'free': return { label: 'مجاني', badge: 'success' as const };
    case 'freemium': return { label: 'مجاني + مدفوع', badge: 'info' as const };
    case 'paid': return { label: price ? `${price}$/شهر` : 'مدفوع', badge: 'secondary' as const };
    case 'contact': return { label: 'تواصل', badge: 'outline' as const };
    default: return { label: model, badge: 'secondary' as const };
  }
}

function getPricingBadgeClass(pricing: string) {
  switch (pricing) {
    case 'free': return 'bg-green-100 text-green-700';
    case 'freemium': return 'bg-blue-100 text-blue-700';
    case 'paid': return 'bg-secondary-400/20 text-secondary-600';
    default: return 'bg-gray-100 text-gray-700';
  }
}

export default function ToolDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const tool = toolsData[slug] || toolsData['chatgpt'];
  const reviews = mockReviews[slug] || [];
  
  const pricing = getPricingLabel(tool.pricing_model, tool.monthly_price);
  const [copied, setCopied] = React.useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = React.useState(false);
  const [newReview, setNewReview] = React.useState('');
  const [newRating, setNewRating] = React.useState(5);
  const [localReviews, setLocalReviews] = React.useState<Review[]>(reviews);
  
  const alternatives = tool.alternatives.map(alt => toolsData[alt]).filter(Boolean);
  const relatedFiltered = relatedToolsData.filter(t => t.slug !== slug).slice(0, 4);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = tool.name;
    
    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`, '_blank');
        break;
    }
  };

  const handleMarkHelpful = (reviewId: string) => {
    setLocalReviews(reviews => 
      reviews.map(r => 
        r.id === reviewId 
          ? { ...r, is_helpful: !r.is_helpful, helpful_count: r.is_helpful ? r.helpful_count - 1 : r.helpful_count + 1 }
          : r
      )
    );
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.trim()) return;
    
    setIsSubmittingReview(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const review: Review = {
      id: Date.now().toString(),
      content: newReview,
      rating: newRating,
      author: { id: 'current', display_name: 'أنت' },
      created_at: new Date().toISOString(),
      helpful_count: 0,
    };
    
    setLocalReviews([review, ...localReviews]);
    setNewReview('');
    setNewRating(5);
    setIsSubmittingReview(false);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getInitials = (name: string) => name.charAt(0).toUpperCase();

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
              <Link href="/tools" className="text-sm font-medium text-primary">الأدوات</Link>
              <Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground">المدونة</Link>
              <Link href="/categories" className="text-sm text-muted-foreground hover:text-foreground">الفئات</Link>
            </nav>
            <div className="flex items-center gap-2">
              <Link href="/admin"><Button size="sm">الدخول للأدمن</Button></Link>
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="border-b border-border bg-muted/20">
        <div className="container-custom py-3">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">الرئيسية</Link>
            <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
            <Link href="/tools" className="hover:text-foreground">الأدوات</Link>
            <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
            <Link href={`/categories/${tool.category.slug}`} className="hover:text-foreground">
              {tool.category.name}
            </Link>
            <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
            <span className="text-foreground font-medium">{tool.name}</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="container-custom py-8">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-background to-secondary-50 rounded-3xl p-8 md:p-12 mb-8">
          <div className="absolute top-0 left-0 w-64 h-64 bg-primary-200 rounded-full blur-3xl opacity-30" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-secondary-200 rounded-full blur-3xl opacity-30" />
          
          <div className="relative flex flex-col lg:flex-row gap-8">
            {/* Tool Logo & Info */}
            <div className="flex-1">
              <div className="flex items-start gap-6">
                {/* Logo */}
                <div 
                  className="w-24 h-24 md:w-32 md:h-32 rounded-2xl flex items-center justify-center text-4xl md:text-5xl font-bold shadow-lg flex-shrink-0"
                  style={{ backgroundColor: tool.category.color + '20', color: tool.category.color }}
                >
                  {tool.name.charAt(0)}
                </div>
                
                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                    <h1 className="text-3xl md:text-4xl font-bold">{tool.name}</h1>
                    {tool.is_verified && (
                      <Badge variant="info" className="gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        موثق
                      </Badge>
                    )}
                    {tool.is_featured && (
                      <Badge variant="default" className="gap-1">
                        <Zap className="w-3 h-3" />
                        مميز
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-3 mb-4 flex-wrap">
                    <Badge 
                      variant="secondary" 
                      style={{ backgroundColor: tool.category.color + '20', color: tool.category.color }}
                    >
                      {tool.category.name}
                    </Badge>
                    <Badge variant={pricing.badge}>{pricing.label}</Badge>
                  </div>
                  
                  <p className="text-lg text-muted-foreground mb-6">{tool.description}</p>
                  
                  {/* Stats */}
                  <div className="flex items-center gap-6 flex-wrap">
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                      <span className="font-bold text-lg">{tool.stats.rating}</span>
                      <span className="text-muted-foreground">({tool.stats.reviews.toLocaleString()} تقييم)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-primary" />
                      <span className="font-bold">{tool.stats.uses.toLocaleString()}</span>
                      <span className="text-muted-foreground">مستخدم</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-5 h-5 text-primary" />
                      <span className="font-bold">{localReviews.length}</span>
                      <span className="text-muted-foreground">مراجعة</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="lg:w-80 flex flex-col gap-3">
              <a href={tool.website_url} target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="w-full gap-2">
                  <ExternalLink className="w-4 h-4" />
                  زيارة الموقع
                </Button>
              </a>
              <a href={tool.documentation_url} target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" className="w-full gap-2">
                  <BookOpen className="w-4 h-4" />
                  التوثيق
                </Button>
              </a>
              
              {/* Share */}
              <div className="flex items-center gap-2 mt-2">
                <span className="text-sm text-muted-foreground">مشاركة:</span>
                <button onClick={() => handleShare('twitter')} className="w-9 h-9 rounded-lg bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </button>
                <button onClick={() => handleShare('facebook')} className="w-9 h-9 rounded-lg bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </button>
                <button onClick={() => handleShare('linkedin')} className="w-9 h-9 rounded-lg bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </button>
                <button onClick={handleCopyLink} className="w-9 h-9 rounded-lg bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors">
                  {copied ? (
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                حول الأداة
              </h2>
              <Card>
                <CardContent className="p-6">
                  <p className="text-muted-foreground leading-relaxed">{tool.long_description}</p>
                </CardContent>
              </Card>
            </section>

            {/* Features Section */}
            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                المميزات
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {tool.features.map((feature, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4 flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Reviews Section */}
            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-primary" />
                المراجعات ({localReviews.length})
              </h2>

              {/* Write Review */}
              <Card className="mb-6">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">اكتب مراجعتك</h3>
                  <form onSubmit={handleSubmitReview} className="space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">التقييم:</span>
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setNewRating(star)}
                            className={`
                              w-8 h-8 transition-colors
                              ${star <= newRating 
                                ? 'text-yellow-400 fill-yellow-400' 
                                : 'text-muted-foreground'}
                            `}
                          >
                            <svg viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                          </button>
                        ))}
                      </div>
                    </div>
                    <textarea
                      value={newReview}
                      onChange={(e) => setNewReview(e.target.value)}
                      placeholder="اكتب مراجعتك عن هذه الأداة..."
                      className="w-full min-h-24 p-3 rounded-lg border border-border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    <div className="flex justify-end">
                      <Button type="submit" disabled={isSubmittingReview || !newReview.trim()}>
                        {isSubmittingReview && <Loader2 className="w-4 h-4 animate-spin ms-2" />}
                        إرسال المراجعة
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* Reviews List */}
              <div className="space-y-4">
                {localReviews.map((review) => (
                  <Card key={review.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-3">
                        <Avatar className="w-10 h-10 shrink-0">
                          {review.author.avatar_url ? (
                            <AvatarImage src={review.author.avatar_url} alt={review.author.display_name} />
                          ) : (
                            <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white">
                              {getInitials(review.author.display_name)}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">{review.author.display_name}</span>
                              <div className="flex items-center">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`w-4 h-4 ${star <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`}
                                  />
                                ))}
                              </div>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {formatDate(review.created_at)}
                            </span>
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-3">
                            {review.content}
                          </p>
                          
                          <button
                            onClick={() => handleMarkHelpful(review.id)}
                            className={`
                              flex items-center gap-1.5 text-xs transition-colors
                              ${review.is_helpful 
                                ? 'text-primary' 
                                : 'text-muted-foreground hover:text-foreground'}
                            `}
                          >
                            <ThumbsUp className={`w-4 h-4 ${review.is_helpful ? 'fill-current' : ''}`} />
                            <span>مفيد ({review.helpful_count})</span>
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Alternatives Section */}
            {alternatives.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <ArrowRight className="w-5 h-5 text-primary rtl:rotate-180" />
                  بدائل مشابهة
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {alternatives.map((alt) => alt && (
                    <Link key={alt.id} href={`/tools/${alt.slug}`}>
                      <Card className="hover:shadow-lg hover:-translate-y-1 transition-all group">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold"
                              style={{ backgroundColor: alt.category.color + '20', color: alt.category.color }}
                            >
                              {alt.name.charAt(0)}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold group-hover:text-primary transition-colors">{alt.name}</h3>
                              <p className="text-sm text-muted-foreground line-clamp-1">{alt.description}</p>
                            </div>
                            <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pricing Card */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary" />
                  التسعير
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-semibold">النموذج</p>
                      <p className="text-sm text-muted-foreground">
                        {tool.pricing_model === 'freemium' && 'مجاني مع باقة مدفوعة'}
                        {tool.pricing_model === 'free' && 'مجاني تماماً'}
                        {tool.pricing_model === 'paid' && 'مدفوع'}
                        {tool.pricing_model === 'contact' && 'تواصل للسعر'}
                      </p>
                    </div>
                    <Badge variant={pricing.badge}>{pricing.label}</Badge>
                  </div>
                  
                  {tool.monthly_price && (
                    <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                      <div>
                        <p className="font-semibold">الباقة المدفوعة</p>
                        <p className="text-sm text-muted-foreground">للاستخدام غير المحدود</p>
                      </div>
                      <span className="text-xl font-bold">{tool.monthly_price}$/شهر</span>
                    </div>
                  )}
                  
                  <a href={tool.website_url} target="_blank" rel="noopener noreferrer" className="block">
                    <Button className="w-full">ابدأ مجاناً</Button>
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Quick Info Card */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold mb-4">معلومات سريعة</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">الفئة</span>
                    <Badge 
                      variant="secondary"
                      style={{ backgroundColor: tool.category.color + '20', color: tool.category.color }}
                    >
                      {tool.category.name}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">التقييم</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="font-medium">{tool.stats.rating}/5</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">عدد التقييمات</span>
                    <span className="font-medium">{tool.stats.reviews.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">المستخدمون</span>
                    <span className="font-medium">{tool.stats.uses.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tags Card */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold mb-4">الوسوم</h3>
                <div className="flex flex-wrap gap-2">
                  {tool.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* External Links Card */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold mb-4">روابط مهمة</h3>
                <div className="space-y-3">
                  <a 
                    href={tool.website_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <ExternalLink className="w-4 h-4 text-primary" />
                      <span className="text-sm">الموقع الرسمي</span>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
                  </a>
                  <a 
                    href={tool.documentation_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <BookOpen className="w-4 h-4 text-primary" />
                      <span className="text-sm">التوثيق</span>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
                  </a>
                  <button 
                    onClick={handleCopyLink}
                    className="w-full flex items-center justify-between p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm">{copied ? 'تم النسخ!' : 'نسخ الرابط'}</span>
                    </div>
                    {copied && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Related Tools */}
        <section className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">أدوات ذات صلة</h2>
            <Link href="/tools">
              <Button variant="ghost" className="gap-2">
                عرض الكل
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </Button>
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedFiltered.map((relatedTool) => (
              <Link key={relatedTool.id} href={`/tools/${relatedTool.slug}`}>
                <Card className="h-full hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group cursor-pointer">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3 mb-3">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold"
                        style={{ backgroundColor: relatedTool.color + '20', color: relatedTool.color }}
                      >
                        {relatedTool.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm group-hover:text-primary transition-colors truncate">
                          {relatedTool.name}
                        </h3>
                        <Badge 
                          variant="secondary" 
                          className="mt-1 text-xs"
                          style={{ backgroundColor: relatedTool.color + '20', color: relatedTool.color }}
                        >
                          {relatedTool.category}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {relatedTool.description}
                    </p>
                    <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
                      <Badge 
                        variant={relatedTool.pricing === 'free' ? 'success' : relatedTool.pricing === 'freemium' ? 'info' : 'secondary'}
                        className="text-xs"
                      >
                        {relatedTool.pricing === 'free' ? 'مجاني' : relatedTool.pricing === 'freemium' ? 'مجاني + مدفوع' : 'مدفوع'}
                      </Badge>
                      <ChevronLeft className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors rtl:rotate-180" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
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
