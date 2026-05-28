'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';

// ============================================================================
// Types
// ============================================================================

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'editor' | 'user';
  avatar_url?: string;
}

interface AuthContextType {
  user: AdminUser | null;
  isLoading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  clearError: () => void;
}

// ============================================================================
// Supabase Client
// ============================================================================

function createSupabaseBrowserClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

// ============================================================================
// Context
// ============================================================================

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const supabaseRef = React.useRef<ReturnType<typeof createSupabaseBrowserClient> | null>(null);
  const router = useRouter();

  // Initialize Supabase client
  if (supabaseRef.current == null) {
    try {
      supabaseRef.current = createSupabaseBrowserClient();
    } catch {
      // Supabase not configured yet
    }
  }

  // Check for existing session on mount
  React.useEffect(() => {
    if (!supabaseRef.current) {
      setIsLoading(false);
      return;
    }

    const supabase = supabaseRef.current;

    // Get initial session
    const initSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const adminUser: AdminUser = {
            id: session.user.id,
            email: session.user.email ?? '',
            name: session.user.user_metadata?.full_name ?? session.user.email?.split('@')[0] ?? 'User',
            role: (session.user.user_metadata?.role as 'admin' | 'editor' | 'user') ?? 'user',
            avatar_url: session.user.user_metadata?.avatar_url,
          };
          setUser(adminUser);
        }
      } catch {
        // Session check failed
      } finally {
        setIsLoading(false);
      }
    };

    initSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const adminUser: AdminUser = {
            id: session.user.id,
            email: session.user.email ?? '',
            name: session.user.user_metadata?.full_name ?? session.user.email?.split('@')[0] ?? 'User',
            role: (session.user.user_metadata?.role as 'admin' | 'editor' | 'user') ?? 'user',
            avatar_url: session.user.user_metadata?.avatar_url,
          };
          setUser(adminUser);
        } else {
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Clear error helper
  const clearError = React.useCallback(() => {
    setError(null);
  }, []);

  // Sign in with email/password
  const signIn = React.useCallback(async (email: string, password: string) => {
    if (!supabaseRef.current) {
      return { success: false, error: 'Supabase not configured' };
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: signInError } = await supabaseRef.current.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        const errorMessage = getAuthErrorMessage(signInError.message);
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }

      if (data.user) {
        const adminUser: AdminUser = {
          id: data.user.id,
          email: data.user.email ?? '',
          name: data.user.user_metadata?.full_name ?? data.user.email?.split('@')[0] ?? 'User',
          role: (data.user.user_metadata?.role as 'admin' | 'editor' | 'user') ?? 'user',
          avatar_url: data.user.user_metadata?.avatar_url,
        };
        setUser(adminUser);
        router.push('/admin');
        return { success: true };
      }

      return { success: false, error: 'Login failed' };
    } catch (err) {
      const errorMessage = 'حدث خطأ غير متوقع أثناء تسجيل الدخول';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  // Sign up (admin creation)
  const signUp = React.useCallback(async (email: string, password: string, name: string) => {
    if (!supabaseRef.current) {
      return { success: false, error: 'Supabase not configured' };
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: signUpError } = await supabaseRef.current.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            role: 'admin',
          },
        },
      });

      if (signUpError) {
        const errorMessage = getAuthErrorMessage(signUpError.message);
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }

      if (data.user) {
        const adminUser: AdminUser = {
          id: data.user.id,
          email: data.user.email ?? '',
          name,
          role: 'admin',
        };
        setUser(adminUser);
        router.push('/admin');
        return { success: true };
      }

      return { success: true }; // Email confirmation required
    } catch (err) {
      const errorMessage = 'حدث خطأ غير متوقع أثناء إنشاء الحساب';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  // Sign out
  const signOut = React.useCallback(async () => {
    if (!supabaseRef.current) {
      setUser(null);
      router.push('/admin/login');
      return;
    }

    setIsLoading(true);

    try {
      await supabaseRef.current.auth.signOut();
      setUser(null);
      router.push('/admin/login');
    } catch {
      // Force logout anyway
      setUser(null);
      router.push('/admin/login');
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  // Reset password (request reset email)
  const resetPassword = React.useCallback(async (email: string) => {
    if (!supabaseRef.current) {
      return { success: false, error: 'Supabase not configured' };
    }

    setIsLoading(true);
    setError(null);

    try {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin;
      const { error: resetError } = await supabaseRef.current.auth.resetPasswordForEmail(email, {
        redirectTo: `${siteUrl}/admin/auth/callback`,
      });

      if (resetError) {
        const errorMessage = getAuthErrorMessage(resetError.message);
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }

      return { success: true };
    } catch (err) {
      const errorMessage = 'حدث خطأ غير متوقع أثناء إرسال رابط استعادة كلمة المرور';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        signIn,
        signUp,
        signOut,
        resetPassword,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Convert Supabase auth error messages to Arabic
 */
function getAuthErrorMessage(error: string): string {
  const errorLower = error.toLowerCase();

  if (errorLower.includes('invalid login credentials') || errorLower.includes('invalid credentials')) {
    return 'البريد الإلكتروني أو كلمة المرور غير صحيحة';
  }

  if (errorLower.includes('email not confirmed')) {
    return 'يرجى تفعيل حسابك أولاً من خلال الرابط المرسل إلى بريدك الإلكتروني';
  }

  if (errorLower.includes('user already registered') || errorLower.includes('already registered')) {
    return 'هذا البريد الإلكتروني مسجل بالفعل';
  }

  if (errorLower.includes('invalid email')) {
    return 'البريد الإلكتروني غير صالح';
  }

  if (errorLower.includes('weak password') || errorLower.includes('password too short')) {
    return 'كلمة المرور ضعيفة. يجب أن تكون 6 أحرف على الأقل';
  }

  if (errorLower.includes('rate limit')) {
    return 'تم تجاوز الحد المسموح من المحاولات. حاول لاحقاً';
  }

  if (errorLower.includes('user not found') || errorLower.includes('invalid')) {
    return 'البريد الإلكتروني أو كلمة المرور غير صحيحة';
  }

  // Default Arabic message
  return 'حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى';
}