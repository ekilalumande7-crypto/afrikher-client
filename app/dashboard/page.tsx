import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import DashboardClient from '@/components/dashboard/DashboardClient';

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect('/auth/connexion');
  }

  let { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  if (!profile) {
    const { data: newProfile } = await supabase
      .from('profiles')
      .insert([
        {
          id: user.id,
          full_name: user.user_metadata?.full_name || '',
          avatar_url: user.user_metadata?.avatar_url || null,
          newsletter_subscribed: true,
        },
      ])
      .select()
      .maybeSingle();

    profile = newProfile;
  }

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <DashboardClient
      user={user}
      profile={profile}
      subscription={subscription}
      orders={orders || []}
    />
  );
}
