'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ThemeToggle } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Mail, Lock, User, Eye, EyeOff, AlertCircle, Loader2, Sparkles, CheckCircle } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { signUp, signInWithGoogle, user, isLoading: authLoading, error, clearError } = useAuth();

  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [localError, setLocalError] = React.useState('');
  const [success, setSuccess] = React.useState(false);

  React.useEffect(() => {
    if (!authLoading && user) {
      router.push('/dashboard');
    }
  }, [user, authLoading, router]);

  React.useEffect(() => {
    if (error) clearError();
    if (localError) setLocalError('');
  }, [name, email, password, confirmPassword, error, clearError, localError]);

  if (authLoading || user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    if (password !== confirmPassword) {
      setLocalError('كلمتا المرور غير متطابقتين');
      return;
    }

    if (password.length < 6) {
      setLocalError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await signUp(email, password, name);
      if (result.success) {
        setSuccess(true);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleRegister = async () => {
    setIsSubmitting(true);
    try {
      await signInWithGoogle();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
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
          <Card className="w-full max-w-md shadow-xl text-center">
            <CardContent className="pt-8 pb-8 space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-success-light flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-success" />
              </div>
              <h2 className="text-2xl font-bold">تم إنشاء الحساب!</h2>
              <p className="text-muted-foreground">
                تم إرسال رابط تفعيل إلى بريدك الإلكتروني. يرجى تفعيل حسابك قبل تسجيل الدخول.
              </p>
              <Button onClick={() => router.push('/auth/login')} className="w-full">
                الذهاب لتسجيل الدخول
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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
              <User className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-2xl">إنشاء حساب جديد</CardTitle>
            <CardDescription>انضم إلينا واكتشف أفضل أدوات الذكاء الاصطناعي</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {(error || localError) && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error || localError}</span>
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">الاسم</label>
                <div className="relative">
                  <User className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input id="name" type="text" placeholder="اسمك الكامل" value={name} onChange={(e) => setName(e.target.value)} className="pe-3 ps-10 rtl:ps-3" required autoComplete="name" />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">البريد الإلكتروني</label>
                <div className="relative">
                  <Mail className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input id="email" type="email" placeholder="example@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pe-3 ps-10 rtl:ps-3" required autoComplete="email" dir="ltr" />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">كلمة المرور</label>
                <div className="relative">
                  <Lock className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="6 أحرف على الأقل" value={password} onChange={(e) => setPassword(e.target.value)} className="pe-10 ps-10 rtl:ps-3 rtl:pe-10" required autoComplete="new-password" dir="ltr" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="confirm-password" className="text-sm font-medium">تأكيد كلمة المرور</label>
                <div className="relative">
                  <Lock className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input id="confirm-password" type={showPassword ? 'text' : 'password'} placeholder="أعد إدخال كلمة المرور" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="pe-3 ps-10 rtl:ps-3" required autoComplete="new-password" dir="ltr" />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> جاري إنشاء الحساب...</> : 'إنشاء حساب'}
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-card px-2 text-muted-foreground">أو</span>
              </div>
            </div>

            <Button type="button" variant="outline" onClick={handleGoogleRegister} disabled={isSubmitting} className="w-full">
              <svg className="w-4 h-4 me-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              التسجيل بـ Google
            </Button>

            <p className="text-center text-sm text-muted-foreground mt-6">
              لديك حساب بالفعل؟{' '}
              <Link href="/auth/login" className="text-primary hover:underline font-medium">
                تسجيل الدخول
              </Link>
            </p>

            <p className="text-center text-xs text-muted-foreground mt-4">
              بإنشاء حساب، أنت توافق على{' '}
              <Link href="/terms" className="text-primary hover:underline">شروط الاستخدام</Link>
              {' '}و{' '}
              <Link href="/privacy" className="text-primary hover:underline">سياسة الخصوصية</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
