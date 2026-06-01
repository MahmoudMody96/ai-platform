-- =============================================
-- AI Platform - Canonical Database Schema
-- Generated: 2026-06-01
--
-- This is the SINGLE SOURCE OF TRUTH for the AI Platform database.
-- It matches src/types/database.types.ts (auto-generated types) and
-- the API routes in src/app/api/*.
--
-- How to apply:
--   1. Local:   supabase db reset
--   2. Remote:  supabase db push
--
-- Companion files:
--   - supabase/migrations/003_arabic_seed_data.sql  (Arabic seed data)
-- =============================================

-- ============================================================================
-- Extensions
-- ============================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ============================================================================
-- ENUMs
-- ============================================================================
CREATE TYPE user_plan AS ENUM ('free', 'starter', 'pro', 'enterprise');
CREATE TYPE user_role AS ENUM ('viewer', 'editor', 'admin', 'super_admin');
CREATE TYPE subscription_status AS ENUM ('active', 'canceled', 'past_due', 'trialing', 'paused');
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
CREATE TYPE tool_pricing_type AS ENUM ('free', 'freemium', 'paid', 'enterprise', 'contact');
CREATE TYPE tool_status AS ENUM ('pending', 'published', 'rejected', 'archived');
CREATE TYPE article_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE review_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE notification_type AS ENUM ('info', 'success', 'warning', 'error', 'system');
CREATE TYPE api_key_status AS ENUM ('active', 'revoked', 'expired');

-- ============================================================================
-- 1. Profiles (extends Supabase Auth)
-- ============================================================================
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    username TEXT UNIQUE,
    display_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    phone TEXT,
    website TEXT,
    plan user_plan DEFAULT 'free',
    role user_role DEFAULT 'viewer',
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    last_login_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_username ON profiles(username);
CREATE INDEX idx_profiles_plan ON profiles(plan);
CREATE INDEX idx_profiles_role ON profiles(role);

-- ============================================================================
-- 2. Sessions tracking
-- ============================================================================
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    device_info JSONB DEFAULT '{}'::jsonb,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_sessions_expires_at ON user_sessions(expires_at);

-- ============================================================================
-- 3. Plans & Subscriptions
-- ============================================================================
CREATE TABLE plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    monthly_price_cents INTEGER NOT NULL DEFAULT 0,
    yearly_price_cents INTEGER,
    currency TEXT DEFAULT 'USD',
    features JSONB NOT NULL DEFAULT '[]'::jsonb,
    limits JSONB NOT NULL DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES plans(id),
    status subscription_status DEFAULT 'active',
    billing_cycle TEXT DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly', 'yearly')),
    current_period_start TIMESTAMPTZ NOT NULL,
    current_period_end TIMESTAMPTZ NOT NULL,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    canceled_at TIMESTAMPTZ,
    trial_ends_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, billing_cycle)
);

CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);

-- ============================================================================
-- 4. Payments & Invoices
-- ============================================================================
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    subscription_id UUID REFERENCES subscriptions(id),
    amount_cents INTEGER NOT NULL,
    currency TEXT DEFAULT 'USD',
    status payment_status DEFAULT 'pending',
    payment_method TEXT,
    payment_intent_id TEXT,
    receipt_url TEXT,
    description TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_status ON payments(status);

CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    payment_id UUID REFERENCES payments(id),
    invoice_number TEXT UNIQUE NOT NULL,
    amount_cents INTEGER NOT NULL,
    currency TEXT DEFAULT 'USD',
    status TEXT DEFAULT 'draft',
    due_date TIMESTAMPTZ,
    paid_at TIMESTAMPTZ,
    pdf_url TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 5. Categories
-- ============================================================================
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    name_en TEXT,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    icon TEXT,
    color TEXT DEFAULT '#6366f1',
    image_url TEXT,
    tools_count INTEGER DEFAULT 0,
    parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_parent_id ON categories(parent_id);
CREATE INDEX idx_categories_sort_order ON categories(sort_order);

-- ============================================================================
-- 6. AI Tools
-- ============================================================================
CREATE TABLE tools (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    tagline TEXT,
    description TEXT,
    description_en TEXT,
    long_description TEXT,
    website_url TEXT NOT NULL,
    documentation_url TEXT,
    logo_url TEXT,
    screenshot_url TEXT,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    tags TEXT[] DEFAULT '{}',
    pricing_type tool_pricing_type DEFAULT 'freemium',
    pricing_currency TEXT DEFAULT 'USD',
    starting_price DECIMAL(10,2),
    monthly_price DECIMAL(10,2),
    pricing_model TEXT DEFAULT 'freemium',  -- legacy alias for pricing_type
    pricing_info JSONB DEFAULT '{}'::jsonb,
    screenshots JSONB DEFAULT '[]'::jsonb,
    has_free_trial BOOLEAN DEFAULT FALSE,
    trial_days INTEGER,
    rating_avg DECIMAL(3,2) DEFAULT 0.00,
    rating_count INTEGER DEFAULT 0,
    rating DECIMAL(2,1) DEFAULT 0,  -- legacy alias
    review_count INTEGER DEFAULT 0,   -- legacy alias
    meta_title TEXT,
    meta_description TEXT,
    views_count INTEGER DEFAULT 0,
    clicks_count INTEGER DEFAULT 0,
    favorites_count INTEGER DEFAULT 0,
    status tool_status DEFAULT 'pending',
    is_featured BOOLEAN DEFAULT FALSE,
    is_sponsored BOOLEAN DEFAULT FALSE,
    is_verified BOOLEAN DEFAULT FALSE,
    is_published BOOLEAN DEFAULT TRUE,
    sponsored_until TIMESTAMPTZ,
    features JSONB DEFAULT '[]'::jsonb,
    pricing_plans JSONB DEFAULT '[]'::jsonb,
    pros JSONB DEFAULT '[]'::jsonb,
    cons JSONB DEFAULT '[]'::jsonb,
    submitted_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_tools_slug ON tools(slug);
CREATE INDEX idx_tools_category_id ON tools(category_id);
CREATE INDEX idx_tools_status ON tools(status);
CREATE INDEX idx_tools_is_featured ON tools(is_featured);
CREATE INDEX idx_tools_rating ON tools(rating_avg DESC, rating_count DESC);
CREATE INDEX idx_tools_search ON tools USING gin(name gin_trgm_ops);
CREATE INDEX idx_tools_tags ON tools USING gin(tags);

-- ============================================================================
-- 7. Reviews
-- ============================================================================
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tool_id UUID NOT NULL REFERENCES tools(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title TEXT,
    content TEXT,
    pros TEXT[] DEFAULT '{}',
    cons TEXT[] DEFAULT '{}',
    use_case TEXT,
    status review_status DEFAULT 'pending',
    helpful_count INTEGER DEFAULT 0,
    not_helpful_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(tool_id, user_id)
);

CREATE INDEX idx_reviews_tool_id ON reviews(tool_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);

-- ============================================================================
-- 8. Favorites
-- ============================================================================
CREATE TABLE favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    tool_id UUID NOT NULL REFERENCES tools(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, tool_id)
);

CREATE INDEX idx_favorites_user_id ON favorites(user_id);

-- ============================================================================
-- 9. Articles (Blog)
-- ============================================================================
CREATE TABLE articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT,
    cover_image_url TEXT,
    cover_image TEXT,  -- legacy alias
    author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    author_name TEXT,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    category TEXT,
    tags TEXT[] DEFAULT '{}',
    related_tools UUID[] DEFAULT '{}',
    meta_title TEXT,
    meta_description TEXT,
    views_count INTEGER DEFAULT 0,
    views INTEGER DEFAULT 0,  -- legacy alias
    likes_count INTEGER DEFAULT 0,
    reading_time INTEGER,
    read_time INTEGER DEFAULT 5,  -- legacy alias
    status article_status DEFAULT 'draft',
    featured BOOLEAN DEFAULT FALSE,
    is_published BOOLEAN DEFAULT FALSE,
    is_premium BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_articles_slug ON articles(slug);
CREATE INDEX idx_articles_author_id ON articles(author_id);
CREATE INDEX idx_articles_status ON articles(status);
CREATE INDEX idx_articles_published_at ON articles(published_at);
CREATE INDEX idx_articles_search ON articles USING gin(title gin_trgm_ops);

-- ============================================================================
-- 10. Comments
-- ============================================================================
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
    tool_id UUID REFERENCES tools(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_approved BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT comment_target CHECK (
        (article_id IS NOT NULL AND tool_id IS NULL)
        OR (article_id IS NULL AND tool_id IS NOT NULL)
    )
);

CREATE INDEX idx_comments_article_id ON comments(article_id);
CREATE INDEX idx_comments_tool_id ON comments(tool_id);
CREATE INDEX idx_comments_author_id ON comments(author_id);

-- ============================================================================
-- 11. Newsletter Subscribers
-- ============================================================================
CREATE TABLE newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed')),
    source TEXT DEFAULT 'website',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 12. API Keys
-- ============================================================================
CREATE TABLE api_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    key_hash TEXT UNIQUE NOT NULL,
    key_prefix TEXT NOT NULL,
    plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'enterprise')),
    rate_limit INTEGER DEFAULT 1000,
    requests_count INTEGER DEFAULT 0,
    last_used_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_api_keys_user_id ON api_keys(user_id);
CREATE INDEX idx_api_keys_is_active ON api_keys(is_active);

-- ============================================================================
-- 13. Notifications
-- ============================================================================
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    type notification_type DEFAULT 'info',
    title TEXT NOT NULL,
    body TEXT,
    action_url TEXT,
    data JSONB DEFAULT '{}'::jsonb,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);

-- ============================================================================
-- 14. Activity & Page views
-- ============================================================================
CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID,
    details JSONB DEFAULT '{}'::jsonb,
    ip_address INET,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_entity ON activity_logs(entity_type, entity_id);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at);

CREATE TABLE page_views (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    page_path TEXT NOT NULL,
    referrer TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    device_type TEXT,
    country TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_page_views_created_at ON page_views(created_at);

-- ============================================================================
-- Triggers
-- ============================================================================

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (id, email, display_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(
            NEW.raw_user_meta_data->>'display_name',
            NEW.raw_user_meta_data->>'full_name',
            split_part(NEW.email, '@', 1)
        )
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_plans_updated_at ON plans;
CREATE TRIGGER update_plans_updated_at
    BEFORE UPDATE ON plans FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON subscriptions;
CREATE TRIGGER update_subscriptions_updated_at
    BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;
CREATE TRIGGER update_categories_updated_at
    BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_tools_updated_at ON tools;
CREATE TRIGGER update_tools_updated_at
    BEFORE UPDATE ON tools FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_reviews_updated_at ON reviews;
CREATE TRIGGER update_reviews_updated_at
    BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_articles_updated_at ON articles;
CREATE TRIGGER update_articles_updated_at
    BEFORE UPDATE ON articles FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_comments_updated_at ON comments;
CREATE TRIGGER update_comments_updated_at
    BEFORE UPDATE ON comments FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_api_keys_updated_at ON api_keys;
CREATE TRIGGER update_api_keys_updated_at
    BEFORE UPDATE ON api_keys FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Maintain tools_count in categories
CREATE OR REPLACE FUNCTION update_category_tools_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.status = 'published' THEN
    UPDATE categories SET tools_count = tools_count + 1 WHERE id = NEW.category_id;
  ELSIF TG_OP = 'DELETE' AND OLD.status = 'published' THEN
    UPDATE categories SET tools_count = tools_count - 1 WHERE id = OLD.category_id;
  ELSIF TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status THEN
    IF NEW.status = 'published' THEN
      UPDATE categories SET tools_count = tools_count + 1 WHERE id = NEW.category_id;
    ELSIF OLD.status = 'published' THEN
      UPDATE categories SET tools_count = tools_count - 1 WHERE id = OLD.category_id;
    END IF;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_category_tools_count ON tools;
CREATE TRIGGER trg_category_tools_count
    AFTER INSERT OR UPDATE OR DELETE ON tools
    FOR EACH ROW EXECUTE FUNCTION update_category_tools_count();

-- Maintain tool rating aggregates
CREATE OR REPLACE FUNCTION update_tool_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE tools SET
    rating_avg = (SELECT ROUND(AVG(rating)::numeric, 2) FROM reviews
                  WHERE tool_id = COALESCE(NEW.tool_id, OLD.tool_id) AND status = 'approved'),
    rating_count = (SELECT COUNT(*) FROM reviews
                    WHERE tool_id = COALESCE(NEW.tool_id, OLD.tool_id) AND status = 'approved')
  WHERE id = COALESCE(NEW.tool_id, OLD.tool_id);
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_tool_rating ON reviews;
CREATE TRIGGER trg_tool_rating
    AFTER INSERT OR UPDATE OR DELETE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_tool_rating();

-- ============================================================================
-- Helper functions
-- ============================================================================

-- Generate a URL-safe slug from arbitrary text (supports Arabic)
CREATE OR REPLACE FUNCTION generate_slug(title TEXT)
RETURNS TEXT AS $$
  SELECT lower(regexp_replace(trim(title), '[^a-z0-9\u0600-\u06FF]+', '-', 'g'))
$$ LANGUAGE sql IMMUTABLE;

-- Arabic-friendly full-text search
CREATE OR REPLACE FUNCTION search_tools(
  query TEXT,
  p_category TEXT DEFAULT NULL,
  p_limit INT DEFAULT 20,
  p_offset INT DEFAULT 0
)
RETURNS SETOF tools AS $$
  SELECT *
  FROM tools
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

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

-- Profiles: public read, own write
CREATE POLICY "profiles_public_read" ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_own_update" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_own_insert" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Sessions: own only
CREATE POLICY "sessions_own" ON user_sessions FOR ALL USING (user_id = auth.uid());

-- Plans: public read
CREATE POLICY "plans_public_read" ON plans FOR SELECT USING (is_active = true);

-- Subscriptions: own only
CREATE POLICY "subscriptions_own" ON subscriptions FOR ALL USING (user_id = auth.uid());

-- Payments & Invoices: own read
CREATE POLICY "payments_own_read" ON payments FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "invoices_own_read" ON invoices FOR SELECT USING (user_id = auth.uid());

-- Categories: public read
CREATE POLICY "categories_public_read" ON categories FOR SELECT USING (is_active = true);
CREATE POLICY "categories_admin_write" ON categories FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

-- Tools: public read published, admin/editor write
CREATE POLICY "tools_public_read" ON tools FOR SELECT USING (status = 'published' OR is_featured = true);
CREATE POLICY "tools_editor_write" ON tools FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('editor', 'admin', 'super_admin'))
);
CREATE POLICY "tools_editor_update" ON tools FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('editor', 'admin', 'super_admin'))
);

-- Reviews: public read approved
CREATE POLICY "reviews_public_read" ON reviews FOR SELECT USING (status = 'approved');
CREATE POLICY "reviews_own_write" ON reviews FOR ALL USING (user_id = auth.uid());

-- Favorites: own only
CREATE POLICY "favorites_own" ON favorites FOR ALL USING (user_id = auth.uid());

-- Articles: public read published
CREATE POLICY "articles_public_read" ON articles FOR SELECT USING (
    status = 'published' OR author_id = auth.uid() OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);
CREATE POLICY "articles_auth_write" ON articles FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "articles_owner_update" ON articles FOR UPDATE USING (
    author_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

-- Comments: public read approved, auth write
CREATE POLICY "comments_public_read" ON comments FOR SELECT USING (
    is_approved = true OR author_id = auth.uid()
);
CREATE POLICY "comments_auth_write" ON comments FOR ALL USING (auth.uid() IS NOT NULL);

-- Newsletter: public insert
CREATE POLICY "newsletter_public_insert" ON newsletter_subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "newsletter_admin_read" ON newsletter_subscribers FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

-- API keys: own only
CREATE POLICY "api_keys_own" ON api_keys FOR ALL USING (user_id = auth.uid());

-- Notifications: own only
CREATE POLICY "notifications_own" ON notifications FOR ALL USING (user_id = auth.uid());

-- Activity logs: own read
CREATE POLICY "activity_logs_own_read" ON activity_logs FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "activity_logs_auth_insert" ON activity_logs FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Page views: insert only
CREATE POLICY "page_views_insert" ON page_views FOR INSERT WITH CHECK (true);
CREATE POLICY "page_views_admin_read" ON page_views FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- ============================================================================
-- Seed: plans
-- ============================================================================
INSERT INTO plans (name, slug, monthly_price_cents, yearly_price_cents, features, limits, sort_order) VALUES
  ('Free', 'free', 0, 0,
   '["Access to free tools", "Basic API access", "Community support", "5 saved tools"]'::jsonb,
   '{"api_calls": 100, "tools": 5, "articles": 3}'::jsonb, 1),
  ('Starter', 'starter', 990, 9900,
   '["All Free features", "Priority support", "20 saved tools", "Advanced analytics"]'::jsonb,
   '{"api_calls": 1000, "tools": 20, "articles": 10}'::jsonb, 2),
  ('Pro', 'pro', 2990, 29900,
   '["All Starter features", "Unlimited saved tools", "Premium tools access", "API access", "Priority email support"]'::jsonb,
   '{"api_calls": 10000, "tools": -1, "articles": -1}'::jsonb, 3),
  ('Enterprise', 'enterprise', 9990, 99900,
   '["All Pro features", "Unlimited everything", "Dedicated support", "Custom integrations", "SLA guarantee", "Team management"]'::jsonb,
   '{"api_calls": -1, "tools": -1, "articles": -1}'::jsonb, 4)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- Final message
-- ============================================================================
SELECT '✅ AI Platform canonical schema applied successfully!' AS status;
