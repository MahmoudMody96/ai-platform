// =============================================
// ToolDetail - Header + Breadcrumb
// =============================================

import Link from 'next/link';
import { Sparkles, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ToolCategory } from './types';

export function ToolHeader() {
  return (
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
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
              الرئيسية
            </Link>
            <Link href="/tools" className="text-sm font-medium text-primary">
              الأدوات
            </Link>
            <Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground">
              المدونة
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/admin">
              <Button size="sm">الدخول للأدمن</Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export function ToolBreadcrumb({
  toolName,
  category,
}: {
  toolName: string;
  category: ToolCategory | null;
}) {
  return (
    <div className="border-b border-border bg-muted/20">
      <div className="container-custom py-3">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            الرئيسية
          </Link>
          <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
          <Link href="/tools" className="hover:text-foreground">
            الأدوات
          </Link>
          <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
          {category && (
            <>
              <Link href={`/tools?category=${category.slug}`} className="hover:text-foreground">
                {category.name}
              </Link>
              <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
            </>
          )}
          <span className="text-foreground font-medium">{toolName}</span>
        </nav>
      </div>
    </div>
  );
}
