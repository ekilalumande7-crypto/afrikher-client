import { NextResponse } from 'next/server';
import { getServiceRoleClient } from '@/lib/supabase';
import { requireAdmin } from '@/lib/auth-helpers';

export async function GET() {
  try {
    const supabase = getServiceRoleClient();

    const { data, error } = await supabase
      .from('site_config')
      .select('key, value');

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch site config' },
        { status: 500 }
      );
    }

    const config = data?.reduce((acc, { key, value }) => {
      acc[key] = value;
      return acc;
    }, {} as Record<string, string>) || {};

    return NextResponse.json({ data: config });
  } catch (error) {
    console.error('GET /api/site-config error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const authResult = await requireAdmin(request);
    if (authResult.status === 401 || authResult.status === 403) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const body = await request.json();
    const updates = body.updates as Record<string, string>;

    if (!updates || typeof updates !== 'object') {
      return NextResponse.json(
        { error: 'Invalid updates object' },
        { status: 400 }
      );
    }

    const supabase = getServiceRoleClient();

    const updatePromises = Object.entries(updates).map(([key, value]) =>
      supabase
        .from('site_config')
        .upsert({ key, value, updated_at: new Date().toISOString() }, {
          onConflict: 'key',
        })
    );

    const results = await Promise.all(updatePromises);
    const hasError = results.some((r) => r.error);

    if (hasError) {
      return NextResponse.json(
        { error: 'Failed to update site config' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Site config updated successfully',
    });
  } catch (error) {
    console.error('PUT /api/site-config error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
