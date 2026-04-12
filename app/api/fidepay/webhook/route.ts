import { NextResponse } from 'next/server';
import { getServiceRoleClient } from '@/lib/supabase';
import {
  getTransactionById,
  markTransactionDone,
  parseWebhookParams,
  verifyWebhookSignature,
} from '@/lib/fidepay';
import { sendTransactionalEmail } from '@/lib/brevo';
import {
  orderConfirmationEmail,
  subscriptionConfirmedEmail,
} from '@/lib/email-templates';

// ══════════════════════════════════════════════
// FIDEPAY IPN WEBHOOK
// - Signature is verified before any business logic
// - Subscription / magazine use the new transactions table
// - Order preserves the existing boutique flow
// ══════════════════════════════════════════════

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const webhookData = parseWebhookParams(url);

    if (!webhookData.status && !webhookData.transaction_id) {
      return NextResponse.json({ ok: true, message: 'FIDEPAY webhook endpoint active' });
    }

    const transactionId = webhookData.transaction_id;
    const paymentStatus = webhookData.status?.toLowerCase() || '';

    const isValidSignature = await verifyWebhookSignature(
      transactionId,
      webhookData.total_amount,
      webhookData.signature
    );

    if (!isValidSignature) {
      console.warn('[FIDEPAY WEBHOOK] Invalid signature for transaction:', transactionId);
      return NextResponse.json({ ok: true, ignored: 'invalid-signature' });
    }

    if (!['success', 'paid', 'completed'].includes(paymentStatus)) {
      console.warn('[FIDEPAY WEBHOOK] Non-success status received:', paymentStatus, transactionId);
      return NextResponse.json({ ok: true, ignored: 'non-success-status' });
    }

    const transaction = await getTransactionById(transactionId);

    if (transaction?.status === 'done') {
      return NextResponse.json({ ok: true, ignored: 'already-processed' });
    }

    if (transaction) {
      await handleTransactionWebhook(transaction);
      return NextResponse.json({ ok: true, type: transaction.type });
    }

    await handleLegacyOrderWebhook(webhookData);
    return NextResponse.json({ ok: true, fallback: 'legacy-order' });
  } catch (error) {
    console.error('[FIDEPAY WEBHOOK] Error:', error);
    return NextResponse.json({ ok: true, error: 'logged' });
  }
}

async function handleTransactionWebhook(transaction: {
  transaction_id: string;
  user_id: string;
  type: 'subscription' | 'magazine' | 'order';
  item_id: string | null;
  order_id: string | null;
  amount: number;
  status: 'pending' | 'done';
}) {
  const supabase = getServiceRoleClient();

  try {
    if (transaction.type === 'subscription') {
      const currentPeriodStart = new Date();
      const currentPeriodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

      const upsertPayload = {
        user_id: transaction.user_id,
        status: 'active',
        current_period_start: currentPeriodStart.toISOString(),
        current_period_end: currentPeriodEnd.toISOString(),
      };

      const { error } = await supabase
        .from('subscriptions')
        .upsert(upsertPayload, { onConflict: 'user_id' });

      if (error) {
        throw new Error(`Subscription upsert failed: ${error.message}`);
      }

      // Send subscription confirmation email via Brevo
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', transaction.user_id)
          .single();
        const { data: authUser } = await supabase.auth.admin.getUserById(transaction.user_id);
        const userEmail = authUser?.user?.email;

        // Fetch the actual plan from the subscription record
        const { data: subRecord } = await supabase
          .from('subscriptions')
          .select('plan, customer_email')
          .eq('user_id', transaction.user_id)
          .maybeSingle();
        const actualPlan = subRecord?.plan || 'monthly';
        const fallbackEmail = subRecord?.customer_email;
        const recipientEmail = userEmail || fallbackEmail;

        console.log('[FIDEPAY WEBHOOK] Subscription email — user:', transaction.user_id, 'email:', recipientEmail, 'plan:', actualPlan);

        if (recipientEmail) {
          const { subject, html } = subscriptionConfirmedEmail(
            profile?.full_name || '',
            actualPlan
          );
          await sendTransactionalEmail({ email: recipientEmail, name: profile?.full_name }, subject, html);
          console.log('[FIDEPAY WEBHOOK] Subscription confirmation email sent to', recipientEmail);
        } else {
          console.warn('[FIDEPAY WEBHOOK] No email found for user', transaction.user_id, '— skipping confirmation email');
        }
      } catch (emailErr) {
        console.error('[FIDEPAY WEBHOOK] Subscription email error:', emailErr);
      }
    }

    if (transaction.type === 'magazine') {
      if (!transaction.item_id) {
        throw new Error('Magazine transaction missing item_id');
      }

      const { error } = await supabase
        .from('magazine_purchases')
        .upsert(
          {
            user_id: transaction.user_id,
            magazine_id: transaction.item_id,
            amount: transaction.amount,
            currency: 'EUR',
            payment_status: 'completed',
            fidepay_payment_id: transaction.transaction_id,
          },
          { onConflict: 'user_id,magazine_id' }
        );

      if (error) {
        throw new Error(`Magazine purchase upsert failed: ${error.message}`);
      }

      if (transaction.order_id) {
        await supabase
          .from('orders')
          .update({
            status: 'paid',
            fidepay_payment_id: transaction.transaction_id,
            updated_at: new Date().toISOString(),
          })
          .eq('id', transaction.order_id);
      }
    }

    if (transaction.type === 'order') {
      await handleLegacyOrderWebhook({
        status: 'success',
        signature: '',
        transaction_id: transaction.transaction_id,
        total_amount: String(transaction.amount),
        charges: '0',
        amount: String(transaction.amount),
        currency: 'EUR',
      });
    }

    await markTransactionDone(transaction.transaction_id);
  } catch (error) {
    console.error('[FIDEPAY WEBHOOK] Transaction handling error:', error);
  }
}

