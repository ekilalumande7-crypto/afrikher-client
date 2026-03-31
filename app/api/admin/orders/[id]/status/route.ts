import { NextResponse } from 'next/server';
import { getServiceRoleClient } from '@/lib/supabase';
import { requireAdmin } from '@/lib/auth-helpers';
import { sendNotification } from '@/lib/notifications';

const VALID_STATUSES = ['pending', 'paid', 'shipped', 'delivered', 'cancelled'];

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAdmin(request);
    if (authResult.status === 401 || authResult.status === 403) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const body = await request.json();
    const { status } = body;
    const { id } = await params;

    if (!status || !VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    const supabase = getServiceRoleClient();

    // Get current order
    const { data: order } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single();

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Update order status
    const { data, error } = await supabase
      .from('orders')
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: 'Failed to update order status' },
        { status: 500 }
      );
    }

    // Send notification to user
    if (order.user_id) {
      try {
        const messages: Record<string, { title: string; body: string }> = {
          shipped: {
            title: 'Commande expédiée',
            body: `Votre commande #${id} a été expédiée`,
          },
          delivered: {
            title: 'Commande livrée',
            body: `Votre commande #${id} a été livrée`,
          },
          cancelled: {
            title: 'Commande annulée',
            body: `Votre commande #${id} a été annulée`,
          },
        };

        if (messages[status]) {
          await sendNotification(order.user_id, {
            type: 'order',
            ...messages[status],
            data: { orderId: id, status },
          });
        }
      } catch (notifError) {
        console.error('Failed to send notification:', notifError);
      }
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('PUT /api/admin/orders/[id]/status error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
