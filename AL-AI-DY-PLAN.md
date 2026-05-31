# AL.AI.DY - خطة البناء الشاملة

> **منصة عربية شاملة لأدوات ومحتوى الذكاء الاصطناعي**

---

## 🎯 الرؤية

**AL.AI.DY** = "العلي" بالعربي + .AI +ady (rhythm)

**Slogan:** "كل حاجة AI في مكان واحد"

**الهدف:** يكون المنصة الأولى عربياً للـ:
- اكتشاف أدوات AI جديدة
- قراءة مراجعات حقيقية
- تعلم من مقالات ومحتوى حصري
- مقارنة الأدوات واختيار الأنسب

---

## 🎨 الهوية البصرية

### الشعار (Logo Concept)
```
   ┌─────────────────────────────────┐
   │                                 │
   │    🤖 ← أيقونة AI بسيطة        │
   │                                 │
   │    AL.AI.DY                     │
   │    ─────────                    │
   │    أكبر دليل عربي لـ AI          │
   │                                 │
   └─────────────────────────────────┘
```

### الألوان (Color Palette)

| اللون | الكود | الاستخدام |
|-------|-------|----------|
| **Primary** | `#8B5CF6` (Violet) | الأزرار، الروابط، الـ accent |
| **Secondary** | `#06B6D4` (Cyan) | العناصر الثانوية |
| **Accent** | `#F59E0B` (Amber) | النجوم، التقييمات، Highlights |
| **Success** | `#10B981` (Emerald) | Success states |
| **Background Light** | `#FAFBFC` | الخلفية في الوضع الفاتح |
| **Background Dark** | `#0F0F1A` | الخلفية في الوضع الداكن |
| **Text Light** | `#1F2937` | النص في الوضع الفاتح |
| **Text Dark** | `#F9FAFB` | النص في الوضع الداكن |

### الخطوط (Typography)
- **العناوين:** Cairo (Google Fonts) - Bold
- **النص:** Cairo - Regular/Medium
- **الأرقام:** Inter (للإحصائيات)

### الأسلوب (Style)
- **Minimal Arabic** - تصميم عربي أصيل مش مترجم
- **Bento Grid** - كروت متدرجة الأحجام
- **Soft Shadows** - ظلال ناعمة
- **Micro-interactions** - حركات صغيرة عند التفاعل
- **Gradient Accents** - لمسات تدرج لونية

---

## 📦 المميزات (Features)

### 1. مكتبة الأدوات (Tools Library) ⭐
```
الصفحة: /tools
- Grid من الأدوات مع filters
- Search سريع
- Filters: الفئة، السعر، التقييم
- Sort: الأحدث، الأعلى تقييم، الأكثر شعبية
- Pagination أو Infinite scroll
- كل أداة فيها:
  - الاسم والصورة
  - الوصف المختصر
  - السعر (مجاني/مدفوع/freemium)
  - التقييم (نجوم + رقم)
  - عدد المراجعات
  - الفئة
```

### 2. تفاصيل الأداة (Tool Detail) ⭐⭐⭐
```
الصفحة: /tools/[slug]
- Hero section مع الصورة والـ CTA
- الوصف الكامل
- المميزات (Features list)
- الـ Pros & Cons
- لقطات شاشة (Screenshots)
- رابط الموقع
- Price info
- نظام التقييم + المراجعة
- مقارنات (Compare with...)
- أدوات مشابهة
- Comments/Discussion
```

### 3. نظام التقييم والمراجعات ⭐⭐⭐
```
Components:
- StarRating (1-5 نجوم)
- ReviewCard (اسم، تاريخ، تقييم، نص)
- ReviewForm (تقييم + عنوان + نص)
- AverageRating (نسبة + عدد تقييمات)

Features:
- التقييم يحتاج تسجيل دخول
- يمكن تقييم أداة مرة واحدة فقط
- يمكن كتابة review مع التقييم
- يمكن Edit/Delete review الخاص بك
- Admin يمكنه حذف أي review
```

### 4. مقارنة الأدوات (Compare) ⭐⭐
```
الصفحة: /compare
- اختيار 2-3 أدوات للمقارنة
- جدول مقارنة:
  - السعر
  - التقييم
  - المميزات
  - الفئة
  - رابط الموقع
- Highlight الفروقات
```

