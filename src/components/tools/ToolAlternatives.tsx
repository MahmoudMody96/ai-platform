// =============================================
// ToolDetail - Alternatives section
// =============================================

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { ToolAlternative } from './types';

export function ToolAlternatives({ alternatives }: { alternatives: ToolAlternative[] }) {
  if (!alternatives || alternatives.length === 0) return null;
  return (
    <section>
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <ArrowRight className="w-5 h-5 text-primary rtl:rotate-180" />
        بدائل مشابهة
      </h2>
      <div className="grid md:grid-cols-2 gap-4">
        {alternatives.map((alt) => (
          <Link key={alt.id} href={`/tools/${alt.slug}`}>
            <Card className="hover:shadow-lg hover:-translate-y-1 transition-all group">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold"
                    style={{
                      backgroundColor: (alt.category?.color || '#6366f1') + '20',
                      color: alt.category?.color || '#6366f1',
                    }}
                  >
                    {alt.logo_url ? (
                      <img src={alt.logo_url} alt={alt.name} className="w-8 h-8" />
                    ) : (
                      alt.name.charAt(0)
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold group-hover:text-primary transition-colors">
                      {alt.name}
                    </h3>
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
  );
}
