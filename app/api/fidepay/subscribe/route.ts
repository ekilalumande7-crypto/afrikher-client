import { NextResponse } from 'next/server';
import { getServiceRoleClient } from '@/lib/supabase';
import { createPayment } from '@/lib/fidepay';
import { requireAuth } from '@/lib/auth-helpers';

interface SubscriptionPlanPricing {
  monthly: number;
  annual: number;
}

const SUBSCRIPTION_PRICING: SubscriptionPlanPricing = {
  monthly: 9.99,
  annual: 99.90,
};

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
    const amount = SUBSCRIPTION_PRICING[plan as keyof SubscriptionPlanPricing];

    // Check if user already has an active subscription
    const { data: existingSubscription } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();

    if (existingSubscription) {
      return NextResponse.json(
        { error: 'You already have an active subscription' },
        { status: 400 }
      );
    }

    // Create subscription record
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .insert({
        user_id: userId,
        plan,
        status: 'trialing',
        amount,
        currency: 'EUR',
        current_period_start: new Date().toISOString(),
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      })
      .select()
      .single();

    if (subError || !subscription) {
      return NextResponse.json(
        { error: 'Failed to create subscription' },
        { status: 500 }
      );
    }

    // Create FidePay payment
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://afrikher.com';
    const transactionId = `SUB_${subscription.id}_${plan}`;

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

      // Update subscription with FidePay data
      await supabase
        .from('subscriptions')
        .update({
          fidepay_sub_id: payment.transaction_id,
        })
        .eq('id', subscription.id);

      return NextResponse.json({
        success: true,
        subscription,
        checkout_url: payment.checkout_url || payment.payment_url,
      });
    } catch (fidepayError) {
      console.error('FidePay error:', fidepayError);

      // Delete the subscription if payment creation failed
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
