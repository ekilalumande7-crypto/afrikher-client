import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Adresse email invalide' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data: existing } = await supabase
      .from('newsletter_subscribers')
      .select('id, active')
      .eq('email', email)
      .maybeSingle();

    if (existing) {
      if (existing.active) {
        return NextResponse.json(
          { error: 'Cette adresse email est déjà inscrite' },
          { status: 400 }
        );
      } else {
        const { error } = await supabase
          .from('newsletter_subscribers')
          .update({ active: true })
          .eq('email', email);

        if (error) throw error;
      }
    } else {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert({ email, active: true });

      if (error) throw error;
    }

    if (process.env.BREVO_API_KEY) {
      try {
        const response = await fetch('https://api.brevo.com/v3/contacts', {
          method: 'POST',
          headers: {
            'api-key': process.env.BREVO_API_KEY,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            listIds: [2],
            updateEnabled: true,
          }),
        });

        if (!response.ok && response.status !== 400) {
          console.error('Brevo API error:', await response.text());
        }
      } catch (brevoError) {
        console.error('Brevo error:', brevoError);
      }
    }

    return NextResponse.json(
      { message: 'Inscription réussie' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue' },
      { status: 500 }
    );
  }
}
