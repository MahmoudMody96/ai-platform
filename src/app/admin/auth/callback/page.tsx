'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

// ============================================================================
// Auth Callback Page
// Handles password reset, email confirmation, and OAuth redirects
// ============================================================================

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = React.useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = React.useState('');

  // Get error from URL params
  const error = searchParams.get('error');
  const errorCode = searchParams.get('error_code');
  const type = searchParams.get('type'); // 'recovery', 'signup', 'email_change'

  // Client reference for Supabase (created lazily)
  const supabaseRef = React.useRef<ReturnType<typeof createBrowserClient> | null>(null);

  // Handle the callback
  React.useEffect(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

    if (!supabaseUrl || !supabaseAnonKey) {
      setStatus('error');
      setMessage('Supabase is not configured. Please contact the administrator.');
      return;
    }

    if (!supabaseRef.current) {
      supabaseRef.current = createBrowserClient(supabaseUrl, supabaseAnonKey);
    }

    const handleCallback = async () => {
      try {
        // Check for error in URL
        if (error) {
          setStatus('error');
          setMessage(getErrorMessage(error, errorCode));
          return;
        }

        // Handle the auth callback (this processes tokens from URL)
        const { data, authError } = await supabaseRef.current!.auth.getSession();

        if (authError) {
          setStatus('error');
          setMessage(getErrorMessage(authError.message));
          return;
        }

        // If we have a session, auth was successful
        if (data.session) {
          setStatus('success');

          // Handle different callback types
          if (type === 'recovery') {
            setMessage('تم التحقق من حسابك بنجاح! يمكنك الآن تعيين كلمة مرور جديدة.');
          } else if (type === 'email_change') {
            setMessage('تم تحديث بريدك الإلكتروني بنجاح!');
          } else {
            setMessage('تم تسجيل الدخول بنجاح!');
          }

          // Redirect to admin after 3 seconds
          setTimeout(() => {
            router.push('/admin');
          }, 3000);
        } else {
          // No session but no error - might be a pending confirmation
          setStatus('success');
          setMessage('تم إرسال رابط التحقق إلى بريدك الإلكتروني. يرجى التحقق من بريدك.');
        }
      } catch {
        setStatus('error');
        setMessage('حدث خطأ غير متوقع أثناء معالجة الطلب.');
      }
    };

    handleCallback();
  }, [error, errorCode, type, router]);

  // ============================================================================
  // Render Loading State
  // ============================================================================

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-900 via-background to-secondary-900 p-4">
        <Card className="w-full max-w-md backdrop-blur-sm bg-background/95 border-border/50 shadow-2xl">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-4 py-8">
              <Loader2 className="w-12 h-12 animate-spin text-primary" />
              <p className="text-muted-foreground">جاري التحقق من حسابك...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ============================================================================
  // Render Success State
  // ============================================================================

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-900 via-background to-secondary-900 p-4">
        <Card className="w-full max-w-md backdrop-blur-sm bg-background/95 border-border/50 shadow-2xl">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-xl">تم بنجاح</CardTitle>
            <CardDescription className="text-muted-foreground">
              {message}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center text-sm text-muted-foreground">
              سيتم توجيهك إلى لوحة التحكم خلال لحظات...
            </div>
            <div className="mt-4 flex justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ============================================================================
  // Render Error State
  // ============================================================================

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-900 via-background to-secondary-900 p-4">
      <Card className="w-full max-w-md backdrop-blur-sm bg-background/95 border-border/50 shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <XCircle className="w-8 h-8 text-destructive" />
          </div>
          <CardTitle className="text-xl text-destructive">حدث خطأ</CardTitle>
          <CardDescription className="text-muted-foreground">
            {message}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <button
            onClick={() => router.push('/admin/login')}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            العودة لتسجيل الدخول
          </button>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Convert error codes/messages to Arabic
 */
function getErrorMessage(error: string | null, errorCode?: string | null): string {
  if (errorCode) {
    switch (errorCode) {
      case 'expired_code':
        return 'انتهت صلاحية الرابط. يرجى طلب رابط جديد.';
      case 'invalid_code':
        return 'الرابط غير صالح. يرجى التحقق من الرابط المرسل.';
      case 'restoration_expired':
        return 'انتهت صلاحية رابط استعادة كلمة المرور. يرجى طلب رابط جديد.';
      default:
        break;
    }
  }

  if (error) {
    const errorLower = error.toLowerCase();

    if (errorLower.includes('invalid') || errorLower.includes('malformed')) {
      return 'الرابط غير صالح. يرجى استخدام الرابط المرسل في البريد الإلكتروني.';
    }

    if (errorLower.includes('expired')) {
      return 'انتهت صلاحية الرابط. يرجى طلب رابط جديد.';
    }

    if (errorLower.includes('already')) {
      return 'تم استخدام هذا الرابط بالفعل.';
    }
  }

  return 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.';
}