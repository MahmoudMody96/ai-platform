-- =============================================
-- AI Platform Database Schema
-- Generated: 2026-05-29
-- =============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- =============================================
-- ENUMS
-- =============================================

CREATE TYPE user_plan AS ENUM ('free', 'starter', 'pro', 'enterprise');
CREATE TYPE user_role AS ENUM ('viewer', 'editor', 'admin', 'super_admin');
CREATE TYPE subscription_status AS ENUM ('active', 'canceled', 'past_due', 'trialing', 'paused');
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
CREATE TYPE tool_pricing_model AS ENUM ('free', 'freemium', 'paid', 'contact');
CREATE TYPE article_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE notification_type AS ENUM ('info', 'success', 'warning', 'error', 'system');
CREATE TYPE api_key_status AS ENUM ('active', 'revoked', 'expired');

-- =============================================
-- 1. USER MANAGEMENT
-- =============================================

-- Profiles table (extends Supabase Auth)
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
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sessions tracking (for concurrent login management)
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    device_info JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL
);

-- =============================================
-- 2. SUBSCRIPTIONS & PLANS
-- =============================================

-- Plans configuration
CREATE TABLE plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    monthly_price_cents INTEGER NOT NULL DEFAULT 0,
    yearly_price_cents INTEGER,
    currency TEXT DEFAULT 'USD',
    features JSONB NOT NULL DEFAULT '[]',
    limits JSONB NOT NULL DEFAULT '{}', -- { api_calls: 1000, tools: 10, articles: 5 }
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User subscriptions
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
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, billing_cycle)
);

-- =============================================
-- 3. PAYMENTS
-- =============================================

-- Transactions / Payments
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
    metadata JSONB DEFAULT '{}',
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Invoices
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
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 4. CATEGORIES
-- =============================================

-- Hierarchical categories
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    icon TEXT,
    color TEXT DEFAULT '#6366f1',
    image_url TEXT,
    parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    sort_order INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 5. AI TOOLS
-- =============================================

-- Tools catalog
CREATE TABLE tools (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    tagline TEXT,
    description TEXT,
    long_description TEXT,
    logo_url TEXT,
    cover_image_url TEXT,
    website_url TEXT,
    documentation_url TEXT,
    pricing_model tool_pricing_model DEFAULT 'free',
    monthly_price_cents INTEGER,
    yearly_price_cents INTEGER,
    currency TEXT DEFAULT 'USD',
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    tags TEXT[] DEFAULT '{}',
    features JSONB DEFAULT '[]',
    alternatives TEXT[] DEFAULT '{}',
    requirements JSONB DEFAULT '{}',
    stats JSONB DEFAULT '{"views": 0, "saves": 0, "uses": 0, "rating": 0, "reviews_count": 0}',
    is_featured BOOLEAN DEFAULT FALSE,
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    is_premium BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0,
    published_at TIMESTAMPTZ,
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tool pricing tiers (for different plans)
CREATE TABLE tool_pricing_tiers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tool_id UUID NOT NULL REFERENCES tools(id) ON DELETE CASCADE,
    plan user_plan DEFAULT 'free',
    monthly_calls_limit INTEGER,
    monthly_price_cents INTEGER DEFAULT 0,
    features JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(tool_id, plan)
);

-- Tool reviews
CREATE TABLE tool_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tool_id UUID NOT NULL REFERENCES tools(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title TEXT,
    content TEXT,
    pros TEXT[],
    cons TEXT[],
    is_verified_purchase BOOLEAN DEFAULT FALSE,
    helpful_count INTEGER DEFAULT 0,
    is_approved BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(tool_id, user_id)
);

-- Tool favorites
CREATE TABLE tool_favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    tool_id UUID NOT NULL REFERENCES tools(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, tool_id)
);

-- Tool usage tracking
CREATE TABLE tool_usage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tool_id UUID NOT NULL REFERENCES tools(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    session_id TEXT,
    action TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 6. ARTICLES / BLOG
-- =============================================

-- Articles
CREATE TABLE articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    cover_image_url TEXT,
    author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    tags TEXT[] DEFAULT '{}',
    status article_status DEFAULT 'draft',
    featured BOOLEAN DEFAULT FALSE,
    read_time INTEGER DEFAULT 5,
    views_count INTEGER DEFAULT 0,
    likes_count INTEGER DEFAULT 0,
    seo_title TEXT,
    seo_description TEXT,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Article comments
CREATE TABLE article_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES article_comments(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    likes_count INTEGER DEFAULT 0,
    is_approved BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Article favorites
CREATE TABLE article_favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, article_id)
);