async function handleLegacyOrderWebhook(webhookData: {
  status: string;
  signature: string;
  transaction_id: string;
  total_amount: string;
  charges: string;
  amount: string;
  currency: string;
}) {
  const supabase = getServiceRoleClient();
  const txId = webhookData.transaction_id;
  let order = null;

  const { data: order1 } = await supabase
    .from('orders')
    .select('*')
    .eq('fidepay_payment_id', txId)
    .single();

  if (order1) {
    order = order1;
  }

  if (!order) {
    const { data: order2 } = await supabase
      .from('orders')
      .select('*')
      .ilike('fidepay_payment_url', `%${txId}%`)
      .single();

    if (order2) {
      order = order2;
    }
  }

  if (!order && txId.length <= 12) {
    const { data: orders3 } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (orders3) {
      order =
        orders3.find((candidate) => {
          const shortId = candidate.id.replace(/-/g, '').substring(0, 12).toUpperCase();
          return shortId === txId.toUpperCase();
        }) || null;
    }
  }

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
      }
    }
  }

  if (!order) {
    console.warn('[FIDEPAY WEBHOOK] Legacy order not found for transaction', txId);
    return;
  }

  await supabase
    .from('orders')
    .update({
      status: 'paid',
      fidepay_payment_id: txId,
      updated_at: new Date().toISOString(),
    })
    .eq('id', order.id);

  if (order.user_id) {
    try {
      await supabase.from('notifications').insert({
        user_id: order.user_id,
        title: 'Paiement recu',
        body: `Votre commande #${order.id.slice(0, 8)} a ete payee avec succes.`,
        type: 'order',
        data: { orderId: order.id, status: 'paid' },
      });
    } catch (notificationError) {
      console.error('[FIDEPAY WEBHOOK] Notification error:', notificationError);
    }

    // Send order confirmation email via Brevo
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', order.user_id)
        .single();
      const customerEmail = order.customer_email;
      if (!customerEmail) {
        const { data: authUser } = await supabase.auth.admin.getUserById(order.user_id);
        if (authUser?.user?.email) {
          const items = Array.isArray(order.items) ? order.items : [];
          const { subject, html } = orderConfirmationEmail(
            profile?.full_name || '',
            order.id,
            String(order.total || '0'),
            items.map((i: { name?: string; qty?: number; price?: number }) => ({
              name: i.name || 'Article',
              qty: i.qty || 1,
              price: i.price || 0,
            }))
          );
          await sendTransactionalEmail(
            { email: authUser.user.email, name: profile?.full_name },
            subject,
            html
          );
        }
      } else {
        const items = Array.isArray(order.items) ? order.items : [];
        const { subject, html } = orderConfirmationEmail(
          profile?.full_name || '',
          order.id,
          String(order.total || '0'),
          items.map((i: { name?: string; qty?: number; price?: number }) => ({
            name: i.name || 'Article',
            qty: i.qty || 1,
            price: i.price || 0,
          }))
        );
        await sendTransactionalEmail(
          { email: customerEmail, name: profile?.full_name },
          subject,
          html
        );
      }
    } catch (emailErr) {
      console.error('[FIDEPAY WEBHOOK] Order email error:', emailErr);
    }
  }

  const orderTransaction = await getTransactionById(txId);
  if (orderTransaction && orderTransaction.status !== 'done') {
    try {
      await markTransactionDone(txId);
    } catch (transactionError) {
      console.error('[FIDEPAY WEBHOOK] Failed to mark legacy order transaction done:', transactionError);
    }
  }
}

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get('content-type') || '';

    if (contentType.includes('form-urlencoded')) {
      const body = await request.text();
      const params = new URLSearchParams(body);
      const url = new URL(request.url);
      params.forEach((value, key) => url.searchParams.set(key, value));
      return GET(new Request(url.toString(), { headers: request.headers }));
    }

    if (contentType.includes('json')) {
      const jsonBody = await request.json();
      const url = new URL(request.url);

      if (jsonBody.status) url.searchParams.set('status', jsonBody.status);
      if (jsonBody.signature) url.searchParams.set('signature', jsonBody.signature);
      if (jsonBody.transaction_id) url.searchParams.set('data[transaction_id]', jsonBody.transaction_id);
      if (jsonBody.data?.transaction_id) url.searchParams.set('data[transaction_id]', jsonBody.data.transaction_id);
      if (jsonBody.total_amount) url.searchParams.set('data[total_amount]', jsonBody.total_amount);
      if (jsonBody.data?.total_amount) url.searchParams.set('data[total_amount]', jsonBody.data.total_amount);

      return GET(new Request(url.toString(), { headers: request.headers }));
    }

    return GET(request);
  } catch (error) {
    console.error('[FIDEPAY WEBHOOK] POST error:', error);
    return NextResponse.json({ ok: true, error: 'logged' });
  }
}
