# 🤖 AI Platform — منصة الذكاء الاصطناعي العربية
### وثيقة المشروع الكاملة · مُعَدَّة للبناء بواسطة MiniMax M2.7 متعدد الوكلاء

> **الهدف:** أول دليل عربي شامل لأدوات الذكاء الاصطناعي — يجمع بين الاستكشاف والمقارنة والمراجعات والمحتوى التعليمي في منصة واحدة تستهدف الجمهور العربي.

---

## 📋 فهرس سريع

| القسم | الموضوع |
|-------|---------|
| [1](#1-رؤية-المشروع) | رؤية المشروع والـ USP |
| [2](#2-tech-stack) | Tech Stack مع المبررات |
| [3](#3-هيكل-الملفات) | هيكل الملفات الكامل |
| [4](#4-قاعدة-البيانات) | Database Schema كاملاً |
| [5](#5-environment-variables) | Environment Variables |
| [6](#6-api-documentation) | API Documentation الكاملة |
| [7](#7-state-management) | State Management Architecture |
| [8](#8-seo--performance) | SEO & Performance Strategy |
| [9](#9-design-system) | Design System |
| [10](#10-security) | Security & Auth |
| [11](#11-monetization) | نموذج الربح |
| [12](#12-deployment) | Deployment & CI/CD |
| [13](#13-agent-task-map) | Agent Task Map |
| [14](#14-checklists) | Checklists |
| [15](#15-التحديثات-الأخيرة) | التحديثات الأخيرة (2026-06-01) |
| [16](#16-troubleshooting) | Troubleshooting (Vercel deployment) |

---

## 0. آخر التحديثات (2026-06-01)

> **مهم:** لو أنت agent أو contributor جديد، ابدأ من هنا. الـ README ده فيه الـ vision الكامل، والـ section دي فيها كل اللي اتغيّر مؤخراً.

### 🔒 Security fixes (CRITICAL)
- **Role check** بقت من `profiles.role` (DB) بدل `user.user_metadata.role` (client-editable)
- **Cookie handling** في `proxy.ts` — بقى بيستدعي `response.cookies.set` و بيطبق `httpOnly`/`sameSite`/`secure`
- **Security headers** — CSP, HSTS, Permissions-Policy, X-XSS-Protection في `next.config.ts`

### 🧹 Cleanup
- `setup-db.sql` (مخلفات POS project) — اتشال
- `src/middleware.ts.disabled` — اتشال
- 8 trash JSON files (`args.json`, `form.json`, `nav.json`, etc.) — اتشالت
- `database/` folder (3 migrations مكررة) — اتشال، الـ schema بقى في `supabase/`
- 2 مكررات من `supabase/migrations/001_*` و `002_*` — اتشالت، الـ canonical بقى `supabase/schema.sql`
- `about-page.png` — اتنقل لـ `public/`

### 🆕 New files
- `supabase/schema.sql` — **Canonical schema** (14 tables, ENUMs, RLS, triggers, seed plans)
- `supabase/migrations/003_arabic_seed_data.sql` — Arabic categories/tools/articles
- `src/lib/env.ts` — Typed env validation (server-only guards)
- `src/lib/ratelimit.ts` — Upstash rate limiting (proxy/api/auth/reviews/newsletter/admin) مع in-memory fallback
- `src/components/tools/*` — تقسيم `ToolDetailClient.tsx` (30KB → 9 files)
- `vitest.config.ts` + 3 test suites
- `CHANGELOG.md` — Keep-a-Changelog format

### 📝 New npm scripts
```bash
npm run type-check       # tsc --noEmit
npm test                # vitest run
npm run test:watch      # vitest (watch mode)
npm run test:coverage   # vitest run --coverage
npm run db:types        # regenerate src/types/database.types.ts from live Supabase
npm run db:reset        # supabase db reset
```

### ⚠️ Breaking notes
- **`.env` rule**: متـ commitش `SUPABASE_SERVICE_ROLE_KEY` — خليها server-only في Vercel dashboard
- **`lucide-react@1.x`**: الإصدار ده series جديد (مش قديم) — الـ `0.4xx` كانت السلسلة القديمة قبل reset
- **`src/middleware.ts` → `src/proxy.ts`**: ده pattern Next.js 16 — مش typo
- **`database/` folder اتشال**: استخدم `supabase/migrations/` بس

---


### 🎯 المشكلة التي نحلها
المطورون والمحترفون العرب (100M+ شخص) يبحثون عن أدوات الذكاء الاصطناعي لكن:
- كل المنصات الموجودة (G2، Product Hunt، Futurepedia) بالإنجليزي فقط
- لا يوجد تقييمات عربية موثوقة
- لا يوجد مقارنات بالأسعار للسوق العربي
- لا يوجد محتوى تعليمي عربي مرتبط بالأدوات

### 💡 الحل (USP)
```
دليل عربي متخصص:
✅ +1000 أداة AI مع وصف عربي كامل
✅ تقييمات ومراجعات من مستخدمين عرب
✅ مقارنة الأسعار والبدائل
✅ مقالات تعليمية "كيف تستخدم X"
✅ نشرة بريدية أسبوعية بأحدث الأدوات
✅ API مفتوح للمطورين
```

### 👤 الجمهور المستهدف
- مطورون وتقنيون عرب
- محترفو التسويق والمحتوى
- أصحاب المشاريع الصغيرة
- الطلاب والباحثون
- الفريلانسرز

### 📊 نموذج النمو
```
المرحلة 1 (0-6 أشهر): SEO + دليل أدوات مجاني
المرحلة 2 (6-12):     Featured Listings + Affiliate
المرحلة 3 (12+):      API مدفوع + Premium للأدوات
```

---

## 2. Tech Stack

### ⚡ الاختيارات وأسبابها

```yaml
Framework:
  Name:    Next.js 15+ (App Router)
  Why:     Server Components للـ SEO + Streaming للـ performance + File-based routing

Styling:
  Name:    Tailwind CSS v4 + shadcn/ui
  Why:     سرعة التطوير + consistency + RTL support ممتاز مع Tailwind

Database:
  Name:    Supabase (PostgreSQL 15)
  Why:     Auth مجاني + Realtime + Storage + Row Level Security كلها في مكان واحد

Server State:
  Name:    TanStack Query v5
  Why:     Caching تلقائي + optimistic updates + refetch على focus

Client State:
  Name:    Zustand v4
  Why:     أبسط من Redux + TypeScript-first + لا boilerplate

Search:
  Name:    Supabase Full-Text Search (Arabic) + مستقبلاً Meilisearch
  Why:     FTS مجاناً في Supabase يكفي للـ MVP، Meilisearch لما نتجاوز 10k أداة

Email:
  Name:    Resend + React Email
  Why:     Developer-friendly + beautiful templates + 3000 email/month مجاناً

Analytics:
  Name:    Posthog (self-host أو cloud)
  Why:     Privacy-first + Arabic users حساسين للـ tracking + open source

Cache Layer:
  Name:    Upstash Redis (serverless)
  Why:     Compatible مع Vercel Edge + pay per request + لا servers

Images:
  Name:    Supabase Storage + Vercel OG
  Why:     Storage للـ tool logos + OG images ديناميكية لكل صفحة

Deployment:
  Name:    Vercel
  Why:     Zero-config مع Next.js + Edge Network + Preview deployments
```

### 📦 package.json الكامل

```json
{
  "name": "ai-platform",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev --turbo",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "db:generate": "supabase gen types typescript --local > src/types/database.types.ts",
    "db:migrate": "supabase db push",
    "db:seed": "npx tsx database/seed.ts",
    "test": "vitest",
    "test:e2e": "playwright test"
  },
  "dependencies": {
    "next": "15.x",
    "react": "19.x",
    "react-dom": "19.x",
    "@supabase/supabase-js": "^2.44.0",
    "@supabase/ssr": "^0.5.0",
    "@tanstack/react-query": "^5.50.0",
    "zustand": "^4.5.0",
    "resend": "^3.5.0",
    "@react-email/components": "^0.0.22",
    "@upstash/redis": "^1.31.0",
    "@upstash/ratelimit": "^2.0.0",
    "zod": "^3.23.0",
    "slugify": "^1.6.6",
    "date-fns": "^3.6.0",
    "date-fns/locale/ar": "*",
    "lucide-react": "^1.16.0",
    "next-themes": "^0.3.0",
    "sonner": "^1.5.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.3.0"
  },
  "devDependencies": {
    "typescript": "^5.5.0",
    "@types/node": "^20",
    "@types/react": "^19",
    "tailwindcss": "^4.0.0",
    "vitest": "^1.6.0",
    "@playwright/test": "^1.45.0",
    "supabase": "^1.178.0"
  }
}
```

---

## 3. هيكل الملفات

```
ai-platform/
│
├── 📁 src/
│   │
│   ├── 📁 app/                              # Next.js App Router
│   │   ├── layout.tsx                        # Root layout (RTL + Fonts + Providers)
│   │   ├── page.tsx                          # Landing page (SSG)
│   │   ├── sitemap.ts                        # Dynamic sitemap لكل الأدوات
│   │   ├── robots.ts                         # Robots.txt
│   │   ├── opengraph-image.tsx               # Default OG image
│   │   ├── not-found.tsx                     # Custom 404
│   │   ├── error.tsx                         # Global error boundary
│   │   │
│   │   ├── 📁 (marketing)/                  # Route Group — no shared layout
│   │   │   ├── about/page.tsx               # من نحن
│   │   │   ├── contact/page.tsx             # تواصل معنا
│   │   │   └── newsletter/page.tsx          # النشرة البريدية
│   │   │
│   │   ├── 📁 tools/
│   │   │   ├── page.tsx                     # /tools — قائمة الأدوات (SSR + Filtering)
│   │   │   ├── loading.tsx                  # Skeleton loading
│   │   │   └── 📁 [slug]/
│   │   │       ├── page.tsx                 # /tools/chatgpt — صفحة الأداة (SSR)
│   │   │       ├── opengraph-image.tsx      # OG image ديناميكي لكل أداة
│   │   │       └── loading.tsx
│   │   │
│   │   ├── 📁 categories/
│   │   │   ├── page.tsx                     # /categories — كل الفئات
│   │   │   └── 📁 [slug]/
│   │   │       └── page.tsx                 # /categories/writing — أدوات الكتابة
│   │   │
│   │   ├── 📁 blog/
│   │   │   ├── page.tsx                     # قائمة المقالات (SSG + ISR)
│   │   │   └── 📁 [slug]/
│   │   │       └── page.tsx                 # مقالة منفردة (ISR 1hr)
│   │   │
│   │   ├── 📁 compare/
│   │   │   └── page.tsx                     # /compare?tools=chatgpt,gemini,claude
│   │   │
│   │   ├── 📁 search/
│   │   │   └── page.tsx                     # /search?q=... (SSR)
│   │   │
│   │   ├── 📁 auth/
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   ├── forgot-password/page.tsx
│   │   │   └── callback/route.ts            # OAuth callback
│   │   │
│   │   ├── 📁 dashboard/                    # Protected — User area
│   │   │   ├── layout.tsx                   # Dashboard layout مع auth check
│   │   │   ├── page.tsx                     # نظرة عامة
│   │   │   ├── favorites/page.tsx           # المفضلة
│   │   │   ├── reviews/page.tsx             # مراجعاتي
│   │   │   └── settings/page.tsx            # الإعدادات
│   │   │
│   │   ├── 📁 admin/                        # Protected — Admin only
│   │   │   ├── layout.tsx                   # Admin layout مع role check
│   │   │   ├── page.tsx                     # Dashboard + إحصائيات
│   │   │   ├── tools/
│   │   │   │   ├── page.tsx                 # جدول الأدوات
│   │   │   │   ├── new/page.tsx             # إضافة أداة
│   │   │   │   └── [id]/edit/page.tsx       # تعديل أداة
│   │   │   ├── articles/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── new/page.tsx
│   │   │   │   └── [id]/edit/page.tsx
│   │   │   ├── categories/page.tsx
│   │   │   ├── users/page.tsx
│   │   │   ├── reviews/page.tsx             # مراجعة التعليقات قبل نشرها
│   │   │   ├── newsletter/page.tsx          # إرسال نشرات
│   │   │   ├── analytics/page.tsx           # إحصائيات تفصيلية
│   │   │   └── settings/page.tsx
│   │   │
│   │   └── 📁 api/                          # Route Handlers
│   │       ├── 📁 tools/
│   │       │   ├── route.ts                 # GET (list) + POST (create)
│   │       │   └── [id]/route.ts            # GET + PUT + DELETE
│   │       ├── 📁 articles/
│   │       │   ├── route.ts
│   │       │   └── [id]/route.ts
│   │       ├── 📁 categories/
│   │       │   ├── route.ts
│   │       │   └── [id]/route.ts
│   │       ├── 📁 reviews/
│   │       │   ├── route.ts
│   │       │   └── [id]/route.ts
│   │       ├── 📁 favorites/
│   │       │   └── route.ts
│   │       ├── 📁 search/
│   │       │   └── route.ts
│   │       ├── 📁 newsletter/
│   │       │   ├── subscribe/route.ts
│   │       │   └── send/route.ts            # Admin only
│   │       ├── 📁 admin/
│   │       │   ├── stats/route.ts
│   │       │   └── users/route.ts
│   │       └── 📁 webhooks/
│   │           └── stripe/route.ts          # Phase 2
│   │
│   ├── 📁 components/
│   │   ├── 📁 ui/                           # shadcn/ui base components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── select.tsx
│   │   │   ├── skeleton.tsx
│   │   │   ├── table.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── textarea.tsx
│   │   │   └── toast.tsx
│   │   │
│   │   ├── 📁 layout/
│   │   │   ├── Navbar.tsx                   # + Mobile menu
│   │   │   ├── Footer.tsx
│   │   │   ├── Sidebar.tsx                  # Dashboard sidebar
│   │   │   └── AdminSidebar.tsx
│   │   │
│   │   ├── 📁 tools/
│   │   │   ├── ToolCard.tsx                 # كارد الأداة في القوائم
│   │   │   ├── ToolCardSkeleton.tsx
│   │   │   ├── ToolGrid.tsx                 # شبكة الأدوات مع pagination
│   │   │   ├── ToolFilters.tsx              # الفلاتر (فئة، سعر، تقييم)
│   │   │   ├── ToolHero.tsx                 # بطل صفحة الأداة
│   │   │   ├── ToolPricing.tsx              # جدول التسعير
│   │   │   ├── ToolFeatures.tsx             # قائمة الميزات
│   │   │   ├── ToolAlternatives.tsx         # البدائل المشابهة
│   │   │   ├── ToolCompareBanner.tsx        # شريط المقارنة السريعة
│   │   │   └── FavoriteButton.tsx           # زر المفضلة مع optimistic update
│   │   │
│   │   ├── 📁 reviews/
│   │   │   ├── ReviewCard.tsx
│   │   │   ├── ReviewList.tsx
│   │   │   ├── ReviewForm.tsx               # نموذج الإضافة مع star rating
│   │   │   └── RatingSummary.tsx            # ملخص التقييمات (نجوم + بار)
│   │   │
│   │   ├── 📁 search/
│   │   │   ├── SearchBar.tsx                # بحث عالمي مع autocomplete
│   │   │   ├── SearchResults.tsx
│   │   │   └── SearchFilters.tsx
│   │   │
│   │   ├── 📁 blog/
│   │   │   ├── ArticleCard.tsx
│   │   │   ├── ArticleGrid.tsx
│   │   │   └── ArticleContent.tsx           # MDX renderer
│   │   │
│   │   ├── 📁 admin/
│   │   │   ├── DataTable.tsx                # Generic sortable/filterable table
│   │   │   ├── StatsCard.tsx
│   │   │   ├── AnalyticsChart.tsx
│   │   │   ├── ToolForm.tsx                 # نموذج إضافة/تعديل أداة
│   │   │   ├── ArticleEditor.tsx            # Rich text editor
│   │   │   └── ReviewModerator.tsx          # لوحة مراجعة التعليقات
│   │   │
│   │   └── 📁 shared/
│   │       ├── CategoryBadge.tsx
│   │       ├── PricingBadge.tsx             # Free / Freemium / Paid / Enterprise
│   │       ├── RatingStars.tsx
│   │       ├── ShareButtons.tsx             # مشاركة على السوشيال
│   │       ├── NewsletterSignup.tsx
│   │       ├── EmptyState.tsx
│   │       ├── ErrorState.tsx
│   │       └── Pagination.tsx
│   │
│   ├── 📁 lib/
│   │   ├── supabase/
│   │   │   ├── client.ts                    # Client-side Supabase
│   │   │   ├── server.ts                    # Server-side (createServerClient)
│   │   │   ├── middleware.ts                # Auth middleware helper
│   │   │   └── queries/                     # كل DB queries هنا
│   │   │       ├── tools.ts
│   │   │       ├── articles.ts
│   │   │       ├── categories.ts
│   │   │       ├── reviews.ts
│   │   │       ├── users.ts
│   │   │       └── analytics.ts
│   │   ├── validations/                     # Zod schemas
│   │   │   ├── tool.schema.ts
│   │   │   ├── article.schema.ts
│   │   │   ├── review.schema.ts
│   │   │   └── auth.schema.ts
│   │   ├── redis.ts                         # Upstash client + helpers
│   │   ├── ratelimit.ts                     # Rate limiting configs
│   │   ├── resend.ts                        # Email client + templates
│   │   ├── seo.ts                           # generateMetadata helpers
│   │   ├── structured-data.ts               # JSON-LD schemas
│   │   ├── arabic-search.ts                 # Arabic search helpers (دعم التشكيل)
│   │   └── utils.ts                         # cn(), formatDate(), truncate()...
│   │
│   ├── 📁 hooks/
│   │   ├── useSupabase.ts                   # Supabase client hook
│   │   ├── useUser.ts                       # Auth user hook
│   │   ├── useTools.ts                      # Tools queries (TanStack Query)
│   │   ├── useFavorites.ts                  # Favorites مع optimistic updates
│   │   ├── useReviews.ts
│   │   ├── useSearch.ts                     # Debounced search
│   │   └── useInfiniteTools.ts              # Infinite scroll للأدوات
│   │
│   ├── 📁 stores/                           # Zustand stores
│   │   ├── filtersStore.ts                  # حالة الفلاتر والترتيب
│   │   ├── compareStore.ts                  # أدوات المقارنة (max 3)
│   │   └── uiStore.ts                       # sidebar, modals, etc.
│   │
│   ├── 📁 types/
│   │   ├── database.types.ts                # Auto-generated من Supabase
│   │   └── index.ts                         # Barrel: re-exports from database.types + AppUser/ApiResponse
│   │
│   └── proxy.ts                             # Next.js 16: Auth + Rate Limiting (NOT middleware.ts)
│
├── 📁 supabase/                             # 🔑 Canonical DB schema (source of truth)
│   ├── schema.sql                           # Full schema: 14 tables, ENUMs, RLS, triggers, seed plans
│   └── migrations/                          # Numbered, additive migrations
│       └── 003_arabic_seed_data.sql         # Arabic categories, tools, articles (idempotent)
│
│   # ملاحظة: الـ database.types.ts و supabase/schema.sql لازم يكونوا متطابقين.
│   # لتجديد الـ types بعد تعديل الـ schema:
│   #   npm run db:types
│
├── 📁 database/                            # ❌ Removed in 2026-06-01 — moved to supabase/
│   # (legacy migrations were duplicates; canonical schema is now supabase/schema.sql)
│
├── 📁 emails/                               # React Email templates
│   ├── WelcomeEmail.tsx
│   ├── NewsletterEmail.tsx
│   └── ReviewApprovedEmail.tsx
│
├── 📁 public/
│   ├── icons/
│   └── og-default.png
│
├── next.config.ts
├── tailwind.config.ts
├── middleware.ts
├── .env.local                               # لا ترفعه على Git أبداً
├── .env.example                             # نسخة فارغة للمشاركة
└── supabase/config.toml
```

---

## 4. قاعدة البيانات

> ⚠️ **للوكلاء:** شغّل ملفات الـ migrations بالترتيب الرقمي. لا تعدّل على migration موجود — أضف migration جديد.

### جدول الفئات `categories`

```sql
-- supabase/schema.sql (الـ canonical — generated 2026-06-01)
-- لو عدّلت الـ schema، اعمل regenerate للـ types بـ: npm run db:types
CREATE TABLE categories (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,                  -- "كتابة المحتوى"
  name_en     TEXT,                           -- "Content Writing"
  slug        TEXT UNIQUE NOT NULL,           -- "content-writing"
  description TEXT,
  icon        TEXT,                           -- Lucide icon name: "PenLine"
  color       TEXT DEFAULT '#6366f1',         -- للعرض في الكارد
  tools_count INTEGER DEFAULT 0,              -- cached count (updated by trigger)
  is_featured BOOLEAN DEFAULT false,
  sort_order  INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_featured ON categories(is_featured) WHERE is_featured = true;
```

### جدول الأدوات `tools`

```sql
CREATE TABLE tools (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name              TEXT NOT NULL,
  slug              TEXT UNIQUE NOT NULL,
  tagline           TEXT,                         -- جملة تسويقية قصيرة (max 100 char)
  description       TEXT,                         -- وصف كامل بالعربي
  description_en    TEXT,                         -- وصف بالإنجليزي (للـ SEO)
  website_url       TEXT NOT NULL,
  logo_url          TEXT,                         -- Supabase Storage URL
  screenshot_url    TEXT,                         -- صورة للأداة
  category_id       UUID REFERENCES categories(id) ON DELETE SET NULL,
  tags              TEXT[] DEFAULT '{}',           -- ['GPT-4', 'API', 'Automation']
  
  -- التسعير
  pricing_type      TEXT DEFAULT 'freemium'       -- free | freemium | paid | enterprise | contact
    CHECK (pricing_type IN ('free','freemium','paid','enterprise','contact')),
  starting_price    DECIMAL(10,2),                -- السعر الأدنى (null = مجاني)
  pricing_currency  TEXT DEFAULT 'USD',
  has_free_trial    BOOLEAN DEFAULT false,
  trial_days        INTEGER,
  
  -- التقييمات (محسوبة تلقائياً)
  rating_avg        DECIMAL(3,2) DEFAULT 0.00,    -- 0.00 - 5.00
  rating_count      INTEGER DEFAULT 0,
  
  -- SEO
  meta_title        TEXT,
  meta_description  TEXT,
  
  -- إحصائيات
  views_count       INTEGER DEFAULT 0,
  clicks_count      INTEGER DEFAULT 0,            -- نقرات "اذهب للموقع"
  favorites_count   INTEGER DEFAULT 0,
  
  -- الحالة
  status            TEXT DEFAULT 'pending'
    CHECK (status IN ('pending', 'published', 'rejected', 'archived')),
  is_featured       BOOLEAN DEFAULT false,
  is_sponsored      BOOLEAN DEFAULT false,        -- للـ monetization
  sponsored_until   TIMESTAMPTZ,
  
  -- الميزات (JSON مرن)
  features          JSONB DEFAULT '[]',           -- [{"title": "...", "desc": "..."}]
  pricing_plans     JSONB DEFAULT '[]',           -- [{"name": "Free", "price": 0, "features": [...]}]
  
  submitted_by      UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_tools_slug ON tools(slug);
CREATE INDEX idx_tools_category ON tools(category_id);
CREATE INDEX idx_tools_status ON tools(status) WHERE status = 'published';
CREATE INDEX idx_tools_featured ON tools(is_featured) WHERE is_featured = true;
CREATE INDEX idx_tools_rating ON tools(rating_avg DESC, rating_count DESC);
CREATE INDEX idx_tools_tags ON tools USING GIN(tags);

-- Full-Text Search (Arabic + English)
CREATE INDEX idx_tools_fts ON tools
  USING GIN(to_tsvector('arabic', coalesce(name,'') || ' ' || coalesce(description,'') || ' ' || coalesce(tagline,'')));
```

### جدول المستخدمين `profiles`

```sql
-- يمتد auth.users من Supabase Auth
CREATE TABLE profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name  TEXT,
  username      TEXT UNIQUE,
  avatar_url    TEXT,
  bio           TEXT,
  role          TEXT DEFAULT 'user'
    CHECK (role IN ('user', 'moderator', 'admin')),
  is_verified   BOOLEAN DEFAULT false,
  website_url   TEXT,
  country       TEXT DEFAULT 'EG',
  
  -- Stats
  reviews_count    INTEGER DEFAULT 0,
  favorites_count  INTEGER DEFAULT 0,
  
  -- Preferences
  email_newsletter BOOLEAN DEFAULT true,
  
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);
```

### جدول المراجعات `reviews`

```sql
CREATE TABLE reviews (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_id     UUID NOT NULL REFERENCES tools(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rating      INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title       TEXT,
  content     TEXT,                             -- الحد الأدنى 50 حرف
  pros        TEXT[] DEFAULT '{}',              -- ['سهل الاستخدام', 'مجاني']
  cons        TEXT[] DEFAULT '{}',              -- ['بطيء أحياناً']
  use_case    TEXT,                             -- "أستخدمه لكتابة محتوى التسويق"
  
  -- Moderation
  status      TEXT DEFAULT 'pending'
    CHECK (status IN ('pending', 'approved', 'rejected')),
  
  -- Helpfulness
  helpful_count    INTEGER DEFAULT 0,
  not_helpful_count INTEGER DEFAULT 0,
  
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(tool_id, user_id)                      -- مراجعة واحدة لكل أداة لكل مستخدم
);

CREATE INDEX idx_reviews_tool ON reviews(tool_id, status);
CREATE INDEX idx_reviews_user ON reviews(user_id);
```

### جدول المقالات `articles`

```sql
CREATE TABLE articles (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title           TEXT NOT NULL,
  slug            TEXT UNIQUE NOT NULL,
  excerpt         TEXT,                          -- مقتطف قصير للـ cards
  content         TEXT,                          -- MDX content
  cover_image_url TEXT,
  author_id       UUID REFERENCES profiles(id) ON DELETE SET NULL,
  category_id     UUID REFERENCES categories(id) ON DELETE SET NULL,
  tags            TEXT[] DEFAULT '{}',
  related_tools   UUID[] DEFAULT '{}',           -- IDs of related tools
  
  -- SEO
  meta_title      TEXT,
  meta_description TEXT,
  
  -- Stats
  views_count     INTEGER DEFAULT 0,
  reading_time    INTEGER,                       -- بالدقائق (محسوب تلقائياً)
  
  status          TEXT DEFAULT 'draft'
    CHECK (status IN ('draft', 'published', 'archived')),
  published_at    TIMESTAMPTZ,
  
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_articles_slug ON articles(slug);
CREATE INDEX idx_articles_status ON articles(status, published_at DESC);

-- FTS للمقالات
CREATE INDEX idx_articles_fts ON articles
  USING GIN(to_tsvector('arabic', coalesce(title,'') || ' ' || coalesce(excerpt,'')));
```

### جدول المفضلة `favorites`

```sql
CREATE TABLE favorites (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  tool_id    UUID NOT NULL REFERENCES tools(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, tool_id)
);

CREATE INDEX idx_favorites_user ON favorites(user_id);
```

### جدول النشرة البريدية `newsletter_subscribers`

```sql
CREATE TABLE newsletter_subscribers (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email       TEXT UNIQUE NOT NULL,
  name        TEXT,
  status      TEXT DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed')),
  source      TEXT DEFAULT 'website',           -- website | tool_page | blog
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
```

### جدول مفاتيح API `api_keys`

```sql
CREATE TABLE api_keys (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,                    -- "My App Key"
  key_hash    TEXT UNIQUE NOT NULL,             -- SHA256 hash (لا نخزن الـ key نفسه)
  key_prefix  TEXT NOT NULL,                    -- أول 8 أحرف للعرض: "aip_Xk3m..."
  plan        TEXT DEFAULT 'free'
    CHECK (plan IN ('free', 'pro', 'enterprise')),
  rate_limit  INTEGER DEFAULT 1000,             -- requests per day
  requests_count INTEGER DEFAULT 0,
  last_used_at TIMESTAMPTZ,
  expires_at  TIMESTAMPTZ,
  is_active   BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
```

### Triggers & Functions

```sql
-- 004_functions.sql

-- 1. تحديث tools_count في categories تلقائياً
CREATE OR REPLACE FUNCTION update_category_tools_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.status = 'published' THEN
    UPDATE categories SET tools_count = tools_count + 1 WHERE id = NEW.category_id;
  ELSIF TG_OP = 'DELETE' AND OLD.status = 'published' THEN
    UPDATE categories SET tools_count = tools_count - 1 WHERE id = OLD.category_id;
  ELSIF TG_OP = 'UPDATE' AND OLD.status != NEW.status THEN
    IF NEW.status = 'published' THEN
      UPDATE categories SET tools_count = tools_count + 1 WHERE id = NEW.category_id;
    ELSIF OLD.status = 'published' THEN
      UPDATE categories SET tools_count = tools_count - 1 WHERE id = OLD.category_id;
    END IF;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_category_tools_count
  AFTER INSERT OR UPDATE OR DELETE ON tools
  FOR EACH ROW EXECUTE FUNCTION update_category_tools_count();

-- 2. تحديث rating_avg في tools عند إضافة/حذف مراجعة
CREATE OR REPLACE FUNCTION update_tool_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE tools SET
    rating_avg   = (SELECT ROUND(AVG(rating)::numeric, 2) FROM reviews WHERE tool_id = COALESCE(NEW.tool_id, OLD.tool_id) AND status = 'approved'),
    rating_count = (SELECT COUNT(*) FROM reviews WHERE tool_id = COALESCE(NEW.tool_id, OLD.tool_id) AND status = 'approved')
  WHERE id = COALESCE(NEW.tool_id, OLD.tool_id);
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_tool_rating
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_tool_rating();

-- 3. Auto slug generation
CREATE OR REPLACE FUNCTION generate_slug(title TEXT)
RETURNS TEXT AS $$
  SELECT lower(regexp_replace(trim(title), '[^a-z0-9\u0600-\u06FF]+', '-', 'g'));
$$ LANGUAGE sql IMMUTABLE;

-- 4. Full-text search function
CREATE OR REPLACE FUNCTION search_tools(query TEXT, p_category TEXT DEFAULT NULL, p_limit INT DEFAULT 20, p_offset INT DEFAULT 0)
RETURNS SETOF tools AS $$
  SELECT * FROM tools
  WHERE status = 'published'
    AND (p_category IS NULL OR category_id = (SELECT id FROM categories WHERE slug = p_category))
    AND (
      to_tsvector('arabic', coalesce(name,'') || ' ' || coalesce(description,'') || ' ' || coalesce(tagline,''))
      @@ plainto_tsquery('arabic', query)
      OR name ILIKE '%' || query || '%'
    )
  ORDER BY rating_avg DESC, views_count DESC
  LIMIT p_limit OFFSET p_offset;
$$ LANGUAGE sql STABLE;
```

### Row Level Security (RLS)

```sql
-- supabase/schema.sql — RLS section (inlined in the canonical schema)

ALTER TABLE tools     ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews   ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles  ENABLE ROW LEVEL SECURITY;

-- Tools: كل الناس تقدر تقرأ المنشور
CREATE POLICY "tools_public_read" ON tools FOR SELECT USING (status = 'published');

-- Tools: الـ admin بس يقدر يعدل
CREATE POLICY "tools_admin_all" ON tools FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Tools: المستخدم يقدر يضيف أداة
CREATE POLICY "tools_user_insert" ON tools FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Reviews: العامة تقرأ المعتمدة فقط
CREATE POLICY "reviews_public_read" ON reviews FOR SELECT USING (status = 'approved');

-- Reviews: المستخدم يقدر يضيف ويعدل مراجعته هو بس
CREATE POLICY "reviews_user_insert" ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "reviews_user_update" ON reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "reviews_user_delete" ON reviews FOR DELETE USING (auth.uid() = user_id);

-- Favorites: المستخدم يشوف ويعدل مفضلته هو بس
CREATE POLICY "favorites_owner_all" ON favorites FOR ALL USING (auth.uid() = user_id);

-- Profiles: كلهم يقدروا يقروا
CREATE POLICY "profiles_public_read" ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_owner_update" ON profiles FOR UPDATE USING (auth.uid() = id);
```

---

## 5. Environment Variables

```bash
# .env.example — انسخ لـ .env.local وامل القيم

# ===== Supabase =====
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...         # Server only — لا تعرضه للـ client أبداً

# ===== Upstash Redis (Rate Limiting + Caching) =====
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=AXxx...

# ===== Resend (Email) =====
RESEND_API_KEY=re_xxx...
EMAIL_FROM=newsletter@aiplatform.com

# ===== App =====
NEXT_PUBLIC_APP_URL=https://aiplatform.com    # أو http://localhost:3000 في dev
NEXT_PUBLIC_APP_NAME=منصة الذكاء الاصطناعي
CRON_SECRET=random_secret_for_cron_jobs       # لتأمين الـ cron routes

# ===== Analytics =====
NEXT_PUBLIC_POSTHOG_KEY=phc_xxx...
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# ===== Phase 2: Stripe =====
# STRIPE_SECRET_KEY=sk_live_xxx
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
# STRIPE_WEBHOOK_SECRET=whsec_xxx
```

---

## 6. API Documentation

> **Base URL:** `/api`  
> **Format:** JSON  
> **Auth:** `Authorization: Bearer <supabase_jwt_token>` (للـ endpoints المحمية)  
> **Rate Limit:** 100 req/min للـ public، 1000 req/min للـ authenticated

### 🔧 Tools API

#### `GET /api/tools`
قائمة الأدوات مع فلترة وترتيب وبحث.

```typescript
// Query Parameters
interface ToolsQueryParams {
  page?:      number;          // default: 1
  limit?:     number;          // default: 20, max: 100
  category?:  string;          // slug الفئة
  pricing?:   'free' | 'freemium' | 'paid' | 'enterprise';
  sort?:      'newest' | 'rating' | 'popular' | 'name';
  q?:         string;          // بحث نصي
  tags?:      string;          // tags مفصولة بفاصلة
  featured?:  boolean;
}

// Response
interface ToolsResponse {
  data: Tool[];
  meta: {
    total:       number;
    page:        number;
    limit:       number;
    total_pages: number;
  };
}
```

```bash
# أمثلة
GET /api/tools?category=writing&pricing=free&sort=rating&page=1
GET /api/tools?q=كتابة&limit=10
GET /api/tools?tags=GPT-4,API&sort=newest
```

#### `GET /api/tools/:id`

```typescript
// Response: Tool object كامل مع category و recent_reviews
interface ToolDetailResponse {
  data: Tool & {
    category:       Category;
    recent_reviews: Review[];
    alternatives:   Tool[];      // أدوات مشابهة في نفس الفئة
    stats: {
      rating_avg:      number;
      rating_count:    number;
      rating_breakdown: Record<1|2|3|4|5, number>;
    };
  };
}
```

#### `POST /api/tools` 🔒 Admin

```typescript
// Request Body (Zod schema)
const CreateToolSchema = z.object({
  name:          z.string().min(2).max(100),
  tagline:       z.string().max(150).optional(),
  description:   z.string().min(50),
  website_url:   z.string().url(),
  category_id:   z.string().uuid(),
  pricing_type:  z.enum(['free','freemium','paid','enterprise','contact']),
  starting_price: z.number().min(0).optional(),
  has_free_trial: z.boolean().default(false),
  trial_days:    z.number().min(1).max(365).optional(),
  tags:          z.array(z.string()).max(10).default([]),
  features:      z.array(z.object({ title: z.string(), desc: z.string() })).default([]),
});

// Response: 201 Created
{ data: Tool, message: "تم إضافة الأداة بنجاح" }
```

#### `PUT /api/tools/:id` 🔒 Admin
نفس schema الـ POST — كل الحقول اختيارية.

#### `DELETE /api/tools/:id` 🔒 Admin
```json
{ "message": "تم حذف الأداة بنجاح" }
```

---

### 📝 Reviews API

#### `GET /api/reviews?tool_id=:id`
```typescript
interface ReviewsQuery {
  tool_id: string;   // required
  sort?:   'newest' | 'helpful' | 'rating_high' | 'rating_low';
  page?:   number;
  limit?:  number;   // default: 10
}
```

#### `POST /api/reviews` 🔒 Auth Required
```typescript
const CreateReviewSchema = z.object({
  tool_id:  z.string().uuid(),
  rating:   z.number().int().min(1).max(5),
  title:    z.string().min(5).max(100).optional(),
  content:  z.string().min(50).max(2000),
  pros:     z.array(z.string().max(50)).max(5).default([]),
  cons:     z.array(z.string().max(50)).max(5).default([]),
  use_case: z.string().max(200).optional(),
});
```

---

### 🔍 Search API

#### `GET /api/search?q=:query`
```typescript
interface SearchResponse {
  tools:    Tool[];          // أول 5 نتائج
  articles: Article[];       // أول 3 نتائج
  meta: {
    total:   number;
    query:   string;
    time_ms: number;
  };
}
```

---

### ❤️ Favorites API

#### `GET /api/favorites` 🔒 Auth
#### `POST /api/favorites` 🔒 Auth
```json
{ "tool_id": "uuid-here" }
```
#### `DELETE /api/favorites/:toolId` 🔒 Auth

---

### 📧 Newsletter API

#### `POST /api/newsletter/subscribe`
```typescript
const SubscribeSchema = z.object({
  email:  z.string().email(),
  name:   z.string().optional(),
  source: z.string().default('website'),
});
```

#### `POST /api/newsletter/send` 🔒 Admin
```typescript
const SendNewsletterSchema = z.object({
  subject:    z.string().min(5),
  preview:    z.string(),
  content:    z.string(),
  send_test?: z.string().email(), // إرسال اختبار قبل الإرسال الكامل
});
```

---

### 📊 Admin Stats API

#### `GET /api/admin/stats` 🔒 Admin
```typescript
interface AdminStats {
  overview: {
    total_tools:       number;
    published_tools:   number;
    pending_tools:     number;
    total_users:       number;
    total_reviews:     number;
    pending_reviews:   number;
    subscribers:       number;
  };
  charts: {
    tools_by_category:  { category: string; count: number }[];
    tools_by_pricing:   { type: string; count: number }[];
    signups_last_30d:   { date: string; count: number }[];
    top_tools:          { name: string; views: number; clicks: number }[];
  };
}
```

---

## 7. State Management

### Client State (Zustand)

```typescript
// stores/filtersStore.ts
interface FiltersState {
  category:   string | null;
  pricing:    string | null;
  sortBy:     'newest' | 'rating' | 'popular' | 'name';
  viewMode:   'grid' | 'list';
  // Actions
  setCategory:   (cat: string | null) => void;
  setPricing:    (p: string | null) => void;
  setSortBy:     (s: FiltersState['sortBy']) => void;
  setViewMode:   (m: 'grid' | 'list') => void;
  resetFilters:  () => void;
}

// stores/compareStore.ts
interface CompareState {
  tools:     Tool[];           // max 3
  addTool:   (tool: Tool) => void;
  removeTool:(id: string) => void;
  clear:     () => void;
  isInCompare:(id: string) => boolean;
}
```

### Server State (TanStack Query)

```typescript
// hooks/useTools.ts — مثال على Query مع Caching
export function useTools(params: ToolsQueryParams) {
  return useQuery({
    queryKey: ['tools', params],
    queryFn:  () => fetchTools(params),
    staleTime: 5 * 60 * 1000,     // 5 دقائق قبل ما يعيد الجلب
    gcTime:    30 * 60 * 1000,    // 30 دقيقة في الـ cache
    placeholderData: keepPreviousData,  // لا يختفي المحتوى عند التصفح
  });
}

// hooks/useFavorites.ts — Optimistic Update
export function useToggleFavorite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: toggleFavoriteAPI,
    onMutate: async (toolId) => {
      // تحديث فوري قبل ما السيرفر يرد
      await queryClient.cancelQueries({ queryKey: ['favorites'] });
      const prev = queryClient.getQueryData(['favorites']);
      queryClient.setQueryData(['favorites'], (old: string[]) =>
        old.includes(toolId) ? old.filter(id => id !== toolId) : [...old, toolId]
      );
      return { prev };
    },
    onError: (_, __, ctx) => queryClient.setQueryData(['favorites'], ctx?.prev),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['favorites'] }),
  });
}
```

---

## 8. SEO & Performance

### استراتيجية الـ SEO

```typescript
// lib/seo.ts
export function generateToolMetadata(tool: Tool): Metadata {
  return {
    title:       `${tool.name} - مراجعة وتقييم | منصة الذكاء الاصطناعي`,
    description: tool.meta_description || tool.tagline || tool.description?.slice(0, 155),
    alternates:  { canonical: `/tools/${tool.slug}` },
    openGraph: {
      title:       tool.name,
      description: tool.tagline ?? '',
      images:      [{ url: `/api/og?tool=${tool.slug}`, width: 1200, height: 630 }],
      type:        'website',
      locale:      'ar_AR',
    },
    twitter: { card: 'summary_large_image' },
  };
}

// app/tools/[slug]/opengraph-image.tsx — OG image ديناميكي لكل أداة
export default async function OGImage({ params }) {
  const tool = await getToolBySlug(params.slug);
  return new ImageResponse(
    <div style={{ display: 'flex', /* ... تصميم */ }}>
      <img src={tool.logo_url} />
      <h1>{tool.name}</h1>
      <p>{tool.tagline}</p>
      <div>⭐ {tool.rating_avg} ({tool.rating_count} تقييم)</div>
    </div>
  );
}
```

### Structured Data (JSON-LD)

```typescript
// lib/structured-data.ts
export function toolStructuredData(tool: Tool) {
  return {
    "@context": "https://schema.org",
    "@type":    "SoftwareApplication",
    "name":     tool.name,
    "description": tool.description,
    "url":      tool.website_url,
    "applicationCategory": "Artificial Intelligence",
    "inLanguage": "ar",
    "offers": {
      "@type": "Offer",
      "price": tool.starting_price ?? "0",
      "priceCurrency": tool.pricing_currency,
    },
    "aggregateRating": tool.rating_count > 0 ? {
      "@type":       "AggregateRating",
      "ratingValue": tool.rating_avg,
      "reviewCount": tool.rating_count,
      "bestRating":  5,
      "worstRating": 1,
    } : undefined,
  };
}
```

### Caching Strategy

```typescript
// Rendering Strategy لكل صفحة:
// Landing:           SSG — إعادة build كل 24 ساعة
// Tools List:        SSR — cache 5 دقائق في Vercel Edge
// Tool Detail:       ISR — revalidate: 3600 (ساعة)
// Article:           ISR — revalidate: 3600
// Search:            SSR — لا cache (dynamic)
// Admin:             SSR — لا cache + auth check

// next.config.ts
export default {
  async headers() {
    return [{
      source: '/api/tools',
      headers: [{ key: 'Cache-Control', value: 's-maxage=300, stale-while-revalidate=60' }],
    }];
  },
};

// Redis Caching في API Routes
// lib/redis.ts
export async function getCached<T>(key: string, fn: () => Promise<T>, ttl = 300): Promise<T> {
  const cached = await redis.get<T>(key);
  if (cached) return cached;
  const data = await fn();
  await redis.setex(key, ttl, data);
  return data;
}

// مثال في route.ts
const tools = await getCached(
  `tools:${JSON.stringify(params)}`,
  () => fetchToolsFromDB(params),
  300 // 5 دقائق
);
```

### Performance Targets

```
Core Web Vitals:
  LCP (Largest Contentful Paint): < 2.5s
  FID (First Input Delay):        < 100ms
  CLS (Cumulative Layout Shift):  < 0.1

Lighthouse Scores:
  Performance:   > 90
  SEO:           > 95
  Accessibility: > 90

Bundle Size:
  First Load JS:  < 150KB
  Per-page chunk: < 50KB
```

---

## 9. Design System

### Color Tokens

```css
/* globals.css */
:root {
  --color-primary:     #6366f1;    /* Indigo — للـ CTAs الرئيسية */
  --color-secondary:   #06b6d4;    /* Cyan — للتمييز */
  --color-accent:      #f59e0b;    /* Amber — للإبراز */
  --color-success:     #10b981;
  --color-warning:     #f59e0b;
  --color-error:       #ef4444;
  --color-bg:          #f9fafb;
  --color-surface:     #ffffff;
  --color-border:      #e5e7eb;
  --color-text:        #111827;
  --color-text-muted:  #6b7280;
}

[data-theme="dark"] {
  --color-bg:         #0f172a;
  --color-surface:    #1e293b;
  --color-border:     #334155;
  --color-text:       #f1f5f9;
  --color-text-muted: #94a3b8;
}
```

### Pricing Badge Colors

```typescript
const PRICING_CONFIG = {
  free:       { label: 'مجاني',       color: 'bg-green-100 text-green-700' },
  freemium:   { label: 'مجاني جزئياً', color: 'bg-blue-100 text-blue-700' },
  paid:       { label: 'مدفوع',       color: 'bg-purple-100 text-purple-700' },
  enterprise: { label: 'للشركات',     color: 'bg-orange-100 text-orange-700' },
  contact:    { label: 'تواصل للسعر', color: 'bg-gray-100 text-gray-700' },
} as const;
```

### Font Configuration

```typescript
// app/layout.tsx
import { IBM_Plex_Sans_Arabic } from 'next/font/google';

const font = IBM_Plex_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

// المستقبل: Cairo أو Tajawal للـ headlines
```

---

## 10. Security

### Authentication Flow

```typescript
// middleware.ts — يشتغل على كل request
export async function middleware(request: NextRequest) {
  const res = NextResponse.next();
  const supabase = createServerClient(/* ... */);
  
  const { data: { session } } = await supabase.auth.getSession();
  
  // حماية routes المحمية
  const protectedRoutes = ['/dashboard', '/admin'];
  const adminRoutes = ['/admin'];
  
  if (protectedRoutes.some(r => request.nextUrl.pathname.startsWith(r))) {
    if (!session) return NextResponse.redirect(new URL('/auth/login', request.url));
  }
  
  if (adminRoutes.some(r => request.nextUrl.pathname.startsWith(r))) {
    const { data: profile } = await supabase
      .from('profiles').select('role').eq('id', session?.user?.id).single();
    if (profile?.role !== 'admin')
      return NextResponse.redirect(new URL('/', request.url));
  }
  
  return res;
}
```

### Rate Limiting

```typescript
// lib/ratelimit.ts
import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "./redis";

export const rateLimiters = {
  api:       new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(100, "1m") }),
  auth:      new Ratelimit({ redis, limiter: Ratelimit.fixedWindow(5, "15m") }),   // 5 محاولات كل 15 دقيقة
  reviews:   new Ratelimit({ redis, limiter: Ratelimit.fixedWindow(3, "1h") }),    // 3 مراجعات/ساعة
  newsletter:new Ratelimit({ redis, limiter: Ratelimit.fixedWindow(1, "1m") }),
};

// في كل API route:
const { success, limit, remaining } = await rateLimiters.api.limit(ip);
if (!success) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
```

### Input Validation (Zod)

```typescript
// كل POST/PUT request يمر عبر Zod قبل أي عملية DB
export async function POST(req: Request) {
  const body = await req.json();
  const parsed = CreateToolSchema.safeParse(body);
  
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'بيانات غير صحيحة', details: parsed.error.flatten() },
      { status: 400 }
    );
  }
  // ... proceed with parsed.data
}
```

### Security Headers

```typescript
// next.config.ts
const securityHeaders = [
  { key: 'X-Frame-Options',          value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options',   value: 'nosniff' },
  { key: 'Referrer-Policy',          value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy',       value: 'camera=(), microphone=(), geolocation=()' },
];
```

---

## 11. نموذج الربح

### المصادر الأساسية (Phase 1 & 2)

```
1. Featured Listings (أبرز الأدوات):
   - الأداة تظهر في أعلى نتائج الفئة
   - شارة "مميزة" + تصميم مختلف
   - السعر: $99/شهر أو $999/سنة

2. Affiliate Links:
   - كل أداة مدفوعة تحتوي affiliate link
   - Commission: 20-40% من أول شهر

3. Sponsored Categories:
   - "مقدمة من X" في صفحة الفئة
   - السعر: $299/شهر لكل فئة

4. Newsletter Sponsorship:
   - إعلان في النشرة الأسبوعية (5,000+ مشترك)
   - السعر: $199 لكل إرسال
```

### Implementation في DB

```sql
-- في جدول tools (موجود بالفعل):
is_sponsored   BOOLEAN DEFAULT false,
sponsored_until TIMESTAMPTZ,            -- ينتهي تلقائياً

-- Query: ترتيب الأدوات يأخذ الـ sponsored أولاً
ORDER BY is_sponsored DESC, rating_avg DESC, views_count DESC
```

---

## 12. Deployment

### Quick Start (Development)

```bash
# 1. Clone
git clone https://github.com/username/ai-platform.git
cd ai-platform

# 2. Install
npm install

# 3. Supabase Local
npx supabase start                                    # يشغل Docker
npx supabase db push                                  # يطبق الـ migrations
npm run db:seed                                       # يملأ بيانات تجريبية

# 4. Environment
cp .env.example .env.local
# امل .env.local بالقيم من npx supabase status

# 5. Run
npm run dev
# http://localhost:3000
```

### Vercel Deployment

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Deploy
vercel --prod

# Environment Variables في Vercel Dashboard:
# Settings → Environment Variables → أضف كل vars من .env.example
```

### GitHub Actions (CI/CD)

```yaml
# .github/workflows/ci.yml
name: CI

on: [push, pull_request]

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci
      - run: npm run type-check
      - run: npm run lint
      - run: npm test

  deploy:
    needs: check
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

---

## 13. Agent Task Map

```
                ┌─────────────────────────────────┐
                │    🎯 ORCHESTRATOR AGENT          │
                │  يقرأ هذا الملف ويوزع المهام     │
                └──────────────┬──────────────────┘
                               │
        ┌──────────┬───────────┼──────────────┬──────────┐
        │          │           │              │          │
   ┌────▼───┐ ┌────▼───┐ ┌────▼────┐ ┌──────▼──┐ ┌─────▼──┐
   │Agent 1 │ │Agent 2 │ │ Agent 3 │ │ Agent 4 │ │Agent 5 │
   │  DB &  │ │ API &  │ │   UI &  │ │  Search │ │ Admin  │
   │  Setup │ │ Routes │ │ Landing │ │  & SEO  │ │Dashboard│
   └────────┘ └────────┘ └─────────┘ └─────────┘ └────────┘
```

| Agent | مسؤوليته | المدخلات | المخرجات |
|-------|----------|----------|---------|
| **#1 DB** | Supabase + Migrations + RLS + Seed | هذا الملف (قسم 4) | DB جاهز + types.ts |
| **#2 API** | كل Route Handlers + Validation | قسم 6 + types.ts | /api/\*\* جاهزة |
| **#3 UI** | Landing + Tools List + Tool Detail | Design System + قسم 9 | صفحات المستخدم |
| **#4 SEO** | Metadata + OG Images + Sitemap + JSON-LD | قسم 8 | SEO كامل |
| **#5 Admin** | لوحة الإدارة الكاملة | قسم 6 + UI components | /admin/\*\* |

### تسلسل التنفيذ المطلوب

```
Phase 1 — Foundation:
  Agent #1 → Agent #2 (يحتاج DB جاهز) → Agent #3 (يحتاج API)

Phase 2 — Enhancement:
  Agent #4 (يشتغل موازي مع #3) + Agent #5 (يحتاج API + UI)

Phase 3 — Polish:
  Orchestrator يراجع الكل + Testing + Performance audit
```

---

## 14. Checklists

### ✅ قبل أي Deployment

```
[ ] npm run type-check — لا type errors
[ ] npm run lint — لا lint warnings
[ ] npm test — كل tests تعدي
[ ] فحص كل environment variables موجودة في Vercel
[ ] فحص RLS policies شتغالة (جرب الوصول بدون auth)
[ ] فحص Rate Limiting بـ 101 request متتالي
[ ] اختبر Arabic search بالتشكيل وبدونه
[ ] فحص RTL على كل الصفحات
[ ] Lighthouse audit > 90 في الـ performance

Database:
[ ] كل migrations طُبِّقت بالترتيب
[ ] كل triggers تشتغل (أضف review وشوف rating_avg اتحدث)
[ ] Indexes موجودة على كل FK و slug

SEO:
[ ] كل صفحة أداة عندها meta title + description مختلفة
[ ] sitemap.ts يولّد صحيح
[ ] OG images تظهر صح على Twitter Card Validator
[ ] JSON-LD validating على Google Rich Results Test
```

### ✅ Content Checklist (قبل Launch)

```
[ ] 50+ أداة منشورة مع أوصاف عربية كاملة
[ ] 10+ فئات مع أيقونات وألوان
[ ] 5+ مقالات "كيف تستخدم X"
[ ] صفحة "من نحن" مكتوبة
[ ] Privacy Policy + Terms of Service
[ ] بيانات اتصال حقيقية
[ ] روابط السوشيال ميديا
```

---

## 📞 للمطورين

```bash
# لو عندك سؤال أو مشكلة في المشروع:
# 1. ابحث في هذه الوثيقة أولاً
# 2. راجع Supabase docs: supabase.com/docs
# 3. راجع Next.js docs: nextjs.org/docs
# 4. تواصل: admin@aiplatform.com
```

---

## 16. Troubleshooting

### 🔴 Build fails: `Invalid supabaseUrl: Must be a valid HTTP or HTTPS URL.`

**السبب:** الـ `NEXT_PUBLIC_SUPABASE_URL` و/أو `NEXT_PUBLIC_SUPABASE_ANON_KEY` مش متاحة في Vercel build environment.

**الحل:**
1. روح لـ [Vercel Dashboard](https://vercel.com/dashboard) → المشروع → **Settings** → **Environment Variables**
2. تأكد إن الـ vars دي موجودة لـ **Production** و **Preview** environments:
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://your-project.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `eyJ...` (من Supabase dashboard)
3. **Redeploy** (مش بس refresh — لازم build جديد)
   - **Deployments** tab → آخر deployment → ⋯ menu → **Redeploy**
   - أو ادفع commit جديد
4. لو الـ vars لسه مش ظاهرة في الـ build، اتأكد إنك ضفتهم للـ **environment** الصح (Production vs Preview vs Development)

**الوقاية:** الـ app دلوقتي defensive — لو الـ Supabase مش configured، الصفحات بتـ render عادي (مع disabled auth)، بدل ما الـ build يفشل. بس لازم تتـ configure عشان الـ features تشتغل.

### 🔴 Runtime: `supabaseKey is required`

نفس الحل — تأكد من `NEXT_PUBLIC_SUPABASE_ANON_KEY` في Vercel.

### 🟡 CORS errors من Supabase

روح لـ Supabase dashboard → **Authentication** → **URL Configuration** → ضيف الـ Vercel domain في **Site URL** و **Additional Redirect URLs**.

### 🟡 Pages ترجع 500 في production

افتح [Vercel logs](https://vercel.com/dashboard) → deployment → **Logs** tab. لو في `Missing NEXT_PUBLIC_SUPABASE_URL`، ارجع للخطوة 1.

### 🟡 Auth callback مش شغّال

تأكد إن `NEXT_PUBLIC_SITE_URL` في Vercel = الـ production domain (مش `http://localhost:3000`).

---


راجع [CHANGELOG.md](./CHANGELOG.md) للتفاصيل الكاملة. أهم الحاجات:

### 🧱 بنية `src/components/tools/` (كانت 30KB في ملف واحد، بقت 9 ملفات)

```
src/components/tools/
├── index.ts              # Barrel — للاستيراد من @/components/tools
├── types.ts              # ToolDetail, ToolReview, PricingType...
├── utils.ts              # getPricingLabel, formatDate, getShareUrl
├── ToolHeader.tsx        # Header + Breadcrumb (~80 سطر)
├── ToolHero.tsx          # Hero + Share bar (~200 سطر)
├── ToolContent.tsx       # About + Features sections (~50 سطر)
├── ToolReviews.tsx       # Review form + list (~150 سطر)
├── ToolAlternatives.tsx  # Alternatives grid (~60 سطر)
├── ToolSidebar.tsx       # Pricing / Quick Info / Tags / Links (~200 سطر)
└── ToolFooter.tsx        # Footer (~25 سطر)
```

`ToolDetailClient.tsx` (orchestrator) بقى **~115 سطر** بدل 661.

### 📁 بنية الـ DB Schema

```
supabase/
├── schema.sql                              # 🔑 Canonical (source of truth)
└── migrations/
    └── 003_arabic_seed_data.sql            # Arabic seed (idempotent)
```

- ملف `setup-db.sql` (مخلفات POS) اتشال
- مجلد `database/` (3 migrations مكررة) اتشال
- `supabase/migrations/001_*` و `002_*` اتشالت (superseded بـ schema.sql)

### 🛠️ بنية `src/lib/`

```
src/lib/
├── env.ts             # Typed env validation (server-only guards)
├── ratelimit.ts       # Upstash + in-memory fallback
├── ratelimit.test.ts  # vitest
├── env.test.ts        # vitest
├── api/response.ts    # successResponse, errorResponse, paginatedResponse
├── seo/               # sitemap + metadata helpers
├── supabase/          # 8 helpers (client, server, middleware, queries, ...)
├── utils/             # cn(), formatters
└── validation/        # Zod schemas
```

### ✅ بعد آخر تحديث

| المؤشر | قبل | بعد |
|--------|-----|-----|
| TypeScript errors | 38+ | 4 (بس vitest imports — `npm install`) |
| DB schema files | 5 متضاربين | 1 canonical + 1 migration |
| Security role check | `user_metadata` (client-editable) | `profiles.role` (server-trusted) |
| Cookie handling | مش بيحدّث response | بيحدّث + httpOnly + sameSite + secure |
| Security headers | 4 (X-Frame, X-Content-Type, Referrer, X-DNS) | 8 (+ CSP, HSTS, Permissions-Policy, X-XSS) |
| Rate limiting | مفيش | Upstash + in-memory fallback |
| Unit tests | 0 | 3 test suites |
| `ToolDetailClient.tsx` | 661 سطر | 115 سطر orchestrator + 9 components |
| Env validation | مفيش | typed + server-only guards |

---

*وثيقة مُعَدَّة لنظام MiniMax M2.7 متعدد الوكلاء · الإصدار 2.0*

> **ملاحظة للوكلاء:** هذه الوثيقة هي المرجع الوحيد. عند أي تعارض بين ما تعرفه وما هو مكتوب هنا، اتبع الوثيقة. لا تتخذ قرارات معمارية خارج ما هو محدد هنا بدون الرجوع للـ Orchestrator Agent.
