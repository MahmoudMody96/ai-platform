# Supabase Database Files

This directory contains every SQL file you need to manage the AI Platform
database. They are designed to be **idempotent and safe to re-run**.

## 📁 Files in this directory

| File | Purpose | When to run |
|------|---------|-------------|
| `schema.sql` | **Canonical** schema: 14 tables, ENUMs, RLS, triggers, plans seed | Once (per database) |
| `migrations/000_reset_all.sql` | DESTRUCTIVE: drops every object in `public` | When you need a clean slate |
| `migrations/003_arabic_seed_data.sql` | Idempotent Arabic seed (8 categories, 11 tools, 3 articles) | After `schema.sql` |
| `scripts/reset-and-apply.sql` | One-shot: reset + schema + seed | When wiping the database |

## 🚀 First-time setup (fresh database)

If your Supabase project is brand new, run **just these two files in order**:

1. `schema.sql`
2. `migrations/003_arabic_seed_data.sql`

You can run them via:
- **Supabase Dashboard** → SQL Editor → paste each file and Run
- **`supabase db push`** if you have the CLI linked

## 🔄 Full reset (wipe + re-apply)

When your database has stale or inconsistent data (e.g. the old Chinese
placeholder categories), run `scripts/reset-and-apply.sql`. It's a single
file that:

1. **Drops** every table, enum, function, trigger, and policy in `public`
2. **Applies** the canonical schema
3. **Seeds** the canonical Arabic data

### How to run

#### Option A — Supabase Dashboard (easiest)

1. Open https://app.supabase.com → your project
2. **SQL Editor** → **New query**
3. Open `scripts/reset-and-apply.sql`, copy the full contents, paste, **Run**
4. Wait for the script to finish (~10s)
5. Verify with:
   ```sql
   SELECT 'tools' AS table, count(*) FROM tools
   UNION ALL SELECT 'categories', count(*) FROM categories
   UNION ALL SELECT 'articles', count(*) FROM articles
   UNION ALL SELECT 'plans', count(*) FROM plans;
   ```
   Expected:
   ```
   tools       | 11
   categories  | 8
   articles    | 3
   plans       | 4
   ```

#### Option B — Supabase CLI

```bash
# From the project root
supabase link --project-ref <your-project-ref>
supabase db push            # applies pending migrations (NOT a reset)
# OR for a true reset:
supabase db reset --linked  # wipes + re-runs all migrations
```

#### Option C — psql

```bash
export DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres"
psql "$DATABASE_URL" -f supabase/scripts/reset-and-apply.sql
```

## 🔁 Re-seeding only (no reset)

If you only want to add the Arabic seed data (e.g. after a partial migration):

```sql
-- In Supabase SQL Editor
\i supabase/migrations/003_arabic_seed_data.sql
```

This is safe to re-run because everything uses `ON CONFLICT DO NOTHING`.

## 📋 Verifying the schema

After any reset/re-apply, run:

```sql
-- Should list ~17 tables
SELECT tablename
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- Should show 8 categories (Arabic names)
SELECT slug, name FROM categories ORDER BY sort_order;

-- Should show 4 plans (Free, Starter, Pro, Enterprise)
SELECT name, monthly_price_cents FROM plans ORDER BY sort_order;

-- Should show 11 tools (Arabic content)
SELECT slug, name, rating_avg FROM tools ORDER BY is_featured DESC, name;
```

## ⚠️ Warnings

- `000_reset_all.sql` is **destructive** — it wipes every byte of data in
  the `public` schema. Don't run it on a database that has real users or
  content you care about.
- The reset script is wrapped in a `BEGIN` / `COMMIT` transaction so it
  either completes fully or not at all.
- After the reset, you **must** run `schema.sql` + the seed, or the
  application will be broken (empty data + stale types).
