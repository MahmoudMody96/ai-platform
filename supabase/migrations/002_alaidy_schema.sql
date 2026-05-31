-- =============================================
-- AL.AI.DY Database Schema
-- Arabic AI Directory Platform
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- CATEGORIES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_ar TEXT NOT NULL,
  name_en TEXT,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT DEFAULT 'Sparkles',
  color TEXT DEFAULT '#8B5CF6',
  tool_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TOOLS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS tools (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  tagline TEXT,
  description TEXT,
  long_description TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  website_url TEXT,
  pricing_type TEXT CHECK (pricing_type IN ('free', 'freemium', 'paid', 'contact')) DEFAULT 'free',
  pricing_info JSONB DEFAULT '{}',
  logo_url TEXT,
  screenshots JSONB DEFAULT '[]',
  features JSONB DEFAULT '[]',
  pros JSONB DEFAULT '[]',
  cons JSONB DEFAULT '[]',
  rating DECIMAL(2,1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- ARTICLES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT,
  cover_image TEXT,
  author_id UUID,
  author_name TEXT DEFAULT 'فريق AL.AI.DY',
  category TEXT DEFAULT 'شروحات',
  tags JSONB DEFAULT '[]',
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  read_time INTEGER DEFAULT 5,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- PROFILES TABLE (extends auth.users)
-- =============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  avatar_url TEXT,
  bio TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'editor')),
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- FAVORITES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  tool_id UUID REFERENCES tools(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, tool_id)
);

