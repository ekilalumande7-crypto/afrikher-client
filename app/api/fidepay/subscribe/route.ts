import { NextResponse } from 'next/server';
import { getServiceRoleClient } from '@/lib/supabase';
import {
  createPayment,
  createPendingTransaction,
  generateTransactionId,
  syncTransactionId,
} from '@/lib/fidepay';
import { requireAuth } from '@/lib/auth-helpers';

export async function POST(request: Request) {
  try {
    const authResult = await requireAuth(request);
    if (authResult.status === 401) {
      return NextResponse.json(
        { error: authResult.error },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { plan } = body;

    if (!plan || !['monthly', 'annual'].includes(plan)) {
      return NextResponse.json(
        { error: 'Valid plan (monthly or annual) is required' },
        { status: 400 }
      );
    }

    const supabase = getServiceRoleClient();
    const userId = authResult.user?.id;
    const userEmail = authResult.user?.email || null;

    // Load pricing from site_config (CMS-driven)
    const { data: configRows } = await supabase
      .from('site_config')
      .select('key, value')
      .like('key', 'sub_%');

    const configMap: Record<string, string> = {};
    configRows?.forEach((row: { key: string; value: string }) => {
      configMap[row.key] = row.value || '';
    });

    const priceKey = plan === 'monthly' ? 'sub_monthly_price' : 'sub_annual_price';
    const priceStr = configMap[priceKey];
    const amount = priceStr ? parseFloat(priceStr.replace(',', '.')) : NaN;

    if (!amount || isNaN(amount) || amount <= 0) {
      return NextResponse.json(
        { error: 'Plan not available' },
        { status: 400 }
      );
    }

    // Check existing active subscription (by user_id OR customer_email)
    const { data: existingByUser } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .maybeSingle();

    if (existingByUser) {
      return NextResponse.json(
        { error: 'You already have an active subscription' },
        { status: 400 }
      );
    }

    if (userEmail) {
      const { data: existingByEmail } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('customer_email', userEmail)
        .eq('status', 'active')
        .maybeSingle();

      if (existingByEmail) {
        return NextResponse.json(
          { error: 'You already have an active subscription' },
          { status: 400 }
        );
      }
    }

    // Create subscription record (linked to both user_id and email)
    const periodDays = plan === 'annual' ? 365 : 30;
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .insert({
        user_id: userId,
        customer_email: userEmail,
        plan,
        status: 'trialing',
        amount,
        currency: 'EUR',
        current_period_start: new Date().toISOString(),
        current_period_end: new Date(Date.now() + periodDays * 24 * 60 * 60 * 1000).toISOString(),
      })
      .select()
      .single();

    if (subError || !subscription) {
      console.error('Subscription insert error:', subError);
      return NextResponse.json(
        { error: 'Failed to create subscription' },
        { status: 500 }
      );
    }

    // Create transaction record before calling FIDEPAY
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://afrikher.com';
    const transactionId = generateTransactionId();

    await createPendingTransaction({
      transactionId,
      userId,
      type: 'subscription',
      itemId: subscription.id,
      amount,
    });

    try {
      const payment = await createPayment({
        amount,
        currency: 'EUR',
        transaction_id: transactionId,
        description: `AFRIKHER Abo ${plan}`,
        ipn_url: `${siteUrl}/api/fidepay/webhook`,
        success_url: `${siteUrl}/abonnement/merci?subscription=${subscription.id}`,
        cancel_url: `${siteUrl}/abonnement`,
      });

      const fidepayTransactionId = payment.transaction_id || transactionId;
      await syncTransactionId(transactionId, fidepayTransactionId);

      await supabase
        .from('subscriptions')
        .update({
          fidepay_sub_id: fidepayTransactionId,
        })
        .eq('id', subscription.id);

      const paymentUrl = payment.checkout_url || payment.payment_url || null;

      return NextResponse.json({
        success: true,
        subscription,
        paymentUrl,
        checkout_url: paymentUrl,
      });
    } catch (fidepayError) {
      console.error('FidePay error:', fidepayError);

      await supabase
        .from('subscriptions')
        .delete()
        .eq('id', subscription.id);

      return NextResponse.json(
        { error: 'Payment service unavailable' },
        { status: 503 }
      );
    }
  } catch (error) {
    console.error('POST /api/fidepay/subscribe error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
