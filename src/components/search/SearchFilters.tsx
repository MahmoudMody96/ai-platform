'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, X } from 'lucide-react';

export type SortOption = 'popular' | 'newest' | 'rating' | 'alphabetical';

interface SearchFiltersProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedPricing: string;
  onPricingChange: (pricing: string) => void;
  categories: string[];
  pricingOptions: { value: string; label: string }[];
  className?: string;
}

export function SearchFilters({
  selectedCategory,
  onCategoryChange,
  selectedPricing,
  onPricingChange,
  categories,
  pricingOptions,
  className,
}: SearchFiltersProps) {
  const hasActiveFilters = selectedCategory !== categories[0] || selectedPricing !== pricingOptions[0].value;

  const clearFilters = () => {
    onCategoryChange(categories[0]);
    onPricingChange(pricingOptions[0].value);
  };

  return (
    <div className={`flex flex-wrap items-center gap-3 ${className ?? ''}`}>
      {/* Category pills */}
      <div className="flex flex-wrap gap-1.5">
        {categories.map((cat) => (
          <Button
            key={cat}
            variant={selectedCategory === cat ? 'default' : 'outline'}
            size="sm"
            onClick={() => onCategoryChange(cat)}
            className="text-xs h-8"
          >
            {cat}
          </Button>
        ))}
      </div>

      {/* Pricing dropdown */}
      <select
        value={selectedPricing}
        onChange={(e) => onPricingChange(e.target.value)}
        className="h-9 px-3 rounded-lg border border-border bg-background text-sm cursor-pointer hover:border-primary transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
        aria-label="تصفية حسب السعر"
      >
        {pricingOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>

      {/* Sort dropdown */}
      <SortSelect />

      {/* Clear filters */}
      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground h-8 gap-1">
          <X className="w-3.5 h-3.5" />
          مسح الفلاتر
        </Button>
      )}

      {/* Active filter indicators */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2">
          {selectedCategory !== categories[0] && (
            <Badge variant="secondary" className="text-xs h-6">
              {selectedCategory}
            </Badge>
          )}
          {selectedPricing !== pricingOptions[0].value && (
            <Badge variant="secondary" className="text-xs h-6">
              {pricingOptions.find(o => o.value === selectedPricing)?.label ?? selectedPricing}
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}

function SortSelect() {
  const [sortBy, setSortBy] = React.useState<SortOption>('popular');

  const labels: Record<SortOption, string> = {
    popular: 'الأكثر شعبية',
    newest: 'الأحدث',
    rating: 'الأعلى تقييماً',
    alphabetical: 'أ-ي',
  };

  return (
    <div className="relative inline-flex items-center">
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value as SortOption)}
        className="h-9 pl-8 pr-3 rounded-lg border border-border bg-background text-sm cursor-pointer appearance-none hover:border-primary transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
        aria-label="ترتيب النتائج"
      >
        {Object.entries(labels).map(([value, label]) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>
      <ChevronDown className="absolute start-2.5 w-4 h-4 text-muted-foreground pointer-events-none" />
    </div>
  );
}


