import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

const PLANS = {
  monthly: {
    priceId: process.env.STRIPE_MONTHLY_PRICE_ID || 'price_monthly',
    amount: 999,
  },
  annual: {
    priceId: process.env.STRIPE_ANNUAL_PRICE_ID || 'price_annual',
    amount: 9999,
  },
};

export async function POST(request: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-02-24.acacia',
  });

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const { plan } = await request.json();

    if (!plan || !['monthly', 'annual'].includes(plan)) {
      return NextResponse.json(
        { error: 'Plan invalide' },
        { status: 400 }
      );
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .maybeSingle();

    let customerId = profile?.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          userId: user.id,
        },
      });
      customerId = customer.id;

      await supabase
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', user.id);
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: PLANS[plan as keyof typeof PLANS].priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?subscription=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/abonnements?subscription=cancelled`,
      metadata: {
        userId: user.id,
        plan,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Stripe subscription error:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue' },
      { status: 500 }
    );
  }
}
