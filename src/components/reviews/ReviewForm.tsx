'use client';

import * as React from 'react';
import { InteractiveStarRating } from './StarRating';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, Send, CheckCircle } from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';

interface ReviewFormProps {
  toolId?: string;
  articleId?: string;
  onSuccess?: () => void;
}

export function ReviewForm({ toolId, articleId, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = React.useState(0);
  const [title, setTitle] = React.useState('');
  const [content, setContent] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState('');

  const supabaseRef = React.useRef<ReturnType<typeof createBrowserClient> | null>(null);
  if (supabaseRef.current == null) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
    if (supabaseUrl && supabaseAnonKey) {
      supabaseRef.current = createBrowserClient(supabaseUrl, supabaseAnonKey);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!rating) {
      setError('يرجى اختيار تقييم');
      return;
    }

    if (!content.trim()) {
      setError('يرجى كتابة مراجعة');
      return;
    }

    if (!supabaseRef.current) {
      setError('يرجى تسجيل الدخول لإضافة مراجعة');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const { data: { session } } = await supabaseRef.current.auth.getSession();
      if (!session?.user) {
        setError('يرجى تسجيل الدخول لإضافة مراجعة');
        setIsSubmitting(false);
        return;
      }

      const { error: insertError } = await supabaseRef.current.from('comments').insert({
        author_id: session.user.id,
        tool_id: toolId ?? null,
        article_id: articleId ?? null,
        content: JSON.stringify({ rating, title, body: content }),
        is_approved: true,
      } as never);

      if (insertError) {
        setError(insertError.message.includes('duplicate') ? 'لقد كتبت مراجعة سابقاً لهذا العنصر' : 'حدث خطأ. حاول لاحقاً');
        return;
      }

      setSuccess(true);
      setRating(0);
      setTitle('');
      setContent('');
      setTimeout(() => setSuccess(false), 4000);
      onSuccess?.();
    } catch {
      setError('حدث خطأ غير متوقع');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">اكتب مراجعة</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {success && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-success-light text-success text-sm">
              <CheckCircle className="w-4 h-4" />
              <span>تم إرسال مراجعتك بنجاح!</span>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">تقييمك</label>
            <InteractiveStarRating value={rating} onChange={setRating} size="lg" />
          </div>

          <div className="space-y-2">
            <label htmlFor="review-title" className="text-sm font-medium">عنوان المراجعة (اختياري)</label>
            <Input
              id="review-title"
              placeholder="عنوان مختصر لمراجعتك..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="review-content" className="text-sm font-medium">مراجعتك</label>
            <textarea
              id="review-content"
              placeholder="شاركنا تجربتك مع هذه الأداة..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              className="textarea"
              maxLength={1000}
              required
            />
            <p className="text-xs text-muted-foreground text-left">{content.length}/1000</p>
          </div>

          <Button type="submit" disabled={isSubmitting || !rating}>
            {isSubmitting ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> جاري الإرسال...</>
            ) : (
              <><Send className="w-4 h-4" /> إرسال المراجعة</>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