### 5. المدونة (Blog) ⭐⭐
```
الصفحة: /blog
- Grid من المقالات
- Categories: مراجعات، شروحات، أخبار، مقارنة
- Search
- Pagination

الصفحة: /blog/[slug]
- Hero مع الصورة
- المحتوى (Markdown)
- الكاتب والتاريخ
- مقالات مشابهة
- Comments
```

### 6. Dashboard شخصي ⭐⭐
```
الصفحة: /dashboard (للمسجلين)
- نظرة عامة (Overview)
  - عدد الأدوات المحفوظة
  - عدد المقالات المقروءة
  - عدد المراجعات المكتوبة
- المفضلة (Favorites)
  - قائمة الأدوات المحفوظة
  - Quick remove
- المراجعات (My Reviews)
  - قائمة مراجعاتي
  - Edit/Delete
- الإعدادات (Settings)
  - Profile
  - Password
  - Theme preference
```

### 7. نظام المستخدمين ⭐⭐
```
Auth:
- Register (email + password)
- Login
- Forgot Password
- Email verification (اختياري)

Profiles:
- الاسم
- البريد الإلكتروني
- الصورة (Gravatar أو upload)
- Bio
- Role (user/admin)
```

### 8. Newsletter ⭐
```
Components:
- NewsletterForm في Footer
- API endpoint للتسجيل

Features:
- Email validation
- Double opt-in (اختياري)
- Admin view للـ subscribers
```

### 9. Dark/Light Mode ⭐
```
Implementation:
- نظام ألوان CSS variables
- Toggle في Header
- حفظ preference في localStorage
- Respect system preference
```

---

## 🏗️ البنية التقنية (Architecture)

### Frontend
```
- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- React Query (TanStack Query)
- Zustand (State Management)
- Lucide React (Icons)
```

### Backend
```
- Supabase (Database + Auth)
- API Routes (Next.js)
- Vercel (Hosting)
```

### Database Schema

```sql
-- Categories
categories (
  id, name_ar, name_en, slug, 
  description, icon, color, 
  tool_count, created_at
)

-- Tools
tools (
  id, name, slug, description, 
  long_description, category_id,
  website_url, pricing_type, 
  logo_url, screenshots[], features[],
  pros[], cons[], rating, review_count,
  is_featured, is_published, created_at
)

-- Articles
articles (
  id, title, slug, content, excerpt,
  cover_image, author_id, category_id,
  tags[], is_published, published_at, created_at
)

-- Users/Profiles
profiles (
  id (FK auth.users), full_name, 
  avatar_url, bio, role, created_at
)

-- Favorites
favorites (
  id, user_id, tool_id, created_at
)

-- Reviews
reviews (
  id, user_id, tool_id, rating,
  title, content, is_approved, created_at
)

-- Newsletter
newsletter (
  id, email, is_active, subscribed_at
)
```

---

## 📄 الصفحات (Pages)

| الصفحة | المسار | الوصف |
|--------|--------|-------|
| الرئيسية | `/` | Hero + Featured tools + Stats |
| الأدوات | `/tools` | مكتبة الأدوات |
| تفاصيل أداة | `/tools/[slug]` | صفحة الأداة الكاملة |
| المقارنة | `/compare` | مقارنة الأدوات |
| المدونة | `/blog` | قائمة المقالات |
| مقال | `/blog/[slug]` | صفحة المقال |
| التصنيفات | `/categories` | تصنيفات الأدوات |
| التصنيف | `/categories/[slug]` | أدوات فئة معينة |
| Dashboard | `/dashboard` | لوحة المستخدم |
| الإعدادات | `/dashboard/settings` | إعدادات الحساب |
| تسجيل الدخول | `/auth/login` | Login |
| إنشاء حساب | `/auth/register` | Register |
| Admin | `/admin` | لوحة الأدمن |
| Admin - الأدوات | `/admin/tools` | إدارة الأدوات |
| Admin - المقالات | `/admin/articles` | إدارة المقالات |
| Admin - المراجعات | `/admin/reviews` | إدارة المراجعات |
| Admin - المستخدمين | `/admin/users` | إدارة المستخدمين |

---

## 🚀 خطة التنفيذ (Implementation Phases)

