// =============================================
// Admin Dashboard - Stats Cards
// =============================================

'use client';

import * as React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: LucideIcon;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
}

export function StatCard({ title, value, change, icon: Icon, color = 'primary' }: StatCardProps) {
  const colors = {
    primary: 'text-primary bg-primary-100',
    secondary: 'text-secondary-600 bg-secondary-400/20',
    success: 'text-success bg-success-light',
    warning: 'text-warning bg-warning-light',
    error: 'text-error bg-error-light',
  };

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
          {change !== undefined && (
            <div className={cn("flex items-center gap-1 mt-2 text-sm", change >= 0 ? "text-success" : "text-error")}>
              {change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span>{Math.abs(change)}% from last month</span>
            </div>
          )}
        </div>
        <div className={cn("p-3 rounded-xl", colors[color])}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </Card>
  );
}