import { NextResponse } from 'next/server';
import { getServiceRoleClient } from '@/lib/supabase';
import { verifyWebhookSignature, parseWebhookPayload } from '@/lib/fidepay';
import { sendNotification } from '@/lib/notifications';

export async function POST(request: Request) {
  try {
    const signature = request.headers.get('x-fidepay-signature');
    if (!signature) {
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 401 }
      );
    }

    // Get raw body for signature verification
    const rawBody = await request.text();

    // Verify webhook signature
    if (!verifyWebhookSignature(rawBody, signature)) {
      console.warn('Invalid webhook signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    const payload = parseWebhookPayload(rawBody);
    const { status, transaction_id, amount, custom_data } = payload;

    const supabase = getServiceRoleClient();

    // Find order by transaction ID
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('fidepay_payment_id', transaction_id)
      .single();

    if (orderError || !order) {
      console.warn(`Order not found for transaction ${transaction_id}`);
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }

    // Map FidePay status to order status
    let orderStatus = 'pending';
    if (status === 'completed' || status === 'success') {
      orderStatus = 'paid';
    } else if (status === 'failed' || status === 'cancelled') {
      orderStatus = 'cancelled';
    }

    // Update order status
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        status: orderStatus,
        updated_at: new Date().toISOString(),
      })
      .eq('id', order.id);

    if (updateError) {
      console.error('Failed to update order:', updateError);
      return NextResponse.json(
        { success: false, message: 'Failed to update order' },
        { status: 500 }
      );
    }

    // Send notification to user
    if (order.user_id) {
      try {
        if (orderStatus === 'paid') {
          await sendNotification(order.user_id, {
            title: 'Paiement reçu',
            body: `Votre commande #${order.id} a été payée avec succès`,
            type: 'order',
            data: { orderId: order.id, status: 'paid' },
          });
        } else if (orderStatus === 'cancelled') {
          await sendNotification(order.user_id, {
            title: 'Paiement échoué',
            body: `Le paiement pour votre commande #${order.id} a échoué`,
            type: 'order',
            data: { orderId: order.id, status: 'failed' },
          });
        }
      } catch (notifError) {
        console.error('Failed to send notification:', notifError);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Webhook processed',
      orderId: order.id,
    });
  } catch (error) {
    console.error('POST /api/fidepay/webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  // FidePay may use GET for health checks
  return NextResponse.json({ status: 'ok' });
}
