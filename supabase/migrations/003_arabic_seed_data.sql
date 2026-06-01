-- =============================================
-- AI Platform - Arabic Seed Data Migration
-- Version: 003
-- Date: 2026-06-01
--
-- This migration adds the canonical Arabic categories, sample tools,
-- and sample articles described in the project plan.
-- It is idempotent (uses ON CONFLICT DO NOTHING) so it can be re-run.
-- =============================================

-- =============================================
-- 1. Categories (Arabic, ordered)
-- =============================================
INSERT INTO categories (name, slug, description, icon, color, sort_order, is_featured, is_active) VALUES
  ('مساعدون ذكيون', 'ai-assistants', 'مساعدات ذكية للمحادثة والكتابة', 'Bot', '#8B5CF6', 1, true, true),
  ('توليد الصور', 'image-generation', 'أدوات لإنشاء وتحرير الصور بالذكاء الاصطناعي', 'Image', '#EC4899', 2, true, true),
  ('كتابة المحتوى', 'writing', 'أدوات كتابة وتحرير النصوص', 'Pen', '#F59E0B', 3, true, true),
  ('البرمجة', 'coding', 'مساعدات برمجة ومولدات كود', 'Code', '#10B981', 4, true, true),
  ('الصوت', 'audio', 'تحويل النص لصوت والتعرف على الكلام', 'Mic', '#06B6D4', 5, false, true),
  ('الفيديو', 'video', 'إنشاء وتحرير الفيديو', 'Video', '#EF4444', 6, false, true),
  ('الأتمتة', 'automation', 'أتمتة سير العمل والمهام', 'Zap', '#0EA5E9', 7, false, true),
  ('البحث', 'search', 'محركات بحث ذكية', 'Search', '#3B82F6', 8, false, true)
ON CONFLICT (slug) DO NOTHING;

-- =============================================
-- 2. Sample Tools (Arabic)
-- =============================================
DO $$
DECLARE
  cat_assistants UUID;
  cat_images UUID;
  cat_writing UUID;
  cat_coding UUID;
  cat_audio UUID;
  cat_video UUID;
  cat_automation UUID;
  cat_search UUID;
