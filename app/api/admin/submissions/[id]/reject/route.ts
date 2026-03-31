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

    // Get submission
    const { data: submission } = await supabase
      .from('partner_submissions')
      .select('*')
      .eq('id', id)
      .single();

    if (!submission) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      );
    }

    // Update submission status
    const { error: updateError } = await supabase
      .from('partner_submissions')
      .update({
        status: 'rejected',
        rejection_reason: reason,
        reviewed_by: authResult.user?.id,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (updateError) {
      return NextResponse.json(
        { error: 'Failed to update submission' },
        { status: 500 }
      );
    }

    // Get partner
    const { data: partner } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', submission.partner_id)
      .single();

    // Send notification
    try {
      await sendNotification(submission.partner_id, {
        title: 'Contenu refusé',
        body: `Votre soumission "${submission.title}" a été refusée: ${reason}`,
        type: 'rejection',
        data: { submissionId: id, reason },
      });
    } catch (notifError) {
      console.error('Failed to send notification:', notifError);
    }

    // Send email
    const htmlContent = `
      <html>
        <body style="font-family: Arial, sans-serif; color: #333;">
          <h2>Feedback sur votre soumission</h2>
          <p>Votre soumission "<strong>${submission.title}</strong>" a été examinée par notre équipe éditoriale.</p>
          <p><strong>Raison du refus:</strong><br/>${reason}</p>
          <p>Vous êtes libre de soumettre une nouvelle version ou un autre contenu.</p>
          <p>Cordialement,<br/>L'équipe éditoriale AFRIKHER</p>
        </body>
      </html>
    `;

    await sendTransactionalEmail(
      { email: partner?.email || '', name: partner?.full_name },
      'Feedback - Soumission AFRIKHER',
      htmlContent
    );

    return NextResponse.json({
      success: true,
      message: 'Submission rejected',
    });
  } catch (error) {
    console.error('POST /api/admin/submissions/[id]/reject error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
