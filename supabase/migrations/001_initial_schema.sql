-- =============================================
-- AI Platform Database Schema
-- Run this in Supabase SQL Editor
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
  color TEXT DEFAULT '#6366f1',
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
  content TEXT,
  excerpt TEXT,
  cover_image TEXT,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  tags JSONB DEFAULT '[]',
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- PROFILES TABLE (extends auth.users)
-- =============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'editor')),
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
  tool_id UUID REFERENCES tools(id) ON DELETE SET NULL,
  article_id UUID REFERENCES articles(id) ON DELETE SET NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  content TEXT,
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
-- ENABLE ROW LEVEL SECURITY
-- =============================================
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter ENABLE ROW LEVEL SECURITY;

-- =============================================
-- RLS POLICIES
-- =============================================

-- Categories: Public read
DROP POLICY IF EXISTS "Public can read categories" ON categories;
CREATE POLICY "Public can read categories" ON categories
  FOR SELECT USING (true);

-- Tools: Public read published
DROP POLICY IF EXISTS "Public can read published tools" ON tools;
CREATE POLICY "Public can read published tools" ON tools
  FOR SELECT USING (is_published = true);

-- Articles: Public read published
DROP POLICY IF EXISTS "Public can read published articles" ON articles;
CREATE POLICY "Public can read published articles" ON articles
  FOR SELECT USING (is_published = true);

-- Profiles: Public read
DROP POLICY IF EXISTS "Public can read profiles" ON profiles;
CREATE POLICY "Public can read profiles" ON profiles
  FOR SELECT USING (true);

-- Favorites: Users manage own
DROP POLICY IF EXISTS "Users manage own favorites" ON favorites;
CREATE POLICY "Users manage own favorites" ON favorites
  FOR ALL USING (auth.uid() = user_id);

-- Reviews: Public read approved
DROP POLICY IF EXISTS "Public can read approved reviews" ON reviews;
CREATE POLICY "Public can read approved reviews" ON reviews
  FOR SELECT USING (is_approved = true);

-- Reviews: Users create own
DROP POLICY IF EXISTS "Users can create own reviews" ON reviews;
CREATE POLICY "Users can create own reviews" ON reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Newsletter: Public insert
DROP POLICY IF EXISTS "Public can subscribe" ON newsletter;
CREATE POLICY "Public can subscribe" ON newsletter
  FOR INSERT WITH CHECK (true);

-- =============================================
-- SEED DATA - Arabic Categories
-- =============================================
INSERT INTO categories (name_ar, slug, description, icon, color) VALUES
('كتابة المحتوى', 'content-writing', 'أدوات لكتابة المحتوى والنسخ والمقالات', 'PenTool', '#6366f1'),
('توليد الصور', 'image-generation', 'أدوات لإنشاء وتحرير الصور بالذكاء الاصطناعي', 'Image', '#ec4899'),
('مساعدون ذكيون', 'ai-assistants', 'مساعدون ذكيون للمهام المختلفة', 'Bot', '#8b5cf6'),
('تحليل البيانات', 'data-analysis', 'أدوات لتحليل واستخراج البيانات', 'BarChart3', '#f59e0b'),
('أتمتة العمليات', 'automation', 'أدوات لأتمتة العمليات المتكررة', 'Zap', '#10b981'),
('ترجمة لغوية', 'translation', 'أدوات ترجمة فورية ومتقدمة', 'Languages', '#06b6d4'),
('تعلم الآلة', 'machine-learning', 'أدوات ونماذج للتعلم الآلي', 'Brain', '#f43f5e'),
('أخرى', 'other', 'أدوات متنوعة للذكاء الاصطناعي', 'Sparkles', '#64748b')
ON CONFLICT (slug) DO NOTHING;

