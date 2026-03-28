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

    const { error } = await supabase
      .from('newsletter_subscribers')
      .update({ active: false })
      .eq('email', email);

    if (error) throw error;

    if (process.env.BREVO_API_KEY) {
      try {
        const response = await fetch(`https://api.brevo.com/v3/contacts/${encodeURIComponent(email)}`, {
          method: 'DELETE',
          headers: {
            'api-key': process.env.BREVO_API_KEY,
          },
        });

        if (!response.ok && response.status !== 404) {
          console.error('Brevo API error:', await response.text());
        }
      } catch (brevoError) {
        console.error('Brevo error:', brevoError);
      }
    }

    return NextResponse.json(
      { message: 'Désinscription réussie' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Newsletter unsubscribe error:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue' },
      { status: 500 }
    );
  }
}
