'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, ArrowUpRight, ChevronDown } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const plans = [
  {
    name: 'Mensuel',
    price: 9.99,
    interval: '/mois',
    plan: 'monthly',
    description: 'Paiement mensuel',
    features: [
      'Accès illimité au magazine',
      'Contenus exclusifs premium',
      'Newsletter hebdomadaire',
      'Accès prioritaire aux événements',
      'Réductions boutique 10%',
    ],
    goodFor: 'Nouvelles abonnées, pour essayer',
  },
  {
    name: 'Concierge+',
    price: 99.99,
    interval: '/an',
    plan: 'annual',
    featured: true,
    description: 'Abonnement annuel',
    features: [
      'Paiement une fois par an',
      'Contenus exclusifs premium',
      'Accès illimité au magazine',
      'Sessions d\'interview exclusives',
      'Accès aux masterclasses',
      'Support personnalisé',
      'Économisez 17%',
      'Garantie satisfaction',
    ],
    goodFor: 'Entrepreneuses établies, communauté active',
  },
  {
    name: 'Enterprise',
    price: null,
    interval: '',
    plan: 'enterprise',
    description: 'Solution sur mesure',
    features: [
      'Licences multiples (20+/mois)',
      'Support prioritaire dédié',
      'Contenu personnalisé',
      'Formation exclusive',
    ],
    goodFor: 'Organisations, réseaux d\'entrepreneuses',
    isEnterprise: true,
  },
];

const faqs = [
  {
    category: 'Abonnement',
    question: 'Puis-je annuler mon abonnement à tout moment ?',
    answer: 'Oui, vous pouvez annuler votre abonnement à tout moment. Aucun frais caché, aucune surprise. Votre accès restera actif jusqu\'à la fin de votre période de facturation.',
  },
  {
    category: 'Abonnement',
    question: 'Quels modes de paiement acceptez-vous ?',
    answer: 'Nous acceptons toutes les cartes de crédit principales (Visa, Mastercard, American Express) ainsi que les paiements via mobile money pour nos abonnées africaines.',
  },
  {
    category: 'Fonctionnalités',
    question: 'Puis-je accéder aux archives du magazine ?',
    answer: 'Oui, tous nos abonnés ont accès à l\'intégralité de nos archives depuis le lancement d\'AFRIKHER.',
  },
  {
    category: 'Fonctionnalités',
    question: 'Y a-t-il des événements exclusifs pour les abonnées ?',
    answer: 'Absolument ! Nos abonnées ont accès à des événements networking, des masterclasses et des rencontres avec des entrepreneures inspirantes.',
  },
];

