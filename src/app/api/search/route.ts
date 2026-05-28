// =============================================
// API Routes - Search
// POST: full-text search across tools and articles
// =============================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { searchSchema } from '@/lib/validation/schemas';
import { successResponse, errorResponse } from '@/lib/api/response';
import type { Tool, Article } from '@/types';

interface SearchResult {
  type: 'tool' | 'article';
  item: Tool | Article;
  relevance: number;
}

// POST /api/search - Full-text search
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Parse and validate body
    const body = await request.json();
    const validated = searchSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        errorResponse(`Validation error: ${validated.error.message}`),
        { status: 400 }
      );
    }

    const { query, type, category, limit } = validated.data;

    // Build search results
    const results: SearchResult[] = [];

    // Search tools if 'all' or 'tools'
    if (type === 'all' || type === 'tools') {
      let toolsQuery = supabase
        .from('tools')
        .select('*, category:categories(*)')
        .or(`name.ilike.%${query}%,description.ilike.%${query}%`);

      if (category) {
        toolsQuery = toolsQuery.eq('category_id', category);
      }

      const { data: tools } = await toolsQuery.limit(limit);

      tools?.forEach(tool => {
        // Calculate simple relevance score
        const nameMatch = tool.name.toLowerCase().includes(query.toLowerCase());
        const descMatch = tool.description?.toLowerCase().includes(query.toLowerCase());
        const relevance = nameMatch ? (descMatch ? 1.0 : 0.7) : 0.4;

        results.push({
          type: 'tool',
          item: tool,
          relevance,
        });
      });
    }

    // Search articles if 'all' or 'articles'
    if (type === 'all' || type === 'articles') {
      let articlesQuery = supabase
        .from('articles')
        .select('*, author:profiles(*), category:categories(*)')
        .eq('status', 'published')
        .or(`title.ilike.%${query}%,excerpt.ilike.%${query}%`);

      if (category) {
        articlesQuery = articlesQuery.eq('category_id', category);
      }

      const { data: articles } = await articlesQuery.limit(limit);

      articles?.forEach(article => {
        // Calculate simple relevance score
        const titleMatch = article.title.toLowerCase().includes(query.toLowerCase());
        const excerptMatch = article.excerpt?.toLowerCase().includes(query.toLowerCase());
        const relevance = titleMatch ? (excerptMatch ? 1.0 : 0.7) : 0.4;

        results.push({
          type: 'article',
          item: article,
          relevance,
        });
      });
    }

    // Sort by relevance
    results.sort((a, b) => b.relevance - a.relevance);

    // Limit results
    const sortedResults = results.slice(0, limit);

    return NextResponse.json(
      successResponse({
        query,
        results: sortedResults,
        total: sortedResults.length,
        tools_count: sortedResults.filter(r => r.type === 'tool').length,
        articles_count: sortedResults.filter(r => r.type === 'article').length,
      })
    );
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(errorResponse('Internal server error'), { status: 500 });
  }
}