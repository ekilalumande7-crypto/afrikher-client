'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check } from 'lucide-react';
import AfrikherButton from '@/components/ui/afrikher-button';
import AfrikherCard from '@/components/ui/afrikher-card';
import { createClient } from '@/lib/supabase/client';

const plans = [
  {
    name: 'Mensuel',
    price: 9.99,
    interval: 'mois',
    plan: 'monthly',
    features: [
      'Accès illimité au journal',
      'Contenus exclusifs',
      'Newsletter hebdomadaire',
      'Accès prioritaire aux événements',
      'Réductions boutique 10%',
    ],
  },
  {
    name: 'Annuel',
    price: 99.99,
    interval: 'an',
    plan: 'annual',
    featured: true,
    features: [
      'Tout le plan mensuel',
      'Économisez 17%',
      'Masterclasses exclusives',
      'Réseau privé de membres',
      'Réductions boutique 20%',
      'Cadeaux exclusifs',
    ],
  },
];

export default function AbonnementsPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
        setSubscription(data);
      }
    };

    fetchUser();
  }, []);

  const handleSubscribe = async (plan: string) => {
    if (!user) {
      router.push('/auth/login?redirect=/abonnements');
      return;
    }

    setLoading(plan);

    try {
      const response = await fetch('/api/stripe/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        setLoading(null);
      }
    } catch (error) {
      console.error('Subscription error:', error);
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-afrikher-cream">
      <section className="bg-afrikher-dark text-afrikher-cream py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display text-5xl md:text-6xl font-bold mb-6">
            Abonnements
          </h1>
          <p className="font-sans text-lg text-afrikher-gray max-w-2xl mx-auto">
            Rejoignez notre communauté exclusive et accédez à des contenus premium,
            des événements privés et bien plus encore.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {subscription && subscription.status === 'active' && (
          <div className="mb-12 p-6 bg-green-50 border-2 border-green-200 rounded">
            <h3 className="font-display text-xl font-semibold text-green-800 mb-2">
              Abonnement Actif
            </h3>
            <p className="font-sans text-sm text-green-700">
              Votre abonnement {subscription.plan === 'monthly' ? 'mensuel' : 'annuel'} est actif.
              Période en cours jusqu&apos;au{' '}
              {new Date(subscription.current_period_end).toLocaleDateString('fr-FR')}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <AfrikherCard
              key={plan.plan}
              className={`relative p-8 ${
                plan.featured ? 'border-4 border-afrikher-gold' : ''
              }`}
            >
              {plan.featured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-afrikher-gold px-4 py-1">
                  <span className="font-sans text-xs uppercase tracking-wide text-afrikher-dark font-bold">
                    Meilleur choix
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="font-display text-3xl font-bold text-afrikher-dark mb-4">
                  {plan.name}
                </h3>
                <div className="flex items-baseline justify-center mb-2">
                  <span className="font-display text-5xl font-bold text-afrikher-gold">
                    {plan.price}€
                  </span>
                  <span className="font-sans text-afrikher-gray ml-2">/ {plan.interval}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="w-5 h-5 text-afrikher-gold mr-3 flex-shrink-0 mt-0.5" />
                    <span className="font-sans text-sm text-afrikher-charcoal">{feature}</span>
                  </li>
                ))}
              </ul>

              <AfrikherButton
                variant={plan.featured ? 'gold' : 'outline'}
                size="lg"
                className="w-full"
                onClick={() => handleSubscribe(plan.plan)}
                disabled={loading !== null || (subscription?.status === 'active')}
              >
                {loading === plan.plan
                  ? 'Redirection...'
                  : subscription?.status === 'active'
                  ? 'Abonnement actif'
                  : 'S\'abonner'}
              </AfrikherButton>
            </AfrikherCard>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="font-sans text-sm text-afrikher-gray">
            Questions sur les abonnements ? Contactez-nous à{' '}
            <a href="mailto:contact@afrikher.com" className="text-afrikher-gold hover:underline">
              contact@afrikher.com
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
