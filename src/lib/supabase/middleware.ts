// =============================================
// AI Platform - Supabase Middleware Helpers
// For Next.js middleware integration
// =============================================

import { NextResponse } from 'next/server';
import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

// Cookie names used by Supabase
export const SUPABASE_AUTH_COOKIE_NAMES = {
  ACCESS_TOKEN: 'sb-access-token',
  REFRESH_TOKEN: 'sb-refresh-token',
} as const;

// Cookie configuration for middleware
export const COOKIE_OPTIONS = {
  accessToken: {
    name: SUPABASE_AUTH_COOKIE_NAMES.ACCESS_TOKEN,
    options: {
      name: SUPABASE_AUTH_COOKIE_NAMES.ACCESS_TOKEN,
      lifetime: 60 * 60 * 4, // 4 hours
      domain: undefined,
      path: '/',
      sameSite: 'lax' as const,
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
    },
  },
  refreshToken: {
    name: SUPABASE_AUTH_COOKIE_NAMES.REFRESH_TOKEN,
    options: {
      name: SUPABASE_AUTH_COOKIE_NAMES.REFRESH_TOKEN,
      lifetime: 60 * 60 * 24 * 7, // 7 days
      domain: undefined,
      path: '/',
      sameSite: 'lax' as const,
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
    },
  },
} as const;

export interface AuthenticatedUser {
  id: string;
  email: string;
  role?: string;
}

// Client type alias
type ClientType = SupabaseClient;

// ============================================================================
// SECURITY: Role must come from the database (profiles.role),
// NOT from user.user_metadata which is client-editable.
// ============================================================================

/**
 * Fetch the user's role from the profiles table.
 * RLS ensures a user can only read their own row (and admins can read all).
 * Returns null if no row or not configured.
 */
export async function getRoleFromProfiles(
  supabase: ClientType,
  userId: string
): Promise<string | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (error || !data) return null;
    return (data.role as string | null) ?? null;
  } catch {
    return null;
  }
}

/**
 * Create Supabase client for middleware context
 * Uses cookies directly without Next.js response helpers
 */
export function createMiddlewareClient(
  cookies: Record<string, string | undefined>
): ClientType {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
  return createBrowserClient(supabaseUrl, supabaseAnonKey, {
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

/**
 * Get the current user from the request cookies.
 * NOTE: `role` is intentionally NOT populated here. Use `getRoleFromProfiles`
 * if you need a server-trusted role.
 */
export async function getUserFromRequest(supabase: ClientType): Promise<AuthenticatedUser | null> {
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return {
    id: user.id,
    email: user.email ?? '',
    // role is intentionally omitted — see getRoleFromProfiles
  };
}

/**
 * Get access token from cookies
 */
export function getAccessToken(cookies: Record<string, string | undefined>): string | undefined {
  return cookies[SUPABASE_AUTH_COOKIE_NAMES.ACCESS_TOKEN];
}

/**
 * Get refresh token from cookies
 */
export function getRefreshToken(cookies: Record<string, string | undefined>): string | undefined {
  return cookies[SUPABASE_AUTH_COOKIE_NAMES.REFRESH_TOKEN];
}

/**
 * Check if the request is authenticated
 */
export function isAuthenticated(cookies: Record<string, string | undefined>): boolean {
  return !!getAccessToken(cookies);
}

/**
 * Create a response with Supabase auth cookies
 * Use this when setting cookies after login
 */
export async function createAuthResponse(
  _request: Request,
  _supabase: ClientType
): Promise<NextResponse> {
  return NextResponse.next();
}

/**
 * Create a sign-out response (clears auth cookies)
 */
export function createSignOutResponse(): NextResponse {
  const response = NextResponse.next();

  response.cookies.delete(SUPABASE_AUTH_COOKIE_NAMES.ACCESS_TOKEN);
  response.cookies.delete(SUPABASE_AUTH_COOKIE_NAMES.REFRESH_TOKEN);

  return response;
}

/**
 * Refresh the session using refresh token
 * Returns updated user if successful, null if failed
 */
export async function refreshSession(
  supabase: ClientType,
  cookies: Record<string, string | undefined>
): Promise<AuthenticatedUser | null> {
  const refreshToken = getRefreshToken(cookies);

  if (!refreshToken) {
    return null;
  }

  const { data: { user }, error } = await supabase.auth.refreshSession();

  if (error || !user) {
    return null;
  }

  return {
    id: user.id,
    email: user.email ?? '',
  };
}

/**
 * Required auth middleware wrapper
 * Redirects to login page if not authenticated
 */
export async function requireAuth(
  supabase: ClientType,
  loginUrl: string = '/admin/login'
): Promise<{ user: AuthenticatedUser; response: NextResponse } | { user: null; response: NextResponse }> {
  const user = await getUserFromRequest(supabase);

  if (!user) {
    return {
      user: null,
      response: NextResponse.redirect(new URL(loginUrl, process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000')),
    };
  }

  return {
    user,
    response: NextResponse.next(),
  };
}

/**
 * Optional auth middleware wrapper
 * Continues regardless of auth state but provides user info if available
 */
export async function optionalAuth(
  supabase: ClientType
): Promise<{ user: AuthenticatedUser | null; response: NextResponse }> {
  const user = await getUserFromRequest(supabase);

  return {
    user,
    response: NextResponse.next(),
  };
}

/**
 * Admin role check middleware wrapper
 * Checks if the authenticated user has admin role via the profiles table
 * (NOT user_metadata — that's client-editable!)
 */
export async function requireAdmin(
  supabase: ClientType,
  loginUrl: string = '/admin/login'
): Promise<{ user: AuthenticatedUser; response: NextResponse } | { user: null; response: NextResponse }> {
  const { user, response } = await requireAuth(supabase, loginUrl);

  if (!user) {
    return { user: null, response };
  }

  // Look up role from DB
  const dbRole = await getRoleFromProfiles(supabase, user.id);

  if (dbRole !== 'admin' && dbRole !== 'super_admin') {
    return {
      user: null,
      response: NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000')),
    };
  }

  return { user: { ...user, role: dbRole }, response };
}
