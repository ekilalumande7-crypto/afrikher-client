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
    const { data: product } = await supabase
      .from('partner_products')
      .select('*')
      .eq('id', id)
      .single();

    if (!product || product.partner_id !== authResult.user?.id) {
      return NextResponse.json(
        { error: 'Not authorized' },
        { status: 403 }
      );
    }

    // Only allow updates if status is pending_approval
    if (!['pending_approval', 'rejected'].includes(product.status)) {
      return NextResponse.json(
        { error: 'Can only edit pending or rejected products' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('partner_products')
      .update({
        ...body,
        status: 'pending_approval', // Reset to pending if resubmitting
      })
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: 'Failed to update product' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('PUT /api/partner/products/[id] error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
