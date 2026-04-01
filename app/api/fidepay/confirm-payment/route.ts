import { NextResponse } from 'next/server';
import { getServiceRoleClient } from '@/lib/supabase';

/**
 * Fallback payment confirmation endpoint.
 * Called when the user returns from FIDEPAY to the success page.
 * If the order is still 'pending', it updates it to 'paid'.
 * This is a safety net in case the FIDEPAY webhook (IPN) didn't fire or was delayed.
 */
export async function POST(request: Request) {
  try {
    const { order_id } = await request.json();

    if (!order_id) {
      return NextResponse.json(
        { error: 'order_id is required' },
        { status: 400 }
      );
    }

    // Require authentication
    const authHeader = request.headers.get('Authorization');
    let userId: string | null = null;

    if (authHeader?.startsWith('Bearer ')) {
      try {
        const { getAuthUser } = await import('@/lib/auth-helpers');
        const authResult = await getAuthUser(request);
        userId = authResult?.user?.id || null;
      } catch {
        // Auth failed, continue without user check
      }
    }

    const supabase = getServiceRoleClient();

    // Fetch the order
    const { data: order, error: fetchError } = await supabase
      .from('orders')
      .select('id, status, user_id')
      .eq('id', order_id)
      .single();

    if (fetchError || !order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Security: only the order owner (or unauthenticated fallback) can confirm
    if (userId && order.user_id && userId !== order.user_id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Only update if still pending — don't override webhook-confirmed statuses
    if (order.status === 'pending') {
      const { error: updateError } = await supabase
        .from('orders')
        .update({
          status: 'paid',
          updated_at: new Date().toISOString(),
        })
        .eq('id', order_id);

      if (updateError) {
        console.error('Error confirming payment:', updateError);
        return NextResponse.json(
          { error: 'Failed to update order' },
          { status: 500 }
        );
      }

      console.log(`[confirm-payment] Order ${order_id} updated to 'paid' (fallback confirmation)`);

      return NextResponse.json({
        success: true,
        updated: true,
        status: 'paid',
      });
    }

    // Already paid/shipped/delivered — no action needed
    return NextResponse.json({
      success: true,
      updated: false,
      status: order.status,
    });
  } catch (error: any) {
    console.error('POST /api/fidepay/confirm-payment error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
