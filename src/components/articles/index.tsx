// =============================================
// Article Components - Reading Time, Author, Related Articles
// =============================================

'use client';

import * as React from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Clock, 
  Calendar, 
  Eye, 
  User,
  ChevronLeft,
  BookOpen,
  Share2,
  MessageCircle,
  ArrowRight
} from 'lucide-react';

// ============================================================================
// Types
// ============================================================================

export interface ArticleAuthor {
  id: string;
  display_name: string;
  avatar_url?: string | null;
  bio?: string | null;
  username?: string | null;
}

export interface ArticleCategory {
  id: string;
  name: string;
  slug: string;
  color?: string | null;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content?: string | null;
  cover_image_url?: string | null;
  author: ArticleAuthor;
  category?: ArticleCategory | null;
  tags?: string[] | null;
  read_time: number;
  views?: number;
  published_at: string;
  featured?: boolean;
}

export interface RelatedArticle {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  category?: ArticleCategory | null;
  read_time: number;
  published_at: string;
  cover_image_url?: string | null;
}

// ============================================================================
// Reading Time Component
// ============================================================================

export interface ReadingTimeProps {
  minutes: number;
  showIcon?: boolean;
  className?: string;
}

export function ReadingTime({ minutes, showIcon = true, className = '' }: ReadingTimeProps) {
  const label = minutes === 1 ? 'دقيقة واحدة' : `${minutes} دقائق`;
  
  return (
    <span className={`inline-flex items-center gap-1 text-sm text-muted-foreground ${className}`}>
      {showIcon && <Clock className="w-4 h-4" />}
      <span>{minutes} دقيقة قراءة</span>
    </span>
  );
}

// ============================================================================
// Article Author Component
// ============================================================================

export interface ArticleAuthorProps {
  author: ArticleAuthor;
  date?: string;
  showBio?: boolean;
  size?: 'sm' | 'md' | 'lg';
  layout?: 'horizontal' | 'vertical';
}

