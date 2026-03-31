import { NextResponse } from 'next/server';
import { getServiceRoleClient } from '@/lib/supabase';
import { verifyWebhookSignature, parseWebhookParams } from '@/lib/fidepay';

// ══════════════════════════════════════════════
// FIDEPAY IPN WEBHOOK
// Doc: FIDEPAY sends a GET request with query params
// ?status=...&signature=...&data[transaction_id]=...&data[total_amount]=...
// ══════════════════════════════════════════════

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const webhookData = parseWebhookParams(url);

    // If no status param, this is a health check
    if (!webhookData.status && !webhookData.transaction_id) {
      return NextResponse.json({ status: 'ok', message: 'FIDEPAY webhook endpoint active' });
    }

    // Verify signature
    const isValid = await verifyWebhookSignature(
      webhookData.transaction_id,
      webhookData.total_amount,
      webhookData.signature
    );

    if (!isValid) {
      console.warn('Invalid FIDEPAY webhook signature for transaction:', webhookData.transaction_id);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const supabase = getServiceRoleClient();
    const txId = webhookData.transaction_id;

    // Determine if this is an order or subscription payment
    const isSubscription = txId.startsWith('SUB_');

    if (isSubscription) {
      // Handle subscription payment
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('fidepay_sub_id', txId)
        .single();

      if (!subscription) {
        console.warn(`Subscription not found for transaction ${txId}`);
        return NextResponse.json({ success: false, message: 'Subscription not found' }, { status: 404 });
      }

      const newStatus = webhookData.status === 'success' || webhookData.status === 'completed'
        ? 'active' : 'cancelled';

      await supabase
        .from('subscriptions')
        .update({ status: newStatus })
        .eq('id', subscription.id);

      // Notify user
      if (subscription.user_id) {
        try {
          await supabase.from('notifications').insert({
            user_id: subscription.user_id,
            title: newStatus === 'active' ? 'Abonnement active' : 'Paiement echoue',
            body: newStatus === 'active'
              ? 'Votre abonnement AFRIKHER est maintenant actif.'
              : 'Le paiement de votre abonnement a echoue.',
            type: 'order',
            data: { subscriptionId: subscription.id, status: newStatus },
          });
        } catch (e) { console.error('Notification error:', e); }
      }

      return NextResponse.json({ success: true, type: 'subscription', status: newStatus });
    } else {
      // Handle order payment
      const { data: order } = await supabase
        .from('orders')
        .select('*')
        .eq('fidepay_payment_id', txId)
        .single();

      if (!order) {
        console.warn(`Order not found for transaction ${txId}`);
        return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
      }

      const orderStatus = webhookData.status === 'success' || webhookData.status === 'completed'
        ? 'paid' : 'cancelled';

      await supabase
        .from('orders')
        .update({ status: orderStatus, updated_at: new Date().toISOString() })
        .eq('id', order.id);

      // Notify user
      if (order.user_id) {
        try {
          await supabase.from('notifications').insert({
            user_id: order.user_id,
            title: orderStatus === 'paid' ? 'Paiement recu' : 'Paiement echoue',
            body: orderStatus === 'paid'
              ? `Votre commande #${order.id.slice(0, 8)} a ete payee avec succes.`
              : `Le paiement pour votre commande #${order.id.slice(0, 8)} a echoue.`,
            type: 'order',
            data: { orderId: order.id, status: orderStatus },
          });
        } catch (e) { console.error('Notification error:', e); }
      }

      return NextResponse.json({ success: true, type: 'order', status: orderStatus });
    }
  } catch (error) {
    console.error('FIDEPAY webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Also handle POST in case FIDEPAY changes behavior
export async function POST(request: Request) {
  // Redirect to GET handler with same URL
  return GET(request);
}
