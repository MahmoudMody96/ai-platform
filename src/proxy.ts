// =============================================
// Proxy - Auth Protection & Rate Limiting
// AI Platform - Next.js 16 Pattern
// =============================================

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createBrowserClient } from '@supabase/ssr';

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
// ============================================================================

function createSupabaseMiddlewareClient(request: NextRequest) {
  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set(name, value);
        });
      },
    },
  });
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

  // Admin routes protection
  if (pathname.startsWith('/admin')) {
    // Skip main admin page and login page - they handle their own auth
    if (pathname === '/admin' || pathname === '/admin/login') {
      return NextResponse.next();
    }

    // Check if Supabase is configured
    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn('Supabase not configured, skipping admin auth check');
      return NextResponse.next();
    }

    const supabase = createSupabaseMiddlewareClient(request);
    if (!supabase) {
      console.error('Failed to create Supabase client in middleware');
      return NextResponse.next();
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
    const userRole = user.user_metadata?.role as string | undefined;

    // Check admin role
    if (userRole !== 'admin' && userRole !== 'editor') {
      // User doesn't have admin/editor role
      const adminUrl = new URL('/admin', request.url);
      adminUrl.searchParams.set('error', 'access_denied');
      return NextResponse.redirect(adminUrl);
    }

    // Add user info to headers for downstream use
    const response = NextResponse.next();
    response.headers.set('x-user-id', user.id);
    response.headers.set('x-user-email', user.email ?? '');
    response.headers.set('x-user-role', userRole ?? 'user');

    return response;
  }

  // Dashboard routes protection
  if (pathname.startsWith('/dashboard')) {
    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.next();
    }

    const supabase = createSupabaseMiddlewareClient(request);
    if (!supabase) {
      return NextResponse.next();
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
    const response = NextResponse.next();
    
    // Add security headers
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'SAMEORIGIN');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    return response;
  }

  return NextResponse.next();
}

// ============================================================================
// Matcher Configuration
// ============================================================================

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
