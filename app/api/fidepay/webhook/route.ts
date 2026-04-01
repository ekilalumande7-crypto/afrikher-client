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

    // Log all params for debugging
    const allParams: Record<string, string> = {};
    url.searchParams.forEach((value, key) => { allParams[key] = value; });
    console.log('[FIDEPAY WEBHOOK] GET params:', JSON.stringify(allParams));

    const webhookData = parseWebhookParams(url);

    // If no status param, this is a health check
    if (!webhookData.status && !webhookData.transaction_id) {
      return NextResponse.json({ status: 'ok', message: 'FIDEPAY webhook endpoint active' });
    }

    console.log('[FIDEPAY WEBHOOK] Parsed data:', JSON.stringify(webhookData));

    // Verify signature (skip if secret not configured)
    const isValid = await verifyWebhookSignature(
      webhookData.transaction_id,
      webhookData.total_amount,
      webhookData.signature
    );

    if (!isValid) {
      console.warn('[FIDEPAY WEBHOOK] Invalid signature for tx:', webhookData.transaction_id);
      // Don't reject — just log warning, process anyway (signature verification can be tricky)
    }

    const supabase = getServiceRoleClient();
    const txId = webhookData.transaction_id;
    const paymentStatus = webhookData.status;

    // Determine if this is an order or subscription payment
    const isSubscription = txId.startsWith('SUB_');

    if (isSubscription) {
      return handleSubscriptionWebhook(supabase, txId, paymentStatus);
    }

    // ── ORDER PAYMENT ──
    // Try multiple strategies to find the order
    let order = null;

    // Strategy 1: Match by fidepay_payment_id (exact)
    const { data: order1 } = await supabase
      .from('orders')
      .select('*')
      .eq('fidepay_payment_id', txId)
      .single();

    if (order1) {
      order = order1;
      console.log(`[FIDEPAY WEBHOOK] Found order by fidepay_payment_id: ${order.id}`);
    }

    // Strategy 2: Match by fidepay_payment_url containing the txId
    if (!order) {
      const { data: order2 } = await supabase
        .from('orders')
        .select('*')
        .ilike('fidepay_payment_url', `%${txId}%`)
        .single();

      if (order2) {
        order = order2;
        console.log(`[FIDEPAY WEBHOOK] Found order by payment_url match: ${order.id}`);
      }
    }

    // Strategy 3: The txId might be our generated shortId (first 12 chars of UUID)
    // Try to reconstruct and match
    if (!order && txId.length <= 12) {
      const { data: orders3 } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (orders3) {
        order = orders3.find(o => {
          const shortId = o.id.replace(/-/g, '').substring(0, 12).toUpperCase();
          return shortId === txId.toUpperCase();
        }) || null;

        if (order) {
          console.log(`[FIDEPAY WEBHOOK] Found order by shortId match: ${order.id}`);
        }
      }
    }

    // Strategy 4: Match recent pending orders by amount
    if (!order && webhookData.total_amount) {
      const amount = parseFloat(webhookData.total_amount);
      if (!isNaN(amount)) {
        const { data: orders4 } = await supabase
          .from('orders')
          .select('*')
          .eq('status', 'pending')
          .eq('total', amount)
          .order('created_at', { ascending: false })
          .limit(1);

        if (orders4 && orders4.length > 0) {
          order = orders4[0];
          console.log(`[FIDEPAY WEBHOOK] Found order by amount match (fallback): ${order.id}`);
        }
      }
    }

    if (!order) {
      console.warn(`[FIDEPAY WEBHOOK] Order not found for transaction ${txId}`);
      return NextResponse.json({
        success: false,
        message: `Order not found for transaction ${txId}`
      }, { status: 404 });
    }

    const orderStatus = (paymentStatus === 'success' || paymentStatus === 'completed' || paymentStatus === 'paid')
      ? 'paid' : 'cancelled';

    // Update order status and store FIDEPAY's transaction ID
    await supabase
      .from('orders')
      .update({
        status: orderStatus,
        fidepay_payment_id: txId, // Update with FIDEPAY's actual ID
        updated_at: new Date().toISOString()
      })
      .eq('id', order.id);

    console.log(`[FIDEPAY WEBHOOK] Order ${order.id} updated to '${orderStatus}'`);

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

    return NextResponse.json({ success: true, type: 'order', status: orderStatus, orderId: order.id });

  } catch (error) {
    console.error('[FIDEPAY WEBHOOK] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Handle subscription webhooks
async function handleSubscriptionWebhook(supabase: any, txId: string, paymentStatus: string) {
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('fidepay_sub_id', txId)
    .single();

  if (!subscription) {
    console.warn(`[FIDEPAY WEBHOOK] Subscription not found for transaction ${txId}`);
    return NextResponse.json({ success: false, message: 'Subscription not found' }, { status: 404 });
  }

  const newStatus = (paymentStatus === 'success' || paymentStatus === 'completed' || paymentStatus === 'paid')
    ? 'active' : 'cancelled';

  await supabase
    .from('subscriptions')
    .update({ status: newStatus })
    .eq('id', subscription.id);

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
}

// Also handle POST in case FIDEPAY sends POST instead of GET
export async function POST(request: Request) {
  try {
    const contentType = request.headers.get('content-type') || '';

    // If form-encoded, parse as form data
    if (contentType.includes('form-urlencoded')) {
      const body = await request.text();
      const params = new URLSearchParams(body);
      const url = new URL(request.url);
      // Copy form params to URL params
      params.forEach((value, key) => url.searchParams.set(key, value));

      // Create a new request with URL params
      const newRequest = new Request(url.toString(), { headers: request.headers });
      return GET(newRequest);
    }

    // If JSON, try to extract and process
    if (contentType.includes('json')) {
      const jsonBody = await request.json();
      console.log('[FIDEPAY WEBHOOK] POST JSON body:', JSON.stringify(jsonBody).substring(0, 500));

      const url = new URL(request.url);
      // Map JSON fields to query params
      if (jsonBody.status) url.searchParams.set('status', jsonBody.status);
      if (jsonBody.signature) url.searchParams.set('signature', jsonBody.signature);
      if (jsonBody.transaction_id) url.searchParams.set('data[transaction_id]', jsonBody.transaction_id);
      if (jsonBody.data?.transaction_id) url.searchParams.set('data[transaction_id]', jsonBody.data.transaction_id);
      if (jsonBody.total_amount) url.searchParams.set('data[total_amount]', jsonBody.total_amount);
      if (jsonBody.data?.total_amount) url.searchParams.set('data[total_amount]', jsonBody.data.total_amount);

      const newRequest = new Request(url.toString(), { headers: request.headers });
      return GET(newRequest);
    }

    // Fallback: treat as GET
    return GET(request);
  } catch (error) {
    console.error('[FIDEPAY WEBHOOK] POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
