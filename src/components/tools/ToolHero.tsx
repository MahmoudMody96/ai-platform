// =============================================
// ToolDetail - Hero section
// =============================================

import * as React from 'react';
import { Star, Users, ExternalLink, Sparkles, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getShareUrl, getPricingLabel } from './utils';
import type { ToolDetail, ToolReview } from './types';

interface ToolHeroProps {
  tool: ToolDetail;
  localReviewCount: number;
  onCopyLink: () => void;
  copied: boolean;
}

export function ToolHero({ tool, localReviewCount, onCopyLink, copied }: ToolHeroProps) {
  const pricing = getPricingLabel(tool.pricing_type, tool.starting_price);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-background to-secondary-50 rounded-3xl p-8 md:p-12 mb-8">
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary-200 rounded-full blur-3xl opacity-30" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-secondary-200 rounded-full blur-3xl opacity-30" />

      <div className="relative flex flex-col lg:flex-row gap-8">
        {/* Tool Logo & Info */}
        <div className="flex-1">
          <div className="flex items-start gap-6">
            <div
              className="w-24 h-24 md:w-32 md:h-32 rounded-2xl flex items-center justify-center text-4xl md:text-5xl font-bold shadow-lg flex-shrink-0"
              style={{
                backgroundColor: (tool.category?.color || '#6366f1') + '20',
                color: tool.category?.color || '#6366f1',
              }}
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
                    style={{
                      backgroundColor: tool.category.color + '20',
                      color: tool.category.color,
                    }}
                  >
                    {tool.category.name}
                  </Badge>
                )}
                <Badge variant={pricing.badge}>{pricing.label}</Badge>
              </div>

              <p className="text-lg text-muted-foreground mb-6">
                {tool.tagline || tool.description}
              </p>

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
                  <span className="font-bold">{localReviewCount}</span>
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

          <ShareBar tool={tool} onCopyLink={onCopyLink} copied={copied} />
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// Share bar (Twitter, Facebook, Copy link)
// ============================================================================

function ShareBar({
  tool,
  onCopyLink,
  copied,
}: {
  tool: ToolDetail;
  onCopyLink: () => void;
  copied: boolean;
}) {
  const handleShare = (platform: 'twitter' | 'facebook' | 'linkedin') => {
    if (typeof window === 'undefined') return;
    window.open(getShareUrl(platform, tool, window.location.href), '_blank');
  };

  return (
    <div className="flex items-center gap-2 mt-2">
      <span className="text-sm text-muted-foreground">مشاركة:</span>

      <button
        onClick={() => handleShare('twitter')}
        className="w-9 h-9 rounded-lg bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
        aria-label="مشاركة على تويتر"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </button>

      <button
        onClick={() => handleShare('facebook')}
        className="w-9 h-9 rounded-lg bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
        aria-label="مشاركة على فيسبوك"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      </button>

      <button
        onClick={onCopyLink}
        className="w-9 h-9 rounded-lg bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
        aria-label={copied ? 'تم نسخ الرابط' : 'نسخ الرابط'}
      >
        {copied ? (
          <CheckCircle2 className="w-4 h-4 text-green-500" />
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        )}
      </button>
    </div>
  );
}
