// =============================================
// ToolDetail - Reviews section (form + list)
// =============================================

import * as React from 'react';
import { Star, Loader2, ThumbsUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDate, getInitials } from './utils';
import type { ToolReview } from './types';

interface ToolReviewsProps {
  reviews: ToolReview[];
  onSubmit: (rating: number, content: string) => Promise<void>;
  isSubmitting: boolean;
}

export function ToolReviews({ reviews, onSubmit, isSubmitting }: ToolReviewsProps) {
  const [newReview, setNewReview] = React.useState('');
  const [newRating, setNewRating] = React.useState(5);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.trim()) return;
    await onSubmit(newRating, newReview);
    setNewReview('');
    setNewRating(5);
  };

  return (
    <section>
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <Star className="w-5 h-5 text-primary" />
        المراجعات ({reviews.length})
      </h2>

      <Card className="mb-6">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4">اكتب مراجعتك</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">التقييم:</span>
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewRating(star)}
                    className={`w-8 h-8 transition-colors ${
                      star <= newRating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'
                    }`}
                    aria-label={`تقييم ${star} نجوم`}
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
              <Button type="submit" disabled={isSubmitting || newReview.length < 50}>
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin ms-2" />}
                إرسال المراجعة
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="p-6">
              <ReviewItem review={review} />
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

function ReviewItem({ review }: { review: ToolReview }) {
  return (
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
                  className={`w-4 h-4 ${
                    star <= review.rating
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-muted-foreground'
                  }`}
                />
              ))}
            </div>
          </div>
          <span className="text-xs text-muted-foreground">{formatDate(review.created_at)}</span>
        </div>

        {review.title && <p className="font-medium mb-2">{review.title}</p>}

        <p className="text-sm text-muted-foreground mb-3">{review.content}</p>

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
  );
}
