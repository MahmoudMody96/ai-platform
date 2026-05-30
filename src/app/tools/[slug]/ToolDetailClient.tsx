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
  Loader2
} from 'lucide-react';

interface Tool {
  id: string;
  name: string;
  slug: string;
  tagline: string | null;
  description: string | null;
  website_url: string;
  logo_url: string | null;
  pricing_type: 'free' | 'freemium' | 'paid' | 'enterprise' | 'contact';
  starting_price: number | null;
  pricing_currency: string;
  tags: string[];
  features: { title: string; desc: string }[];
  rating_avg: number;
  rating_count: number;
  views_count: number;
  is_featured: boolean;
  is_verified: boolean;
  created_at: string;
  category: {
    id: string;
    name: string;
    slug: string;
    color: string;
  } | null;
  recent_reviews: Array<{
    id: string;
    rating: number;
    title: string | null;
    content: string | null;
    pros: string[];
    cons: string[];
    created_at: string;
    author: {
      id: string;
      display_name: string;
      avatar_url: string | null;
    };
    helpful_count: number;
  }>;
  alternatives: Array<{
    id: string;
    name: string;
    slug: string;
    tagline: string | null;
    logo_url: string | null;
    pricing_type: string;
    rating_avg: number;
    category: { name: string; color: string } | null;
  }>;
  stats: {
    rating_avg: number;
    rating_count: number;
    rating_breakdown: Record<number, number>;
  };
}

interface ToolDetailClientProps {
  tool: Tool;
}