export default function AbonnementsPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [activeCategory, setActiveCategory] = useState('Abonnement');
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

  const handleContactEnterprise = () => {
    router.push('/contact');
  };

  const categories = Array.from(new Set(faqs.map(faq => faq.category)));
  const filteredFaqs = faqs.filter(faq => faq.category === activeCategory);

  return (
    <div className="min-h-screen bg-white">
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-4">
            <span className="inline-block bg-afrikher-gold px-4 py-2 font-sans text-xs uppercase tracking-wider text-afrikher-dark font-semibold">
              Tarifs
            </span>
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-bold text-afrikher-dark mb-4">
            Simple &{' '}
            <span className="text-afrikher-gold" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Transparent
            </span>
          </h1>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        {subscription && subscription.status === 'active' && (
          <div className="mb-12 p-6 bg-green-50 border-l-4 border-green-500">
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.plan}
              className={`relative border ${
                plan.featured
                  ? 'bg-afrikher-dark text-afrikher-cream border-afrikher-dark'
                  : 'bg-white text-afrikher-dark border-gray-200'
              } transition-all duration-300 hover:shadow-xl`}
            >
              <div className="p-8">
                <div className="mb-8">
                  <h3 className={`font-sans text-sm mb-4 ${plan.featured ? 'text-afrikher-cream' : 'text-afrikher-gray'}`}>
                    {plan.description}
                  </h3>
                  <div className="flex items-baseline mb-2">
                    {plan.price ? (
                      <>
                        <span className="font-display text-6xl font-bold">
                          ${plan.price}
                        </span>
                        <span className={`font-sans text-lg ml-1 ${plan.featured ? 'text-afrikher-cream/70' : 'text-afrikher-gray'}`}>
                          {plan.interval}
                        </span>
                      </>
                    ) : (
                      <span className="font-display text-5xl font-bold">
                        {plan.name}
                      </span>
                    )}
                  </div>
                  {!plan.isEnterprise && (
                    <h2 className={`font-display text-2xl font-bold mt-2 ${plan.featured ? 'text-afrikher-cream' : 'text-afrikher-dark'}`}>
                      {plan.name}
                    </h2>
                  )}
                </div>

                <div className="mb-8">
                  <h4 className={`font-sans text-sm font-semibold mb-4 ${plan.featured ? 'text-afrikher-cream' : 'text-afrikher-dark'}`}>
                    Ce que vous obtenez :
                  </h4>
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className={`w-5 h-5 mr-3 flex-shrink-0 mt-0.5 ${plan.featured ? 'text-afrikher-gold' : 'text-afrikher-dark'}`} />
                        <span className={`font-sans text-sm ${plan.featured ? 'text-afrikher-cream/90' : 'text-afrikher-gray'}`}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {plan.goodFor && (
                  <div className="mb-8">
                    <h4 className={`font-sans text-sm font-semibold mb-2 ${plan.featured ? 'text-afrikher-cream' : 'text-afrikher-dark'}`}>
                      Idéal pour :
                    </h4>
                    <p className={`font-sans text-sm ${plan.featured ? 'text-afrikher-cream/70' : 'text-afrikher-gray'}`}>
                      {plan.goodFor}
                    </p>
                  </div>
                )}
              </div>

              <div className="p-8 pt-0">
                <button
                  onClick={() => plan.isEnterprise ? handleContactEnterprise() : handleSubscribe(plan.plan)}
                  disabled={loading !== null || (subscription?.status === 'active' && !plan.isEnterprise)}
                  className={`relative w-full py-4 px-6 font-sans font-semibold text-sm flex items-center justify-between group overflow-hidden transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                    plan.featured
                      ? 'bg-afrikher-dark text-afrikher-cream border-2 border-afrikher-gold'
                      : 'border-2 border-afrikher-dark text-afrikher-dark hover:bg-afrikher-dark hover:text-afrikher-cream'
                  }`}
                >
                  {plan.featured && (
                    <span
                      className="absolute inset-0 animate-gold-shimmer"
                      style={{
                        background: 'linear-gradient(90deg, transparent 0%, rgba(201, 168, 76, 0.3) 45%, rgba(244, 228, 184, 0.5) 50%, rgba(201, 168, 76, 0.3) 55%, transparent 100%)',
                        backgroundSize: '200% 100%'
                      }}
                    />
                  )}
                  <span className="relative z-10">
                    {loading === plan.plan
                      ? 'Redirection...'
                      : subscription?.status === 'active' && !plan.isEnterprise
                      ? 'Abonnement actif'
                      : plan.isEnterprise
                      ? 'Contacter notre équipe'
                      : 'Choisir ce plan'}
                  </span>
                  <ArrowUpRight className="relative z-10 w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-afrikher-cream py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
            <div>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-afrikher-dark mb-4">
                Questions Fréquentes
              </h2>
            </div>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 font-sans text-sm text-afrikher-dark hover:text-afrikher-gold transition-colors duration-300 group"
            >
              Centre d'aide
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
            </a>
          </div>

          <div className="mb-8 flex gap-4 border-b border-afrikher-dark/10">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`pb-4 px-2 font-sans text-sm font-medium transition-all duration-300 ${
                  activeCategory === category
                    ? 'text-afrikher-dark border-b-2 border-afrikher-gold'
                    : 'text-afrikher-gray hover:text-afrikher-dark'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {filteredFaqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white border border-afrikher-dark/10 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-afrikher-cream/30 transition-colors duration-300"
                >
                  <span className="font-sans font-semibold text-afrikher-dark pr-8">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-afrikher-dark flex-shrink-0 transition-transform duration-300 ${
                      openFaq === index ? 'transform rotate-180' : ''
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openFaq === index ? 'max-h-96' : 'max-h-0'
                  }`}
                >
                  <div className="px-8 pb-6">
                    <p className="font-sans text-afrikher-gray leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