-- =============================================
-- 7. API MANAGEMENT
-- =============================================

-- User API Keys
CREATE TABLE api_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    key_text TEXT UNIQUE NOT NULL,
    prefix TEXT NOT NULL,
    permissions JSONB DEFAULT '["read"]',
    rate_limit INTEGER DEFAULT 1000,
    quota_limit INTEGER,
    quota_used INTEGER DEFAULT 0,
    quota_reset_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    last_used_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- API Usage Logs
CREATE TABLE api_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    api_key_id UUID REFERENCES api_keys(id) ON DELETE SET NULL,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    endpoint TEXT NOT NULL,
    method TEXT DEFAULT 'GET',
    status_code INTEGER,
    ip_address INET,
    user_agent TEXT,
    request_body JSONB,
    response_body JSONB,
    response_time_ms INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 8. NOTIFICATIONS & MESSAGES
-- =============================================

-- Notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    type notification_type DEFAULT 'info',
    title TEXT NOT NULL,
    body TEXT,
    action_url TEXT,
    data JSONB DEFAULT '{}',
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contact messages
CREATE TABLE contact_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    phone TEXT,
    is_replied BOOLEAN DEFAULT FALSE,
    replied_by UUID REFERENCES profiles(id),
    replied_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 9. ACTIVITY & AUDIT LOGS
-- =============================================

-- Activity logs
CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID,
    details JSONB DEFAULT '{}',
    ip_address INET,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Page views analytics
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

-- =============================================
-- 10. FEEDBACK & SUPPORT
-- =============================================

-- Support tickets
CREATE TABLE support_tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    subject TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT DEFAULT 'general',
    priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
    assigned_to UUID REFERENCES profiles(id),
    resolution TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    closed_at TIMESTAMPTZ
);

-- Ticket replies
CREATE TABLE ticket_replies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id UUID NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_internal BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- General feedback
CREATE TABLE feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    type TEXT NOT NULL CHECK (type IN ('bug', 'feature', 'general')),
    subject TEXT NOT NULL,
    description TEXT,
    rating INTEGER,
    screenshot_url TEXT,
    is_resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TRIGGERS
-- =============================================

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (id, email, display_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Auto-generate username from email if not provided
CREATE OR REPLACE FUNCTION set_default_username()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.username IS NULL OR NEW.username = '' THEN
        NEW.username := lower(regexp_replace(split_part(NEW.email, '@', 1), '[^a-z0-9]', '', 'g')) || '_' || substring(NEW.id::text, 1, 4);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_profile_username
    BEFORE INSERT ON profiles
    FOR EACH ROW EXECUTE FUNCTION set_default_username();

-- Update updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_plans_updated_at BEFORE UPDATE ON plans FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_tools_updated_at BEFORE UPDATE ON tools FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_tool_reviews_updated_at BEFORE UPDATE ON tool_reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON articles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_article_comments_updated_at BEFORE UPDATE ON article_comments FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_api_keys_updated_at BEFORE UPDATE ON api_keys FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_notifications_updated_at BEFORE UPDATE ON notifications FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_support_tickets_updated_at BEFORE UPDATE ON support_tickets FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================
-- INDEXES
-- =============================================

-- Profiles
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_username ON profiles(username);
CREATE INDEX idx_profiles_plan ON profiles(plan);
CREATE INDEX idx_profiles_role ON profiles(role);

-- Sessions
CREATE INDEX idx_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_sessions_expires_at ON user_sessions(expires_at);

-- Subscriptions
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);

-- Payments
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_status ON payments(status);

-- Categories
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_parent_id ON categories(parent_id);
CREATE INDEX idx_categories_sort_order ON categories(sort_order);

-- Tools
CREATE INDEX idx_tools_name ON tools(name);
CREATE INDEX idx_tools_slug ON tools(slug);
CREATE INDEX idx_tools_category_id ON tools(category_id);
CREATE INDEX idx_tools_is_featured ON tools(is_featured);
CREATE INDEX idx_tools_is_active ON tools(is_active);
CREATE INDEX idx_tools_published_at ON tools(published_at);
CREATE INDEX idx_tools_search ON tools USING gin(name gin_trgm_ops);
CREATE INDEX idx_tools_tags ON tools USING gin(tags);

-- Tool pricing tiers
CREATE INDEX idx_tool_pricing_tiers_tool_id ON tool_pricing_tiers(tool_id);

