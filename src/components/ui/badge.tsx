// =============================================
// UI Components - Badge
// =============================================

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", {
  variants: {
    variant: {
      default: "bg-primary-100 text-primary-700",
      secondary: "bg-secondary-400/20 text-secondary-600",
      accent: "bg-accent-400/20 text-accent-600",
      success: "bg-green-100 text-green-700",
      warning: "bg-yellow-100 text-yellow-700",
      error: "bg-red-100 text-red-700",
      destructive: "bg-red-100 text-red-700", // destructive variant for semantic consistency
      info: "bg-blue-100 text-blue-700",
      outline: "border border-border",
      ghost: "bg-transparent",
    },
  },
  defaultVariants: { variant: "default" },
});

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export function PricingBadge({ pricing, locale = 'ar' }: { pricing: 'free' | 'freemium' | 'paid' | 'contact'; locale?: 'ar' | 'en' }) {
  const variants: Record<string, VariantProps<typeof badgeVariants>['variant']> = { free: 'success', freemium: 'info', paid: 'secondary', contact: 'outline' };
  const labels: Record<string, Record<string, string>> = {
    free: { ar: 'مجاني', en: 'Free' },
    freemium: { ar: 'مجاني مع باقة مدفوعة', en: 'Freemium' },
    paid: { ar: 'مدفوع', en: 'Paid' },
    contact: { ar: 'تواصل للسعر', en: 'Contact' },
  };
  return <Badge variant={variants[pricing]}>{labels[pricing][locale]}</Badge>;
}

export { Badge, badgeVariants };