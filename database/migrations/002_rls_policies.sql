-- =============================================
-- RLS Policies Migration
-- AI Platform - Row Level Security
-- Created: 2026-05-30
-- =============================================

-- Enable RLS on all tables
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- =============================================
-- Tools Policies
-- =============================================

-- Everyone can read published tools
CREATE POLICY "tools_public_read" ON tools FOR SELECT USING (status = 'published');

-- Only admins can update/delete tools
CREATE POLICY "tools_admin_all" ON tools FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Authenticated users can insert tools
CREATE POLICY "tools_user_insert" ON tools FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- =============================================
-- Reviews Policies
-- =============================================

-- Public can read approved reviews
CREATE POLICY "reviews_public_read" ON reviews FOR SELECT USING (status = 'approved');

-- Users can insert their own reviews
CREATE POLICY "reviews_user_insert" ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own reviews
CREATE POLICY "reviews_user_update" ON reviews FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own reviews
CREATE POLICY "reviews_user_delete" ON reviews FOR DELETE USING (auth.uid() = user_id);

-- =============================================
-- Profiles Policies
-- =============================================

-- Everyone can read profiles
CREATE POLICY "profiles_public_read" ON profiles FOR SELECT USING (true);

-- Users can update their own profile
CREATE POLICY "profiles_owner_update" ON profiles FOR UPDATE USING (auth.uid() = id);

-- =============================================
-- Favorites Policies
-- =============================================

-- Users can manage their own favorites
CREATE POLICY "favorites_owner_all" ON favorites FOR ALL USING (auth.uid() = user_id);

-- =============================================
-- Articles Policies
-- =============================================

-- Everyone can read published articles
CREATE POLICY "articles_public_read" ON articles FOR SELECT USING (status = 'published');

-- Admins can manage all articles
CREATE POLICY "articles_admin_all" ON articles FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Authors can update their own articles
CREATE POLICY "articles_author_update" ON articles FOR UPDATE USING (auth.uid() = author_id);

-- =============================================
-- Newsletter Policies
-- =============================================

-- Anyone can subscribe
CREATE POLICY "newsletter_public_insert" ON newsletter_subscribers FOR INSERT WITH CHECK (true);

-- Users can manage their own subscription
CREATE POLICY "newsletter_owner_all" ON newsletter_subscribers FOR ALL USING (auth.uid() IS NOT NULL);

-- =============================================
-- API Keys Policies
-- =============================================

-- Users can manage their own API keys
CREATE POLICY "api_keys_owner_all" ON api_keys FOR ALL USING (auth.uid() = user_id);