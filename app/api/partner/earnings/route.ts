import { NextResponse, NextRequest } from 'next/server';
import { getServiceRoleClient } from '@/lib/supabase';
import { requirePartner } from '@/lib/auth-helpers';

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
    const limit = parseInt(searchParams.get('limit') || '20');

    const offset = (page - 1) * limit;
    const supabase = getServiceRoleClient();

    // Get earnings
    const { data: earnings, error, count } = await supabase
      .from('partner_earnings')
      .select('*', { count: 'exact' })
      .eq('partner_id', authResult.user?.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch earnings' },
        { status: 500 }
      );
    }

    // Calculate totals
    const { data: allEarnings } = await supabase
      .from('partner_earnings')
      .select('gross_amount, net_amount, paid')
      .eq('partner_id', authResult.user?.id);

    const totalGross = (allEarnings || []).reduce(
      (sum, e) => sum + (e.gross_amount || 0),
      0
    );
    const totalNet = (allEarnings || []).reduce(
      (sum, e) => sum + (e.net_amount || 0),
      0
    );
    const totalPaid = (allEarnings || []).reduce(
      (sum, e) => sum + (e.paid ? e.net_amount || 0 : 0),
      0
    );

    return NextResponse.json({
      data: earnings,
      totals: {
        totalGross,
        totalNet,
        totalPaid,
        pendingPayout: totalNet - totalPaid,
      },
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    console.error('GET /api/partner/earnings error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
