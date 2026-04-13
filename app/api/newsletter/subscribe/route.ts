import { NextResponse } from 'next/server';
import { getServiceRoleClient } from '@/lib/supabase';
import { addContact, sendTransactionalEmail } from '@/lib/brevo';
import { newsletterWelcomeEmail } from '@/lib/email-templates';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const supabase = getServiceRoleClient();

    // Check if already subscribed
    const { data: existing } = await supabase
      .from('newsletter_subscribers')
      .select('id')
      .eq('email', email)
      .single();

    if (existing) {
      // Already subscribed, just update if needed
      await supabase
        .from('newsletter_subscribers')
        .update({ active: true, unsubscribed_at: null })
        .eq('email', email);
    } else {
      // Add to Supabase first
      const { error: dbError } = await supabase
        .from('newsletter_subscribers')
        .insert({
          email,
          full_name: name || null,
          active: true,
        });

      if (dbError) {
        console.error('Database error:', dbError);
        return NextResponse.json(
          { error: 'Failed to subscribe' },
          { status: 500 }
        );
      }
    }

    // Add to Brevo
    const brevoResponse = await addContact(email, name);

    if (!brevoResponse.ok) {
      console.error('Brevo error:', await brevoResponse.text());
      // Continue anyway - user is in our system
    }

    // Send newsletter welcome email
    try {
      const { subject, html } = await newsletterWelcomeEmail(name || '');
      await sendTransactionalEmail({ email, name }, subject, html);
    } catch (emailErr) {
      console.error('Newsletter welcome email error:', emailErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to newsletter',
    });
  } catch (error) {
    console.error('POST /api/newsletter/subscribe error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
