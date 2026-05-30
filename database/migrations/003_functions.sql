-- =============================================
-- Functions and Triggers Migration
-- AI Platform - Auto-updates and Functions
-- Created: 2026-05-30
-- =============================================

-- =============================================
-- Function: Update category tools_count
-- =============================================
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

-- =============================================
-- Function: Update tool rating_avg
-- =============================================
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

-- =============================================
-- Function: Update profile reviews_count
-- =============================================
CREATE OR REPLACE FUNCTION update_profile_reviews_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.status = 'approved' THEN
    UPDATE profiles SET reviews_count = reviews_count + 1 WHERE id = NEW.user_id;
  ELSIF TG_OP = 'DELETE' AND OLD.status = 'approved' THEN
    UPDATE profiles SET reviews_count = reviews_count - 1 WHERE id = OLD.user_id;
  ELSIF TG_OP = 'UPDATE' AND OLD.status != NEW.status THEN
    IF NEW.status = 'approved' THEN
      UPDATE profiles SET reviews_count = reviews_count + 1 WHERE id = NEW.user_id;
    ELSIF OLD.status = 'approved' THEN
      UPDATE profiles SET reviews_count = reviews_count - 1 WHERE id = OLD.user_id;
    END IF;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_profile_reviews_count
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_profile_reviews_count();

-- =============================================
-- Function: Update profile favorites_count
-- =============================================
CREATE OR REPLACE FUNCTION update_profile_favorites_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE profiles SET favorites_count = favorites_count + 1 WHERE id = NEW.user_id;
    UPDATE tools SET favorites_count = favorites_count + 1 WHERE id = NEW.tool_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE profiles SET favorites_count = favorites_count - 1 WHERE id = OLD.user_id;
    UPDATE tools SET favorites_count = favorites_count - 1 WHERE id = OLD.tool_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_profile_favorites_count
  AFTER INSERT OR DELETE ON favorites
  FOR EACH ROW EXECUTE FUNCTION update_profile_favorites_count();

-- =============================================
-- Function: Generate slug from title (Arabic compatible)
-- =============================================
CREATE OR REPLACE FUNCTION generate_slug(title TEXT)
RETURNS TEXT AS $$
  SELECT lower(regexp_replace(trim(title), '[^a-z0-9\u0600-\u06FF]+', '-', 'g'));
$$ LANGUAGE sql IMMUTABLE;

-- =============================================
-- Function: Full-text search for tools
-- =============================================
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

-- =============================================
-- Function: Calculate reading time for articles
-- =============================================
CREATE OR REPLACE FUNCTION calculate_reading_time(content TEXT)
RETURNS INT AS $$
  SELECT GREATEST(1, CEIL(length(content) / 1000.0));
$$ LANGUAGE sql IMMUTABLE;

-- =============================================
-- Function: Auto-create profile on user signup
-- =============================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, display_name, username)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();