export function ArticleAuthor({
  author,
  date,
  showBio = false,
  size = 'md',
  layout = 'horizontal',
}: ArticleAuthorProps) {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  const sizeClasses = {
    sm: { avatar: 'w-8 h-8', text: 'text-xs', icon: 'w-4 h-4' },
    md: { avatar: 'w-10 h-10', text: 'text-sm', icon: 'w-4 h-4' },
    lg: { avatar: 'w-12 h-12', text: 'text-base', icon: 'w-5 h-5' },
  };

  const classes = sizeClasses[size];

  return (
    <div className={`flex items-center ${layout === 'horizontal' ? 'gap-3' : 'flex-col gap-2'}`}>
      <Avatar className={classes.avatar}>
        {author.avatar_url ? (
          <AvatarImage src={author.avatar_url} alt={author.display_name} />
        ) : (
          <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white">
            {getInitials(author.display_name)}
          </AvatarFallback>
        )}
      </Avatar>

      <div className={layout === 'horizontal' ? '' : 'text-center'}>
        <p className={`font-semibold ${classes.text}`}>{author.display_name}</p>
        
        {date && (
          <div className="flex items-center gap-1 text-muted-foreground">
            <Calendar className={classes.icon} />
            <span className="text-xs">{formatDate(date)}</span>
          </div>
        )}

        {showBio && author.bio && (
          <p className="text-xs text-muted-foreground mt-1">{author.bio}</p>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// Article Meta Component (Full Meta Bar)
// ============================================================================

export interface ArticleMetaProps {
  author: ArticleAuthor;
  date: string;
  readTime: number;
  views?: number;
  commentsCount?: number;
  category?: ArticleCategory | null;
  size?: 'sm' | 'md' | 'lg';
}

export function ArticleMeta({
  author,
  date,
  readTime,
  views = 0,
  commentsCount = 0,
  category,
  size = 'md',
}: ArticleMetaProps) {
  const sizeClasses = {
    sm: 'text-xs gap-4',
    md: 'text-sm gap-6',
    lg: 'text-base gap-8',
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className={`flex flex-wrap items-center ${sizeClasses[size]} text-muted-foreground`}>
      {/* Author */}
      <ArticleAuthor author={author} date={date} size="sm" />

      {/* Separator */}
      <span className="hidden sm:block text-border">•</span>

      {/* Read Time */}
      <div className="flex items-center gap-1">
        <Clock className="w-4 h-4" />
        <span>{readTime} دقيقة</span>
      </div>

      {/* Views */}
      {views > 0 && (
        <>
          <span className="hidden sm:block text-border">•</span>
          <div className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            <span>{views.toLocaleString()} مشاهدة</span>
          </div>
        </>
      )}

      {/* Comments */}
      {commentsCount > 0 && (
        <>
          <span className="hidden sm:block text-border">•</span>
          <div className="flex items-center gap-1">
            <MessageCircle className="w-4 h-4" />
            <span>{commentsCount} تعليق</span>
          </div>
        </>
      )}

      {/* Category */}
      {category && (
        <>
          <span className="hidden sm:block text-border">•</span>
          <Link 
            href={`/categories/${category.slug}`}
            className="hover:text-foreground transition-colors"
            style={{ color: category.color || undefined }}
          >
            {category.name}
          </Link>
        </>
      )}
    </div>
  );
}

// ============================================================================
// Article Card Component
// ============================================================================

export interface ArticleCardProps {
  article: Article;
  variant?: 'default' | 'featured' | 'compact';
  showExcerpt?: boolean;
  showAuthor?: boolean;
  showCategory?: boolean;
  className?: string;
}

export function ArticleCard({
  article,
  variant = 'default',
  showExcerpt = true,
  showAuthor = true,
  showCategory = true,
  className = '',
}: ArticleCardProps) {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  const categoryColor = article.category?.color || '#6366f1';

  if (variant === 'compact') {
    return (
      <Link href={`/blog/${article.slug}`}>
        <Card className={`h-full hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group cursor-pointer ${className}`}>
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              {/* Cover */}
              <div 
                className="w-16 h-16 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: categoryColor + '15' }}
              >
                {article.cover_image_url ? (
                  <img src={article.cover_image_url} alt="" className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <BookOpen className="w-6 h-6 text-primary/40" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                {showCategory && article.category && (
                  <Badge 
                    className="mb-1 text-xs"
                    style={{ backgroundColor: categoryColor + '20', color: categoryColor }}
                  >
                    {article.category.name}
                  </Badge>
                )}
                <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
                  {article.title}
                </h3>
                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span>{article.read_time} دقيقة</span>
                  <span>•</span>
                  <span>{formatDate(article.published_at)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  }

  if (variant === 'featured') {
    return (
      <Link href={`/blog/${article.slug}`}>
        <Card className={`h-full hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group cursor-pointer overflow-hidden ${className}`}>
          {/* Cover Image */}
          <div 
            className="aspect-video flex items-center justify-center relative"
            style={{ backgroundColor: categoryColor + '15' }}
          >
            {article.cover_image_url ? (
              <img src={article.cover_image_url} alt="" className="w-full h-full object-cover" />
            ) : (
              <BookOpen className="w-16 h-16 text-primary/30 group-hover:text-primary/50 transition-colors" />
            )}
            
            {showCategory && article.category && (
              <Badge 
                className="absolute top-4 start-4"
                style={{ backgroundColor: categoryColor + '20', color: categoryColor }}
              >
                {article.category.name}
              </Badge>
            )}
          </div>

          <CardContent className="p-6">
            <h2 className="font-bold text-xl mb-3 line-clamp-2 group-hover:text-primary transition-colors">
              {article.title}
            </h2>
            
            {showExcerpt && article.excerpt && (
              <p className="text-muted-foreground line-clamp-2 mb-4">
                {article.excerpt}
              </p>
            )}

            <div className="flex items-center justify-between">
              {showAuthor && (
                <div className="flex items-center gap-2">
                  <Avatar className="w-6 h-6">
                    {article.author.avatar_url ? (
                      <AvatarImage src={article.author.avatar_url} />
                    ) : (
                      <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-xs">
                        {getInitials(article.author.display_name)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <span className="text-sm text-muted-foreground">{article.author.display_name}</span>
                </div>
              )}

              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>{formatDate(article.published_at)}</span>
                <span>•</span>
                <span>{article.read_time} دقيقة</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  }

  // Default variant
  return (
    <Link href={`/blog/${article.slug}`}>
      <Card className={`h-full hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group cursor-pointer overflow-hidden ${className}`}>
        {/* Cover Image */}
        <div 
          className="aspect-video flex items-center justify-center relative"
          style={{ backgroundColor: categoryColor + '15' }}
        >
          {article.cover_image_url ? (
            <img src={article.cover_image_url} alt="" className="w-full h-full object-cover" />
          ) : (
            <BookOpen className="w-10 h-10 text-primary/30 group-hover:text-primary/50 transition-colors" />
          )}
          
          {showCategory && article.category && (
            <Badge 
              className="absolute top-3 start-3"
              style={{ backgroundColor: categoryColor + '20', color: categoryColor }}
            >
              {article.category.name}
            </Badge>
          )}
        </div>

        <CardContent className="p-5">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {article.title}
          </h3>
          
          {showExcerpt && article.excerpt && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
              {article.excerpt}
            </p>
          )}

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            {showAuthor && (
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{formatDate(article.published_at)}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{article.read_time} دقيقة</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

// ============================================================================
// Related Articles Component
// ============================================================================

export interface RelatedArticlesProps {
  articles: RelatedArticle[];
  title?: string;
  showViewAll?: boolean;
  viewAllHref?: string;
  columns?: 2 | 3 | 4;
}

export function RelatedArticles({
  articles,
  title = 'مقالات ذات صلة',
  showViewAll = true,
  viewAllHref = '/blog',
  columns = 3,
}: RelatedArticlesProps) {
  if (articles.length === 0) return null;

  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <section className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          {title}
        </h2>
        
        {showViewAll && (
          <Link href={viewAllHref}>
            <Badge variant="ghost" className="gap-1 cursor-pointer hover:bg-muted">
              عرض الكل
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </Badge>
          </Link>
        )}
      </div>

      <div className={`grid ${gridCols[columns]} gap-6`}>
        {articles.slice(0, columns === 4 ? 4 : 3).map((article) => {
          const categoryColor = article.category?.color || '#6366f1';
          
          return (
            <Link key={article.id} href={`/blog/${article.slug}`}>
              <Card className="h-full hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group cursor-pointer overflow-hidden">
                <div 
                  className="aspect-video flex items-center justify-center relative"
                  style={{ backgroundColor: categoryColor + '15' }}
                >
                  {article.cover_image_url ? (
                    <img src={article.cover_image_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <BookOpen className="w-10 h-10 text-primary/30 group-hover:text-primary/50 transition-colors" />
                  )}
                  {article.category && (
                    <Badge 
                      className="absolute top-3 start-3 text-xs"
                      style={{ backgroundColor: categoryColor + '20', color: categoryColor }}
                    >
                      {article.category.name}
                    </Badge>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-base mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {article.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>{article.read_time} دقيقة</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

// ============================================================================
// Article Content Renderer
// ============================================================================

export interface ArticleContentProps {
  content: string;
  className?: string;
}

export function ArticleContent({ content, className = '' }: ArticleContentProps) {
  const renderContent = React.useMemo(() => {
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
      if (trimmed.startsWith('#### ')) {
        return <h4 key={index} className="text-lg font-semibold mt-4 mb-2 text-foreground">{trimmed.slice(5)}</h4>;
      }
      
      // Blockquote
      if (trimmed.startsWith('> ')) {
        return (
          <blockquote key={index} className="border-s-4 border-primary ps-4 my-4 text-muted-foreground italic">
            {trimmed.slice(2)}
          </blockquote>
        );
      }
      
      // Unordered list
      if (trimmed.startsWith('- ')) {
        return <li key={index} className="mr-6 mb-2 text-muted-foreground">{trimmed.slice(2)}</li>;
      }
      
      // Ordered list
      if (/^\d+\.\s/.test(trimmed)) {
        return <li key={index} className="mr-6 mb-2 text-muted-foreground list-decimal">{trimmed.replace(/^\d+\.\s/, '')}</li>;
      }
      
      // Code blocks
      if (trimmed.startsWith('```')) {
        return null; // Handle code blocks separately if needed
      }
      
      // Horizontal rule
      if (trimmed === '---') {
        return <hr key={index} className="my-8 border-border" />;
      }
      
      // Bold text markers (simple markdown)
      if (trimmed.startsWith('**') && trimmed.endsWith('**') && trimmed.length > 4) {
        return <p key={index} className="font-semibold mb-2">{trimmed.slice(2, -2)}</p>;
      }
      
      // Default paragraph
      return <p key={index} className="text-muted-foreground leading-relaxed mb-4">{trimmed}</p>;
    });
  }, [content]);

  return (
    <article className={`prose prose-lg max-w-none ${className}`}>
      {renderContent}
    </article>
  );
}

// ============================================================================
// Share Buttons Component
// ============================================================================

export interface ShareButtonsProps {
  title: string;
  url?: string;
  className?: string;
}

export function ShareButtons({ title, url, className = '' }: ShareButtonsProps) {
  const [copied, setCopied] = React.useState(false);
  
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  
  const handleShare = (platform: string) => {
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedTitle = encodeURIComponent(title);
    
    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`);
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`);
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`);
        break;
      case 'copy':
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        break;
    }
  };

  return (
    <div className={`bg-muted/30 rounded-xl p-6 ${className}`}>
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h3 className="font-semibold mb-1">شارك المقال</h3>
          <p className="text-sm text-muted-foreground">ساعد الآخرين في اكتشاف هذا المحتوى</p>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleShare('twitter')}
            className="w-9 h-9 rounded-lg bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
            aria-label="مشاركة على تويتر"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </button>
          
          <button
            onClick={() => handleShare('facebook')}
            className="w-9 h-9 rounded-lg bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
            aria-label="مشاركة على فيسبوك"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </button>
          
          <button
            onClick={() => handleShare('linkedin')}
            className="w-9 h-9 rounded-lg bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
            aria-label="مشاركة على لينكد إن"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </button>
          
          <button
            onClick={() => handleShare('copy')}
            className="w-9 h-9 rounded-lg bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
            aria-label="نسخ الرابط"
          >
            {copied ? (
              <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}


