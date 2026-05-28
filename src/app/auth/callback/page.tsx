'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

function AuthCallbackContent() {
  const router = useRouter();
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const errorParam = params.get('error');

    if (errorParam) {
      setError(errorParam);
      return;
    }

    const timer = setTimeout(() => {
      router.push('/dashboard');
    }, 1500);

    return () => clearTimeout(timer);
  }, [router]);

  if (error) {
    return (
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
          <span className="text-3xl">⚠️</span>
        </div>
        <h1 className="text-2xl font-bold">حدث خطأ</h1>
        <p className="text-muted-foreground">{error}</p>
        <button onClick={() => router.push('/auth/login')} className="btn btn-primary">
          العودة لتسجيل الدخول
        </button>
      </div>
    );
  }

  return (
    <div className="text-center space-y-4">
      <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
      <h1 className="text-2xl font-bold">جاري تسجيل الدخول...</h1>
      <p className="text-muted-foreground">سيتم توجيهك قريباً</p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return <AuthCallbackContent />;
}
