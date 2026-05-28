// =============================================
// API Routes - Admin Dashboard Stats
// GET: fetch dashboard statistics
// =============================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { successResponse, errorResponse } from '@/lib/api/response';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(errorResponse('Unauthorized'), { status: 401 });
    }

    // Check admin role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json(errorResponse('Admin access required'), { status: 403 });
    }

    // Get total counts
    const [
      { count: totalTools },
      { count: totalArticles },
      { count: totalUsers },
      { count: totalComments },
      { count: featuredTools },
      { count: publishedArticles },
      { count: activeApiKeys },
    ] = await Promise.all([
      supabase.from('tools').select('*', { count: 'exact', head: true }),
      supabase.from('articles').select('*', { count: 'exact', head: true }),
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('comments').select('*', { count: 'exact', head: true }),
      supabase.from('tools').select('*', { count: 'exact', head: true }).eq('is_featured', true),
      supabase.from('articles').select('*', { count: 'exact', head: true }).eq('status', 'published'),
      supabase.from('api_keys').select('*', { count: 'exact', head: true }).eq('is_active', true),
    ]);

    // Get API usage
    const { data: apiKeys } = await supabase.from('api_keys').select('usage_count');
    const totalApiCalls = apiKeys?.reduce((sum, key) => sum + (key.usage_count || 0), 0) || 0;

    // Get weekly stats (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [
      { count: toolsThisWeek },
      { count: articlesThisWeek },
      { count: usersThisWeek },
    ] = await Promise.all([
      supabase.from('tools').select('*', { count: 'exact', head: true }).gte('created_at', sevenDaysAgo.toISOString()),
      supabase.from('articles').select('*', { count: 'exact', head: true }).gte('created_at', sevenDaysAgo.toISOString()),
      supabase.from('profiles').select('*', { count: 'exact', head: true }).gte('created_at', sevenDaysAgo.toISOString()),
    ]);

    // Get recent activity
    const { data: recentActivity } = await supabase
      .from('activity_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    const stats = {
      total_tools: totalTools || 0,
      total_articles: totalArticles || 0,
      total_users: totalUsers || 0,
      total_comments: totalComments || 0,
      featured_tools: featuredTools || 0,
      published_articles: publishedArticles || 0,
      active_api_keys: activeApiKeys || 0,
      total_api_calls: totalApiCalls,
      tools_this_week: toolsThisWeek || 0,
      articles_this_week: articlesThisWeek || 0,
      users_this_week: usersThisWeek || 0,
      recent_activity: recentActivity || [],
    };

    return NextResponse.json(successResponse(stats));
  } catch (error) {
    console.error('Dashboard error:', error);
    return NextResponse.json(errorResponse('Internal server error'), { status: 500 });
  }
}
