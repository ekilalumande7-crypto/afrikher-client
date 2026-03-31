import { NextResponse } from 'next/server';
import { getServiceRoleClient } from '@/lib/supabase';
import { requireAdmin } from '@/lib/auth-helpers';
import { sendNotification } from '@/lib/notifications';
import { sendTransactionalEmail } from '@/lib/brevo';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAdmin(request);
    if (authResult.status === 401 || authResult.status === 403) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const body = await request.json();
    const { reason } = body;
    const { id } = await params;

    if (!reason) {
      return NextResponse.json(
        { error: 'Rejection reason is required' },
        { status: 400 }
      );
    }

    const supabase = getServiceRoleClient();

    // Get partner profile
    const { data: partner } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (!partner) {
      return NextResponse.json(
        { error: 'Partner not found' },
        { status: 404 }
      );
    }

    // Update partner status
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ role: 'rejected_partner' })
      .eq('id', id);

    if (profileError) {
      return NextResponse.json(
        { error: 'Failed to update partner role' },
        { status: 500 }
      );
    }

    const { error: partnerError } = await supabase
      .from('partners')
      .update({
        status: 'rejected',
        rejection_reason: reason,
        validated_at: new Date().toISOString(),
        validated_by: authResult.user?.id,
      })
      .eq('id', id);

    if (partnerError) {
      return NextResponse.json(
        { error: 'Failed to reject partner' },
        { status: 500 }
      );
    }

    // Send notification
    try {
      await sendNotification(id, {
        title: 'Candidature refusée',
        body: `Votre candidature en tant que partenaire AFRIKHER a été refusée: ${reason}`,
        type: 'rejection',
        data: { partnerId: id, reason },
      });
    } catch (notifError) {
      console.error('Failed to send notification:', notifError);
    }

    // Send email
    const htmlContent = `
      <html>
        <body style="font-family: Arial, sans-serif; color: #333;">
          <h2>Résultat de votre candidature</h2>
          <p>Nous avons examiné votre candidature en tant que partenaire AFRIKHER.</p>
          <p><strong>Raison du refus:</strong><br/>${reason}</p>
          <p>Nous vous encourageons à nous contacter si vous avez des questions ou souhaitez soumettre une nouvelle candidature.</p>
          <p>Cordialement,<br/>L'équipe AFRIKHER</p>
        </body>
      </html>
    `;

    await sendTransactionalEmail(
      { email: partner.email || '', name: partner.full_name },
      'Résultat de votre candidature AFRIKHER',
      htmlContent
    );

    return NextResponse.json({
      success: true,
      message: 'Partner rejected successfully',
    });
  } catch (error) {
    console.error('POST /api/admin/partners/[id]/reject error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
