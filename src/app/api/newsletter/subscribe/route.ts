// =============================================
// API Routes - Newsletter Subscribe
// POST: Subscribe to newsletter
// =============================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { successResponse, errorResponse } from '@/lib/api/response';
import { z } from 'zod';

const subscribeSchema = z.object({
  email: z.string().email('يرجى إدخال بريد إلكتروني صحيح'),
  name: z.string().max(100).optional(),
  source: z.enum(['website', 'tool_page', 'blog', 'footer']).default('website'),
});

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    const body = await request.json();
    const validated = subscribeSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        errorResponse(validated.error.issues[0].message),
        { status: 400 }
      );
    }

    const { email, name, source } = validated.data;

    // Check if already subscribed
    const { data: existing } = await supabase
      .from('newsletter_subscribers')
      .select('id, status')
      .eq('email', email.toLowerCase())
      .single();

    if (existing) {
      if (existing.status === 'unsubscribed') {
        // Re-subscribe
        const { error: updateError } = await supabase
          .from('newsletter_subscribers')
          .update({ 
            status: 'active', 
            source,
            name: name ?? null 
          })
          .eq('id', existing.id);

        if (updateError) {
          return NextResponse.json(errorResponse(updateError.message), { status: 500 });
        }

        return NextResponse.json(
          successResponse({ message: 'تم إعادة اشتراكك بنجاح' }),
          { status: 200 }
        );
      }

      return NextResponse.json(
        errorResponse('هذا البريد مشترك بالفعل في النشرة البريدية'),
        { status: 409 }
      );
    }

    // Create new subscription
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .insert({
        email: email.toLowerCase(),
        name: name ?? null,
        source,
        status: 'active',
      })
      .select()
      .single();

    if (error) {
      console.error('Newsletter subscription error:', error);
      return NextResponse.json(errorResponse('حدث خطأ أثناء الاشتراك'), { status: 500 });
    }

    return NextResponse.json(
      successResponse({ 
        message: 'تم الاشتراك بنجاح! سنرسل لك أحدث الأخبار والأدوات.',
        subscriber: { id: data.id, email: data.email }
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error('Newsletter POST error:', error);
    return NextResponse.json(errorResponse('خطأ داخلي في الخادم'), { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(errorResponse('البريد الإلكتروني مطلوب'), { status: 400 });
    }

    const { error } = await supabase
      .from('newsletter_subscribers')
      .update({ status: 'unsubscribed' })
      .eq('email', email.toLowerCase());

    if (error) {
      return NextResponse.json(errorResponse(error.message), { status: 500 });
    }

    return NextResponse.json(
      successResponse({ message: 'تم إلغاء الاشتراك بنجاح' })
    );
  } catch (error) {
    console.error('Newsletter DELETE error:', error);
    return NextResponse.json(errorResponse('خطأ داخلي في الخادم'), { status: 500 });
  }
}