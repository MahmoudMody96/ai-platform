-- =============================================
-- AI Platform — Full Database Reset + Re-apply
-- Date: 2026-06-01
--
-- ⚠️⚠️⚠️ DESTRUCTIVE — wipes the entire `public` schema ⚠️⚠️⚠️
--
-- This is a single-file convenience that runs the three migrations
-- in order:
--   1. supabase/migrations/000_reset_all.sql           (wipe everything)
--   2. supabase/schema.sql                              (canonical schema)
--   3. supabase/migrations/003_arabic_seed_data.sql     (Arabic seed)
--
-- USAGE
-- -----
--   Option A — Supabase Dashboard (easiest, no CLI):
--     1. Open https://app.supabase.com → your project
--     2. SQL Editor → New query
--     3. Open this file, copy its full contents, paste, and Run
--
--   Option B — Supabase CLI:
--     supabase db reset --linked   # wipes local DB + re-runs migrations
--     # OR for a remote project:
--     supabase db push --include-all
--
--   Option C — psql (advanced):
--     psql "$DATABASE_URL" -f supabase/scripts/reset-and-apply.sql
--
-- After running, verify with:
--   SELECT count(*) FROM tools;        -- 11
--   SELECT count(*) FROM categories;   -- 8
--   SELECT count(*) FROM articles;     -- 3
--   SELECT count(*) FROM plans;        -- 4
-- =============================================

\echo '▶ Step 1/3: Wiping public schema...'
\i supabase/migrations/000_reset_all.sql

\echo '▶ Step 2/3: Applying canonical schema...'
\i supabase/schema.sql

\echo '▶ Step 3/3: Seeding Arabic data...'
\i supabase/migrations/003_arabic_seed_data.sql

\echo '✅ Done. Verify with:'
\echo '   SELECT ''tools''     AS table, count(*) FROM tools'
\echo '   UNION ALL SELECT ''categories'', count(*) FROM categories'
\echo '   UNION ALL SELECT ''articles'',   count(*) FROM articles'
\echo '   UNION ALL SELECT ''plans'',      count(*) FROM plans;'
