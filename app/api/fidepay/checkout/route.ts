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

    // Try to get user from auth header (optional - allows guest checkout)
    let userId = null;
    const authHeader = request.headers.get('Authorization');
    if (authHeader?.startsWith('Bearer ')) {
      try {
        const { getAuthUser } = await import('@/lib/auth-helpers');
        const authResult = await getAuthUser(request);
        if (authResult?.user?.id) {
          userId = authResult.user.id;
        }
      } catch {
        // Guest checkout - no user ID
      }
    }

    const supabase = getServiceRoleClient();

    // Create order record
    const orderData: Record<string, any> = {
      items,
      total: calculatedAmount,
      status: 'pending',
      customer_email,
      shipping_address: shipping_address || null,
    };
    // Only include user_id if we have one (guest checkout = no user_id)
    if (userId) {
      orderData.user_id = userId;
    }

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
    const transactionId = `ORDER_${order.id}`;

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
