import { NextResponse } from 'next/server';
import { getServiceRoleClient } from '@/lib/supabase';
import { requireAdmin } from '@/lib/auth-helpers';

export async function GET(request: Request) {
  try {
    const authResult = await requireAdmin(request);
    if (authResult.status === 401 || authResult.status === 403) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const supabase = getServiceRoleClient();

    // Get counts
    const [articles, orders, subscribers, partners, products] = await Promise.all([
      supabase
        .from('articles')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'published'),
      supabase
        .from('orders')
        .select('id, total', { count: 'exact' })
        .eq('status', 'paid'),
      supabase
        .from('newsletter_subscribers')
        .select('id', { count: 'exact', head: true })
        .eq('active', true),
      supabase
        .from('partners')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'active'),
      supabase
        .from('products')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'active'),
    ]);

    // Calculate revenue from orders
    const { data: orderData } = await supabase
      .from('orders')
      .select('total')
      .eq('status', 'paid');

    const totalRevenue = (orderData || []).reduce(
      (sum, order) => sum + (order.total || 0),
      0
    );

    // Get recent orders
    const { data: recentOrders } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    return NextResponse.json({
      success: true,
      stats: {
        articles: articles.count || 0,
        orders: orders.count || 0,
        subscribers: subscribers.count || 0,
        partners: partners.count || 0,
        products: products.count || 0,
        totalRevenue,
        recentOrders: recentOrders || [],
      },
    });
  } catch (error) {
    console.error('GET /api/admin/stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
