'use client';

import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { StarRating } from './StarRating';
import { ThumbsUp } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';

interface ReviewCardProps {
  review: {
    id: string;
    author?: { display_name?: string; username?: string; avatar_url?: string };
    content: string;
    rating?: number;
    created_at: string;
    upvotes?: number;
  };
}

export function ReviewCard({ review }: ReviewCardProps) {
  // Parse content (stored as JSON string)
  let parsed: { rating?: number; title?: string; body?: string } = {};
  try {
    parsed = JSON.parse(review.content);
  } catch {
    parsed = { body: review.content };
  }

  const authorName = review.author?.display_name ?? review.author?.username ?? 'مستخدم';
  const initials = authorName.charAt(0).toUpperCase();

  return (
    <Card>
      <CardContent className="p-5">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={review.author?.avatar_url ?? undefined} alt={authorName} />
                <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-sm">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-sm">{authorName}</p>
                {parsed.title && (
                  <p className="text-xs font-medium text-foreground">{parsed.title}</p>
                )}
              </div>
            </div>
            {parsed.rating && (
              <StarRating rating={parsed.rating} size="sm" />
            )}
          </div>

          {/* Content */}
          {parsed.body && (
            <p className="text-sm text-muted-foreground leading-relaxed">{parsed.body}</p>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(review.created_at), { addSuffix: true, locale: ar })}
            </span>
            <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
              <ThumbsUp className="w-3 h-3" />
              <span>{review.upvotes ?? 0}</span>
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface ReviewListProps {
  reviews: ReviewCardProps['review'][];
  toolId?: string;
  articleId?: string;
  showForm?: boolean;
}

export function ReviewList({ reviews, toolId, articleId, showForm = true }: ReviewListProps) {
  return (
    <div className="space-y-6">
      {/* Average Rating Summary */}
      {reviews.length > 0 && (
        <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/50">
          <div className="text-4xl font-bold text-gradient">
            {(reviews.reduce((sum, r) => {
              try { return sum + (JSON.parse(r.content)?.rating ?? 0); }
              catch { return sum; }
            }, 0) / reviews.length).toFixed(1)}
          </div>
          <div>
            <StarRating
              rating={reviews.reduce((sum, r) => {
                try { return sum + (JSON.parse(r.content)?.rating ?? 0); }
                catch { return sum; }
              }, 0) / reviews.length}
              size="md"
            />
            <p className="text-sm text-muted-foreground mt-1">
              بناءً على {reviews.length} مراجعة
            </p>
          </div>
        </div>
      )}

      {/* Reviews */}
      {reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <p>لا توجد مراجعات بعد. كن أول من يراجع!</p>
        </div>
      )}
    </div>
  );
}
