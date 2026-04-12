import { NextResponse, NextRequest } from 'next/server';
import { getServiceRoleClient } from '@/lib/supabase';
import { requirePartner } from '@/lib/auth-helpers';
import { sendAdminAlert } from '@/lib/notifications';
import { sendTransactionalEmail } from '@/lib/brevo';
import { submissionReceivedEmail } from '@/lib/email-templates';

export async function GET(request: NextRequest) {
  try {
    const authResult = await requirePartner(request);
    if (authResult.status === 401 || authResult.status === 403) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const offset = (page - 1) * limit;
    const supabase = getServiceRoleClient();

    const { data, error, count } = await supabase
      .from('partner_submissions')
      .select('*', { count: 'exact' })
      .eq('partner_id', authResult.user?.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch submissions' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data,
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    console.error('GET /api/partner/submissions error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const authResult = await requirePartner(request);
    if (authResult.status === 401 || authResult.status === 403) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const body = await request.json();
    const { type, title, content, category_id, cover_image, tags, note_to_editor } =
      body;

    if (!type || !title || !content) {
      return NextResponse.json(
        { error: 'Type, title, and content are required' },
        { status: 400 }
      );
    }

    const supabase = getServiceRoleClient();

    const { data, error } = await supabase
      .from('partner_submissions')
      .insert({
        partner_id: authResult.user?.id,
        type,
        title,
        content,
        category_id,
        cover_image,
        tags,
        note_to_editor,
        status: 'pending',
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Failed to create submission' },
        { status: 500 }
      );
    }

    // Send admin alert
    try {
      await sendAdminAlert({
        type: 'new_submission',
        message: `Nouvelle soumission: "${title}" de ${authResult.profile?.full_name}`,
        targetId: data?.id,
      });
    } catch (alertError) {
      console.error('Failed to send admin alert:', alertError);
    }

    // Send confirmation email to partner via Brevo
    try {
      const partnerEmail = authResult.user?.email;
      if (partnerEmail) {
        const { subject, html } = submissionReceivedEmail(
          authResult.profile?.full_name || '',
          title
        );
        await sendTransactionalEmail({ email: partnerEmail, name: authResult.profile?.full_name }, subject, html);
      }
    } catch (emailErr) {
      console.error('Failed to send submission email:', emailErr);
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    console.error('POST /api/partner/submissions error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