BEGIN
  SELECT id INTO cat_assistants FROM categories WHERE slug = 'ai-assistants';
  SELECT id INTO cat_images FROM categories WHERE slug = 'image-generation';
  SELECT id INTO cat_writing FROM categories WHERE slug = 'writing';
  SELECT id INTO cat_coding FROM categories WHERE slug = 'coding';
  SELECT id INTO cat_audio FROM categories WHERE slug = 'audio';
  SELECT id INTO cat_video FROM categories WHERE slug = 'video';
  SELECT id INTO cat_automation FROM categories WHERE slug = 'automation';
  SELECT id INTO cat_search FROM categories WHERE slug = 'search';

  -- Assistants
  INSERT INTO tools (name, slug, tagline, description, website_url, pricing_model, monthly_price, pricing_currency, category_id, tags, features, is_featured, is_published, stats) VALUES
    ('ChatGPT', 'chatgpt', 'مساعد ذكي للمحادثة والكتابة',
     'نموذج لغوي كبير من OpenAI للمحادثة، الكتابة، الترجمة، وتوليد الأفكار.',
     'https://chat.openai.com', 'freemium', 20.00, 'USD', cat_assistants,
     ARRAY['chatbot','writing','translation'], '[{"title":"محادثة ذكية","desc":"فهم سياق المحادثة"},{"title":"كتابة محتوى","desc":"مقالات، إيميلات، سكريبت"},{"title":"برمجة","desc":"كتابة وشرح الكود"}]'::jsonb,
     true, true, '{"views":0,"saves":0,"uses":0,"rating":4.9,"reviews_count":15420}'::jsonb)
  ON CONFLICT (slug) DO NOTHING;

  INSERT INTO tools (name, slug, tagline, description, website_url, pricing_model, monthly_price, pricing_currency, category_id, tags, features, is_featured, is_published, stats) VALUES
    ('Claude', 'claude', 'مساعد للتحليل والكتابة الطويلة',
     'نموذج من Anthropic متميز في المحادثات الطويلة والتحليل العميق.',
     'https://claude.ai', 'freemium', 20.00, 'USD', cat_assistants,
     ARRAY['chatbot','analysis','long-context'], '[{"title":"سياق طويل","desc":"حتى 200K token"},{"title":"تحليل عميق","desc":"منطق واستدلال"}]'::jsonb,
     true, true, '{"views":0,"saves":0,"uses":0,"rating":4.8,"reviews_count":8920}'::jsonb)
  ON CONFLICT (slug) DO NOTHING;

  INSERT INTO tools (name, slug, tagline, description, website_url, pricing_model, monthly_price, pricing_currency, category_id, tags, features, is_featured, is_published, stats) VALUES
    ('Gemini', 'gemini', 'مساعد Google مع البحث الحي',
     'مساعد ذكي من Google يدمج البحث الفعلي بنموذج لغوي متقدم.',
     'https://gemini.google.com', 'free', 0, 'USD', cat_assistants,
     ARRAY['chatbot','search','google'], '[{"title":"بحث حي","desc":"نتائج محدثة"},{"title":"تحليل صور","desc":"فهم بصري"}]'::jsonb,
     true, true, '{"views":0,"saves":0,"uses":0,"rating":4.6,"reviews_count":4820}'::jsonb)
  ON CONFLICT (slug) DO NOTHING;

  -- Image generation
  INSERT INTO tools (name, slug, tagline, description, website_url, pricing_model, monthly_price, pricing_currency, category_id, tags, features, is_featured, is_published, stats) VALUES
    ('Midjourney', 'midjourney', 'صور فنية مذهلة',
     'من Midjourney لتوليد صور فنية عالية الجودة من الأوصاف النصية.',
     'https://midjourney.com', 'paid', 10.00, 'USD', cat_images,
     ARRAY['images','art','discord'], '[{"title":"جودة فنية","desc":"صور بستايل فني"},{"title":"أنماط متعددة","desc":"photoreal, anime, ..."}]'::jsonb,
     true, true, '{"views":0,"saves":0,"uses":0,"rating":4.7,"reviews_count":6540}'::jsonb)
  ON CONFLICT (slug) DO NOTHING;

  INSERT INTO tools (name, slug, tagline, description, website_url, pricing_model, monthly_price, pricing_currency, category_id, tags, features, is_featured, is_published, stats) VALUES
    ('DALL-E 3', 'dalle-3', 'توليد صور من OpenAI',
     'مولد صور من OpenAI بدقة عالية ويفهم التعليمات المعقدة.',
     'https://openai.com/dall-e-3', 'paid', 20.00, 'USD', cat_images,
     ARRAY['images','openai','hd'], '[{"title":"دقة عالية","desc":"صور HD"},{"title":"نص في الصور","desc":"يدعم كتابة نصوص في الصور"}]'::jsonb,
     true, true, '{"views":0,"saves":0,"uses":0,"rating":4.5,"reviews_count":3280}'::jsonb)
  ON CONFLICT (slug) DO NOTHING;

  -- Coding
  INSERT INTO tools (name, slug, tagline, description, website_url, pricing_model, monthly_price, pricing_currency, category_id, tags, features, is_featured, is_published, stats) VALUES
    ('GitHub Copilot', 'github-copilot', 'مساعد برمجي ذكي',
     'مساعد من GitHub وOpenAI يقترح كود داخل الـ IDE.',
     'https://github.com/features/copilot', 'paid', 10.00, 'USD', cat_coding,
     ARRAY['coding','ide','autocomplete'], '[{"title":"إكمال تلقائي","desc":"اقتراح سطور ودوال"},{"title":"دردشة كود","desc":"شرح وإعادة كتابة"}]'::jsonb,
     true, true, '{"views":0,"saves":0,"uses":0,"rating":4.4,"reviews_count":12850}'::jsonb)
  ON CONFLICT (slug) DO NOTHING;

  -- Writing
  INSERT INTO tools (name, slug, tagline, description, website_url, pricing_model, monthly_price, pricing_currency, category_id, tags, features, is_featured, is_published, stats) VALUES
    ('Notion AI', 'notion-ai', 'ذكاء اصطناعي داخل Notion',
     'مساعد ذكي مدمج في Notion للتلخيص، الترجمة، وكتابة الملاحظات.',
     'https://notion.so/product/ai', 'paid', 10.00, 'USD', cat_writing,
     ARRAY['writing','notes','notion'], '[{"title":"تلخيص","desc":"تلخيص النصوص الطويلة"},{"title":"ترجمة","desc":"دعم متعدد اللغات"}]'::jsonb,
     false, true, '{"views":0,"saves":0,"uses":0,"rating":4.3,"reviews_count":2150}'::jsonb)
  ON CONFLICT (slug) DO NOTHING;

  -- Audio
  INSERT INTO tools (name, slug, tagline, description, website_url, pricing_model, monthly_price, pricing_currency, category_id, tags, features, is_featured, is_published, stats) VALUES
    ('ElevenLabs', 'elevenlabs', 'أصوات واقعية من نص',
     'تحويل نص إلى كلام بأصوات واقعية متعددة اللغات.',
     'https://elevenlabs.io', 'freemium', 5.00, 'USD', cat_audio,
     ARRAY['tts','voice','arabic'], '[{"title":"أصوات طبيعية","desc":"9 أصوات عربية"},{"title":"استنساخ صوت","desc":"بنموذج 60 ثانية"}]'::jsonb,
     false, true, '{"views":0,"saves":0,"uses":0,"rating":4.6,"reviews_count":1820}'::jsonb)
  ON CONFLICT (slug) DO NOTHING;

  -- Video
  INSERT INTO tools (name, slug, tagline, description, website_url, pricing_model, monthly_price, pricing_currency, category_id, tags, features, is_featured, is_published, stats) VALUES
    ('Runway', 'runway', 'إنشاء فيديو بالذكاء الاصطناعي',
     'أداة متقدمة لتوليد وتحرير الفيديو من نصوص وصور.',
     'https://runwayml.com', 'paid', 15.00, 'USD', cat_video,
     ARRAY['video','gen-2','editing'], '[{"title":"توليد فيديو","desc":"من نص أو صورة"},{"title":"تحرير متقدم","desc":"Inpainting للفيديو"}]'::jsonb,
     false, true, '{"views":0,"saves":0,"uses":0,"rating":4.4,"reviews_count":2560}'::jsonb)
  ON CONFLICT (slug) DO NOTHING;

  -- Automation
  INSERT INTO tools (name, slug, tagline, description, website_url, pricing_model, monthly_price, pricing_currency, category_id, tags, features, is_featured, is_published, stats) VALUES
    ('Zapier', 'zapier', 'ربط تطبيقاتك ببعض',
     'منصة أتمتة تربط بين آلاف التطبيقات بدون كود.',
     'https://zapier.com', 'paid', 20.00, 'USD', cat_automation,
     ARRAY['automation','workflow','integration'], '[{"title":"بدون كود","desc":"سحب وإفلات"},{"title":"AI Actions","desc":"دمج GPT في الـ Zaps"}]'::jsonb,
     false, true, '{"views":0,"saves":0,"uses":0,"rating":4.3,"reviews_count":3240}'::jsonb)
  ON CONFLICT (slug) DO NOTHING;

  -- Search
  INSERT INTO tools (name, slug, tagline, description, website_url, pricing_model, monthly_price, pricing_currency, category_id, tags, features, is_featured, is_published, stats) VALUES
    ('Perplexity', 'perplexity', 'محرك بحث ذكي',
     'محرك بحث يستخدم الذكاء الاصطناعي مع مصادر موثوقة.',
     'https://perplexity.ai', 'freemium', 20.00, 'USD', cat_search,
     ARRAY['search','research','citations'], '[{"title":"مصادر","desc":"روابط لكل إجابة"},{"title":"Focus modes","desc":"Academic, YouTube, ..."}]'::jsonb,
     false, true, '{"views":0,"saves":0,"uses":0,"rating":4.5,"reviews_count":3890}'::jsonb)
  ON CONFLICT (slug) DO NOTHING;
