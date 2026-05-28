import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createBrowserClient } from '@supabase/ssr';

// ============================================================================
// Supabase Configuration
// ============================================================================

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

// ============================================================================
// Role-Based Access Configuration
// ============================================================================

interface RouteConfig {
  allowedRoles: string[];
  requireAuth: boolean;
}

// Define protected routes and their access requirements
const protectedRoutes: Record<string, RouteConfig> = {
  '/admin': { allowedRoles: ['admin', 'editor', 'user'], requireAuth: true },
  '/admin/settings': { allowedRoles: ['admin'], requireAuth: true },
  '/admin/users': { allowedRoles: ['admin'], requireAuth: true },
  '/admin/analytics': { allowedRoles: ['admin', 'editor'], requireAuth: true },
};

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
// Helper Functions
// ============================================================================

/**
 * Check if user has required role for the route
 */
function hasRequiredRole(userRole: string | undefined, allowedRoles: string[]): boolean {
  if (!userRole) return false;
  return allowedRoles.includes(userRole);
}

/**
 * Get route config for a given pathname
 */
function getRouteConfig(pathname: string): RouteConfig | null {
  // Exact match
  if (protectedRoutes[pathname]) {
    return protectedRoutes[pathname];
  }

  // Prefix match for nested routes
  for (const route of Object.keys(protectedRoutes)) {
    if (pathname.startsWith(route + '/')) {
      return protectedRoutes[route];
    }
  }

  // Default: require auth for /admin/*
  if (pathname.startsWith('/admin')) {
    return { allowedRoles: ['admin', 'editor', 'user'], requireAuth: true };
  }

  return null;
}

// ============================================================================
// Middleware Handler
// ============================================================================

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for login and auth callback pages
  const publicPaths = [
    '/admin/login',
    '/admin/auth/callback',
    '/api/auth',
  ];

  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Protect all /admin/* routes
  if (pathname.startsWith('/admin')) {
    // Check if Supabase is configured
    if (!supabaseUrl || !supabaseAnonKey) {
      // Supabase not configured - redirect to login
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('error', 'supabase_not_configured');
      return NextResponse.redirect(loginUrl);
    }

    const supabase = createSupabaseMiddlewareClient(request);

    if (!supabase) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('error', 'client_init_failed');
      return NextResponse.redirect(loginUrl);
    }

    // Get current user from session
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData?.user) {
      // No valid session - redirect to login
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    const user = userData.user;

    // Check role-based access
    const routeConfig = getRouteConfig(pathname);

    if (routeConfig?.requireAuth) {
      const userRole = user.user_metadata?.role as string | undefined;

      if (!hasRequiredRole(userRole, routeConfig.allowedRoles)) {
        // User doesn't have required role
        // Redirect to admin home or show access denied
        const redirectUrl = new URL('/admin', request.url);
        redirectUrl.searchParams.set('error', 'access_denied');
        return NextResponse.redirect(redirectUrl);
      }
    }

    // Add user info to headers for downstream use
    const response = NextResponse.next();
    response.headers.set('x-user-id', user.id);
    response.headers.set('x-user-email', user.email ?? '');
    response.headers.set('x-user-role', user.user_metadata?.role as string ?? 'user');

    return response;
  }

  return NextResponse.next();
}

// ============================================================================
// Middleware Configuration
// ============================================================================

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/auth/:path*',
  ],
};

// ============================================================================
// Optional: Create authenticated response helper
// ============================================================================

export async function createAuthenticatedResponse(
  request: NextRequest,
  destination: string = '/admin'
): Promise<NextResponse> {
  const url = new URL(destination, request.url);
  url.searchParams.set('verified', 'true');
  return NextResponse.redirect(url);
}

export async function createErrorResponse(
  request: NextRequest,
  error: string,
  destination: string = '/admin/login'
): Promise<NextResponse> {
  const url = new URL(destination, request.url);
  url.searchParams.set('error', error);
  return NextResponse.redirect(url);
}