-- =============================================
-- REVIEWS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  tool_id UUID REFERENCES tools(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  content TEXT,
  pros TEXT,
  cons TEXT,
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- NEWSLETTER TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS newsletter (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  subscribed_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- COMMENTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- ENABLE ROW LEVEL SECURITY
-- =============================================
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- =============================================
-- RLS POLICIES
-- =============================================

-- Categories: Public read
CREATE POLICY "Public can read categories" ON categories
  FOR SELECT USING (true);

-- Tools: Public read published
CREATE POLICY "Public can read tools" ON tools
  FOR SELECT USING (is_published = true);

-- Articles: Public read published
CREATE POLICY "Public can read articles" ON articles
  FOR SELECT USING (is_published = true);

-- Profiles: Public read
CREATE POLICY "Public can read profiles" ON profiles
  FOR SELECT USING (true);

-- Favorites: Users manage own
CREATE POLICY "Users manage own favorites" ON favorites
  FOR ALL USING (auth.uid() = user_id);

-- Reviews: Public read approved, users create own
CREATE POLICY "Public can read approved reviews" ON reviews
  FOR SELECT USING (is_approved = true);

CREATE POLICY "Users can create own reviews" ON reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews" ON reviews
  FOR UPDATE USING (auth.uid() = user_id);

-- Newsletter: Public insert
CREATE POLICY "Public can subscribe" ON newsletter
  FOR INSERT WITH CHECK (true);

-- Comments: Public read approved
CREATE POLICY "Public can read comments" ON comments
  FOR SELECT USING (is_approved = true);

CREATE POLICY "Users can create comments" ON comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =============================================
-- SEED DATA - Categories (Arabic)
-- =============================================
INSERT INTO categories (name_ar, slug, description, icon, color) VALUES
('مساعدون ذكيون', 'ai-assistants', 'أدوات محادثة وكتابة ذكية', 'Bot', '#8B5CF6'),
('توليد الصور', 'image-generation', 'أدوات إنشاء وتحرير الصور', 'Image', '#EC4899'),
('أتمتة العمليات', 'automation', 'أدوات لأتمتة المهام', 'Zap', '#06B6D4'),
('برمجة', 'coding', 'أدوات مساعدة البرمجة', 'Code', '#10B981'),
('صوت', 'audio', 'أدوات تحويل النص لصوت والعكس', 'Mic', '#F59E0B'),
('فيديو', 'video', 'أدوات إنشاء وتحرير الفيديو', 'Video', '#EF4444'),
('بحث', 'search', 'محركات بحث ذكية', 'Globe', '#3B82F6'),
('كتابة', 'writing', 'أدوات كتابة وتحرير النصوص', 'Pen', '#8B5CF6');

-- =============================================
-- SEED DATA - Tools (Arabic)
-- =============================================
INSERT INTO tools (name, slug, tagline, description, category_id, website_url, pricing_type, features, is_featured, rating, review_count)
SELECT 'ChatGPT', 'chatgpt', 'أذكى مساعد ذكي في العالم', 'مساعد ذكي من OpenAI للمحادثة والكتابة والترجمة', id, 'https://chat.openai.com', 'freemium', '["محادثة ذكية","كتابة محتوى","ترجمة","برمجة","تحليل بيانات"]', true, 4.9, 15420
FROM categories WHERE slug = 'ai-assistants';

INSERT INTO tools (name, slug, tagline, description, category_id, website_url, pricing_type, features, is_featured, rating, review_count)
SELECT 'Claude', 'claude', 'مساعدك الذكي للتأمل والتحليل', 'مساعد ذكي من Anthropic للمحادثة والتحليل الإبداعي', id, 'https://claude.ai', 'freemium', '["محادثة متقدمة","تحليل نصوص","كتابة إبداعية","استدلال منطقي"]', true, 4.8, 8920
FROM categories WHERE slug = 'ai-assistants';

INSERT INTO tools (name, slug, tagline, description, category_id, website_url, pricing_type, features, is_featured, rating, review_count)
SELECT 'Midjourney', 'midjourney', 'حوّل أفكارك إلى صور فنية', 'أداة متقدمة لتوليد الصور بالذكاء الاصطناعي', id, 'https://midjourney.com', 'paid', '["توليد صور فنية","أنماط متعددة","جودة عالية","Variations"]', true, 4.7, 6540
FROM categories WHERE slug = 'image-generation';

INSERT INTO tools (name, slug, tagline, description, category_id, website_url, pricing_type, features, is_featured, rating, review_count)
SELECT 'Gemini', 'gemini', 'من Google مع قوة البحث', 'مساعد ذكي من Google للمحادثة والبحث', id, 'https://gemini.google.com', 'free', '["بحث شامل","تحليل صور","كتابة محتوى","ترجمة فورية"]', true, 4.6, 4820
FROM categories WHERE slug = 'ai-assistants';

INSERT INTO tools (name, slug, tagline, description, category_id, website_url, pricing_type, features, is_featured, rating, review_count)
SELECT 'DALL-E 3', 'dall-e-3', 'صور من خيالك', 'أداة OpenAI لتوليد الصور من النصوص', id, 'https://openai.com/dall-e-3', 'paid', '["توليد صور","تحرير الصور","Variations","جودة HD"]', true, 4.5, 3280
FROM categories WHERE slug = 'image-generation';

INSERT INTO tools (name, slug, tagline, description, category_id, website_url, pricing_type, features, is_featured, rating, review_count)
SELECT 'GitHub Copilot', 'github-copilot', 'صديقك في البرمجة', 'مساعد برمجي من GitHub وOpenAI', id, 'https://github.com/features/copilot', 'paid', '["اكمال الكود","شرح الكود","كتابة اختبارات","Debugging"]', true, 4.4, 12850
FROM categories WHERE slug = 'coding';

INSERT INTO tools (name, slug, tagline, description, category_id, website_url, pricing_type, features, is_featured, rating, review_count)
SELECT 'Notion AI', 'notion-ai', 'ذكاء اصطناعي داخل Notion', 'مساعد ذكي لكتابة الملاحظات والتنظيم', id, 'https://notion.so', 'paid', '["كتابة ملاحظات","تلخيص","ترجمة","عصف ذهني"]', false, 4.3, 2150
FROM categories WHERE slug = 'writing';

INSERT INTO tools (name, slug, tagline, description, category_id, website_url, pricing_type, features, is_featured, rating, review_count)
SELECT 'Perplexity', 'perplexity', 'محرك البحث الذكي', 'محرك بحث يستخدم الذكاء الاصطناعي', id, 'https://perplexity.ai', 'freemium', '["بحث ذكي","مصادر موثوقة","محادثة","Follow-up"]', true, 4.5, 3890
FROM categories WHERE slug = 'search';

INSERT INTO tools (name, slug, tagline, description, category_id, website_url, pricing_type, features, is_featured, rating, review_count)
SELECT 'ElevenLabs', 'elevenlabs', 'أصوات طبيعية بالذكاء الاصطناعي', 'أداة تحويل النص إلى صوت بأصوات واقعية', id, 'https://elevenlabs.io', 'freemium', '["نصوص لصوت","استنساخ الأصوات","Multiple languages","Dubbing"]', false, 4.6, 1820
FROM categories WHERE slug = 'audio';

INSERT INTO tools (name, slug, tagline, description, category_id, website_url, pricing_type, features, is_featured, rating, review_count)
SELECT 'Runway', 'runway', 'أفلام من النصوص', 'منصة إنتاج فيديو متقدمة بالذكاء الاصطناعي', id, 'https://runwayml.com', 'paid', '["توليد فيديو","تحرير فيديو","Gen-2","أدوات متقدمة"]', false, 4.4, 2560
FROM categories WHERE slug = 'video';

INSERT INTO tools (name, slug, tagline, description, category_id, website_url, pricing_type, features, is_featured, rating, review_count)
SELECT 'Zapier', 'zapier', 'أتمتة كل شيء', 'أداة لأتمتة العمليات بين التطبيقات', id, 'https://zapier.com', 'paid', '["أتمتة workflows","Integrations","AI Actions","Multi-step"]', false, 4.3, 3240
FROM categories WHERE slug = 'automation';

INSERT INTO tools (name, slug, tagline, description, category_id, website_url, pricing_type, features, is_featured, rating, review_count)
SELECT 'Jasper', 'jasper', 'كاتب ذكي للمحتوى', 'أداة كتابة محتوى تسويقي بالذكاء الاصطناعي', id, 'https://jasper.ai', 'paid', '["كتابة محتوى","قصص اجتماعية","مقالات","ترجمة"]', false, 4.2, 1980
FROM categories WHERE slug = 'writing';

-- =============================================
-- SEED DATA - Articles (Arabic)
-- =============================================
INSERT INTO articles (title, slug, excerpt, content, category, tags, is_published, published_at, read_time, views)
VALUES
(
  'دليلك الشامل لأدوات الذكاء الاصطناعي في 2026',
  'ai-tools-guide-2026',
  'اكتشف أحدث أدوات الذكاء الاصطناعي وأكثرها قوة في هذا الدليل الشامل',
  '# دليلك الشامل لأدوات الذكاء الاصطناعي في 2026

## مقدمة

شهد عام 2026 تطورات هائلة في مجال الذكاء الاصطناعي. في هذا الدليل الشامل، سنستعرض أفضل الأدوات المتاحة وكيفية استخدامها بفعالية.

## أدوات المحادثة

### ChatGPT
منصة OpenAI أصبحت الخيار الأول للملايين حول العالم. يتميز بـ:
- فهم السياق بعمق
- دعم العربية بشكل ممتاز
- قدرة على الكتابة والترجمة

### Claude
من Anthropic، يتميز بـ:
- طول المحادثة
- التحليل العميق
- الكتابة الإبداعية

## أدوات توليد الصور

### Midjourney
الخيار الأول للفنانين والمصممين.

### DALL-E 3
من OpenAI، يتميز بدقة التفاصيل.

## نصائح للاستخدام

1. **ابدأ بسيط**: لا تكثر من الطلبات في مرة واحدة
2. **كن محدداً**: كلما كان طلبك واضحاً، كانت النتيجة أفضل
3. **كرر وعدّل**: لا تتردد في طلب التعديلات

## الخلاصة

الذكاء الاصطناعي أصبح أداة أساسية في حياتنا اليومية. البدء باستخدام هذه الأدوات هو الخطوة الأولى نحو الإنتاجية.',
  'شروحات',
  '["AI","أدوات","دليل","2026"]',
  true,
  NOW(),
  8,
  2450
),

(
  'مقارنة: ChatGPT vs Claude - أيهما أفضل؟',
  'chatgpt-vs-claude',
  'مقارنة تفصيلية بين أقوى مساعدين ذكيين: ChatGPT و Claude',
  '# مقارنة: ChatGPT vs Claude

## من هذا المقال؟

سنتعرف على الفروقات الرئيسية بين ChatGPT و Claude لمساعدتك في اختيار الأنسب لاحتياجاتك.

## ChatGPT

**المميزات:**
- شعبية كبيرة
- دعم ممتاز للغة العربية
- سرعة استجابة عالية
- نظام Plugin

**العيوب:**
- قد يقطع المحادثات الطويلة
- المعرفة محدودة بـ 2023

## Claude

**المميزات:**
- طول السياق حتى 200K token
- أفضل في التحليل العميق
- أكثر أماناً حسب الشركة
- Claude.ai للبحث

**العيوب:**
- أبطأ قليلاً
- أقل شهرة

## الخلاصة

الاختيار يعتمد على استخدامك:
- **للبرمجة**: ChatGPT
- **للكتابة الطويلة**: Claude
- **للمحادثة العامة**: كليهما ممتازان',
  'مقارنات',
  '["ChatGPT","Claude","مقارنة"]',
  true,
  NOW(),
  6,
  3890
),

(
  'كيف تستخدم Midjourney لإنشاء صور مذهلة',
  'midjourney-tutorial',
  'دليل خطوة بخطوة لاستخدام Midjourney',
  '# كيف تستخدم Midjourney لإنشاء صور مذهلة

## ما هو Midjourney؟

Midjourney هو أداة توليد صور بالذكاء الاصطناعي اشتهرت بصورها الفنية المميزة.

## كيف تبدأ؟

### 1. التسجيل
1. اذهب إلى discord.gg/midjourney
2. أنشئ حساب Discord
3. انضم لخادم Midjourney

### 2. الأوامر الأساسية

```
/imagine prompt: description
```

### 3. نصائح للصور الأفضل

- **كن محدداً**: حدد الأسلوب، الإضاءة، الألوان
- **استخدم references**: أضف صور مرجعية
- **Experiment**: جرب أنماط مختلفة

## جودة الصورة

- `--q 1` أو `--q 2`: جودة أعلى
- `--ar 16:9`: نسبة العرض للارتفاع
- `--v 5`: أحدث إصدار

## الخلاصة

Midjourney أداة قوية للفنانين والمصممين. مع الممارسة، ستنتج صوراً مذهلة.',
  'شروحات',
  '["Midjourney","صور","Tutorial"]',
  true,
  NOW(),
  7,
  1680
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================
CREATE INDEX IF NOT EXISTS idx_tools_category ON tools(category_id);
CREATE INDEX IF NOT EXISTS idx_tools_slug ON tools(slug);
CREATE INDEX IF NOT EXISTS idx_tools_featured ON tools(is_featured);
CREATE INDEX IF NOT EXISTS idx_tools_published ON tools(is_published);
CREATE INDEX IF NOT EXISTS idx_tools_rating ON tools(rating DESC);

CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(is_published);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);

CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_tool ON reviews(tool_id);
CREATE INDEX IF NOT EXISTS idx_reviews_approved ON reviews(is_approved);

-- =============================================
-- GRANT PERMISSIONS
-- =============================================
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- =============================================
-- FUNCTION: Update updated_at
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- TRIGGERS
-- =============================================
DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_tools_updated_at ON tools;
CREATE TRIGGER update_tools_updated_at
  BEFORE UPDATE ON tools
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_articles_updated_at ON articles;
CREATE TRIGGER update_articles_updated_at
  BEFORE UPDATE ON articles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_reviews_updated_at ON reviews;
CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- DONE!
-- =============================================
SELECT '✅ AL.AI.DY Database created successfully!' as status;
