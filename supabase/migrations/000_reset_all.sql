-- =============================================
-- Migration 000: COMPLETE DATABASE RESET
-- Date: 2026-06-01
--
-- ⚠️⚠️⚠️ DESTRUCTIVE — READ BEFORE RUNNING ⚠️⚠️⚠️
--
-- This script wipes EVERYTHING in the `public` schema:
--   - All tables (data + structure)
--   - All custom ENUM types
--   - All functions, triggers, and policies
--   - All indexes
--
-- After this script, the database is completely empty.
-- You must immediately run `supabase/schema.sql` followed by
-- `supabase/migrations/003_arabic_seed_data.sql` to recreate the
-- AI Platform schema.
--
-- Use cases:
--   ✅ Wipe stale Chinese placeholder data from an old migration
--   ✅ Restart with a clean slate during local development
--   ✅ Re-apply the canonical schema when migrating projects
--
-- DO NOT run this on a production database with real users / data.
--
-- If you only want to reseed, run `supabase/migrations/003_arabic_seed_data.sql`
-- directly (it's idempotent thanks to `ON CONFLICT DO NOTHING`).
-- =============================================

BEGIN;

-- ============================================================================
-- 1. Drop every RLS policy on public tables
-- ============================================================================
DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN
    SELECT schemaname, tablename, policyname
    FROM pg_policies
    WHERE schemaname = 'public'
  LOOP
    EXECUTE format(
      'DROP POLICY IF EXISTS %I ON %I.%I',
      pol.policyname, pol.schemaname, pol.tablename
    );
  END LOOP;
END
$$;

-- ============================================================================
-- 2. Drop every trigger in the public schema
-- ============================================================================
DO $$
DECLARE
  trg RECORD;
BEGIN
  FOR trg IN
    SELECT event_object_schema, event_object_table, trigger_name
    FROM information_schema.triggers
    WHERE event_object_schema = 'public'
  LOOP
    EXECUTE format(
      'DROP TRIGGER IF EXISTS %I ON %I.%I CASCADE',
      trg.trigger_name, trg.event_object_schema, trg.event_object_table
    );
  END LOOP;
END
$$;

-- ============================================================================
-- 2.5. Drop extensions that own functions in the public schema
--      (pg_trgm functions like `similarity()` are protected by the extension
--       and can't be DROP'd directly — must drop the extension first.)
-- ============================================================================
DROP EXTENSION IF EXISTS pg_trgm CASCADE;

-- ============================================================================
-- 3. Drop every FUNCTION in the public schema
--    (CASCADE so dependent triggers / defaults are removed too)
-- ============================================================================
DO $$
DECLARE
  fn RECORD;
BEGIN
  FOR fn IN
    SELECT
      n.nspname AS schema_name,
      p.proname AS function_name,
      pg_get_function_identity_arguments(p.oid) AS args
    FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = 'public'
  LOOP
    EXECUTE format(
      'DROP FUNCTION IF EXISTS %I.%I(%s) CASCADE',
      fn.schema_name, fn.function_name, fn.args
    );
  END LOOP;
END
$$;

-- ============================================================================
-- 4. Drop every TABLE in the public schema
--    (CASCADE strips FKs, indexes, defaults that reference them)
-- ============================================================================
DO $$
DECLARE
  t RECORD;
BEGIN
  FOR t IN
    SELECT tablename
    FROM pg_tables
    WHERE schemaname = 'public'
  LOOP
    EXECUTE format('DROP TABLE IF EXISTS public.%I CASCADE', t.tablename);
  END LOOP;
END
$$;

-- ============================================================================
-- 5. Drop every CUSTOM TYPE (ENUMs)
-- ============================================================================
DO $$
DECLARE
  typ RECORD;
BEGIN
  FOR typ IN
    SELECT t.typname
    FROM pg_type t
    JOIN pg_namespace n ON t.typnamespace = n.oid
    WHERE n.nspname = 'public'
      AND t.typtype = 'e'  -- 'e' = enum
  LOOP
    EXECUTE format('DROP TYPE IF EXISTS public.%I CASCADE', typ.typname);
  END LOOP;
END
$$;

-- ============================================================================
-- 6. Drop the AI Platform plan seed (it's inserted by schema.sql)
--    (No-op if the table was already dropped above.)
-- ============================================================================

-- ============================================================================
-- 7. Verify the public schema is now empty
-- ============================================================================
DO $$
DECLARE
  remaining_tables INT;
  remaining_types INT;
  remaining_funcs INT;
BEGIN
  SELECT COUNT(*) INTO remaining_tables FROM pg_tables WHERE schemaname = 'public';
  SELECT COUNT(*) INTO remaining_types FROM pg_type t
    JOIN pg_namespace n ON t.typnamespace = n.oid
    WHERE n.nspname = 'public' AND t.typtype = 'e';
  SELECT COUNT(*) INTO remaining_funcs FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = 'public';

  RAISE NOTICE 'After reset: % tables, % enums, % functions remain in public schema',
    remaining_tables, remaining_types, remaining_funcs;
END
$$;

COMMIT;

-- ============================================================================
-- 8. Next steps (run AFTER this script in the same SQL Editor session)
-- ============================================================================
--   1. Run `supabase/schema.sql`              (canonical schema, 14 tables)
--   2. Run `supabase/migrations/003_arabic_seed_data.sql`  (Arabic seed)
--   3. Verify with:
--        SELECT tablename FROM pg_tables WHERE schemaname='public' ORDER BY tablename;
--      Expected: api_keys, articles, categories, comments, favorites, feedback,
--                invoices, newsletter_subscribers, notifications, page_views,
--                payments, plans, profiles, reviews, subscriptions, tools,
--                user_sessions, + activity_logs / contact_messages / etc.
-- ============================================================================

SELECT '✅ Public schema wiped. Run supabase/schema.sql next.' AS status;
