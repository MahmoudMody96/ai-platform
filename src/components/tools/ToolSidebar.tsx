// =============================================
// ToolDetail - Sidebar (Pricing / Quick Info / Tags / Links)
// =============================================

import { Sparkles, Star, ExternalLink, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getPricingLabel } from './utils';
import type { ToolDetail, PricingType } from './types';

interface ToolSidebarProps {
  tool: ToolDetail;
  onCopyLink: () => void;
  copied: boolean;
}

const PRICING_MODEL_LABEL: Record<PricingType, string> = {
  free: 'مجاني تماماً',
  freemium: 'مجاني مع باقة مدفوعة',
  paid: 'مدفوع',
  enterprise: 'للشركات',
  contact: 'تواصل للسعر',
};

export function ToolSidebar({ tool, onCopyLink, copied }: ToolSidebarProps) {
  const pricing = getPricingLabel(tool.pricing_type, tool.starting_price);

  return (
    <div className="space-y-6">
      {/* Pricing Card */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            التسعير
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
              <div>
                <p className="font-semibold">النموذج</p>
                <p className="text-sm text-muted-foreground">
                  {PRICING_MODEL_LABEL[tool.pricing_type]}
                </p>
              </div>
              <Badge variant={pricing.badge}>{pricing.label}</Badge>
            </div>

            {tool.starting_price && (
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div>
                  <p className="font-semibold">الباقة المدفوعة</p>
                  <p className="text-sm text-muted-foreground">للاستخدام غير المحدود</p>
                </div>
                <span className="text-xl font-bold">{tool.starting_price}$/شهر</span>
              </div>
            )}

            <a
              href={tool.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <Button className="w-full">ابدأ مجاناً</Button>
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Quick Info Card */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-bold mb-4">معلومات سريعة</h3>
          <div className="space-y-4">
            {tool.category && (
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">الفئة</span>
                <Badge
                  variant="secondary"
                  style={{
                    backgroundColor: tool.category.color + '20',
                    color: tool.category.color,
                  }}
                >
                  {tool.category.name}
                </Badge>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">التقييم</span>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="font-medium">{tool.rating_avg}/5</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">عدد التقييمات</span>
              <span className="font-medium">{tool.rating_count}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">المشاهدات</span>
              <span className="font-medium">{tool.views_count.toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tags Card */}
      {tool.tags && tool.tags.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h3 className="font-bold mb-4">الوسوم</h3>
            <div className="flex flex-wrap gap-2">
              {tool.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* External Links Card */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-bold mb-4">روابط مهمة</h3>
          <div className="space-y-3">
            <a
              href={tool.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
            >
              <div className="flex items-center gap-3">
                <ExternalLink className="w-4 h-4 text-primary" />
                <span className="text-sm">الموقع الرسمي</span>
              </div>
              <ArrowRightIcon />
            </a>
            <button
              onClick={onCopyLink}
              className="w-full flex items-center justify-between p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
            >
              <div className="flex items-center gap-3">
                <CopyLinkIcon />
                <span className="text-sm">{copied ? 'تم النسخ!' : 'نسخ الرابط'}</span>
              </div>
              {copied && <CheckCircle2 className="w-4 h-4 text-green-500" />}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Small inline icons (kept here to avoid bloating the icons import at the top)
function ArrowRightIcon() {
  return (
    <svg
      className="w-4 h-4 text-muted-foreground rtl:rotate-180"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 5l7 7-7 7"
      />
    </svg>
  );
}

function CopyLinkIcon() {
  return (
    <svg
      className="w-4 h-4 text-primary"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
      />
    </svg>
  );
}
