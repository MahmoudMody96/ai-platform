-- =============================================
-- Migration 004: Grant base privileges
-- Date: 2026-06-02
--
-- RLS policies only filter rows; the base SELECT/INSERT/UPDATE/DELETE
-- privileges on the tables themselves must be granted explicitly. Without
-- these grants, anon reads return:
--   "permission denied for table <name>" (Postgres code 42501)
-- even when an RLS policy would otherwise allow the row.
--
-- The canonical schema.sql embeds the same grants, so this migration is
-- only needed for databases that were initialised before the grants were
-- added. Re-running is safe (idempotent).
-- =============================================

GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public
  TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES
  TO anon, authenticated, service_role;

GRANT USAGE, SELECT, UPDATE ON ALL SEQUENCES IN SCHEMA public
  TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT USAGE, SELECT, UPDATE ON SEQUENCES
  TO anon, authenticated, service_role;

GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public
  TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT EXECUTE ON FUNCTIONS
  TO anon, authenticated, service_role;

SELECT '✅ Grants applied.' AS status;
