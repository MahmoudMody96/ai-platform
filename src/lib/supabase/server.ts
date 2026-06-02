// =============================================
// AI Platform - Supabase Server Client (Route Handlers)
// =============================================
//
// Returns `SupabaseClient | null` so callers can branch on configuration
// status. Falls back to an anonymous (no-cookie) client when the cookie
// store is unavailable (e.g. during static generation in dev).
// =============================================

import { createServerClient as createSupabaseServerClient, type CookieOptions } from '@supabase/ssr';
import { createClient as createSupabaseClient, type SupabaseClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

function getSupabaseUrl(): string {
  const v = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  if (!v && process.env.NODE_ENV !== 'production') {
    console.log('[supabase] NEXT_PUBLIC_SUPABASE_URL is empty in process.env');
  }
  return v;
}
function getSupabaseAnonKey(): string {
  const v = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
  if (!v && process.env.NODE_ENV !== 'production') {
    console.log('[supabase] NEXT_PUBLIC_SUPABASE_ANON_KEY is empty in process.env');
  }
  return v;
}

function isConfigured(): boolean {
  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();
  if (!url || !key) {
    if (process.env.NODE_ENV !== 'production') {
      console.log('[supabase] env missing — url empty:', !url, 'key empty:', !key);
    }
    return false;
  }
  if (!url.startsWith('https://') && !url.startsWith('http://')) {
    if (process.env.NODE_ENV !== 'production') {
      console.log('[supabase] url malformed:', url.slice(0, 30));
    }
    return false;
  }
  return true;
}

/**
 * Try to build a cookie-aware Supabase client (for auth-bound queries).
 * If `cookies()` is unavailable (e.g. in some static prerender paths), we
 * fall back to a plain anonymous client — same RLS reads still work.
 */
async function buildClient(): Promise<SupabaseClient | null> {
  if (!isConfigured()) return null;

  // Try cookie-aware client first
  try {
    const cookieStore = await cookies();
    return createSupabaseServerClient(
      getSupabaseUrl(),
      getSupabaseAnonKey(),
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => {
                cookieStore.set(name, value, options as CookieOptions);
              });
            } catch {
              // setAll called from a Server Component — ignored.
            }
          },
        },
      }
    );
  } catch (err) {
    // cookies() failed (likely the route is not in a Server Action /
    // Route Handler context). Fall back to a plain anon client.
    if (process.env.NODE_ENV !== 'production') {
      console.log('[supabase] cookie client unavailable, falling back to anon:', err);
    }
  }

  // Plain anonymous client — works for all public read queries
  // under RLS. Sufficient for /api/tools, /api/categories, etc.
  return createSupabaseClient(getSupabaseUrl(), getSupabaseAnonKey());
}

/**
 * Create a Supabase client for Server Components and Route Handlers.
 * Returns null if env vars are not configured.
 */
export async function createClient(): Promise<SupabaseClient | null> {
  return buildClient();
}

/**
 * Helper for API routes. Returns the Supabase client OR a `NextResponse`
 * with a 503 — so callers can `return` it directly.
 */
export async function getSupabaseOrError(): Promise<SupabaseClient | Response> {
  const client = await buildClient();
  if (!client) {
    return new Response(
      JSON.stringify({
        success: false,
        error:
          'Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your environment.',
      }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    );
  }
  return client;
}
