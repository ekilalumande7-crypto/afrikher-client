'use client';

import { CreditCard, ShoppingBag, User } from 'lucide-react';
import Link from 'next/link';
import AfrikherBadge from '@/components/ui/afrikher-badge';

interface DashboardStatsProps {
  subscription: any;
  ordersCount: number;
  profile: any;
}

export default function DashboardStats({
  subscription,
  ordersCount,
  profile,
}: DashboardStatsProps) {
  const isActive = subscription?.status === 'active';
  const profileCompletion = calculateProfileCompletion(profile);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      <StatsCard
        icon={<CreditCard className="w-6 h-6" />}
        title="Mon Abonnement"
      >
        <div className="flex items-center gap-2 mb-2">
          <span
            className="font-sans text-sm"
            style={{ color: '#F5F0E8' }}
          >
            {isActive ? 'Actif' : 'Inactif'}
          </span>
          {isActive && <AfrikherBadge variant="gold">Premium</AfrikherBadge>}
        </div>
        {isActive && subscription?.plan && (
          <p
            className="font-sans text-xs"
            style={{ color: '#9A9A8A' }}
          >
            Plan: {subscription.plan === 'monthly' ? 'Mensuel' : 'Annuel'}
          </p>
        )}
      </StatsCard>

      <StatsCard
        icon={<ShoppingBag className="w-6 h-6" />}
        title="Mes Commandes"
      >
        <p
          className="font-sans text-2xl font-bold mb-2"
          style={{ color: '#C9A84C' }}
        >
          {ordersCount}
        </p>
        {ordersCount > 0 && (
          <Link
            href="#commandes"
            className="font-sans text-xs hover:opacity-70 transition-opacity"
            style={{ color: '#C9A84C' }}
          >
            VOIR TOUT →
          </Link>
        )}
      </StatsCard>

      <StatsCard
        icon={<User className="w-6 h-6" />}
        title="Mon Profil"
      >
        <div className="mb-2">
          <div className="flex items-center gap-2 mb-1">
            <div className="flex-1 h-1.5 bg-white/[0.08] overflow-hidden">
              <div
                className="h-full transition-all duration-300"
                style={{
                  width: `${profileCompletion}%`,
                  backgroundColor: '#C9A84C',
                }}
              />
            </div>
            <span
              className="font-sans text-xs"
              style={{ color: '#9A9A8A' }}
            >
              {profileCompletion}%
            </span>
          </div>
        </div>
        {profileCompletion < 100 && (
          <Link
            href="#profil"
            className="font-sans text-xs hover:opacity-70 transition-opacity"
            style={{ color: '#C9A84C' }}
          >
            COMPLÉTER →
          </Link>
        )}
      </StatsCard>
    </div>
  );
}

function StatsCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="p-6 border border-white/[0.08]"
      style={{
        backgroundColor: '#111111',
        borderTopColor: '#C9A84C',
        borderTopWidth: '2px',
      }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div style={{ color: '#C9A84C' }}>{icon}</div>
        <h3
          className="font-sans text-sm font-semibold tracking-wider uppercase"
          style={{ color: '#F5F0E8' }}
        >
          {title}
        </h3>
      </div>
      <div>{children}</div>
    </div>
  );
}

function calculateProfileCompletion(profile: any): number {
  if (!profile) return 0;

  let completed = 0;
  const total = 3;

  if (profile.full_name) completed++;
  if (profile.avatar_url) completed++;
  if (profile.newsletter_subscribed !== null) completed++;

  return Math.round((completed / total) * 100);
}
