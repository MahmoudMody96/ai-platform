// =============================================
// AI Platform - Supabase Client Configuration
// =============================================
//
// Every factory in this file returns `SupabaseClient | null`.
// Callers MUST null-check before using the client. This is critical
// during `next build` and Vercel prerender, where environment
// variables may not be set yet (or the project is being built
// without secrets for a smoke check).
//
// The original `validateEnv()` that *threw* is now a soft `isConfigured()`
// helper that callers can use to decide whether to render a
// "configure Supabase" placeholder instead of crashing the build.
// =============================================

import { createClient as createSupabaseClient, type SupabaseClient } from '@supabase/supabase-js';
import { createBrowserClient as createBrowserClientSSR } from '@supabase/ssr';

// ============================================================================
// Environment access (defensive)
// ============================================================================

function getSupabaseUrl(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
}

function getSupabaseAnonKey(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
}

function getSupabaseServiceKey(): string {
  // SERVER-ONLY — never expose to the browser bundle.
  if (typeof window !== 'undefined') {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('[supabase] SUPABASE_SERVICE_ROLE_KEY accessed from the client. This is a bug.');
    }
    return '';
  }
  return process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';
}

/** Returns true only when both public vars are set and look like a URL. */
export function isSupabaseConfigured(): boolean {
  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();
  if (!url || !key) return false;
  if (!url.startsWith('https://') && !url.startsWith('http://')) return false;
  return true;
}

// Singleton for server-side usage without cookies
let _serverClient: SupabaseClient | null = null;

// ============================================================================
// Server-side (no cookies) — for API routes that need anon auth
// ============================================================================

export function createClient(): SupabaseClient | null {
  if (!isSupabaseConfigured()) {
    if (process.env.NODE_ENV === 'production') {
      console.warn('[supabase] NEXT_PUBLIC_SUPABASE_URL/ANON_KEY missing — returning null client');
    }
    return null;
  }
  return createSupabaseClient(getSupabaseUrl(), getSupabaseAnonKey());
}

// ============================================================================
// Browser client (uses @supabase/ssr for cookie-aware sessions)
// ============================================================================

export function createBrowserClient(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null;
  return createBrowserClientSSR(getSupabaseUrl(), getSupabaseAnonKey());
}

// ============================================================================
// Server client for Server Components / Route Handlers (cookie-aware)
// ============================================================================

export function createServerClient(
  cookies: Record<string, string | undefined>
): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null;
  return createBrowserClientSSR(getSupabaseUrl(), getSupabaseAnonKey(), {
    cookies: {
      getAll() {
        return Object.entries(cookies).map(([name, value]) => ({
          name,
          value: value ?? '',
        }));
      },
      setAll() {
        // No-op in legacy helper; the real cookie refresh happens in proxy.ts
      },
    },
  });
}

// ============================================================================
// Server client with middleware cookie access (for the proxy.ts integration)
// ============================================================================

export function createServerClientFromMiddleware(
  cookies: {
    get: (name: string) => string | undefined;
    set: (name: string, value: string, options: object) => void;
  }
): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null;
  return createBrowserClientSSR(getSupabaseUrl(), getSupabaseAnonKey(), {
    cookies: {
      getAll() {
        return [
          {
            name: 'sb-access-token',
            value: cookies.get('sb-access-token') ?? '',
          },
          {
            name: 'sb-refresh-token',
            value: cookies.get('sb-refresh-token') ?? '',
          },
        ].filter((c) => c.value);
      },
      setAll(cookiesToSet: { name: string; value: string; options?: object }[]) {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookies.set(name, value, options as Parameters<typeof cookies.set>[2]);
        });
      },
    },
  });
}

// ============================================================================
// Singleton (server-side only, when no cookies are involved)
// ============================================================================

export function getServerClient(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null;
  if (!_serverClient) {
    _serverClient = createSupabaseClient(getSupabaseUrl(), getSupabaseAnonKey());
  }
  return _serverClient;
}

// ============================================================================
// Admin client (bypasses RLS) — SERVER-ONLY
// ============================================================================

export function createAdminClient(): SupabaseClient | null {
  if (typeof window !== 'undefined') {
    throw new Error('[supabase] createAdminClient() must never be called from the client.');
  }
  const url = getSupabaseUrl();
  const serviceKey = getSupabaseServiceKey();
  if (!url || !serviceKey) {
    return null;
  }
  return createSupabaseClient(url, serviceKey);
}
