# خطة إصلاح وتطوير منصة AI Platform

## الحالة الحالية

### ✅ ما تم إصلاحه مؤخراً
- ✅ خطأ SVG path في صفحة الرئيسية
- ✅ خطأ QueryClientProvider
- ✅ APIs ترجع بيانات فاضية بدل 500 error
- ✅ middleware.ts → proxy.ts لـ Next.js 16
- ✅ Build يمر بنجاح

### ❌ المشاكل المتبقية

#### 1. مشاكل البيانات (أولوية عالية)
```
- Supabase Schema غير مطابق للـ APIs
- البيانات في قاعدة البيانات Chinese أو placeholder
- APIs ترجع 500 error
```

#### 2. مشاكل الـ Pages
```
- /tools - بتحتاج بيانات من API
- /blog - بتحتاج بيانات من API
- /categories - بتحتاج بيانات من API
- صفحة التفاصيل [slug] - بتحتاج بيانات
```

#### 3. مشاكل Admin
```
- /admin - بتحتاج Supabase connection
- Admin pages بتحتاج setState in effect fix
```

---

## خطة العمل

### المرحلة 1: إصلاح Database Schema (اليوم)

#### 1.1 إنشاء Database Migration
```sql
-- إنشاء الجداول الأساسية

-- categories
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_ar TEXT NOT NULL,
  name_en TEXT,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT,
  tool_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- tools
CREATE TABLE tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  long_description TEXT,
  category_id UUID REFERENCES categories(id),
  website_url TEXT,
  pricing_type TEXT CHECK (pricing_type IN ('free', 'freemium', 'paid', 'contact')),
  pricing_info JSONB,
  logo_url TEXT,
  screenshots JSONB,
  features JSONB,
  pros JSONB,
  cons JSONB,
  rating DECIMAL(2,1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- articles
CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT,
  excerpt TEXT,
  cover_image TEXT,
  author_id UUID REFERENCES auth.users(id),
  category_id UUID REFERENCES categories(id),
  tags JSONB,
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- users
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'editor')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- favorites
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  tool_id UUID REFERENCES tools(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, tool_id)
);

-- reviews
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  tool_id UUID REFERENCES tools(id),
  article_id UUID REFERENCES articles(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  content TEXT,
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- newsletter
CREATE TABLE newsletter (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  subscribed_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter ENABLE ROW LEVEL SECURITY;

-- RLS Policies (public read)
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public read tools" ON tools FOR SELECT USING (true);
CREATE POLICY "Public read articles" ON articles FOR SELECT USING (is_published = true);
CREATE POLICY "Public read profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can manage own favorites" ON favorites FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Public read reviews" ON reviews FOR SELECT USING (is_approved = true);
CREATE POLICY "Public insert newsletter" ON newsletter FOR INSERT WITH CHECK (true);
```

#### 1.2 Seed Data (Arabic)
```sql
-- Seed Categories
INSERT INTO categories (name_ar, slug, description, icon, color) VALUES
('كتابة المحتوى', 'content-writing', 'أدوات لكتابة المحتوى والنسخ', 'PenTool', '#6366f1'),
('توليد الصور', 'image-generation', 'أدوات لإنشاء وتحرير الصور بالذكاء الاصطناعي', 'Image', '#ec4899'),
('مساعدون ذكيون', 'assistants', 'مساعدون ذكيون للمهام المختلفة', 'Bot', '#8b5cf6'),
('تحليل البيانات', 'data-analysis', 'أدوات لتحليل واستخراج البيانات', 'BarChart3', '#f59e0b'),
('أتمتة العمليات', 'automation', 'أدوات لأتمتة العمليات المتكررة', 'Zap', '#10b981'),
('ترجمة لغوية', 'translation', 'أدوات ترجمة فورية ومتقدمة', 'Languages', '#06b6d4'),
('تعلم الآلة', 'machine-learning', 'أدوات ونماذج للتعلم الآلي', 'Brain', '#f43f5e'),
('أخرى', 'other', 'أدوات متنوعة للذكاء الاصطناعي', 'Sparkles', '#64748b');

-- Seed Tools
INSERT INTO tools (name, slug, description, category_id, website_url, pricing_type, features, is_featured) VALUES
('ChatGPT', 'chatgpt', 'مساعد ذكي من OpenAI للمحادثة والت写作', (SELECT id FROM categories WHERE slug = 'assistants'), 'https://chat.openai.com', 'freemium', '["محادثة ذكية", "كتابة محتوى", "ترجمة", "تلخيص"]', true),
('Midjourney', 'midjourney', 'أداة لتوليد الصور بالذكاء الاصطناعي', (SELECT id FROM categories WHERE slug = 'image-generation'), 'https://midjourney.com', 'paid', '["توليد صور", "تعديل الصور", "أنماط متعددة"]', true),
('Claude', 'claude', 'مساعد ذكي من Anthropic', (SELECT id FROM categories WHERE slug = 'assistants'), 'https://claude.ai', 'freemium', '["محادثة", "تحليل نصوص", "كتابة إبداعية"]', true);
```

