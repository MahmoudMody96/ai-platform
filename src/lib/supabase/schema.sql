-- =============================================
-- AI Platform - Supabase Database Schema
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- TABLES
-- =============================================

-- Profiles table (extends auth.users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    username TEXT UNIQUE,
    display_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'enterprise')),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categories table (hierarchical)
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    icon TEXT,
    color TEXT DEFAULT '#6366f1',
    parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tools table
CREATE TABLE tools (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    logo_url TEXT,
    website_url TEXT,
    documentation_url TEXT,
    pricing_model TEXT DEFAULT 'free' CHECK (pricing_model IN ('free', 'freemium', 'paid', 'contact')),
    monthly_price DECIMAL(10, 2),
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    tags TEXT[] DEFAULT '{}',
    features JSONB DEFAULT '[]',
    alternatives TEXT[] DEFAULT '{}',
    stats_json JSONB DEFAULT '{"views": 0, "saves": 0, "reviews": 0}',
    is_featured BOOLEAN DEFAULT FALSE,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Articles table
CREATE TABLE articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT,
    cover_image_url TEXT,
    author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    tags TEXT[] DEFAULT '{}',
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    featured BOOLEAN DEFAULT FALSE,
    read_time INTEGER DEFAULT 5,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Comments table (polymorphic for articles and tools)
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content TEXT NOT NULL,
    article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
    tool_id UUID REFERENCES tools(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    is_approved BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT comment_target CHECK (
        (article_id IS NOT NULL AND tool_id IS NULL) OR 
        (article_id IS NULL AND tool_id IS NOT NULL)
    )
);

-- Favorites table (polymorphic)
CREATE TABLE favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
    tool_id UUID REFERENCES tools(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, article_id, tool_id),
    CONSTRAINT favorite_target CHECK (
        (article_id IS NOT NULL AND tool_id IS NULL) OR 
        (article_id IS NULL AND tool_id IS NOT NULL)
    )
);

-- API Keys table
CREATE TABLE api_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    key TEXT UNIQUE NOT NULL,
    prefix TEXT NOT NULL,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    permissions JSONB DEFAULT '["read"]',
    rate_limit INTEGER DEFAULT 1000,
    expires_at TIMESTAMPTZ,
    last_used_at TIMESTAMPTZ,
    usage_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- API Logs table
CREATE TABLE api_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    api_key_id UUID REFERENCES api_keys(id) ON DELETE CASCADE,
    endpoint TEXT NOT NULL,
    method TEXT DEFAULT 'GET',
    status_code INTEGER,
    ip_address INET,
    user_agent TEXT,
    request_body JSONB,
    response_body JSONB,
    duration_ms INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    body TEXT,
    data_json JSONB DEFAULT '{}',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activity Logs table
CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    details_json JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
    ON profiles FOR SELECT
    USING (TRUE);

CREATE POLICY "Users can update their own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
    ON profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Categories policies (public read, authenticated write)
CREATE POLICY "Categories are viewable by everyone"
    ON categories FOR SELECT
    USING (TRUE);

CREATE POLICY "Authenticated users can create categories"
    ON categories FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update categories"
    ON categories FOR UPDATE
    USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete categories"
    ON categories FOR DELETE
    USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can create tools"
    ON tools FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update tools"
    ON tools FOR UPDATE
    USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete tools"
    ON tools FOR DELETE
    USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can create articles"
    ON articles FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authors can update their own articles"
    ON articles FOR UPDATE
    USING (author_id = auth.uid());

CREATE POLICY "Authors can delete their own articles"
    ON articles FOR DELETE
    USING (author_id = auth.uid());

CREATE POLICY "Users can create their own notifications"
    ON notifications FOR INSERT
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Authenticated users can create activity logs"
    ON activity_logs FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own activity"
    ON activity_logs FOR UPDATE
    USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own activity"
    ON activity_logs FOR DELETE
    USING (user_id = auth.uid());

