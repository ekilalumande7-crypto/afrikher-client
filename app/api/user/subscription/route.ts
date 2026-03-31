import { NextResponse } from 'next/server';
import { getServiceRoleClient } from '@/lib/supabase';
import { requireAuth } from '@/lib/auth-helpers';

export async function GET(request: Request) {
  try {
    const authResult = await requireAuth(request);
    if (authResult.status === 401) {
      return NextResponse.json(
        { error: authResult.error },
        { status: 401 }
      );
    }

    const supabase = getServiceRoleClient();

    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', authResult.user?.id)
      .single();

    if (error) {
      // No subscription found is not an error
      return NextResponse.json({
        data: null,
        hasSubscription: false,
      });
    }

    return NextResponse.json({
      data,
      hasSubscription: data?.status === 'active',
    });
  } catch (error) {
    console.error('GET /api/user/subscription error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
