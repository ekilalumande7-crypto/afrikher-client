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

    const { id } = await params;
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
      .update({ role: 'partner' })
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
        status: 'active',
        validated_at: new Date().toISOString(),
        validated_by: authResult.user?.id,
      })
      .eq('id', id);

    if (partnerError) {
      return NextResponse.json(
        { error: 'Failed to validate partner' },
        { status: 500 }
      );
    }

    // Send notification
    try {
      await sendNotification(id, {
        title: 'Candidature approuvée',
        body: 'Votre candidature en tant que partenaire AFRIKHER a été approuvée!',
        type: 'validation',
        data: { partnerId: id },
      });
    } catch (notifError) {
      console.error('Failed to send notification:', notifError);
    }

    // Send email
    const htmlContent = `
      <html>
        <body style="font-family: Arial, sans-serif; color: #333;">
          <h2>Bienvenue dans la famille AFRIKHER!</h2>
          <p>Votre candidature en tant que partenaire a été approuvée.</p>
          <p>Vous pouvez maintenant accéder à votre espace partenaire pour:</p>
          <ul>
            <li>Soumettre des articles et contenus éditoriaux</li>
            <li>Ajouter vos produits en boutique</li>
            <li>Suivre vos revenus et paiements</li>
          </ul>
          <p><a href="https://afrikher.com/partner/dashboard">Accéder à mon tableau de bord</a></p>
          <p>Cordialement,<br/>L'équipe AFRIKHER</p>
        </body>
      </html>
    `;

    await sendTransactionalEmail(
      { email: partner.email || '', name: partner.full_name },
      'Bienvenue AFRIKHER - Partenaire approuvé',
      htmlContent
    );

    return NextResponse.json({
      success: true,
      message: 'Partner validated successfully',
    });
  } catch (error) {
    console.error('POST /api/admin/partners/[id]/validate error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
