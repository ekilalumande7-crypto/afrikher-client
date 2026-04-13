import { NextResponse } from 'next/server';
import { getServiceRoleClient } from '@/lib/supabase';
import { sendTransactionalEmail } from '@/lib/brevo';
import { contactConfirmationEmail } from '@/lib/email-templates';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, subject, message } = body;

    if (!email || !name || !message) {
      return NextResponse.json(
        { error: 'Email, name, and message are required' },
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

    // Save contact form to database for audit
    const { error: dbError } = await supabase.from('contact_submissions').insert({
      email,
      full_name: name,
      subject: subject || 'Contact Form Submission',
      message,
      status: 'new',
    });

    if (dbError) {
      console.error('Database error:', dbError);
    }

    // Send confirmation email to user
    try {
      const { subject: emailSubject, html } = await contactConfirmationEmail(name, subject || 'Contact');
      await sendTransactionalEmail({ email, name }, emailSubject, html);
    } catch (emailErr) {
      console.error('Contact confirmation email error:', emailErr);
    }

    // Send notification to admin
    const adminHtml = `
      <html>
        <body style="font-family: Arial, sans-serif; color: #333;">
          <h2>Nouveau message de contact</h2>
          <p><strong>Nom:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Sujet:</strong> ${subject || 'Non spécifié'}</p>
          <p><strong>Message:</strong><br/>${message.replace(/\n/g, '<br/>')}</p>
        </body>
      </html>
    `;

    await sendTransactionalEmail(
      { email: process.env.ADMIN_EMAIL || 'hadassa.ekilalumande@afrikher.com' },
      `Nouveau message de contact: ${name}`,
      adminHtml,
      'AFRIKHER Contact'
    );

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully',
    });
  } catch (error) {
    console.error('POST /api/contact error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
