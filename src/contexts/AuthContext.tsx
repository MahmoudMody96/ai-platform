'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';

// ============================================================================
// Types
// ============================================================================

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  username?: string;
  avatar_url?: string;
  bio?: string;
  plan: 'free' | 'pro' | 'team';
  role: 'admin' | 'editor' | 'user';
}

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (data: Partial<UserProfile>) => Promise<{ success: boolean; error?: string }>;
  clearError: () => void;
}

// ============================================================================
// Supabase Client
// ============================================================================

function createSupabaseBrowserClient() {
  // Defensive: the underlying @supabase/ssr will throw on empty/malformed URLs
  // during build/prerender. We guard here so the render path doesn't crash.
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }
  if (!supabaseUrl.startsWith('https://') && !supabaseUrl.startsWith('http://')) {
    return null;
  }

  try {
    return createBrowserClient(supabaseUrl, supabaseAnonKey);
  } catch {
    return null;
  }
}

// ============================================================================
// Context
// ============================================================================

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<UserProfile | null>(null);
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

  // Build user profile from session
  const buildUser = React.useCallback((sessionUser: { id: string; email?: string; user_metadata?: Record<string, unknown> }): UserProfile => {
    return {
      id: sessionUser.id,
      email: sessionUser.email ?? '',
      name: (sessionUser.user_metadata?.full_name as string) ?? sessionUser.email?.split('@')[0] ?? 'User',
      username: sessionUser.user_metadata?.username as string | undefined,
      avatar_url: sessionUser.user_metadata?.avatar_url as string | undefined,
      bio: sessionUser.user_metadata?.bio as string | undefined,
      plan: (sessionUser.user_metadata?.plan as 'free' | 'pro' | 'team') ?? 'free',
      role: (sessionUser.user_metadata?.role as 'admin' | 'editor' | 'user') ?? 'user',
    };
  }, []);

  // Check for existing session on mount
  React.useEffect(() => {
    if (!supabaseRef.current) {
      setIsLoading(false);
      return;
    }

    const supabase = supabaseRef.current;

    const initSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(buildUser(session.user));
        }
      } catch {
        // Session check failed
      } finally {
        setIsLoading(false);
      }
    };

    initSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(buildUser(session.user));
        } else {
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [buildUser]);

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
        setUser(buildUser(data.user));
        return { success: true };
      }

      return { success: false, error: 'Login failed' };
    } catch {
      const errorMessage = 'حدث خطأ غير متوقع أثناء تسجيل الدخول';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [buildUser]);

  // Sign up (user registration)
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
            role: 'user',
            plan: 'free',
          },
        },
      });

      if (signUpError) {
        const errorMessage = getAuthErrorMessage(signUpError.message);
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }

      if (data.user) {
        setUser(buildUser(data.user));
        return { success: true };
      }

      return { success: true }; // Email confirmation required
    } catch {
      const errorMessage = 'حدث خطأ غير متوقع أثناء إنشاء الحساب';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [buildUser]);

  // Sign in with Google OAuth
  const signInWithGoogle = React.useCallback(async () => {
    if (!supabaseRef.current) {
      return { success: false, error: 'Supabase not configured' };
    }

    setIsLoading(true);
    setError(null);

    try {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin;
      const { error: googleError } = await supabaseRef.current.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${siteUrl}/auth/callback`,
        },
      });

      if (googleError) {
        const errorMessage = getAuthErrorMessage(googleError.message);
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }

      return { success: true };
    } catch {
      const errorMessage = 'حدث خطأ غير متوقع أثناء تسجيل الدخول بـ Google';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Sign out
  const signOut = React.useCallback(async () => {
    if (!supabaseRef.current) {
      setUser(null);
      router.push('/');
      return;
    }

    setIsLoading(true);

    try {
      await supabaseRef.current.auth.signOut();
      setUser(null);
      router.push('/');
    } catch {
      setUser(null);
      router.push('/');
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  // Reset password
  const resetPassword = React.useCallback(async (email: string) => {
    if (!supabaseRef.current) {
      return { success: false, error: 'Supabase not configured' };
    }

    setIsLoading(true);
    setError(null);

    try {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin;
      const { error: resetError } = await supabaseRef.current.auth.resetPasswordForEmail(email, {
        redirectTo: `${siteUrl}/auth/callback`,
      });

      if (resetError) {
        const errorMessage = getAuthErrorMessage(resetError.message);
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }

      return { success: true };
    } catch {
      const errorMessage = 'حدث خطأ غير متوقع أثناء إرسال رابط استعادة كلمة المرور';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update user profile
  const updateProfile = React.useCallback(async (data: Partial<UserProfile>) => {
    if (!supabaseRef.current || !user) {
      return { success: false, error: 'Not authenticated' };
    }

    setIsLoading(true);
    setError(null);

    try {
      const { error: updateError } = await supabaseRef.current.auth.updateUser({
        data: {
          full_name: data.name,
          username: data.username,
          avatar_url: data.avatar_url,
          bio: data.bio,
        },
      });

      if (updateError) {
        const errorMessage = getAuthErrorMessage(updateError.message);
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }

      setUser(prev => prev ? { ...prev, ...data } : null);
      return { success: true };
    } catch {
      const errorMessage = 'حدث خطأ غير متوقع أثناء تحديث الملف الشخصي';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        signIn,
        signUp,
        signInWithGoogle,
        signOut,
        resetPassword,
        updateProfile,
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

  return 'حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى';
}
