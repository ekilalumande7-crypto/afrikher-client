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

    return NextResponse.json({
      data: authResult.profile,
    });
  } catch (error) {
    console.error('GET /api/user/profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const authResult = await requireAuth(request);
    if (authResult.status === 401) {
      return NextResponse.json(
        { error: authResult.error },
        { status: 401 }
      );
    }

    const body = await request.json();
    const userId = authResult.user?.id;

    const supabase = getServiceRoleClient();

    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...body,
      })
      .eq('id', userId)
      .select()
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: 'Failed to update profile' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('PUT /api/user/profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
