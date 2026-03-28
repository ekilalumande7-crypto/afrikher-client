'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, ShoppingBag, CreditCard, LogOut } from 'lucide-react';
import AfrikherButton from '@/components/ui/afrikher-button';
import AfrikherCard from '@/components/ui/afrikher-card';
import { createClient } from '@/lib/supabase/client';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    setUser({ email: 'client@afrikher.com' });
    setProfile({ full_name: 'Client AFRIKHER', role: 'client' });
    setLoading(false);
  }, [router]);

  const handleLogout = async () => {
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-afrikher-cream flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-afrikher-gold border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-afrikher-cream">
      <section className="bg-afrikher-dark text-afrikher-cream py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Bonjour, {profile?.full_name || 'Bienvenue'}
          </h1>
          <p className="font-sans text-afrikher-gray">Gérez votre compte et vos abonnements</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <AfrikherCard className="p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-afrikher-gold rounded-full flex items-center justify-center mr-4">
                <User className="w-6 h-6 text-afrikher-dark" />
              </div>
              <div>
                <h3 className="font-display text-xl font-semibold text-afrikher-dark">Profil</h3>
              </div>
            </div>
            <p className="font-sans text-sm text-afrikher-gray mb-2">
              <strong>Email:</strong> {user?.email}
            </p>
            <p className="font-sans text-sm text-afrikher-gray">
              <strong>Rôle:</strong> {profile?.role || 'reader'}
            </p>
          </AfrikherCard>

          <AfrikherCard className="p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-afrikher-gold rounded-full flex items-center justify-center mr-4">
                <CreditCard className="w-6 h-6 text-afrikher-dark" />
              </div>
              <div>
                <h3 className="font-display text-xl font-semibold text-afrikher-dark">Abonnement</h3>
              </div>
            </div>
            {subscription?.status === 'active' ? (
              <>
                <p className="font-sans text-sm text-afrikher-gray mb-2">
                  <strong>Plan:</strong> {subscription.plan === 'monthly' ? 'Mensuel' : 'Annuel'}
                </p>
                <p className="font-sans text-sm text-afrikher-gray">
                  <strong>Fin:</strong> {new Date(subscription.current_period_end).toLocaleDateString('fr-FR')}
                </p>
              </>
            ) : (
              <p className="font-sans text-sm text-afrikher-gray">Aucun abonnement actif</p>
            )}
          </AfrikherCard>

          <AfrikherCard className="p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-afrikher-gold rounded-full flex items-center justify-center mr-4">
                <ShoppingBag className="w-6 h-6 text-afrikher-dark" />
              </div>
              <div>
                <h3 className="font-display text-xl font-semibold text-afrikher-dark">Commandes</h3>
              </div>
            </div>
            <p className="font-sans text-sm text-afrikher-gray">
              {orders.length} commande{orders.length > 1 ? 's' : ''}
            </p>
          </AfrikherCard>
        </div>

        {orders.length > 0 && (
          <AfrikherCard className="p-6">
            <h3 className="font-display text-2xl font-semibold text-afrikher-dark mb-6">
              Dernières Commandes
            </h3>
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between py-4 border-b border-afrikher-gray"
                >
                  <div>
                    <p className="font-sans font-medium text-afrikher-dark">
                      Commande #{order.id.substring(0, 8)}
                    </p>
                    <p className="font-sans text-sm text-afrikher-gray">
                      {new Date(order.created_at).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-sans font-bold text-afrikher-gold">{order.total.toFixed(2)} €</p>
                    <p className="font-sans text-sm text-afrikher-gray capitalize">{order.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </AfrikherCard>
        )}

        <div className="mt-8 text-center">
          <AfrikherButton variant="dark" size="lg" onClick={handleLogout}>
            <LogOut className="w-5 h-5 mr-2" />
            Se déconnecter
          </AfrikherButton>
        </div>
      </section>
    </div>
  );
}
