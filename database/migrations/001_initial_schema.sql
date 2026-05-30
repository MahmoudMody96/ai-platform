-- =============================================
-- Initial Schema Migration
-- AI Platform - Database Schema
-- Created: 2026-05-30
-- =============================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- Categories Table
-- =============================================
CREATE TABLE categories (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  name_en     TEXT,
  slug        TEXT UNIQUE NOT NULL,
  description TEXT,
  icon        TEXT,
  color       TEXT DEFAULT '#6366f1',
  tools_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  sort_order  INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_featured ON categories(is_featured) WHERE is_featured = true;

-- =============================================
-- Tools Table
-- =============================================
CREATE TABLE tools (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name              TEXT NOT NULL,
  slug              TEXT UNIQUE NOT NULL,
  tagline           TEXT,
  description       TEXT,
  description_en    TEXT,
  website_url       TEXT NOT NULL,
  logo_url          TEXT,
  screenshot_url    TEXT,
  category_id       UUID REFERENCES categories(id) ON DELETE SET NULL,
  tags              TEXT[] DEFAULT '{}',

  -- Pricing
  pricing_type      TEXT DEFAULT 'freemium'
    CHECK (pricing_type IN ('free','freemium','paid','enterprise','contact')),
  starting_price    DECIMAL(10,2),
  pricing_currency  TEXT DEFAULT 'USD',
  has_free_trial    BOOLEAN DEFAULT false,
  trial_days        INTEGER,

  -- Ratings
  rating_avg        DECIMAL(3,2) DEFAULT 0.00,
  rating_count      INTEGER DEFAULT 0,

  -- SEO
  meta_title        TEXT,
  meta_description  TEXT,

  -- Stats
  views_count       INTEGER DEFAULT 0,
  clicks_count      INTEGER DEFAULT 0,
  favorites_count   INTEGER DEFAULT 0,

  -- Status
  status            TEXT DEFAULT 'pending'
    CHECK (status IN ('pending', 'published', 'rejected', 'archived')),
  is_featured       BOOLEAN DEFAULT false,
  is_sponsored      BOOLEAN DEFAULT false,
  sponsored_until   TIMESTAMPTZ,

  -- Features (JSON)
  features          JSONB DEFAULT '[]',
  pricing_plans     JSONB DEFAULT '[]',

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

-- =============================================
-- Profiles Table (extends auth.users)
-- =============================================
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

-- =============================================
-- Reviews Table
-- =============================================
CREATE TABLE reviews (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_id     UUID NOT NULL REFERENCES tools(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rating      INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title       TEXT,
  content     TEXT,
  pros        TEXT[] DEFAULT '{}',
  cons        TEXT[] DEFAULT '{}',
  use_case    TEXT,

  -- Moderation
  status      TEXT DEFAULT 'pending'
    CHECK (status IN ('pending', 'approved', 'rejected')),

  -- Helpfulness
  helpful_count     INTEGER DEFAULT 0,
  not_helpful_count INTEGER DEFAULT 0,

  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(tool_id, user_id)
);

CREATE INDEX idx_reviews_tool ON reviews(tool_id, status);
CREATE INDEX idx_reviews_user ON reviews(user_id);

-- =============================================
-- Articles Table
-- =============================================
CREATE TABLE articles (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title           TEXT NOT NULL,
  slug            TEXT UNIQUE NOT NULL,
  excerpt         TEXT,
  content         TEXT,
  cover_image_url TEXT,
  author_id       UUID REFERENCES profiles(id) ON DELETE SET NULL,
  category_id     UUID REFERENCES categories(id) ON DELETE SET NULL,
  tags            TEXT[] DEFAULT '{}',
  related_tools   UUID[] DEFAULT '{}',

  -- SEO
  meta_title       TEXT,
  meta_description TEXT,

  -- Stats
  views_count      INTEGER DEFAULT 0,
  reading_time      INTEGER,

  status           TEXT DEFAULT 'draft'
    CHECK (status IN ('draft', 'published', 'archived')),
  published_at     TIMESTAMPTZ,

  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_articles_slug ON articles(slug);
CREATE INDEX idx_articles_status ON articles(status, published_at DESC);

-- FTS for articles
CREATE INDEX idx_articles_fts ON articles
  USING GIN(to_tsvector('arabic', coalesce(title,'') || ' ' || coalesce(excerpt,'')));

-- =============================================
-- Favorites Table
-- =============================================
CREATE TABLE favorites (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  tool_id    UUID NOT NULL REFERENCES tools(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, tool_id)
);

CREATE INDEX idx_favorites_user ON favorites(user_id);

-- =============================================
-- Newsletter Subscribers Table
-- =============================================
CREATE TABLE newsletter_subscribers (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email       TEXT UNIQUE NOT NULL,
  name        TEXT,
  status      TEXT DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed')),
  source      TEXT DEFAULT 'website',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- API Keys Table
-- =============================================
CREATE TABLE api_keys (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  key_hash        TEXT UNIQUE NOT NULL,
  key_prefix      TEXT NOT NULL,
  plan            TEXT DEFAULT 'free'
    CHECK (plan IN ('free', 'pro', 'enterprise')),
  rate_limit      INTEGER DEFAULT 1000,
  requests_count  INTEGER DEFAULT 0,
  last_used_at    TIMESTAMPTZ,
  expires_at      TIMESTAMPTZ,
  is_active       BOOLEAN DEFAULT true,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- Seed Categories
-- =============================================
INSERT INTO categories (name, name_en, slug, description, icon, color, sort_order, is_featured) VALUES
  ('كتابة المحتوى', 'Content Writing', 'content-writing', 'أدوات لكتابة المحتوى والتدوينات', 'FileText', '#10b981', 1, true),
  ('تصميم', 'Design', 'design', 'أدوات تصميم بالذكاء الاصطناعي', 'ImageIcon', '#ec4899', 2, true),
  ('برمجة', 'Coding', 'coding', 'مساعدات البرمجة وكتابة الكود', 'Code2', '#8b5cf6', 3, true),
  ('صوت', 'Audio', 'audio', 'أدوات تحويل النص إلى صوت', 'Mic', '#06b6d4', 4, false),
  ('فيديو', 'Video', 'video', 'أدوات إنتاج وتحرير الفيديو', 'Video', '#f43f5e', 5, true),
  ('بحث', 'Research', 'research', 'محركات بحث ذكية', 'Globe', '#22c55e', 6, false),
  ('أدوات مساعدة', 'Productivity', 'productivity', 'أدوات للإنتاجية', 'Layers', '#f59e0b', 7, false);