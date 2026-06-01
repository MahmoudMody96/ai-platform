// =============================================
// AI Platform - Supabase Server Client (Route Handlers)
// =============================================
//
// Returns `SupabaseClient | null` so callers can branch on configuration
// status. The original implementation asserted non-null on the env vars,
// which crashed route handlers at runtime when secrets were missing.
// =============================================

import { createServerClient as createSupabaseServerClient, type CookieOptions } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

function getSupabaseUrl(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
}
function getSupabaseAnonKey(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
}

function isConfigured(): boolean {
  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();
  if (!url || !key) return false;
  if (!url.startsWith('https://') && !url.startsWith('http://')) return false;
  return true;
}

/**
 * Create a Supabase client for Server Components and Route Handlers.
 * Returns null if env vars are not configured (e.g. in a build-only context
 * or a misconfigured Vercel environment).
 */
export async function createClient(): Promise<SupabaseClient | null> {
  if (!isConfigured()) return null;

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
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing user sessions.
          }
        },
      },
    }
  );
}

/**
 * Helper for API routes. Returns the Supabase client OR a `NextResponse`
 * with a 503 — so callers can `return` it directly.
 *
 *   const supabase = await getSupabaseOrError();
 *   if (supabase instanceof NextResponse) return supabase;
 *   // supabase is now narrowed to SupabaseClient
 */
export async function getSupabaseOrError(): Promise<SupabaseClient | Response> {
  const client = await createClient();
  if (!client) {
    return new Response(
      JSON.stringify({
        success: false,
        error:
          'Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your environment (e.g. Vercel dashboard).',
      }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    );
  }
  return client;
}
