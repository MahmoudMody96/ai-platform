'use client';

import * as React from 'react';
import { useFavorites } from '@/contexts/FavoritesContext';
import { Button } from '@/components/ui/button';
import { Heart, Loader2 } from 'lucide-react';

interface SaveButtonProps {
  toolId?: string;
  articleId?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'icon';
  showLabel?: boolean;
  className?: string;
}

export function SaveButton({ toolId, articleId, variant = 'outline', size = 'sm', showLabel = false, className }: SaveButtonProps) {
  const { isFavorite, getFavoriteId, toggleFavorite, isLoading } = useFavorites();
  const [isToggling, setIsToggling] = React.useState(false);

  const saved = isFavorite(toolId, articleId);
  const favoriteId = getFavoriteId(toolId, articleId);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsToggling(true);
    try {
      await toggleFavorite(toolId, articleId);
    } finally {
      setIsToggling(false);
    }
  };

  if (isLoading) {
    return (
      <Button variant={variant} size={size} disabled className={className}>
        <Loader2 className="w-4 h-4 animate-spin" />
        {showLabel && <span className="ms-1">...</span>}
      </Button>
    );
  }

  return (
    <Button
      variant={saved ? 'default' : variant}
      size={size}
      onClick={handleClick}
      disabled={isToggling}
      className={`${saved ? 'bg-red-500 hover:bg-red-600 text-white border-red-500' : ''} ${className ?? ''}`}
      title={saved ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}
    >
      <Heart className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
      {showLabel && <span className="ms-1">{saved ? 'محفوظ' : 'حفظ'}</span>}
    </Button>
  );
}