export function ToolDetailClient({ tool }: ToolDetailClientProps) {
  const params = useParams();
  const slug = params.slug as string;
  
  const [copied, setCopied] = React.useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = React.useState(false);
  const [newReview, setNewReview] = React.useState('');
  const [newRating, setNewRating] = React.useState(5);
  const [localReviews, setLocalReviews] = React.useState(tool.recent_reviews);
  
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

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.trim()) return;
    
    setIsSubmittingReview(true);
    
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tool_id: tool.id,
          rating: newRating,
          content: newReview,
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setLocalReviews([data.data.review, ...localReviews]);
        setNewReview('');
        setNewRating(5);
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getInitials = (name: string) => name.charAt(0).toUpperCase();

  const getPricingLabel = (model: string, price?: number | null) => {
    switch (model) {
      case 'free': return { label: 'مجاني', badge: 'success' as const };
      case 'freemium': return { label: 'مجاني + مدفوع', badge: 'info' as const };
      case 'paid': return { label: price ? `${price}$/شهر` : 'مدفوع', badge: 'secondary' as const };
      case 'enterprise': return { label: 'للشركات', badge: 'outline' as const };
      case 'contact': return { label: 'تواصل', badge: 'outline' as const };
      default: return { label: model, badge: 'secondary' as const };
    }
  };

  const pricing = getPricingLabel(tool.pricing_type, tool.starting_price);

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
            {tool.category && (
              <>
                <Link href={`/tools?category=${tool.category.slug}`} className="hover:text-foreground">
                  {tool.category.name}
                </Link>
                <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
              </>
            )}
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
                <div 
                  className="w-24 h-24 md:w-32 md:h-32 rounded-2xl flex items-center justify-center text-4xl md:text-5xl font-bold shadow-lg flex-shrink-0"
                  style={{ backgroundColor: (tool.category?.color || '#6366f1') + '20', color: tool.category?.color || '#6366f1' }}
                >
                  {tool.logo_url ? (
                    <img src={tool.logo_url} alt={tool.name} className="w-16 h-16" />
                  ) : (
                    tool.name.charAt(0)
                  )}
                </div>
                
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
                        <Sparkles className="w-3 h-3" />
                        مميز
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-3 mb-4 flex-wrap">
                    {tool.category && (
                      <Badge 
                        variant="secondary" 
                        style={{ backgroundColor: tool.category.color + '20', color: tool.category.color }}
                      >
                        {tool.category.name}
                      </Badge>
                    )}
                    <Badge variant={pricing.badge}>{pricing.label}</Badge>
                  </div>
                  
                  <p className="text-lg text-muted-foreground mb-6">{tool.tagline || tool.description}</p>
                  
                  {/* Stats */}
                  <div className="flex items-center gap-6 flex-wrap">
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                      <span className="font-bold text-lg">{tool.rating_avg}</span>
                      <span className="text-muted-foreground">({tool.rating_count} تقييم)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-primary" />
                      <span className="font-bold">{tool.views_count.toLocaleString()}</span>
                      <span className="text-muted-foreground">مشاهدة</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-primary" />
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
            {tool.description && (
              <section>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  حول الأداة
                </h2>
                <Card>
                  <CardContent className="p-6">
                    <p className="text-muted-foreground leading-relaxed">{tool.description}</p>
                  </CardContent>
                </Card>
              </section>
            )}

            {/* Features Section */}
            {tool.features && tool.features.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  المميزات
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {tool.features.map((feature, index) => (
                    <Card key={index} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4 flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold">{feature.title}</span>
                          {feature.desc && <p className="text-sm text-muted-foreground">{feature.desc}</p>}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}

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
                            className={`w-8 h-8 transition-colors ${star <= newRating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`}
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
                      placeholder="اكتب مراجعتك عن هذه الأداة... (50 حرف على الأقل)"
                      className="w-full min-h-24 p-3 rounded-lg border border-border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    <div className="flex justify-end">
                      <Button type="submit" disabled={isSubmittingReview || newReview.length < 50}>
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
                          
                          {review.title && <p className="font-medium mb-2">{review.title}</p>}
                          
                          <p className="text-sm text-muted-foreground mb-3">
                            {review.content}
                          </p>
                          
                          {(review.pros?.length > 0 || review.cons?.length > 0) && (
                            <div className="flex flex-wrap gap-2 mb-3">
                              {review.pros?.map((pro, i) => (
                                <Badge key={`pro-${i}`} variant="success" className="text-xs">
                                  + {pro}
                                </Badge>
                              ))}
                              {review.cons?.map((con, i) => (
                                <Badge key={`con-${i}`} variant="destructive" className="text-xs">
                                  - {con}
                                </Badge>
                              ))}
                            </div>
                          )}
                          
                          <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors">
                            <ThumbsUp className="w-4 h-4" />
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
            {tool.alternatives && tool.alternatives.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <ArrowRight className="w-5 h-5 text-primary rtl:rotate-180" />
                  بدائل مشابهة
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {tool.alternatives.map((alt) => (
                    <Link key={alt.id} href={`/tools/${alt.slug}`}>
                      <Card className="hover:shadow-lg hover:-translate-y-1 transition-all group">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold"
                              style={{ backgroundColor: (alt.category?.color || '#6366f1') + '20', color: alt.category?.color || '#6366f1' }}
                            >
                              {alt.logo_url ? (
                                <img src={alt.logo_url} alt={alt.name} className="w-8 h-8" />
                              ) : (
                                alt.name.charAt(0)
                              )}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold group-hover:text-primary transition-colors">{alt.name}</h3>
                              <p className="text-sm text-muted-foreground line-clamp-1">{alt.tagline}</p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors rtl:rotate-180" />
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
                  <Sparkles className="w-5 h-5 text-primary" />
                  التسعير
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-semibold">النموذج</p>
                      <p className="text-sm text-muted-foreground">
                        {tool.pricing_type === 'freemium' && 'مجاني مع باقة مدفوعة'}
                        {tool.pricing_type === 'free' && 'مجاني تماماً'}
                        {tool.pricing_type === 'paid' && 'مدفوع'}
                        {tool.pricing_type === 'enterprise' && 'للشركات'}
                        {tool.pricing_type === 'contact' && 'تواصل للسعر'}
                      </p>
                    </div>
                    <Badge variant={pricing.badge}>{pricing.label}</Badge>
                  </div>
                  
                  {tool.starting_price && (
                    <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                      <div>
                        <p className="font-semibold">الباقة المدفوعة</p>
                        <p className="text-sm text-muted-foreground">للاستخدام غير المحدود</p>
                      </div>
                      <span className="text-xl font-bold">{tool.starting_price}$/شهر</span>
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
                  {tool.category && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">الفئة</span>
                      <Badge 
                        variant="secondary"
                        style={{ backgroundColor: tool.category.color + '20', color: tool.category.color }}
                      >
                        {tool.category.name}
                      </Badge>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">التقييم</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="font-medium">{tool.rating_avg}/5</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">عدد التقييمات</span>
                    <span className="font-medium">{tool.rating_count}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">المشاهدات</span>
                    <span className="font-medium">{tool.views_count.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tags Card */}
            {tool.tags && tool.tags.length > 0 && (
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
            )}

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
                    <ArrowRight className="w-4 h-4 text-muted-foreground rtl:rotate-180" />
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