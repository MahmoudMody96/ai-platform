'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ThemeToggle } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  User, Mail, Lock, Briefcase, Calendar, Loader2, Save, CheckCircle, AlertCircle
} from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoading: authLoading, updateProfile, signOut } = useAuth();

  const [name, setName] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [bio, setBio] = React.useState('');
  const [isSaving, setIsSaving] = React.useState(false);
  const [saveSuccess, setSaveSuccess] = React.useState(false);
  const [saveError, setSaveError] = React.useState('');

  // Initialize form with user data (only when user first loads)
  const initRef = React.useRef(false);
  React.useEffect(() => {
    if (user && !initRef.current) {
      initRef.current = true;
      setName(user.name);
      setUsername(user.username ?? '');
      setBio(user.bio ?? '');
    }
  }, [user]);

  // Redirect if not logged in
  React.useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    setSaveError('');

    try {
      const result = await updateProfile({ name, username, bio });
      if (result.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        setSaveError(result.error ?? 'حدث خطأ');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const planColors: Record<string, string> = {
    free: 'bg-muted text-muted-foreground',
    pro: 'bg-primary-100 text-primary-700',
    team: 'bg-accent-400/20 text-accent-600',
  };

  const roleLabels: Record<string, string> = {
    admin: 'مدير',
    editor: 'محرر',
    user: 'مستخدم',
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="container-custom">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <span className="text-white text-sm font-bold">AI</span>
              </div>
              <span className="font-bold text-lg">AI Platform</span>
            </Link>
            <div className="flex items-center gap-3">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">لوحة التحكم</Button>
              </Link>
              <ThemeToggle variant="ghost" />
            </div>
          </div>
        </div>
      </header>

      <main className="container-custom py-8 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">الملف الشخصي</h1>
          <p className="text-muted-foreground">إدارة بياناتك الشخصية</p>
        </div>

        {/* Profile Header Card */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Avatar className="w-20 h-20">
                <AvatarImage src={user.avatar_url ?? undefined} alt={user.name} />
                <AvatarFallback className="text-xl bg-gradient-to-br from-primary to-secondary text-white">
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-bold">{user.name}</h2>
                <p className="text-muted-foreground text-sm">{user.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className={planColors[user.plan]}>
                    {user.plan === 'free' ? 'مجاني' : user.plan === 'pro' ? 'احترافي' : 'فريق'}
                  </Badge>
                  <Badge variant="outline">{roleLabels[user.role] ?? user.role}</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              تعديل البيانات الشخصية
            </CardTitle>
            <CardDescription>قم بتحديث معلوماتك الشخصية</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Success / Error messages */}
              {saveSuccess && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-success-light text-success text-sm">
                  <CheckCircle className="w-4 h-4" />
                  <span>تم حفظ التغييرات بنجاح</span>
                </div>
              )}
              {saveError && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{saveError}</span>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium flex items-center gap-1">
                    <User className="w-4 h-4" /> الاسم
                  </label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="اسمك الكامل" required />
                </div>

                <div className="space-y-2">
                  <label htmlFor="username" className="text-sm font-medium flex items-center gap-1">
                    <Briefcase className="w-4 h-4" /> اسم المستخدم
                  </label>
                  <div className="relative">
                    <span className="absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">@</span>
                    <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="username" className="ps-7" dir="ltr" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium flex items-center gap-1">
                  <Mail className="w-4 h-4" /> البريد الإلكتروني
                </label>
                <Input id="email" value={user.email} disabled dir="ltr" className="opacity-60" />
                <p className="text-xs text-muted-foreground">لا يمكن تغيير البريد الإلكتروني</p>
              </div>

              <div className="space-y-2">
                <label htmlFor="bio" className="text-sm font-medium flex items-center gap-1">
                  <Briefcase className="w-4 h-4" /> نبذة شخصية
                </label>
                <textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="اكتب نبذة عن نفسك..."
                  rows={3}
                  className="textarea"
                />
              </div>

              <div className="flex items-center gap-3">
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? <><Loader2 className="w-4 h-4 animate-spin" /> جاري الحفظ...</> : <><Save className="w-4 h-4" /> حفظ التغييرات</>}
                </Button>
                <Button type="button" variant="outline" onClick={signOut} className="text-destructive hover:text-destructive">
                  تسجيل الخروج
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