-- =============================================
-- SEED DATA - Sample Tools
-- =============================================
INSERT INTO tools (name, slug, description, category_id, website_url, pricing_type, features, is_featured)
SELECT 
  'ChatGPT',
  'chatgpt',
  'مساعد ذكي من OpenAI للمحادثة وكتابة المحتوى والترجمة',
  id,
  'https://chat.openai.com',
  'freemium',
  '["محادثة ذكية", "كتابة محتوى", "ترجمة فورية", "تلخيص نصوص", "برمجة"]',
  true
FROM categories WHERE slug = 'ai-assistants'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO tools (name, slug, description, category_id, website_url, pricing_type, features, is_featured)
SELECT 
  'Claude',
  'claude',
  'مساعد ذكي من Anthropic للمحادثة والتحليل الإبداعي',
  id,
  'https://claude.ai',
  'freemium',
  '["محادثة متقدمة", "تحليل نصوص", "كتابة إبداعية", "الاستدلال المنطقي"]',
  true
FROM categories WHERE slug = 'ai-assistants'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO tools (name, slug, description, category_id, website_url, pricing_type, features, is_featured)
SELECT 
  'Midjourney',
  'midjourney',
  'أداة متقدمة لتوليد الصور بالذكاء الاصطناعي',
  id,
  'https://midjourney.com',
  'paid',
  '["توليد صور فنية", "أنماط متعددة", "تحسين الجودة", "Variation"]',
  true
FROM categories WHERE slug = 'image-generation'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO tools (name, slug, description, category_id, website_url, pricing_type, features, is_featured)
SELECT 
  'DALL-E',
  'dall-e',
  'أداة OpenAI لتوليد الصور من النصوص',
  id,
  'https://openai.com/dall-e-3',
  'paid',
  '["توليد صور", "تحرير الصور", "Variations", "Quality HD"]',
  false
FROM categories WHERE slug = 'image-generation'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO tools (name, slug, description, category_id, website_url, pricing_type, features, is_featured)
SELECT 
  'Gemini',
  'gemini',
  'مساعد ذكي من Google للمحادثة والبحث',
  id,
  'https://gemini.google.com',
  'free',
  '["محادثة ذكية", "بحث شامل", "تحليل صور", "كتابة محتوى"]',
  true
FROM categories WHERE slug = 'ai-assistants'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO tools (name, slug, description, category_id, website_url, pricing_type, features, is_featured)
SELECT 
  'Notion AI',
  'notion-ai',
  'مساعد ذكي لكتابة الملاحظات والتنظيم',
  id,
  'https://notion.so',
  'paid',
  '["كتابة ملاحظات", "تلخيص", "ترجمة", "العصف الذهني"]',
  false
FROM categories WHERE slug = 'content-writing'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO tools (name, slug, description, category_id, website_url, pricing_type, features, is_featured)
SELECT 
  'GitHub Copilot',
  'github-copilot',
  'مساعد برمجي من GitHub وOpenAI',
  id,
  'https://github.com/features/copilot',
  'paid',
  '["اكمال الكود", "شرح الكود", "كتابة اختبارات", "Debugging"]',
  true
FROM categories WHERE slug = 'automation'
ON CONFLICT (slug) DO NOTHING;