-- Tools policies
CREATE POLICY "Tools are viewable by everyone"
    ON tools FOR SELECT
    USING (TRUE);

-- Articles policies
CREATE POLICY "Published articles are viewable by everyone"
    ON articles FOR SELECT
    USING (status = 'published' OR author_id = auth.uid());

-- Comments policies
CREATE POLICY "Approved comments are viewable by everyone"
    ON comments FOR SELECT
    USING (is_approved = TRUE OR author_id = auth.uid());

CREATE POLICY "Authenticated users can create comments"
    ON comments FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authors can update their own comments"
    ON comments FOR UPDATE
    USING (author_id = auth.uid());

CREATE POLICY "Authors can delete their own comments"
    ON comments FOR DELETE
    USING (author_id = auth.uid());

-- Favorites policies
CREATE POLICY "Users can only see their own favorites"
    ON favorites FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users can manage their own favorites"
    ON favorites FOR ALL
    USING (user_id = auth.uid());

-- API Keys policies
CREATE POLICY "Users can only see their own API keys"
    ON api_keys FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users can manage their own API keys"
    ON api_keys FOR ALL
    USING (user_id = auth.uid());

-- Notifications policies
CREATE POLICY "Users can only see their own notifications"
    ON notifications FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications"
    ON notifications FOR UPDATE
    USING (user_id = auth.uid());

-- Activity Logs policies
CREATE POLICY "Users can view their own activity"
    ON activity_logs FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Authenticated users can create activity logs"
    ON activity_logs FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- =============================================
-- FUNCTIONS
-- =============================================