### Phase 1: الأساسيات (Week 1)
- [ ] Database Schema + Seed data
- [ ] Design System (globals.css)
- [ ] Layout + Header + Footer
- [ ] Homepage (البداية)
- [ ] Tools listing page
- [ ] Tool detail page
- [ ] Dark/Light mode

### Phase 2: المستخدمين (Week 2)
- [ ] Auth (Login + Register)
- [ ] Profile management
- [ ] Favorites system
- [ ] Dashboard

### Phase 3: المراجعات (Week 3)
- [ ] Review system
- [ ] Star rating
- [ ] Comments

### Phase 4: المدونة (Week 4)
- [ ] Blog listing
- [ ] Blog post page
- [ ] Author profiles

### Phase 5: المقارنة + Extra (Week 5)
- [ ] Compare page
- [ ] Newsletter
- [ ] Search
- [ ] SEO optimization
- [ ] Performance

### Phase 6: Admin (Week 6)
- [ ] Admin dashboard
- [ ] CRUD tools
- [ ] CRUD articles
- [ ] Moderation (reviews, comments)

---

## 🎨 التصميم (UI Design)

### Homepage Layout
```
┌────────────────────────────────────────────────────────────┐
│  HEADER (Logo + Nav + Theme Toggle + Auth)                │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  HERO SECTION                                              │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  "اكتشف أكبر دليل عربي لأدوات AI"                     │ │
│  │  [Search Bar]                                        │ │
│  │  [Stats: 500+ أداة | 200+ مقال | 50K+ مستخدم]     │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  FEATURED TOOLS (Grid 4 columns)                         │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                    │
│  │ChatGPT│ │Claude │ │Midjour│ │Gemini│                    │
│  └──────┘ └──────┘ └──────┘ └──────┘                    │
│                                                            │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  CATEGORIES (Icons Grid 6 items)                        │
│  🤖 مساعدون | 🎨 تصميم | 💻 برمجة | 🔊 صوت | 🎬 فيديو     │
│                                                            │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  BLOG SECTION (3 articles)                                 │
│  ┌────────────────────────────────────────────────────┐   │
│  │ مقال 1 │ مقال 2 │ مقال 3 │                        │   │
│  └────────────────────────────────────────────────────┘   │
│                                                            │
├────────────────────────────────────────────────────────────┤
│  FOOTER                                                   │
└────────────────────────────────────────────────────────────┘
```

### Tool Card Design
```
┌────────────────────────────┐
│  ┌────┐                    │
│  │ 🤖 │  ⭐ 4.8 (1.2K)    │
│  └────┘                    │
│                            │
│  ChatGPT                   │
│  مساعد ذكي من OpenAI...    │
│                            │
│  ┌────────┐ ┌────────┐    │
│  │مجاني ✓ │ │مساعدون │    │
│  └────────┘ └────────┘    │
│                            │
│  ════════════════════════  │
│  ❤️ حفظ  |  🔗 زيارة     │
└────────────────────────────┘
```

### Color Theme Example

**Light Mode:**
- Background: `#FAFBFC` (off-white)
- Card: `#FFFFFF`
- Primary: `#8B5CF6` (violet)
- Text: `#1F2937`

**Dark Mode:**
- Background: `#0F0F1A` (deep navy)
- Card: `#1A1A2E`
- Primary: `#A78BFA` (light violet)
- Text: `#F9FAFB`

---

## ✅ Acceptance Criteria

1. ✅ الموقع يفتح بدون أخطاء
2. ✅ Homepage يعرض tools و articles
3. ✅ يمكن تسجيل الدخول وإنشاء حساب
4. ✅ يمكن حفظ أدوات في المفضلة
5. ✅ يمكن كتابة تقييم/مراجعة
6. ✅ Dark/Light mode يشتغل
7. ✅ الموقع متجاوب (mobile + desktop)
8. ✅ SEO basics (meta tags, sitemap)

---

## 📝 ملاحظات

- التصميم يركز على **البساطة** + **الوضوح**
- **RTL first** - كل حاجة من اليمين لليسار
- **Arabic first** - كل المحتوى بالعربي
- **Performance** - fast loading مهمة

---

## 🚀 Next Step

1. Confirmation على الخطة
2. نبدأ Phase 1: الأساسيات
3. Design System + Homepage

**هل الفكرة واضحة؟ نبدأ؟** 🎯
