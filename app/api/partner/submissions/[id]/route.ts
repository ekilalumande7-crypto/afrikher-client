import { NextResponse } from 'next/server';
import { getServiceRoleClient } from '@/lib/supabase';
import { requirePartner } from '@/lib/auth-helpers';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requirePartner(request);
    if (authResult.status === 401 || authResult.status === 403) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const body = await request.json();
    const { id } = await params;

    const supabase = getServiceRoleClient();

    // Check ownership
    const { data: submission } = await supabase
      .from('partner_submissions')
      .select('*')
      .eq('id', id)
      .single();

    if (!submission || submission.partner_id !== authResult.user?.id) {
      return NextResponse.json(
        { error: 'Not authorized' },
        { status: 403 }
      );
    }

    // Only allow updates if status is pending
    if (submission.status !== 'pending') {
      return NextResponse.json(
        { error: 'Can only edit pending submissions' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('partner_submissions')
      .update({
        ...body,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: 'Failed to update submission' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('PUT /api/partner/submissions/[id] error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requirePartner(request);
    if (authResult.status === 401 || authResult.status === 403) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const { id } = await params;
    const supabase = getServiceRoleClient();

    // Check ownership
    const { data: submission } = await supabase
      .from('partner_submissions')
      .select('*')
      .eq('id', id)
      .single();

    if (!submission || submission.partner_id !== authResult.user?.id) {
      return NextResponse.json(
        { error: 'Not authorized' },
        { status: 403 }
      );
    }

    // Only allow deletion if status is pending
    if (submission.status !== 'pending') {
      return NextResponse.json(
        { error: 'Can only delete pending submissions' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('partner_submissions')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json(
        { error: 'Failed to delete submission' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: 'Submission deleted' });
  } catch (error) {
    console.error('DELETE /api/partner/submissions/[id] error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
