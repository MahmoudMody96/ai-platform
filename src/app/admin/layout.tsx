'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { AdminSidebar } from '@/components/admin/Sidebar';
import { Loader2 } from 'lucide-react';

// ============================================================================
// Supabase Session Provider (wraps children with Supabase listener)
// ============================================================================

function SupabaseSessionProvider({ children }: { children: React.ReactNode }) {
  const supabaseRef = React.useRef<ReturnType<typeof createBrowserClient> | null>(null);
  const [supabaseReady, setSupabaseReady] = React.useState(false);

  React.useEffect(() => {
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

      if (!supabaseUrl || !supabaseAnonKey) {
        setSupabaseReady(true);
        return;
      }

      supabaseRef.current = createBrowserClient(supabaseUrl, supabaseAnonKey);

      // Subscribe to auth state changes to trigger AuthProvider updates
      const { data: { subscription } } = supabaseRef.current.auth.onAuthStateChange(() => {
        // AuthProvider will handle state updates via its own listener
      });

      setSupabaseReady(true);

      return () => {
        subscription.unsubscribe();
      };
    } catch {
      setSupabaseReady(true);
    }
  }, []);

  // Don't render children until Supabase client is ready
  if (!supabaseReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}

// ============================================================================
// Admin Content with Auth Check
// ============================================================================

function AdminContent({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [isClient, setIsClient] = React.useState(false);
  const [pathname, setPathname] = React.useState('');

  // Set client state on mount
  React.useEffect(() => {
    setIsClient(true);
    setPathname(window.location.pathname);
  }, []);

  // Check auth and redirect
  React.useEffect(() => {
    if (isClient && !isLoading && !user && pathname !== '/admin/login') {
      router.push('/admin/login');
    }
  }, [user, isLoading, router, isClient, pathname]);

  // Skip auth check on login page
  if (isClient && pathname === '/admin/login') {
    return <>{children}</>;
  }

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">جاري التحقق من البيانات...</p>
        </div>
      </div>
    );
  }

  // Don't render admin content if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">جاري التحويل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        <div className="container-custom py-8">
          {children}
        </div>
      </main>
    </div>
  );
}

// ============================================================================
// Layout Export
// ============================================================================

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SupabaseSessionProvider>
      <AuthProvider>
        <AdminContent>{children}</AdminContent>
      </AuthProvider>
    </SupabaseSessionProvider>
  );
}