import { NextResponse } from 'next/server';
import { sendTransactionalEmail } from '@/lib/brevo';
import { welcomeReaderEmail } from '@/lib/email-templates';

// POST /api/auth/welcome
// Called after successful registration to send welcome email
export async function POST(request: Request) {
  try {
    const { email, name } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    const { subject, html } = await welcomeReaderEmail(name || '');

    try {
      await sendTransactionalEmail({ email, name }, subject, html);
    } catch (brevoError) {
      console.error('[WELCOME EMAIL] Brevo error:', brevoError);
      // Don't fail the request — email is best-effort
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[WELCOME EMAIL] Error:', error);
    return NextResponse.json({ ok: true }); // Never block registration
  }
}
