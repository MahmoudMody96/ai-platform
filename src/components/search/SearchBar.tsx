'use client';

import * as React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({
  value,
  onChange,
  onSubmit,
  placeholder = 'ابحث عن أي أداة...',
  className,
}: SearchBarProps) {
  const [focused, setFocused] = React.useState(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSubmit) {
      onSubmit(value);
    }
  };

  return (
    <div className={`relative ${className ?? ''}`}>
      <Search className={`absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${focused ? 'text-primary' : 'text-muted-foreground'}`} />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        className="h-12 ps-12 pe-4 text-lg shadow-sm rtl:ps-4 rtl:pe-12 border-2 transition-colors focus:border-primary"
        dir="rtl"
      />
    </div>
  );
}
