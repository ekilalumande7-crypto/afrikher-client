import { NextResponse, NextRequest } from 'next/server';
import { getServiceRoleClient } from '@/lib/supabase';
import { requirePartner } from '@/lib/auth-helpers';
import { sendAdminAlert } from '@/lib/notifications';

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
      .from('partner_products')
      .select('*', { count: 'exact' })
      .eq('partner_id', authResult.user?.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch products' },
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
    console.error('GET /api/partner/products error:', error);
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
    const { name, description, price, images, type = 'other', stock, unlimited_stock } =
      body;

    if (!name || !price) {
      return NextResponse.json(
        { error: 'Name and price are required' },
        { status: 400 }
      );
    }

    const supabase = getServiceRoleClient();

    const { data, error } = await supabase
      .from('partner_products')
      .insert({
        partner_id: authResult.user?.id,
        name,
        description,
        price,
        images,
        type,
        stock: stock || 0,
        unlimited_stock: unlimited_stock || false,
        status: 'pending_approval',
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Failed to create product' },
        { status: 500 }
      );
    }

    // Send admin alert
    try {
      await sendAdminAlert({
        type: 'new_submission',
        message: `Nouveau produit partenaire: "${name}" de ${authResult.profile?.full_name}`,
        targetId: data?.id,
      });
    } catch (alertError) {
      console.error('Failed to send admin alert:', alertError);
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    console.error('POST /api/partner/products error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
