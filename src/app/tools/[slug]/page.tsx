// =============================================
// Tool Detail Page
// Connected to Supabase API
// =============================================

import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { generateToolMetadata, generateToolStructuredData } from '@/lib/seo';
import { ToolDetailClient } from './ToolDetailClient';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: tool } = await supabase
    .from('tools')
    .select('*, category:categories(*)')
    .or(`slug.eq.${slug},id.eq.${slug}`)
    .eq('status', 'published')
    .single();

  if (!tool) return { title: 'الأداة غير موجودة' };

  return generateToolMetadata(tool);
}

export default async function ToolDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  // Get tool data
  const { data: tool, error } = await supabase
    .from('tools')
    .select(`
      *,
      category:categories(id, name, slug, color, icon)
    `)
    .or(`slug.eq.${slug},id.eq.${slug}`)
    .eq('status', 'published')
    .single();

  if (error || !tool) {
    notFound();
  }

  // Get recent reviews
  const { data: reviews } = await supabase
    .from('reviews')
    .select(`
      id,
      rating,
      title,
      content,
      pros,
      cons,
      created_at,
      author:profiles(id, display_name, avatar_url)
    `)
    .eq('tool_id', tool.id)
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
    .limit(10);

  // Get similar tools
  const { data: similarTools } = await supabase
    .from('tools')
    .select(`
      id,
      name,
      slug,
      tagline,
      logo_url,
      pricing_type,
      rating_avg,
      category:categories(name, color)
    `)
    .eq('category_id', tool.category_id)
    .eq('status', 'published')
    .neq('id', tool.id)
    .order('rating_avg', { ascending: false })
    .limit(4);

  // Get rating breakdown
  const { data: ratingStats } = await supabase
    .from('reviews')
    .select('rating')
    .eq('tool_id', tool.id)
    .eq('status', 'approved');

  const ratingBreakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } as Record<number, number>;
  ratingStats?.forEach(r => {
    if (r.rating >= 1 && r.rating <= 5) {
      ratingBreakdown[r.rating as keyof typeof ratingBreakdown]++;
    }
  });

  // Generate JSON-LD
  const toolStructuredData = generateToolStructuredData({
    name: tool.name,
    description: tool.description || tool.tagline || '',
    image: tool.logo_url || undefined,
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/tools/${tool.slug}`,
    price: tool.starting_price || undefined,
    priceCurrency: tool.pricing_currency || 'USD',
    category: tool.category?.name,
    rating: tool.rating_avg,
    reviewCount: tool.rating_count,
    pricingModel: tool.pricing_type as 'free' | 'freemium' | 'paid' | 'contact',
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toolStructuredData }}
      />
      <ToolDetailClient 
        tool={{
          ...tool,
          recent_reviews: reviews || [],
          alternatives: similarTools || [],
          stats: {
            rating_avg: tool.rating_avg,
            rating_count: tool.rating_count,
            rating_breakdown: ratingBreakdown,
          },
        }}
      />
    </>
  );
}