// =============================================
// API - Single Tool Endpoint
// =============================================

import { NextResponse } from 'next/server';

// Import shared store (in real app, this would be Supabase)
const mockTools = [
  { id: '1', name: 'ChatGPT', slug: 'chatgpt', description: 'نموذج لغوي متقدم للكتابة والتحليل', logo_url: null, website_url: 'https://chat.openai.com', documentation_url: null, pricing_model: 'freemium', monthly_price: 20, category_id: '1', tags: ['writing', 'chat'], features: null, alternatives: null, stats: { uses: 1500000, rating: 4.8, reviews: 25000 }, is_featured: true, is_verified: true, created_at: '2026-01-15', updated_at: '2026-05-20' },
  { id: '2', name: 'Midjourney', slug: 'midjourney', description: 'توليد صور فنية مذهلة', logo_url: null, website_url: 'https://midjourney.com', documentation_url: null, pricing_model: 'paid', monthly_price: 30, category_id: '2', tags: ['image', 'design'], features: null, alternatives: null, stats: { uses: 890000, rating: 4.7, reviews: 15000 }, is_featured: true, is_verified: true, created_at: '2026-02-10', updated_at: '2026-05-18' },
  { id: '3', name: 'Claude', slug: 'claude', description: 'مساعد ذكي للتحليل والكتابة', logo_url: null, website_url: 'https://claude.ai', documentation_url: null, pricing_model: 'freemium', monthly_price: null, category_id: '1', tags: ['writing', 'analysis'], features: null, alternatives: null, stats: { uses: 750000, rating: 4.9, reviews: 12000 }, is_featured: true, is_verified: true, created_at: '2026-03-05', updated_at: '2026-05-22' },
  { id: '4', name: 'GitHub Copilot', slug: 'github-copilot', description: 'مساعد برمجة بالذكاء الاصطناعي', logo_url: null, website_url: 'https://github.com/features/copilot', documentation_url: null, pricing_model: 'paid', monthly_price: 10, category_id: '3', tags: ['coding', 'development'], features: null, alternatives: null, stats: { uses: 500000, rating: 4.6, reviews: 8000 }, is_featured: false, is_verified: true, created_at: '2026-01-20', updated_at: '2026-05-15' },
  { id: '5', name: 'DALL-E 3', slug: 'dall-e-3', description: 'توليد صور واقعية من النصوص', logo_url: null, website_url: 'https://openai.com/dall-e-3', documentation_url: null, pricing_model: 'paid', monthly_price: 15, category_id: '2', tags: ['image', 'design'], features: null, alternatives: null, stats: { uses: 620000, rating: 4.7, reviews: 11000 }, is_featured: true, is_verified: true, created_at: '2026-02-28', updated_at: '2026-05-19' },
  { id: '6', name: 'ElevenLabs', slug: 'elevenlabs', description: 'أصوات AI واقعية للنصوص والكلام', logo_url: null, website_url: 'https://elevenlabs.io', documentation_url: null, pricing_model: 'freemium', monthly_price: null, category_id: '9', tags: ['audio', 'voice'], features: null, alternatives: null, stats: { uses: 420000, rating: 4.8, reviews: 9000 }, is_featured: false, is_verified: true, created_at: '2026-03-15', updated_at: '2026-05-21' },
  { id: '7', name: 'Notion AI', slug: 'notion-ai', description: 'مساعد ذكي للعملاء وكتابة النصوص', logo_url: null, website_url: 'https://notion.so', documentation_url: null, pricing_model: 'paid', monthly_price: 10, category_id: '1', tags: ['writing', 'productivity'], features: null, alternatives: null, stats: { uses: 380000, rating: 4.5, reviews: 7000 }, is_featured: false, is_verified: true, created_at: '2026-01-25', updated_at: '2026-05-14' },
  { id: '8', name: 'Canva AI', slug: 'canva-ai', description: 'تصميم جرافيك بالذكاء الاصطناعي', logo_url: null, website_url: 'https://canva.com', documentation_url: null, pricing_model: 'freemium', monthly_price: 13, category_id: '2', tags: ['design', 'graphics'], features: null, alternatives: null, stats: { uses: 520000, rating: 4.4, reviews: 11000 }, is_featured: false, is_verified: true, created_at: '2026-02-05', updated_at: '2026-05-16' },
  { id: '9', name: 'Jasper', slug: 'jasper', description: 'كتابة محتوى تسويقي بالذكاء الاصطناعي', logo_url: null, website_url: 'https://jasper.ai', documentation_url: null, pricing_model: 'paid', monthly_price: 49, category_id: '5', tags: ['marketing', 'writing'], features: null, alternatives: null, stats: { uses: 290000, rating: 4.3, reviews: 5000 }, is_featured: false, is_verified: false, created_at: '2026-03-10', updated_at: '2026-05-12' },
  { id: '10', name: 'Runway', slug: 'runway', description: 'توليد وتحرير فيديوهات بالذكاء الاصطناعي', logo_url: null, website_url: 'https://runwayml.com', documentation_url: null, pricing_model: 'paid', monthly_price: 35, category_id: '6', tags: ['video', 'editing'], features: null, alternatives: null, stats: { uses: 310000, rating: 4.6, reviews: 6000 }, is_featured: false, is_verified: true, created_at: '2026-01-30', updated_at: '2026-05-17' },
];

let toolsStore = [...mockTools];

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const tool = toolsStore.find(t => t.id === id || t.slug === id);
  
  if (!tool) {
    return NextResponse.json({
      success: false,
      error: 'Tool not found',
    }, { status: 404 });
  }
  
  return NextResponse.json({
    success: true,
    data: tool,
  });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const index = toolsStore.findIndex(t => t.id === id);
  
  if (index === -1) {
    return NextResponse.json({
      success: false,
      error: 'Tool not found',
    }, { status: 404 });
  }
  
  try {
    const body = await request.json();
    
    const updatedTool = {
      ...toolsStore[index],
      ...body,
      updated_at: new Date().toISOString(),
    };
    
    toolsStore[index] = updatedTool;
    
    return NextResponse.json({
      success: true,
      data: updatedTool,
    });
  } catch (error) {
    console.error('Error updating tool:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update tool',
    }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const index = toolsStore.findIndex(t => t.id === id);
  
  if (index === -1) {
    return NextResponse.json({
      success: false,
      error: 'Tool not found',
    }, { status: 404 });
  }
  
  toolsStore.splice(index, 1);
  
  return NextResponse.json({
    success: true,
    message: 'Tool deleted successfully',
  });
}