// =============================================
// Admin - Dashboard Page
// =============================================

'use client';

import * as React from 'react';
import { StatCard } from '@/components/dashboard/StatCard';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Wrench, FileText, Users, MessageSquare, Eye, Zap, TrendingUp, Calendar, Loader2 } from 'lucide-react';

interface DashboardStats {
  total_tools: number;
  total_articles: number;
  total_users: number;
  total_comments: number;
  featured_tools: number;
  published_articles: number;
  active_api_keys: number;
  total_api_calls: number;
  tools_this_week: number;
  articles_this_week: number;
  users_this_week: number;
  recent_activity: Array<{
    id: string;
    action: string;
    entity_type: string;
    created_at: string;
  }>;
}

const mockChartData = [
  { day: 'Sat', tools: 12, articles: 5, users: 45 },
  { day: 'Sun', tools: 8, articles: 7, users: 62 },
  { day: 'Mon', tools: 15, articles: 3, users: 78 },
  { day: 'Tue', tools: 6, articles: 9, users: 54 },
  { day: 'Wed', tools: 18, articles: 4, users: 89 },
  { day: 'Thu', tools: 11, articles: 6, users: 67 },
  { day: 'Fri', tools: 14, articles: 8, users: 71 },
];

export default function AdminDashboard() {
  const [stats, setStats] = React.useState<DashboardStats | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchStats = React.useCallback(async () => {
    try {
      const response = await fetch('/api/admin/dashboard');
      const data = await response.json();
      
      if (data.success) {
        queueMicrotask(() => setStats(data.data));
      } else {
        queueMicrotask(() => setError(data.error || 'Failed to fetch stats'));
      }
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      queueMicrotask(() => setError('Failed to connect to server'));
    } finally {
      queueMicrotask(() => setLoading(false));
    }
  }, []);

  React.useEffect(() => {
    fetchStats();
    
    // Optional: Poll for updates every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, [fetchStats]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <p className="text-destructive">{error}</p>
        <button onClick={fetchStats} className="text-primary hover:underline">
          إعادة المحاولة
        </button>
      </div>
    );
  }

  const statsData = [
    { 
      title: 'إجمالي الأدوات', 
      value: stats?.total_tools?.toLocaleString() || '0', 
      change: stats?.tools_this_week || 0, 
      icon: Wrench, 
      color: 'primary' as const 
    },
    { 
      title: 'إجمالي المقالات', 
      value: stats?.total_articles?.toLocaleString() || '0', 
      change: stats?.articles_this_week || 0, 
      icon: FileText, 
      color: 'secondary' as const 
    },
    { 
      title: 'إجمالي المستخدمين', 
      value: stats?.total_users?.toLocaleString() || '0', 
      change: stats?.users_this_week || 0, 
      icon: Users, 
      color: 'success' as const 
    },
    { 
      title: 'إجمالي التعليقات', 
      value: stats?.total_comments?.toLocaleString() || '0', 
      change: 0, 
      icon: MessageSquare, 
      color: 'warning' as const 
    },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              إحصائيات الأسبوع
            </CardTitle>
            <select className="px-3 py-1.5 rounded-lg border border-border text-sm bg-background">
              <option>الأسبوع الحالي</option>
              <option>الأسبوع الماضي</option>
              <option>هذا الشهر</option>
            </select>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-end gap-2">
              {mockChartData.map((data, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex flex-col gap-1" style={{ height: '200px' }}>
                    <div className="w-full bg-primary-200 rounded-t" style={{ height: `${data.tools * 8}px` }} />
                    <div className="w-full bg-secondary-400/50 rounded-t" style={{ height: `${data.articles * 12}px` }} />
                    <div className="w-full bg-accent-400/50 rounded-t" style={{ height: `${data.users * 1.5}px` }} />
                  </div>
                  <span className="text-xs text-muted-foreground">{data.day}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-primary-200" /><span className="text-sm">أدوات</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-secondary-400/50" /><span className="text-sm">مقالات</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-accent-400/50" /><span className="text-sm">مستخدمين</span></div>
            </div>
          </CardContent>
        </Card>

        {/* Activity */}
        <div className="space-y-6">
          <RecentActivity />
          
          {/* Quick Stats */}
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Eye className="w-5 h-5 text-primary" />زيارات اليوم</CardTitle></CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-gradient mb-2">12,456</p>
              <p className="text-sm text-muted-foreground">+15% من أمس</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* API Calls & Performance */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Zap className="w-5 h-5 text-primary" />استدعاءات API</CardTitle></CardHeader>
          <CardContent>
            <p className="text-3xl font-bold mb-2">{stats?.total_api_calls?.toLocaleString() || 0}</p>
            <p className="text-sm text-muted-foreground">إجمالي</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Calendar className="w-5 h-5 text-secondary" />أدوات جديدة</CardTitle></CardHeader>
          <CardContent>
            <p className="text-3xl font-bold mb-2">+{stats?.tools_this_week || 0}</p>
            <p className="text-sm text-muted-foreground">هذا الأسبوع</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="w-5 h-5 text-success" />المقالات المميزة</CardTitle></CardHeader>
          <CardContent>
            <p className="text-3xl font-bold mb-2">+{stats?.featured_tools || 0}</p>
            <p className="text-sm text-muted-foreground">المقالات المميزة</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
