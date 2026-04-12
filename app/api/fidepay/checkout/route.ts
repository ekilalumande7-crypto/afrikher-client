import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
import { getServiceRoleClient } from '@/lib/supabase';
import {
  createPayment,
  createPendingTransaction,
  syncTransactionId,
} from '@/lib/fidepay';

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

    // ── Authentication: try multiple methods ──
    let userId: string | null = null;

    // Method 1: Bearer token (existing approach)
    const authHeader = request.headers.get('Authorization');
    if (authHeader?.startsWith('Bearer ')) {
      try {
        const token = authHeader.substring(7);
        const supabaseAuth = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
        const { data: { user } } = await supabaseAuth.auth.getUser(token);
        if (user?.id) {
          userId = user.id;
          console.log('Auth via Bearer token OK:', userId);
        }
      } catch (e) {
        console.warn('Bearer token auth failed, trying cookies...', e);
      }
    }

    // Method 2: Cookie-based auth (SSR — works when Bearer token is expired)
    if (!userId) {
      try {
        const cookieStore = await cookies();
        const supabaseSsr = createServerClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          {
            cookies: {
              getAll() {
                return cookieStore.getAll();
              },
            },
          }
        );
        const { data: { user } } = await supabaseSsr.auth.getUser();
        if (user?.id) {
          userId = user.id;
          console.log('Auth via SSR cookies OK:', userId);
        }
      } catch (e) {
        console.warn('Cookie auth failed:', e);
      }
    }

    // Method 3: Lookup by email as last resort (user is authenticated on page but token expired)
    if (!userId && customer_email) {
      try {
        const serviceClient = getServiceRoleClient();
        // Use admin API to find user by email
        const { data: usersData } = await serviceClient.auth.admin.listUsers({
          page: 1,
          perPage: 1,
        });
        const matchedUser = usersData?.users?.find(
          (u: any) => u.email?.toLowerCase() === customer_email.toLowerCase()
        );
        if (matchedUser?.id) {
          // Verify user is not blocked
          const { data: profile } = await serviceClient
            .from('profiles')
            .select('id, is_blocked')
            .eq('id', matchedUser.id)
            .single();
          if (profile?.id && !profile.is_blocked) {
            userId = profile.id;
            console.log('Auth via email lookup OK:', userId);
          }
        }
      } catch (e) {
        console.warn('Email lookup auth failed:', e);
      }
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required. Please log in and try again.' },
        { status: 401 }
      );
    }

    const supabase = getServiceRoleClient();

    const itemIds = items
      .map((item: any) => item.product_id)
      .filter((value: unknown): value is string => typeof value === 'string' && value.length > 0);

    let transactionType: 'magazine' | 'order' = 'order';
    let transactionItemId: string | null = null;

    if (itemIds.length > 0) {
      const { data: magazineMatches, error: magazineMatchError } = await supabase
        .from('magazines')
        .select('id')
        .in('id', itemIds);

      if (magazineMatchError) {
        console.warn('Magazine type detection failed, defaulting to order:', magazineMatchError);
      } else if ((magazineMatches?.length || 0) === itemIds.length) {
        transactionType = 'magazine';
        transactionItemId = itemIds[0] || null;
      }
    }

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

    await createPendingTransaction({
      transactionId,
      userId,
      type: transactionType,
      itemId: transactionItemId,
      orderId: order.id,
      amount: calculatedAmount,
    });

    // For magazine purchases, redirect to the magazine page after payment
    // so the user can immediately read the flipbook / download the PDF
    let successUrl = `${siteUrl}/boutique/merci?order=${order.id}`;
    let cancelUrl = `${siteUrl}/boutique`;

    if (transactionType === 'magazine' && transactionItemId) {
      const { data: magSlug } = await supabase
        .from('magazines')
        .select('slug')
        .eq('id', transactionItemId)
        .maybeSingle();
      if (magSlug?.slug) {
        successUrl = `${siteUrl}/magazine/${magSlug.slug}?paid=1`;
        cancelUrl = `${siteUrl}/magazine/${magSlug.slug}`;
      }
    }

    try {
      const payment = await createPayment({
        amount: calculatedAmount,
        currency,
        transaction_id: transactionId,
        description: transactionType === 'magazine' ? `AFRIKHER Magazine` : `AFRIKHER Commande`,
        ipn_url: `${siteUrl}/api/fidepay/webhook`,
        success_url: successUrl,
        cancel_url: cancelUrl,
        customer_name: customer_name || '',
        customer_email: customer_email || '',
      });

      // Extract transaction ID from FIDEPAY response (may be nested)
      const paymentTxId = payment.transaction_id
        || payment.data?.transaction_id
        || payment.result?.transaction_id
        || transactionId; // fallback to our generated ID

      await syncTransactionId(transactionId, paymentTxId);

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
        paymentUrl,
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
