'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Mail, CheckCircle, AlertCircle } from 'lucide-react';

interface NewsletterFormProps {
  variant?: 'inline' | 'card';
  placeholder?: string;
  buttonText?: string;
  successMessage?: string;
  className?: string;
}

export function NewsletterForm({
  variant = 'card',
  placeholder = 'أدخل بريدك الإلكتروني...',
  buttonText = 'اشترك الآن',
  successMessage = 'تم الاشتراك بنجاح! سنتواصل معك قريباً',
  className,
}: NewsletterFormProps) {
  const [email, setEmail] = React.useState('');
  const [status, setStatus] = React.useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = React.useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setErrorMessage('يرجى إدخال البريد الإلكتروني');
      setStatus('error');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMessage('يرجى إدخال بريد إلكتروني صحيح');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error ?? 'حدث خطأ');
      }

      setStatus('success');
      setEmail('');
    } catch (err) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'حدث خطأ غير متوقع');
    }
  };

  if (status === 'success') {
    if (variant === 'card') {
      return (
        <Card className={className}>
          <CardContent className="p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-success-light flex items-center justify-center mx-auto">
              <CheckCircle className="w-6 h-6 text-success" />
            </div>
            <h3 className="text-lg font-semibold">تم الاشتراك!</h3>
            <p className="text-muted-foreground text-sm">{successMessage}</p>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className={`flex items-center gap-2 text-success ${className ?? ''}`}>
        <CheckCircle className="w-5 h-5" />
        <span className="text-sm font-medium">تم الاشتراك بنجاح!</span>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <form onSubmit={handleSubmit} className={`flex items-center gap-2 ${className ?? ''}`}>
        <div className="relative flex-1">
          <Mail className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="email"
            placeholder={placeholder}
            value={email}
            onChange={(e) => { setEmail(e.target.value); setStatus('idle'); }}
            className="ps-10 rtl:ps-3"
            dir="ltr"
            required
          />
        </div>
        <Button type="submit" disabled={status === 'loading'}>
          {status === 'loading' ? <Loader2 className="w-4 h-4 animate-spin" /> : buttonText}
        </Button>
        {status === 'error' && (
          <span className="text-xs text-destructive">{errorMessage}</span>
        )}
      </form>
    );
  }

  return (
    <Card className={className}>
      <CardContent className="p-6 space-y-4">
        <div className="text-center space-y-2">
          <Mail className="w-8 h-8 mx-auto text-primary" />
          <h3 className="text-lg font-semibold">اشترك في النشرة البريدية</h3>
          <p className="text-sm text-muted-foreground">
            احصل على أحدث أدوات الذكاء الاصطناعي والتحديثات مباشرة في بريدك
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {status === 'error' && (
            <div className="flex items-center gap-2 p-2 rounded-lg bg-destructive/10 text-destructive text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="relative">
            <Mail className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="email"
              placeholder={placeholder}
              value={email}
              onChange={(e) => { setEmail(e.target.value); setStatus('idle'); }}
              className="ps-10 rtl:ps-3"
              dir="ltr"
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={status === 'loading'}>
            {status === 'loading' ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> جاري الاشتراك...</>
            ) : (
              <><Mail className="w-4 h-4" /> {buttonText}</>
            )}
          </Button>
        </form>

        <p className="text-xs text-muted-foreground text-center">
          لا نرسل رسائل مزعجة. يمكنك إلغاء الاشتراك في أي وقت.
        </p>
      </CardContent>
    </Card>
  );
}
