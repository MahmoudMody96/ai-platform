// =============================================
// Admin Dashboard - Recent Activity
// =============================================

'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { formatRelativeTime, cn } from '@/lib/utils';
import { Plus, Edit, Trash2, Eye, Heart, MessageSquare } from 'lucide-react';

interface Activity {
  id: string;
  action: 'create' | 'update' | 'delete' | 'view' | 'favorite' | 'comment';
  entity_type: string;
  entity_name: string;
  user: string;
  created_at: string;
}

const mockActivities: Activity[] = [
  { id: '1', action: 'create', entity_type: 'tool', entity_name: 'ChatGPT', user: 'Admin', created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
  { id: '2', action: 'update', entity_type: 'article', entity_name: 'مراجعة Claude 3.5', user: 'Editor', created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
  { id: '3', action: 'favorite', entity_type: 'tool', entity_name: 'Midjourney', user: 'User123', created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString() },
  { id: '4', action: 'comment', entity_type: 'article', entity_name: 'كيف تستخدم AI في التسويق', user: 'Ahmed M.', created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString() },
  { id: '5', action: 'view', entity_type: 'tool', entity_name: 'DALL-E 3', user: 'Anonymous', created_at: new Date(Date.now() - 1000 * 60 * 180).toISOString() },
];

const actionIcons = { create: Plus, update: Edit, delete: Trash2, view: Eye, favorite: Heart, comment: MessageSquare };
const actionColors = { create: 'success', update: 'info', delete: 'error', view: 'secondary', favorite: 'accent', comment: 'default' };

export function RecentActivity() {
  return (
    <Card>
      <CardHeader><CardTitle>النشاط الأخير</CardTitle></CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockActivities.map((activity) => {
            const Icon = actionIcons[activity.action];
            return (
              <div key={activity.id} className="flex items-start gap-4 pb-4 border-b border-border last:border-0 last:pb-0">
                <div className={cn("p-2 rounded-lg", `bg-${actionColors[activity.action]}-100`)}>
                  <Icon className={cn("w-4 h-4", `text-${actionColors[activity.action]}-700`)} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm">
                    <span className="font-medium">{activity.user}</span>
                    <span className="text-muted-foreground"> {activity.action === 'create' ? 'أضاف' : activity.action === 'update' ? 'عدّل' : activity.action === 'delete' ? 'حذف' : activity.action === 'favorite' ? 'أضاف للمفضلة' : activity.action === 'comment' ? 'علّق على' : 'شاهد'} </span>
                    <span className="font-medium">{activity.entity_name}</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{formatRelativeTime(activity.created_at)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}