---

### المرحلة 2: إصلاح الـ APIs (غداً)

#### 2.1 تحديث /api/tools
```typescript
// src/app/api/tools/route.ts
// - إضافة validation للـ query params
// - إضافة caching
// - تحسين error handling
```

#### 2.2 تحديث /api/articles
```typescript
// src/app/api/articles/route.ts
// - نفس التحسينات
```

#### 2.3 إضافة /api/categories
```typescript
// src/app/api/categories/route.ts
// - GET all categories
// - POST create (admin only)
```

---

### المرحلة 3: تحسين الـ Frontend (هذا الأسبوع)

#### 3.1 صفحة الأدوات (/tools)
```
- إضافة search و filter
- إضافة pagination
- تحسين loading state
- إضافة error boundary
```

#### 3.2 صفحة المدونة (/blog)
```
- إضافة cards للمقالات
- تحسين grid layout
- إضافة loading skeleton
```

#### 3.3 لوحة التحكم (/dashboard)
```
- إضافة stats cards
- إضافة recent activity
- إضافة charts بسيطة
```

---

### المرحلة 4: تحسين Admin Panel (الأسبوع القادم)

#### 4.1 إصلاح CRUD Operations
```
- إضافة Forms للإضافة والتعديل
- إضافة delete confirmation
- إضافة success/error notifications
```

#### 4.2 إضافة Features
```
- Drag and drop reorder
- Bulk actions
- Import/Export CSV
```

---

### المرحلة 5: تحسين UX (مستمر)

#### 5.1 Performance
```
- إضافة next/image للأدوات
- إضافة loading skeletons
- تحسين Core Web Vitals
```

#### 5.2 Accessibility
```
- إضافة ARIA labels
- تحسين keyboard navigation
- إضافة focus states
```

#### 5.3 SEO
```
- إضافة meta tags
- إنشاء sitemap
- إضافة Open Graph images
```

---

## الجدول الزمني

| المرحلة | المدة | الحالة |
|---------|-------|--------|
| 1. Database Schema | 1 يوم | 🔴 لم تبدأ |
| 2. APIs | 1 يوم | 🔴 لم تبدأ |
| 3. Frontend | 3 أيام | 🔴 لم تبدأ |
| 4. Admin Panel | 3 أيام | 🔴 لم تبدأ |
| 5. UX Improvements | مستمر | 🔴 لم تبدأ |

---

## الأولويات

### 🔴 عاجل (اليوم)
1. إنشاء Supabase Schema
2. Seed البيانات بالعربي
3. اختبار الـ APIs

### 🟡 مهم (هذا الأسبوع)
1. تحسين صفحة الأدوات
2. تحسين صفحة المدونة
3. إضافة search/filter

### 🟢 تحسين (الأسبوع القادم)
1. Admin panel كامل
2. Dashboard with charts
3. Performance optimization

---

## الموارد المطلوبة

- Supabase account (متاح)
- Vercel account (متاح)
- 2-3 ساعات يومياً
- GitHub repo (متاح)

---

## للتنفيذ

هل تريد أن أبدأ بـ:
1. **إنشاء Supabase Schema** - لإصلاح قاعدة البيانات
2. **تحسين صفحة الأدوات** - لإصلاح الـ UI
3. **فقط إصلاح الأخطاء الحرجة** -解决 current errors

أخبرني وأبدأ فوراً! 🚀
