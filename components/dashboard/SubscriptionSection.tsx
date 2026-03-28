'use client';

import Link from 'next/link';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CreditCard, Check } from 'lucide-react';
import AfrikherButton from '@/components/ui/afrikher-button';
import AfrikherBadge from '@/components/ui/afrikher-badge';

interface SubscriptionSectionProps {
  subscription: any;
}

export default function SubscriptionSection({
  subscription,
}: SubscriptionSectionProps) {
  const isActive = subscription?.status === 'active';
  const isTrialing = subscription?.status === 'trialing';

  return (
    <div className="mb-12">
      <h2
        className="font-sans text-xs tracking-[0.2em] uppercase mb-6"
        style={{ color: '#C9A84C' }}
      >
        — MON ABONNEMENT
      </h2>

      {!subscription || (!isActive && !isTrialing) ? (
        <div className="text-center py-12">
          <CreditCard
            className="w-16 h-16 mx-auto mb-4 opacity-30"
            style={{ color: '#9A9A8A' }}
          />
          <p
            className="font-sans text-sm mb-2"
            style={{ color: '#9A9A8A' }}
          >
            Vous n'êtes pas encore abonné.
          </p>
          <p
            className="font-sans text-xs mb-6"
            style={{ color: '#9A9A8A' }}
          >
            Accédez à l'ensemble de nos contenus exclusifs et bien plus encore.
          </p>
          <Link href="/abonnements">
            <AfrikherButton variant="gold" size="lg">
              VOIR LES OFFRES
            </AfrikherButton>
          </Link>
        </div>
      ) : (
        <div
          className="p-8 border border-white/[0.08]"
          style={{
            backgroundColor: '#111111',
            borderTopColor: '#C9A84C',
            borderTopWidth: '2px',
          }}
        >
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h3
                  className="font-display text-2xl"
                  style={{ color: '#F5F0E8' }}
                >
                  {subscription.plan === 'monthly'
                    ? 'Abonnement Mensuel'
                    : 'Abonnement Annuel'}
                </h3>
                <AfrikherBadge variant="gold">
                  {isTrialing ? 'Essai' : 'Actif'}
                </AfrikherBadge>
              </div>
              <p
                className="font-sans text-sm"
                style={{ color: '#9A9A8A' }}
              >
                {subscription.plan === 'monthly'
                  ? '5,99 € / mois'
                  : '49,99 € / an'}
              </p>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <FeatureItem text="Accès illimité à tous les articles" />
            <FeatureItem text="Contenus exclusifs réservés aux abonnés" />
            <FeatureItem text="Newsletter premium hebdomadaire" />
            <FeatureItem text="Réductions sur la boutique" />
          </div>

          {subscription.current_period_end && (
            <div
              className="pt-4 border-t"
              style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}
            >
              <p
                className="font-sans text-xs"
                style={{ color: '#9A9A8A' }}
              >
                Prochain renouvellement le{' '}
                <span style={{ color: '#F5F0E8' }}>
                  {format(
                    new Date(subscription.current_period_end),
                    'dd MMMM yyyy',
                    { locale: fr }
                  )}
                </span>
              </p>
            </div>
          )}

          <div className="mt-6">
            <AfrikherButton
              variant="outline"
              size="md"
              onClick={() => alert('Gestion des abonnements à venir')}
            >
              GÉRER MON ABONNEMENT
            </AfrikherButton>
          </div>
        </div>
      )}
    </div>
  );
}

function FeatureItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <Check className="w-4 h-4 flex-shrink-0" style={{ color: '#C9A84C' }} />
      <span
        className="font-sans text-sm"
        style={{ color: '#F5F0E8' }}
      >
        {text}
      </span>
    </div>
  );
}
