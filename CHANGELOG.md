# Changelog

All notable changes to **AI Platform (AL.AI.DY)** will be documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased] — 2026-06-01

### Security (CRITICAL)
- **Fixed privilege escalation in proxy.ts** — role check was reading from
  `user.user_metadata?.role` (client-editable) and is now read from the
  `profiles.role` column via a server-trusted DB query.
- **Fixed cookie handling in proxy.ts** — the `setAll` callback now writes
  back to `response.cookies` (not just `request.cookies`) and applies
  `httpOnly`, `sameSite`, and `secure` defaults.
- **Fixed same role check in `lib/supabase/middleware.ts`** — `requireAdmin`
  now looks up `profiles.role` instead of trusting `user_metadata`. Added
  new `getRoleFromProfiles` helper.
- **Added Content-Security-Policy** and other security headers in
  `next.config.ts` (HSTS, Permissions-Policy, frame-ancestors, etc.).

### Changed
- **Unified DB schema** — `supabase/schema.sql` is now the single source of
  truth (mirrors `src/types/database.ts`). Removed the 4 duplicate schemas
  under `database/migrations/` and the old `supabase/migrations/001_*` and
  `002_*` files. New `supabase/migrations/003_arabic_seed_data.sql` adds
  the canonical Arabic categories / tools / articles.
- **Refactored `src/types/index.ts`** into a barrel that re-exports from
  `database.types.ts` plus a small set of app-level helpers (`AppUser`,
  `ApiResponse`, `PaginatedResponse`). This eliminates the
  Tool-vs-Tool / pricing_type-vs-pricing_model drift that was breaking
  some API routes.
- **Removed `as never` cast** in `FavoritesContext.tsx` — replaced with
  the proper `Database['public']['Tables']['favorites']['Insert']` type.

### Added
- `src/lib/env.ts` — typed env accessor with server-only guards, used by
  every server-only module going forward.
- `src/lib/ratelimit.ts` — Upstash Ratelimit wrappers (with safe in-memory
  fallback for dev). Pre-configured limiters: `proxy`, `api`, `auth`,
  `reviews`, `newsletter`, `admin`.
- **Vitest** test runner with the first three test suites:
  - `src/lib/ratelimit.test.ts` — fallback limits, header parsing
  - `src/lib/env.test.ts` — env validation & requireServerEnv
  - `src/types/types.test.ts` — barrel re-exports & shape checks
- New npm scripts: `test`, `test:watch`, `test:coverage`, `type-check`,
  `db:types`, `db:reset`.

### Removed
- `setup-db.sql` (POS project leftovers, would have dropped unrelated tables)
- `src/middleware.ts.disabled` (empty placeholder)
- `args.json`, `form.json`, `input.json`, `nav.json`, `page.json`,
  `test-args.json`, `trash_args.json`, `src/trash_args.json`
  (test scraper artifacts)
- `about-page.png` moved from project root to `public/`
- `database/` directory (replaced by unified `supabase/`)

## [0.1.0] — 2026-05-29

### Added
- Initial AL.AI.DY platform: 27 routes (public + admin + API)
- Auth via Supabase (email + Google OAuth)
- Tools catalog, articles blog, categories, comments, reviews, favorites
- Admin dashboard with CRUD for tools, articles, categories, users
- Bilingual (Arabic / English) RTL UI with IBM Plex Sans Arabic
- TanStack Query, Zustand, Radix UI, Framer Motion, Zod v4
- Tailwind CSS v4 design system (violet / cyan / amber palette)
