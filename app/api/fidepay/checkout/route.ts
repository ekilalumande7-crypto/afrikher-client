import { NextResponse } from 'next/server';
import { getServiceRoleClient } from '@/lib/supabase';
import { createPayment } from '@/lib/fidepay';
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
    const { items, amount, currency = 'EUR' } = body;

    if (!items || !amount) {
      return NextResponse.json(
        { error: 'Items and amount are required' },
        { status: 400 }
      );
    }

    const supabase = getServiceRoleClient();
    const userId = authResult.user?.id;

    // Create order record
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        items,
        total: amount,
        status: 'pending',
        customer_email: authResult.user?.email,
      })
      .select()
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        { error: 'Failed to create order' },
        { status: 500 }
      );
    }

    // Create FidePay payment session
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://afrikher.com';
    const transactionId = `ORDER_${order.id}`;

    try {
      const payment = await createPayment({
        amount: amount * 100, // Convert to cents
        currency,
        transaction_id: transactionId,
        description: `AFRIKHER Order #${order.id}`,
        ipn_url: `${siteUrl}/api/fidepay/webhook`,
        success_url: `${siteUrl}/boutique/merci?order=${order.id}`,
        cancel_url: `${siteUrl}/boutique`,
      });

      // Update order with FidePay data
      await supabase
        .from('orders')
        .update({
          fidepay_payment_id: payment.transaction_id,
          fidepay_payment_url: payment.checkout_url || payment.payment_url,
        })
        .eq('id', order.id);

      return NextResponse.json({
        success: true,
        order,
        checkout_url: payment.checkout_url || payment.payment_url,
      });
    } catch (fidepayError) {
      console.error('FidePay error:', fidepayError);

      // Update order status to failed
      await supabase
        .from('orders')
        .update({ status: 'cancelled' })
        .eq('id', order.id);

      return NextResponse.json(
        { error: 'Payment service unavailable' },
        { status: 503 }
      );
    }
  } catch (error) {
    console.error('POST /api/fidepay/checkout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
