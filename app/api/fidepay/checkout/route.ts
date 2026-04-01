import { NextResponse } from 'next/server';
import { getServiceRoleClient } from '@/lib/supabase';
import { createPayment } from '@/lib/fidepay';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      items,
      amount,
      currency = 'EUR',
      customer_name,
      customer_email,
      shipping_address,
    } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Items are required' },
        { status: 400 }
      );
    }

    // Calculate amount from items if not provided
    const calculatedAmount = amount || items.reduce(
      (sum: number, item: any) => sum + (item.price * (item.qty || 1)),
      0
    );

    if (!calculatedAmount || calculatedAmount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }

    if (!customer_email) {
      return NextResponse.json(
        { error: 'Customer email is required' },
        { status: 400 }
      );
    }

    // Require authentication - guest checkout not allowed
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    let userId = null;
    try {
      const { getAuthUser } = await import('@/lib/auth-helpers');
      const authResult = await getAuthUser(request);
      if (!authResult?.user?.id) {
        return NextResponse.json(
          { error: 'Invalid authentication' },
          { status: 401 }
        );
      }
      userId = authResult.user.id;
    } catch (authError) {
      console.error('Auth error:', authError);
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 401 }
      );
    }

    const supabase = getServiceRoleClient();

    // Create order record
    const orderData: Record<string, any> = {
      items,
      total: calculatedAmount,
      status: 'pending',
      customer_email,
      user_id: userId, // Now always required (authenticated users only)
      shipping_address: shipping_address || {
        full_name: customer_name || '',
        phone: body.customer_phone || '',
      },
    };

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert(orderData)
      .select()
      .single();

    if (orderError || !order) {
      console.error('Order creation error:', orderError);
      return NextResponse.json(
        { error: `Failed to create order: ${orderError?.message || 'unknown error'}`, details: orderError },
        { status: 500 }
      );
    }

    // Create FidePay payment session
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://afrikher-client.vercel.app';
    // FIDEPAY requires transaction_id <= 12 chars
    const shortId = order.id.replace(/-/g, '').substring(0, 12).toUpperCase();
    const transactionId = shortId;

    try {
      const payment = await createPayment({
        amount: calculatedAmount,
        currency,
        transaction_id: transactionId,
        description: `AFRIKHER Commande`,
        ipn_url: `${siteUrl}/api/fidepay/webhook`,
        success_url: `${siteUrl}/boutique/merci?order=${order.id}`,
        cancel_url: `${siteUrl}/boutique`,
        customer_name: customer_name || '',
        customer_email: customer_email || '',
      });

      // Extract transaction ID from FIDEPAY response (may be nested)
      const paymentTxId = payment.transaction_id
        || payment.data?.transaction_id
        || payment.result?.transaction_id
        || transactionId; // fallback to our generated ID

      const paymentUrl = payment.checkout_url
        || payment.payment_url
        || payment.data?.checkout_url
        || payment.data?.payment_url
        || payment.result?.checkout_url
        || payment.result?.payment_url;

      console.log('FIDEPAY response:', JSON.stringify(payment).substring(0, 500));
      console.log('Extracted txId:', paymentTxId, 'paymentUrl:', paymentUrl);

      // Update order with FidePay data
      await supabase
        .from('orders')
        .update({
          fidepay_payment_id: paymentTxId,
          fidepay_payment_url: paymentUrl || '',
        })
        .eq('id', order.id);

      return NextResponse.json({
        success: true,
        order,
        checkout_url: paymentUrl,
      });
    } catch (fidepayError: any) {
      console.error('FidePay error:', fidepayError);

      // Update order status to failed
      await supabase
        .from('orders')
        .update({ status: 'cancelled' })
        .eq('id', order.id);

      return NextResponse.json(
        { error: `Payment service error: ${fidepayError.message}` },
        { status: 503 }
      );
    }
  } catch (error: any) {
    console.error('POST /api/fidepay/checkout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
