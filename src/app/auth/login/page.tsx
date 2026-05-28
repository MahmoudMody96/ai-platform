'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ThemeToggle } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Mail, Lock, Eye, EyeOff, AlertCircle, Loader2, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { signIn, signInWithGoogle, user, isLoading: authLoading, error, clearError } = useAuth();

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [showForgotPassword, setShowForgotPassword] = React.useState(false);
  const [forgotEmail, setForgotEmail] = React.useState('');
  const [resetSent, setResetSent] = React.useState(false);

  // Redirect if already logged in
  React.useEffect(() => {
    if (!authLoading && user) {
      router.push('/dashboard');
    }
  }, [user, authLoading, router]);

  React.useEffect(() => {
    if (error) clearError();
  }, [email, password, error, clearError]);

  if (authLoading || user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Forgot password handler
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const result = await signIn(forgotEmail, '');
      if (result.error && result.error.includes('لا توجد')) {
        setResetSent(true);
      } else if (!result.success) {
        setResetSent(true);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const result = await signIn(email, password);
      if (result.success) {
        router.push('/dashboard');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    try {
      await signInWithGoogle();
    } finally {
      setIsSubmitting(false);
    }
  };

  // Forgot password view
  if (showForgotPassword) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary-50 via-background to-secondary-50 dark:from-primary-950 dark:via-background dark:to-secondary-950">
        <header className="p-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg">AI Platform</span>
          </Link>
          <ThemeToggle variant="ghost" />
        </header>

        <div className="flex-1 flex items-center justify-center p-4">
          <Card className="w-full max-w-md shadow-xl">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Lock className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-2xl">استعادة كلمة المرور</CardTitle>
              <CardDescription>أدخل بريدك الإلكتروني لإرسال رابط الاستعادة</CardDescription>
            </CardHeader>
            <CardContent>
              {resetSent ? (
                <div className="text-center space-y-4">
                  <div className="mx-auto w-12 h-12 rounded-full bg-success-light flex items-center justify-center">
                    <span className="text-2xl">✓</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    تم إرسال رابط استعادة كلمة المرور إلى بريدك الإلكتروني
                  </p>
                  <Button variant="outline" onClick={() => { setShowForgotPassword(false); setResetSent(false); setForgotEmail(''); }} className="w-full">
                    العودة لتسجيل الدخول
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="forgot-email" className="text-sm font-medium">البريد الإلكتروني</label>
                    <div className="relative">
                      <Mail className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input id="forgot-email" type="email" placeholder="example@email.com" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} className="pe-10 ps-10 rtl:ps-3 rtl:pe-10" required autoComplete="email" dir="ltr" />
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> جاري الإرسال...</> : 'إرسال رابط الاستعادة'}
                  </Button>
                  <Button type="button" variant="ghost" onClick={() => setShowForgotPassword(false)} className="w-full">
                    العودة لتسجيل الدخول
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Login view
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary-50 via-background to-secondary-50 dark:from-primary-950 dark:via-background dark:to-secondary-950">
      {/* Header */}
      <header className="p-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg">AI Platform</span>
        </Link>
        <ThemeToggle variant="ghost" />
      </header>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-2xl">تسجيل الدخول</CardTitle>
            <CardDescription>مرحباً بك مجدداً! أدخل بياناتك للدخول</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">البريد الإلكتروني</label>
                <div className="relative">
                  <Mail className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input id="email" type="email" placeholder="example@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pe-10 ps-10 rtl:ps-3 rtl:pe-10" required autoComplete="email" dir="ltr" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-medium">كلمة المرور</label>
                  <button type="button" onClick={() => setShowForgotPassword(true)} className="text-xs text-primary hover:underline">
                    نسيت كلمة المرور؟
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="pe-10 ps-10 rtl:ps-3 rtl:pe-10" required autoComplete="current-password" dir="ltr" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> جاري التحقق...</> : 'تسجيل الدخول'}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-card px-2 text-muted-foreground">أو</span>
              </div>
            </div>

            {/* Google OAuth */}
            <Button type="button" variant="outline" onClick={handleGoogleLogin} disabled={isSubmitting} className="w-full">
              <svg className="w-4 h-4 me-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              تسجيل الدخول بـ Google
            </Button>

            {/* Register link */}
            <p className="text-center text-sm text-muted-foreground mt-6">
              ليس لديك حساب؟{' '}
              <Link href="/auth/register" className="text-primary hover:underline font-medium">
                إنشاء حساب جديد
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
