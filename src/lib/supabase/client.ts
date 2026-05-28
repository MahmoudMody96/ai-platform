// =============================================
// AI Platform - Supabase Client Configuration
// =============================================

import { createClient as createSupabaseClient, type SupabaseClient } from '@supabase/supabase-js';
import { createBrowserClient as createBrowserClientSSR } from '@supabase/ssr';

// Environment variables with fallbacks
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';

// Singleton instance for server-side usage
let serverClientInstance: SupabaseClient | null = null;

/**
 * Validate environment variables
 */
function validateEnv(): void {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing Supabase environment variables. ' +
      'Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY'
    );
  }
}

/**
 * Create a standard Supabase client (server-side only)
 * Use this only in API routes, RSC without cookies access
 */
export function createClient(): SupabaseClient {
  validateEnv();
  return createSupabaseClient(supabaseUrl, supabaseAnonKey);
}

/**
 * Create a browser client using @supabase/ssr (for client components)
 * Handles cookie management automatically
 */
export function createBrowserClient(): SupabaseClient {
  validateEnv();
  return createBrowserClientSSR(supabaseUrl, supabaseAnonKey);
}

/**
 * Create a server client for Server Components and Route Handlers
 * Uses cookies for session management via @supabase/ssr
 */
export function createServerClient(
  cookies: Record<string, string | undefined>
): SupabaseClient {
  validateEnv();
  return createBrowserClientSSR(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return Object.entries(cookies).map(([name, value]) => ({
          name,
          value: value ?? '',
        }));
      },
      setAll(cookiesToSet: { name: string; value: string; options?: object }[]) {
        cookiesToSet.forEach(({ name, value }) => {
          cookies[name] = value;
        });
      },
    },
  });
}

/**
 * Create a server client with middleware cookie access
 * Preferred for Route Handlers that need to read/write cookies
 */
export function createServerClientFromMiddleware(
  cookies: {
    get: (name: string) => string | undefined;
    set: (name: string, value: string, options: object) => void;
  }
): SupabaseClient {
  validateEnv();
  return createBrowserClientSSR(supabaseUrl, supabaseAnonKey, {
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
        ].filter(c => c.value);
      },
      setAll(cookiesToSet: { name: string; value: string; options?: object }[]) {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookies.set(name, value, options as Parameters<typeof cookies.set>[2]);
        });
      },
    },
  });
}

/**
 * Get singleton server client instance
 * WARNING: Reuses the same instance across requests. Not suitable for multi-tenant apps.
 * Use only in contexts where session doesn't change per request.
 */
export function getServerClient(): SupabaseClient {
  if (!serverClientInstance) {
    serverClientInstance = createClient();
  }
  return serverClientInstance;
}

/**
 * Create admin client with service role key (bypasses RLS)
 * Use only in secure server contexts - never expose to client
 */
export function createAdminClient(): SupabaseClient {
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error(
      'Missing Supabase service role key. ' +
      'Please set SUPABASE_SERVICE_ROLE_KEY'
    );
  }

  return createSupabaseClient(supabaseUrl, supabaseServiceKey);
}
