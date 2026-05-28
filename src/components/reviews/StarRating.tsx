'use client';

import * as React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  reviewCount?: number;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
};

const textSizeClasses = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
};

export function StarRating({ rating, max = 5, size = 'md', showValue = true, reviewCount }: StarRatingProps) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  const emptyStars = max - fullStars - (hasHalf ? 1 : 0);

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star key={`full-${i}`} className={`${sizeClasses[size]} text-accent fill-accent`} />
        ))}
        {hasHalf && (
          <div className="relative">
            <Star className={`${sizeClasses[size]} text-muted-foreground/30`} />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star className={`${sizeClasses[size]} text-accent fill-accent`} />
            </div>
          </div>
        )}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <Star key={`empty-${i}`} className={`${sizeClasses[size]} text-muted-foreground/30`} />
        ))}
      </div>
      {showValue && (
        <span className={`font-medium ${textSizeClasses[size]}`}>{rating.toFixed(1)}</span>
      )}
      {reviewCount !== undefined && (
        <span className={`text-muted-foreground ${textSizeClasses[size]}`}>
          ({reviewCount.toLocaleString()})
        </span>
      )}
    </div>
  );
}

interface InteractiveStarRatingProps {
  value: number;
  onChange: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
  readonly?: boolean;
}

export function InteractiveStarRating({ value, onChange, size = 'md', readonly = false }: InteractiveStarRatingProps) {
  const [hoverValue, setHoverValue] = React.useState(0);

  const displayValue = hoverValue || value;

  return (
    <div className="flex items-center gap-1" role={readonly ? undefined : 'radiogroup'} aria-label="التقييم">
      {Array.from({ length: 5 }).map((_, i) => {
        const starNum = i + 1;
        const isFilled = starNum <= displayValue;

        return (
          <button
            key={i}
            type="button"
            disabled={readonly}
            onMouseEnter={() => !readonly && setHoverValue(starNum)}
            onMouseLeave={() => !readonly && setHoverValue(0)}
            onClick={() => !readonly && onChange(starNum)}
            className={`${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'} transition-transform`}
            aria-label={`${starNum} نجمة`}
            aria-checked={value === starNum}
            role={readonly ? undefined : 'radio'}
          >
            <Star
              className={`${sizeClasses[size]} transition-colors ${isFilled ? 'text-accent fill-accent' : 'text-muted-foreground/40'}`}
            />
          </button>
        );
      })}
      {value > 0 && (
        <span className="ms-1 text-sm text-muted-foreground">
          {value === 5 ? 'ممتاز' : value === 4 ? 'جيد جداً' : value === 3 ? 'جيد' : value === 2 ? 'مقبول' : 'ضعيف'}
        </span>
      )}
    </div>
  );
}