-- =============================================
-- SEED DATA - Sample Articles
-- =============================================
INSERT INTO articles (title, slug, content, excerpt, is_published, published_at)
VALUES
(
  'مقدمة في الذكاء الاصطناعي',
  'introduction-to-ai',
  '# مقدمة في الذكاء الاصطناعي

الذكاء الاصطناعي (AI) هو فرع من علوم الحاسوب يهدف إلى إنشاء أنظمة قادرة على محاكاة الذكاء البشري.

## ما هو الذكاء الاصطناعي؟

الذكاء الاصطناعي هو قدرة الآلات على التعلم من البيانات واتخاذ القرارات بناءً عليها.

## أنواع الذكاء الاصطناعي

1. **تعلم الآلة (Machine Learning)**: أنظمة تتعلم من البيانات
2. **التعلم العميق (Deep Learning)**: شبكات عصبية معقدة
3. **معالجة اللغة الطبيعية (NLP)**: فهم وإنتاج اللغة البشرية

## تطبيقات الذكاء الاصطناعي

- المساعدات الافتراضية
- التعرف على الصور
- السيارات ذاتية القيادة
- الترجمة الآلية
- تحليل البيانات',
  'اكتشف أساسيات الذكاء الاصطناعي وكيف يعمل وتقنياته المختلفة',
  true,
  NOW()
),
(
  'أفضل أدوات توليد الصور بالذكاء الاصطناعي 2026',
  'best-ai-image-generators-2026',
  '# أفضل أدوات توليد الصور بالذكاء الاصطناعي

في هذا المقال نستعرض أفضل الأدوات المتاحة لتوليد الصور بالذكاء الاصطناعي.

## أفضل الأدوات

### 1. Midjourney
أفضل أداة للفنانين والمصممين المحترفين.

### 2. DALL-E 3
من OpenAI، ممتازة للتحكم في التفاصيل.

### 3. Stable Diffusion
مفتوحة المصدر، يمكن تشغيلها محلياً.

### 4. Adobe Firefly
مدمجة مع أدوات Adobe الاحترافية.

## كيف تختار الأداة المناسبة؟

اختر الأداة بناءً على:
- مستوى خبرتك
- نوع الصور المطلوبة
- الميزانية المتاحة',
  'قارن بين أفضل أدوات توليد الصور بالذكاء الاصطناعي واختر الأنسب لك',
  true,
  NOW()
),
(
  'كيف تستخدم ChatGPT بفعالية',
  'how-to-use-chatgpt-effectively',
  '# كيف تستخدم ChatGPT بفعالية

ChatGPT هو مساعد ذكي يمكنه مساعدتك في مهام كثيرة. إليك نصائح لاستخدامه بفعالية.

## نصائح أساسية

### 1. كن محدداً في أسئلتك
كلما كانت提问 أكثر تحديداً، كانت الإجابات أفضل.

### 2. استخدم السياق
قدم معلومات خلفية للحصول على إجابات أدق.

### 3. اطلب إعادة الصياغة
إذا لم يعجبك الرد، اطلب منه إعادة صياغته.

### 4. قسّم المهام الكبيرة
اطلب منه تقسيم المهام الكبيرة إلى خطوات صغيرة.

## استخدامات متقدمة

- كتابة الأكواد البرمجية
- تحليل البيانات
- الترجمة والمراجعة
- العصف الذهني
- كتابة المحتوى',
  'تعلم كيف تحصل على أفضل النتائج من ChatGPT مع نصائح واستراتيجيات متقدمة',
  true,
  NOW()
)
ON CONFLICT (slug) DO NOTHING;

-- =============================================
-- FUNCTION: Update updated_at timestamp
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- TRIGGERS: Auto-update updated_at
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

DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_reviews_updated_at ON reviews;
CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- INDEXES: Improve query performance
-- =============================================
CREATE INDEX IF NOT EXISTS idx_tools_category ON tools(category_id);
CREATE INDEX IF NOT EXISTS idx_tools_slug ON tools(slug);
CREATE INDEX IF NOT EXISTS idx_tools_featured ON tools(is_featured);
CREATE INDEX IF NOT EXISTS idx_tools_published ON tools(is_published);

CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(is_published);
CREATE INDEX IF NOT EXISTS idx_articles_author ON articles(author_id);

CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_tool ON favorites(tool_id);

CREATE INDEX IF NOT EXISTS idx_reviews_tool ON reviews(tool_id);
CREATE INDEX IF NOT EXISTS idx_reviews_article ON reviews(article_id);
CREATE INDEX IF NOT EXISTS idx_reviews_approved ON reviews(is_approved);

-- =============================================
-- GRANT PERMISSIONS
-- =============================================
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- =============================================
-- COMPLETION MESSAGE
-- =============================================
SELECT 'Database schema created successfully!' as status;
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
