import { NextResponse } from 'next/server';
import { getServiceRoleClient } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { adSlotId } = body;

    if (!adSlotId) {
      return NextResponse.json(
        { error: 'Ad slot ID is required' },
        { status: 400 }
      );
    }

    const supabase = getServiceRoleClient();

    // Get current impression count
    const { data: adSlot, error: fetchError } = await supabase
      .from('ad_slots')
      .select('impressions')
      .eq('id', adSlotId)
      .single();

    if (fetchError || !adSlot) {
      return NextResponse.json(
        { error: 'Ad slot not found' },
        { status: 404 }
      );
    }

    // Increment impression count
    const newImpressions = (adSlot.impressions || 0) + 1;

    const { error: updateError } = await supabase
      .from('ad_slots')
      .update({ impressions: newImpressions })
      .eq('id', adSlotId);

    if (updateError) {
      return NextResponse.json(
        { error: 'Failed to update impression count' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      impressions: newImpressions,
    });
  } catch (error) {
    console.error('POST /api/ads/impression error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
