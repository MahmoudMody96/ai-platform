// =============================================
// Proxy - Auth Protection & Rate Limiting
// AI Platform - Next.js 16 Pattern
// =============================================

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { rateLimiters } from '@/lib/ratelimit';

// ============================================================================
// Supabase Configuration
// ============================================================================

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

// ============================================================================
// Public Paths (No Auth Required)
// ============================================================================

const publicPaths = [
  '/auth/login',
  '/auth/register',
  '/auth/callback',
  '/admin/login',
  '/admin/auth/callback',
  '/api/auth',
  '/api/newsletter/subscribe',
  '/api/tools',
  '/api/categories',
  '/api/articles',
  '/api/search',
  '/api/sitemap',
];

// ============================================================================
// Supabase Client Factory (Middleware)
// Uses createServerClient so we can update response cookies
// ============================================================================

function createSupabaseMiddlewareClient(request: NextRequest, response: NextResponse) {
  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          // Update request cookies (so server components see the latest)
          request.cookies.set(name, value);
          // Update response cookies (so browser persists them)
          response.cookies.set(name, value, {
            ...options,
            httpOnly: options?.httpOnly ?? true,
            sameSite: options?.sameSite ?? 'lax',
            secure: process.env.NODE_ENV === 'production',
          });
        });
      },
    },
  });
}

// ============================================================================
// Role lookup — reads from profiles table (server-trusted, RLS-protected)
// NOT from user.user_metadata (client-editable!)
// ============================================================================

async function getUserRole(
  supabase: ReturnType<typeof createSupabaseMiddlewareClient> extends infer T ? T : never,
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
    return data.role ?? null;
  } catch {
    return null;
  }
}

// ============================================================================
// Main Middleware Handler
// ============================================================================

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files and API health checks
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.') ||
    pathname === '/api/health'
  ) {
    return NextResponse.next();
  }

  // Check if path is public
  const isPublicPath = publicPaths.some(
    (path) => pathname === path || pathname.startsWith(path + '/')
  );

  if (isPublicPath) {
    return NextResponse.next();
  }

  // Lightweight rate limiting on every proxy invocation
  // (Full per-endpoint limits happen in API routes)
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || request.headers.get('x-real-ip')
      || 'anonymous';
    const { success } = await rateLimiters.proxy.limit(ip);
    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Too many requests' },
        { status: 429 }
      );
    }
  } catch {
    // If Upstash isn't configured, don't block
  }

  // Build a single response we can mutate for cookie propagation
  const response = NextResponse.next();

  // Admin routes protection
  if (pathname.startsWith('/admin')) {
    // Skip main admin page and login page - they handle their own auth
    if (pathname === '/admin' || pathname === '/admin/login') {
      return response;
    }

    // Check if Supabase is configured
    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn('Supabase not configured, skipping admin auth check');
      return response;
    }

    const supabase = createSupabaseMiddlewareClient(request, response);
    if (!supabase) {
      console.error('Failed to create Supabase client in middleware');
      return response;
    }

    // Get current user from session
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData?.user) {
      // No valid session - redirect to admin home
      const loginUrl = new URL('/admin', request.url);
      loginUrl.searchParams.set('error', 'session_expired');
      return NextResponse.redirect(loginUrl);
    }

    const user = userData.user;

    // ✅ SECURITY FIX: look up role from DB, not user_metadata
    const userRole = await getUserRole(supabase, user.id);

    // Check admin role
    if (userRole !== 'admin' && userRole !== 'super_admin' && userRole !== 'editor') {
      // User doesn't have admin/editor role
      const adminUrl = new URL('/admin', request.url);
      adminUrl.searchParams.set('error', 'access_denied');
      return NextResponse.redirect(adminUrl);
    }

    // Add user info to headers for downstream use
    response.headers.set('x-user-id', user.id);
    response.headers.set('x-user-email', user.email ?? '');
    response.headers.set('x-user-role', userRole ?? 'user');

    return response;
  }

  // Dashboard routes protection
  if (pathname.startsWith('/dashboard')) {
    if (!supabaseUrl || !supabaseAnonKey) {
      return response;
    }

    const supabase = createSupabaseMiddlewareClient(request, response);
    if (!supabase) {
      return response;
    }

    const { data: userData } = await supabase.auth.getUser();

    if (!userData?.user) {
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // API routes - add common headers
  if (pathname.startsWith('/api')) {
    // Add security headers
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'SAMEORIGIN');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

    return response;
  }

  return response;
}

// ============================================================================
// Matcher Configuration
// ============================================================================

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
