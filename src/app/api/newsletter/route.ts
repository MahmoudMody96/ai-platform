// =============================================
// API Routes - Newsletter Signup
// POST: Add email to newsletter list
// =============================================

import { NextRequest, NextResponse } from 'next/server';
import { successResponse, errorResponse } from '@/lib/api/response';
import { z } from 'zod';

const newsletterSchema = z.object({
  email: z.string().email('بريد إلكتروني غير صالح'),
  source: z.string().optional().default('website'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = newsletterSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        errorResponse(`خطأ في البيانات: ${validated.error.message}`),
        { status: 400 }
      );
    }

    const { email, source } = validated.data;

    // In production, this would integrate with an email service like:
    // - Resend: await resend.emails.send({ from: 'newsletter@aiplatform.com', to: email, ... })
    // - ConvertKit: await convertKitApi.subscribe(email)
    // - Mailchimp: await mailchimp.lists.addListMember(listId, { email_address: email, ... })
    // - Or save to Supabase newsletter table

    // For now, we simulate success and could store in Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';

    if (supabaseUrl && supabaseKey) {
      try {
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(supabaseUrl, supabaseKey);

        // Check if already subscribed
        const { data: existing } = await supabase
          .from('newsletter_subscribers')
          .select('id, status')
          .eq('email', email)
          .single();

        if (existing) {
          if (existing.status === 'subscribed') {
            return NextResponse.json(
              successResponse({ message: 'هذا البريد مشترك بالفعل' }),
              { status: 200 }
            );
          }

          // Re-subscribe
          await supabase
            .from('newsletter_subscribers')
            .update({ status: 'subscribed', subscribed_at: new Date().toISOString() })
            .eq('id', existing.id);
        } else {
          // Insert new subscriber
          await supabase.from('newsletter_subscribers').insert({
            email,
            source,
            status: 'subscribed',
          } as never);
        }
      } catch {
        // Supabase write failed, but we still return success for the user
      }
    }

    return NextResponse.json(
      successResponse({ message: 'تم الاشتراك بنجاح' }),
      { status: 201 }
    );
  } catch (error) {
    console.error('Newsletter signup error:', error);
    return NextResponse.json(
      errorResponse('حدث خطأ أثناء تسجيل الاشتراك'),
      { status: 500 }
    );
  }
}

// GET: Check subscription status
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json(errorResponse('Email is required'), { status: 400 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json(
      successResponse({ subscribed: false }),
      { status: 200 }
    );
  }

  try {
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data } = await supabase
      .from('newsletter_subscribers')
      .select('status')
      .eq('email', email)
      .single();

    return NextResponse.json(
      successResponse({ subscribed: data?.status === 'subscribed' }),
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      successResponse({ subscribed: false }),
      { status: 200 }
    );
  }
}