-- Tool reviews
CREATE INDEX idx_tool_reviews_tool_id ON tool_reviews(tool_id);
CREATE INDEX idx_tool_reviews_user_id ON tool_reviews(user_id);
CREATE INDEX idx_tool_reviews_rating ON tool_reviews(rating);

-- Tool usage
CREATE INDEX idx_tool_usage_tool_id ON tool_usage(tool_id);
CREATE INDEX idx_tool_usage_user_id ON tool_usage(user_id);
CREATE INDEX idx_tool_usage_created_at ON tool_usage(created_at);

-- Articles
CREATE INDEX idx_articles_slug ON articles(slug);
CREATE INDEX idx_articles_author_id ON articles(author_id);
CREATE INDEX idx_articles_status ON articles(status);
CREATE INDEX idx_articles_published_at ON articles(published_at);
CREATE INDEX idx_articles_search ON articles USING gin(title gin_trgm_ops);

-- Article comments
CREATE INDEX idx_article_comments_article_id ON article_comments(article_id);
CREATE INDEX idx_article_comments_user_id ON article_comments(user_id);
CREATE INDEX idx_article_comments_parent_id ON article_comments(parent_id);

-- API keys
CREATE INDEX idx_api_keys_user_id ON api_keys(user_id);
CREATE INDEX idx_api_keys_is_active ON api_keys(is_active);

-- API logs
CREATE INDEX idx_api_logs_api_key_id ON api_logs(api_key_id);
CREATE INDEX idx_api_logs_created_at ON api_logs(created_at);

-- Notifications
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);

-- Activity logs
CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_entity ON activity_logs(entity_type, entity_id);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at);

-- Page views
CREATE INDEX idx_page_views_created_at ON page_views(created_at);
CREATE INDEX idx_page_views_user_id ON page_views(user_id);

-- Support tickets
CREATE INDEX idx_support_tickets_user_id ON support_tickets(user_id);
CREATE INDEX idx_support_tickets_status ON support_tickets(status);
CREATE INDEX idx_support_tickets_assigned_to ON support_tickets(assigned_to);

-- Feedback
CREATE INDEX idx_feedback_user_id ON feedback(user_id);
CREATE INDEX idx_feedback_type ON feedback(type);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE tool_pricing_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE tool_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE tool_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE tool_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- =============================================
-- RLS POLICIES
-- =============================================

-- PROFILES
CREATE POLICY "profiles_public_read" ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_own_update" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_own_insert" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- SESSIONS
CREATE POLICY "sessions_own" ON user_sessions FOR ALL USING (user_id = auth.uid());

-- SUBSCRIPTIONS
CREATE POLICY "subscriptions_own" ON subscriptions FOR ALL USING (user_id = auth.uid());

-- PAYMENTS
CREATE POLICY "payments_own_read" ON payments FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "payments_admin_insert" ON payments FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- INVOICES
CREATE POLICY "invoices_own_read" ON invoices FOR SELECT USING (user_id = auth.uid());

-- CATEGORIES
CREATE POLICY "categories_public_read" ON categories FOR SELECT USING (is_active = true);
CREATE POLICY "categories_admin_write" ON categories FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

-- TOOLS
CREATE POLICY "tools_public_read" ON tools FOR SELECT USING (is_active = true);
CREATE POLICY "tools_editor_write" ON tools FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('editor', 'admin', 'super_admin'))
);
CREATE POLICY "tools_editor_update" ON tools FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('editor', 'admin', 'super_admin'))
);

-- TOOL PRICING TIERS
CREATE POLICY "tool_pricing_tiers_public_read" ON tool_pricing_tiers FOR SELECT USING (true);

-- TOOL REVIEWS
CREATE POLICY "tool_reviews_public_read" ON tool_reviews FOR SELECT USING (is_approved = true);
CREATE POLICY "tool_reviews_own_write" ON tool_reviews FOR ALL USING (user_id = auth.uid());

-- TOOL FAVORITES
CREATE POLICY "tool_favorites_own" ON tool_favorites FOR ALL USING (user_id = auth.uid());