-- Increment API usage
CREATE OR REPLACE FUNCTION increment_api_usage(api_key_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE api_keys
    SET 
        usage_count = usage_count + 1,
        last_used_at = NOW()
    WHERE id = api_key_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Search tools function
CREATE OR REPLACE FUNCTION search_tools(
    query TEXT DEFAULT '',
    category_id_filter UUID DEFAULT NULL,
    pricing_filter TEXT DEFAULT NULL
)
RETURNS TABLE (
    id UUID,
    name TEXT,
    slug TEXT,
    description TEXT,
    logo_url TEXT,
    website_url TEXT,
    pricing_model TEXT,
    monthly_price DECIMAL,
    category_id UUID,
    category_name TEXT,
    tags TEXT[],
    is_featured BOOLEAN,
    is_verified BOOLEAN,
    created_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.id, t.name, t.slug, t.description, t.logo_url,
        t.website_url, t.pricing_model, t.monthly_price, t.category_id,
        c.name as category_name, t.tags, t.is_featured, t.is_verified, t.created_at
    FROM tools t
    LEFT JOIN categories c ON t.category_id = c.id
    WHERE 
        (query = '' OR 
            t.name ILIKE '%' || query || '%' OR 
            t.description ILIKE '%' || query || '%' OR 
            t.slug ILIKE '%' || query || '%')
        AND (category_id_filter IS NULL OR t.category_id = category_id_filter)
        AND (pricing_filter IS NULL OR t.pricing_model = pricing_filter);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get dashboard stats function
CREATE OR REPLACE FUNCTION get_dashboard_stats()
RETURNS TABLE (
    total_tools INTEGER,
    total_articles INTEGER,
    total_users INTEGER,
    total_api_keys INTEGER,
    total_api_calls BIGINT,
    featured_tools_count INTEGER,
    published_articles_count INTEGER,
    active_api_keys_count INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*)::INTEGER as total_tools,
        (SELECT COUNT(*) FROM articles WHERE status = 'published')::INTEGER as total_articles,
        (SELECT COUNT(*) FROM profiles)::INTEGER as total_users,
        (SELECT COUNT(*) FROM api_keys)::INTEGER as total_api_keys,
        (SELECT COALESCE(SUM(usage_count), 0) FROM api_keys)::BIGINT as total_api_calls,
        (SELECT COUNT(*) FROM tools WHERE is_featured = TRUE)::INTEGER as featured_tools_count,
        (SELECT COUNT(*) FROM articles WHERE status = 'published')::INTEGER as published_articles_count,
        (SELECT COUNT(*) FROM api_keys WHERE is_active = TRUE)::INTEGER as active_api_keys_count
    FROM tools;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- TRIGGERS
-- =============================================

-- Handle new user trigger (creates profile on auth.users insert)
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (id, email, display_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Update updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply update_updated_at trigger to all tables with updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at
    BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tools_updated_at
    BEFORE UPDATE ON tools
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_articles_updated_at
    BEFORE UPDATE ON articles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at
    BEFORE UPDATE ON comments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- INDEXES
-- =============================================

-- Tools indexes
CREATE INDEX idx_tools_name ON tools(name);
CREATE INDEX idx_tools_category_id ON tools(category_id);
CREATE INDEX idx_tools_pricing_model ON tools(pricing_model);
CREATE INDEX idx_tools_slug ON tools(slug);
CREATE INDEX idx_tools_is_featured ON tools(is_featured);

-- Articles indexes
CREATE INDEX idx_articles_title ON articles(title);
CREATE INDEX idx_articles_author_id ON articles(author_id);
CREATE INDEX idx_articles_status ON articles(status);
CREATE INDEX idx_articles_slug ON articles(slug);
CREATE INDEX idx_articles_published_at ON articles(published_at DESC);

-- Comments indexes
CREATE INDEX idx_comments_article_id ON comments(article_id);
CREATE INDEX idx_comments_tool_id ON comments(tool_id);
CREATE INDEX idx_comments_author_id ON comments(author_id);
CREATE INDEX idx_comments_parent_id ON comments(parent_id);

-- Favorites indexes
CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE INDEX idx_favorites_article_id ON favorites(article_id);
CREATE INDEX idx_favorites_tool_id ON favorites(tool_id);

-- API Keys indexes
CREATE INDEX idx_api_keys_user_id ON api_keys(user_id);
CREATE INDEX idx_api_keys_key ON api_keys(key);
CREATE INDEX idx_api_keys_prefix ON api_keys(prefix);

-- API Logs indexes
CREATE INDEX idx_api_logs_api_key_id ON api_logs(api_key_id);
CREATE INDEX idx_api_logs_created_at ON api_logs(created_at DESC);
CREATE INDEX idx_api_logs_endpoint ON api_logs(endpoint);

-- Notifications indexes
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

-- Activity Logs indexes
CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_entity ON activity_logs(entity_type, entity_id);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at DESC);

-- Categories indexes
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_parent_id ON categories(parent_id);

-- =============================================
-- ADDITIONAL UTILITY FUNCTIONS
-- =============================================

-- Get user by email
CREATE OR REPLACE FUNCTION get_user_by_email(user_email TEXT)
RETURNS TABLE (
    id UUID,
    email TEXT,
    username TEXT,
    display_name TEXT,
    plan TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT p.id, p.email, p.username, p.display_name, p.plan
    FROM profiles p
    WHERE p.email = user_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get user's favorites
CREATE OR REPLACE FUNCTION get_user_favorites(user_id_param UUID)
RETURNS TABLE (
    favorite_id UUID,
    article_id UUID,
    article_title TEXT,
    tool_id UUID,
    tool_name TEXT,
    created_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        f.id, f.article_id, a.title as article_title, f.tool_id, t.name as tool_name, f.created_at
    FROM favorites f
    LEFT JOIN articles a ON f.article_id = a.id
    LEFT JOIN tools t ON f.tool_id = t.id
    WHERE f.user_id = user_id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Log activity helper
CREATE OR REPLACE FUNCTION log_activity(
    action_param TEXT,
    entity_type_param TEXT,
    entity_id_param UUID,
    user_id_param UUID,
    details JSONB DEFAULT '{}'
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO activity_logs (action, entity_type, entity_id, user_id, details_json)
    VALUES (action_param, entity_type_param, entity_id_param, user_id_param, details);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;