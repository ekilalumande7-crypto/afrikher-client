'use client';

import Link from 'next/link';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ShoppingBag } from 'lucide-react';
import AfrikherButton from '@/components/ui/afrikher-button';

interface OrdersSectionProps {
  orders: any[];
}

export default function OrdersSection({ orders }: OrdersSectionProps) {
  return (
    <div id="commandes" className="mb-12 scroll-mt-8">
      <h2
        className="font-sans text-xs tracking-[0.2em] uppercase mb-6"
        style={{ color: '#C9A84C' }}
      >
        — MES COMMANDES
      </h2>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingBag
            className="w-16 h-16 mx-auto mb-4 opacity-30"
            style={{ color: '#9A9A8A' }}
          />
          <p
            className="font-sans text-sm mb-6"
            style={{ color: '#9A9A8A' }}
          >
            Vous n'avez pas encore de commandes.
          </p>
          <Link href="/boutique">
            <AfrikherButton variant="gold" size="lg">
              DÉCOUVRIR LA BOUTIQUE
            </AfrikherButton>
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr
                className="border-b"
                style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}
              >
                <th
                  className="font-sans text-xs tracking-wider uppercase text-left pb-3"
                  style={{ color: '#9A9A8A' }}
                >
                  Date
                </th>
                <th
                  className="font-sans text-xs tracking-wider uppercase text-left pb-3"
                  style={{ color: '#9A9A8A' }}
                >
                  Produit
                </th>
                <th
                  className="font-sans text-xs tracking-wider uppercase text-right pb-3"
                  style={{ color: '#9A9A8A' }}
                >
                  Montant
                </th>
                <th
                  className="font-sans text-xs tracking-wider uppercase text-right pb-3"
                  style={{ color: '#9A9A8A' }}
                >
                  Statut
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b"
                  style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}
                >
                  <td className="py-4">
                    <span
                      className="font-sans text-sm"
                      style={{ color: '#F5F0E8' }}
                    >
                      {format(new Date(order.created_at), 'dd MMM yyyy', {
                        locale: fr,
                      })}
                    </span>
                  </td>
                  <td className="py-4">
                    <span
                      className="font-sans text-sm"
                      style={{ color: '#F5F0E8' }}
                    >
                      {getOrderItemsDescription(order.items)}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <span
                      className="font-sans text-sm font-semibold"
                      style={{ color: '#C9A84C' }}
                    >
                      {order.total.toFixed(2)} €
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <StatusBadge status={order.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const statusConfig: Record<
    string,
    { label: string; color: string; bg: string }
  > = {
    pending: {
      label: 'En attente',
      color: '#F5F0E8',
      bg: 'rgba(255, 255, 255, 0.08)',
    },
    processing: {
      label: 'En cours',
      color: '#C9A84C',
      bg: 'rgba(201, 168, 76, 0.1)',
    },
    completed: {
      label: 'Livré',
      color: '#4CAF50',
      bg: 'rgba(76, 175, 80, 0.1)',
    },
    cancelled: {
      label: 'Annulé',
      color: '#9A9A8A',
      bg: 'rgba(154, 154, 138, 0.1)',
    },
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span
      className="inline-block px-3 py-1 font-sans text-xs tracking-wider uppercase"
      style={{
        color: config.color,
        backgroundColor: config.bg,
      }}
    >
      {config.label}
    </span>
  );
}

function getOrderItemsDescription(items: any): string {
  if (!items || !Array.isArray(items) || items.length === 0) {
    return 'Commande';
  }

  if (items.length === 1) {
    return items[0].name || 'Produit';
  }

  return `${items.length} produits`;
}