-- TOOL USAGE
CREATE POLICY "tool_usage_all_read" ON tool_usage FOR SELECT USING (
    auth.uid() IS NOT NULL AND
    (user_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
);
CREATE POLICY "tool_usage_insert" ON tool_usage FOR INSERT WITH CHECK (true);

-- ARTICLES
CREATE POLICY "articles_public_read" ON articles FOR SELECT USING (
    status = 'published' OR author_id = auth.uid() OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);
CREATE POLICY "articles_auth_write" ON articles FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "articles_owner_update" ON articles FOR UPDATE USING (
    author_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

-- ARTICLE COMMENTS
CREATE POLICY "article_comments_public_read" ON article_comments FOR SELECT USING (
    is_approved = true OR user_id = auth.uid()
);
CREATE POLICY "article_comments_auth_write" ON article_comments FOR ALL USING (auth.uid() IS NOT NULL);

-- ARTICLE FAVORITES
CREATE POLICY "article_favorites_own" ON article_favorites FOR ALL USING (user_id = auth.uid());

-- API KEYS
CREATE POLICY "api_keys_own" ON api_keys FOR ALL USING (user_id = auth.uid());

-- API LOGS
CREATE POLICY "api_logs_own" ON api_logs FOR SELECT USING (
    user_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "api_logs_insert" ON api_logs FOR INSERT WITH CHECK (true);

-- NOTIFICATIONS
CREATE POLICY "notifications_own" ON notifications FOR ALL USING (user_id = auth.uid());

-- CONTACT MESSAGES
CREATE POLICY "contact_messages_public_insert" ON contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "contact_messages_admin_read" ON contact_messages FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

-- ACTIVITY LOGS
CREATE POLICY "activity_logs_admin_read" ON activity_logs FOR SELECT USING (
    user_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "activity_logs_auth_insert" ON activity_logs FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- PAGE VIEWS
CREATE POLICY "page_views_insert" ON page_views FOR INSERT WITH CHECK (true);
CREATE POLICY "page_views_admin_read" ON page_views FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- SUPPORT TICKETS
CREATE POLICY "support_tickets_own" ON support_tickets FOR ALL USING (
    user_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

-- TICKET REPLIES
CREATE POLICY "ticket_replies_own" ON ticket_replies FOR ALL USING (
    user_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

-- FEEDBACK
CREATE POLICY "feedback_own" ON feedback FOR ALL USING (user_id = auth.uid());
CREATE POLICY "feedback_public_insert" ON feedback FOR INSERT WITH CHECK (user_id IS NOT NULL);

-- =============================================
-- SEED DATA
-- =============================================

-- Plans
INSERT INTO plans (name, slug, monthly_price_cents, yearly_price_cents, features, limits, sort_order) VALUES
('Free', 'free', 0, 0,
    '["Access to free tools", "Basic API access", "Community support", "5 saved tools", "Basic analytics"]',
    '{"api_calls": 100, "tools": 5, "articles": 3}',
    1),
('Starter', 'starter', 990, 9900,
    '["All Free features", "Priority support", "20 saved tools", "Advanced analytics", "Email notifications"]',
    '{"api_calls": 1000, "tools": 20, "articles": 10}',
    2),
('Pro', 'pro', 2990, 29900,
    '["All Starter features", "Unlimited saved tools", "Premium tools access", "API access", "Priority email support", "Custom notifications"]',
    '{"api_calls": 10000, "tools": -1, "articles": -1}',
    3),
('Enterprise', 'enterprise', 9990, 99900,
    '["All Pro features", "Unlimited everything", "Dedicated support", "Custom integrations", "SLA guarantee", "Team management"]',
    '{"api_calls": -1, "tools": -1, "articles": -1}',
    4);

-- Categories
INSERT INTO categories (name, slug, description, icon, color, sort_order, is_featured) VALUES
('AI Chatbots', 'ai-chatbots', 'Conversational AI and chatbot platforms', 'bot', '#6366f1', 1, true),
('Image Generation', 'image-generation', 'AI-powered image creation and editing', 'image', '#8b5cf6', 2, true),
('Code Assistants', 'code-assistants', 'AI coding tools and programming assistants', 'code', '#10b981', 3, true),
('Writing Tools', 'writing-tools', 'AI writing and content creation tools', 'pen', '#f59e0b', 4, false),
('Video & Audio', 'video-audio', 'AI video generation and audio processing', 'video', '#ec4899', 5, false),
('Productivity', 'productivity', 'AI tools for productivity and workflow', 'zap', '#14b8a6', 6, false),
('Analytics', 'analytics', 'AI-powered data and analytics tools', 'bar-chart', '#3b82f6', 7, false),
('Research', 'research', 'AI research and learning tools', 'book', '#a855f7', 8, false);

SELECT '✅ AI Platform Schema created successfully!' as status;