// =============================================
// ToolDetail - About + Features sections
// =============================================

import { BookOpen, Sparkles, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { ToolFeature } from './types';

export function ToolAbout({ description }: { description: string | null }) {
  if (!description) return null;
  return (
    <section>
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <BookOpen className="w-5 h-5 text-primary" />
        حول الأداة
      </h2>
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground leading-relaxed">{description}</p>
        </CardContent>
      </Card>
    </section>
  );
}

export function ToolFeatures({ features }: { features: ToolFeature[] }) {
  if (!features || features.length === 0) return null;
  return (
    <section>
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-primary" />
        المميزات
      </h2>
      <div className="grid md:grid-cols-2 gap-4">
        {features.map((feature, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold">{feature.title}</span>
                {feature.desc && (
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