END $$;

-- =============================================
-- 3. Sample Articles (Arabic)
-- =============================================
DO $$
DECLARE
  cat_assistants UUID;
  cat_coding UUID;
  cat_images UUID;
BEGIN
  SELECT id INTO cat_assistants FROM categories WHERE slug = 'ai-assistants';
  SELECT id INTO cat_coding FROM categories WHERE slug = 'coding';
  SELECT id INTO cat_images FROM categories WHERE slug = 'image-generation';

  INSERT INTO articles (title, slug, excerpt, content, author_id, category_id, tags, status, featured, read_time, published_at, is_premium)
  VALUES
    ('دليلك الشامل لأدوات الذكاء الاصطناعي في 2026',
     'ai-tools-guide-2026',
     'اكتشف أهم أدوات الذكاء الاصطناعي وأكثرها قوة في هذا الدليل الشامل.',
     '# دليلك الشامل لأدوات الذكاء الاصطناعي في 2026

في هذا الدليل نستعرض أهم الأدوات المتاحة في 2026 ونقارن بينها من حيث السعر والمميزات.

## أدوات المحادثة
- ChatGPT: الخيار الأكثر شعبية
- Claude: الأفضل للمحادثات الطويلة
- Gemini: مدمج مع بحث Google

## أدوات توليد الصور
- Midjourney: للجودة الفنية
- DALL-E 3: للدقة في التعليمات

## نصائح
1. حدد هدفك قبل اختيار الأداة
2. جرب النسخ المجانية أولاً
3. اقرأ التقييمات العربية على منصاتنا',
     NULL, cat_assistants, ARRAY['AI','guide','2026'], 'published', true, 8, NOW(), false)
  ON CONFLICT (slug) DO NOTHING;

  INSERT INTO articles (title, slug, excerpt, content, author_id, category_id, tags, status, featured, read_time, published_at, is_premium)
  VALUES
    ('GitHub Copilot: كيف تسرّع شغلك 10x',
     'github-copilot-tutorial',
     'تعلم كيف تستخدم GitHub Copilot لزيادة إنتاجيتك في كتابة الكود.',
     '# GitHub Copilot: دليلك العملي

Copilot أداة من GitHub وOpenAI تقترح كود وأنت تكتب.

## كيف تبدأ
1. Install extension في VSCode
2. سجّل بحساب GitHub
3. ابدأ بكتابة كود طبيعي

## نصائح
- اكتب comments واضحة
- استخدم chat للشرح
- راجع دائماً قبل القبول',
     NULL, cat_coding, ARRAY['coding','copilot','tutorial'], 'published', false, 5, NOW(), false)
  ON CONFLICT (slug) DO NOTHING;

  INSERT INTO articles (title, slug, excerpt, content, author_id, category_id, tags, status, featured, read_time, published_at, is_premium)
  VALUES
    ('Midjourney vs DALL-E 3: مقارنة شاملة',
     'midjourney-vs-dalle',
     'أيهما أفضل لتوليد الصور؟ مقارنة تفصيلية من حيث الجودة والسعر.',
     '# Midjourney vs DALL-E 3

مقارنة شاملة بين أشهر مولدي الصور.

## الجودة
- Midjourney: أفضل للجودة الفنية
- DALL-E 3: أفضل في فهم التعليمات

## السعر
- Midjourney: $10/شهر
- DALL-E 3: متاح مع ChatGPT Plus

## الخلاصة
- للفنانين: Midjourney
- للسرعة: DALL-E 3',
     NULL, cat_images, ARRAY['images','comparison','midjourney','dalle'], 'published', false, 6, NOW(), false)
  ON CONFLICT (slug) DO NOTHING;
END $$;

-- =============================================
-- 4. Newsletter subscribers (empty by default)
-- =============================================
-- (no seed)

SELECT '✅ Arabic seed data inserted successfully!' AS status;
