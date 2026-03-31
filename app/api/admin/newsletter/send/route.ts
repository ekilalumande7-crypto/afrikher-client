import { NextResponse } from 'next/server';
import { getServiceRoleClient } from '@/lib/supabase';
import { requireAdmin } from '@/lib/auth-helpers';
import { sendCampaign } from '@/lib/brevo';

export async function POST(request: Request) {
  try {
    const authResult = await requireAdmin(request);
    if (authResult.status === 401 || authResult.status === 403) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const body = await request.json();
    const { subject, htmlContent, listIds = [2] } = body;

    if (!subject || !htmlContent) {
      return NextResponse.json(
        { error: 'Subject and htmlContent are required' },
        { status: 400 }
      );
    }

    const supabase = getServiceRoleClient();

    // Create campaign record
    const { data: campaign, error: campaignError } = await supabase
      .from('newsletter_campaigns')
      .insert({
        subject,
        body: htmlContent,
        status: 'draft',
        created_by: authResult.user?.id,
      })
      .select()
      .single();

    if (campaignError || !campaign) {
      return NextResponse.json(
        { error: 'Failed to create campaign' },
        { status: 500 }
      );
    }

    try {
      // Send via Brevo
      const brevoResponse = await sendCampaign(subject, htmlContent, listIds);

      if (!brevoResponse.ok) {
        console.error('Brevo error:', await brevoResponse.text());
        return NextResponse.json(
          { error: 'Failed to send campaign' },
          { status: 500 }
        );
      }

      const brevoData = await brevoResponse.json();

      // Update campaign status
      await supabase
        .from('newsletter_campaigns')
        .update({
          status: 'sent',
          sent_at: new Date().toISOString(),
          brevo_campaign_id: brevoData.id,
        })
        .eq('id', campaign.id);

      return NextResponse.json({
        success: true,
        message: 'Campaign sent successfully',
        campaign,
      });
    } catch (brevoError) {
      console.error('Brevo error:', brevoError);
      return NextResponse.json(
        { error: 'Failed to send via email service' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('POST /api/admin/newsletter/send error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
