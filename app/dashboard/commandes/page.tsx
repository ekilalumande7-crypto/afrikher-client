"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
  BookOpen,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Download,
  Newspaper,
  Package,
  ShoppingBag,
  Truck,
} from "lucide-react";
import AccountCard from "@/components/account/AccountCard";
import AccountEmptyState from "@/components/account/AccountEmptyState";
import AccountLoadingBlock from "@/components/account/AccountLoadingBlock";
import AccountSectionHeader from "@/components/account/AccountSectionHeader";

interface OrderItem {
  product_id: string;
  name: string;
  price: number;
  qty: number;
  type?: string;
  image?: string;
}

interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  status: string;
  shipping_address: any;
  created_at: string;
  customer_email?: string;
}

const statusLabels: Record<string, { label: string; color: string; icon: any }> =
  {
    pending: {
      label: "En attente",
      color: "bg-yellow-100 text-yellow-700",
      icon: Package,
    },
    paid: {
      label: "Payé",
      color: "bg-emerald-100 text-emerald-700",
      icon: CheckCircle,
    },
    shipped: {
      label: "Expédié",
      color: "bg-blue-100 text-blue-700",
      icon: Truck,
    },
    delivered: {
      label: "Livré",
      color: "bg-emerald-200 text-emerald-800",
      icon: CheckCircle,
    },
    cancelled: {
      label: "Annulé",
      color: "bg-red-100 text-red-700",
      icon: Package,
    },
  };

export default function CommandesPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: userOrders } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      const { data: emailOrders } = await supabase
        .from("orders")
        .select("*")
        .eq("customer_email", user.email)
        .is("user_id", null)
        .order("created_at", { ascending: false });

      const allOrders = [...(userOrders || [])];
      const existingIds = new Set(allOrders.map((order) => order.id));

      for (const order of emailOrders || []) {
        if (!existingIds.has(order.id)) {
          allOrders.push(order);
          supabase
            .from("orders")
            .update({ user_id: user.id })
            .eq("id", order.id)
            .then(() => {});
        }
      }

      allOrders.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      setOrders(allOrders);
      setLoading(false);
    };
    fetchOrders();
  }, []);

  const isDigitalItem = (item: OrderItem) =>
    item.type === "magazine" || item.type === "digital" || item.type === "book";

  const canDownload = (order: Order) =>
    order.status === "paid" || order.status === "delivered";

  if (loading) {
    return <AccountLoadingBlock />;
  }

  return (
    <div className="space-y-8">
      <AccountSectionHeader
        eyebrow="Commandes"
        title="Votre historique d’achats"
        description="Retrouvez vos commandes, vos contenus téléchargeables et l’état de chaque étape avec une lecture plus claire."
      />

      <AccountCard
        eyebrow="Suivi"
        title="Mes commandes"
        description="Un espace plus lisible pour retrouver vos achats, suivre leur progression et accéder aux contenus numériques."
      >
        {orders.length === 0 ? (
          <AccountEmptyState
            icon={<Package size={42} />}
            title="Aucune commande pour le moment"
            description="Explorez la boutique AFRIKHER ou revenez vers le magazine pour découvrir les sélections et éditions disponibles."
            ctaHref="/boutique"
            ctaLabel="Visiter la boutique"
            secondaryHref="/magazine"
            secondaryLabel="Ouvrir le magazine"
          />
        ) : (
          <>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/boutique"
                className="inline-flex items-center gap-2 border border-black/8 bg-white/60 px-4 py-2.5 font-body text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#0A0A0A]/66 transition-colors hover:border-[#C9A84C] hover:text-[#C9A84C]"
              >
                <ShoppingBag size={14} />
                Boutique
              </Link>
              <Link
                href="/magazine"
                className="inline-flex items-center gap-2 border border-black/8 bg-white/60 px-4 py-2.5 font-body text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#0A0A0A]/66 transition-colors hover:border-[#C9A84C] hover:text-[#C9A84C]"
              >
                <Newspaper size={14} />
                Magazine
              </Link>
            </div>

            <div className="space-y-4">
              {orders.map((order) => {
                const status = statusLabels[order.status] || statusLabels.pending;
                const StatusIcon = status.icon;
                const isExpanded = expandedOrder === order.id;

                return (
                  <div
                    key={order.id}
                    className="border border-black/8 bg-white/45 transition-colors hover:border-[#C9A84C]/28"
                  >
                    <button
                      onClick={() =>
                        setExpandedOrder(isExpanded ? null : order.id)
                      }
                      className="w-full px-5 py-5 text-left md:px-6"
                    >
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex h-11 w-11 items-center justify-center bg-[#F5F0E8] text-[#C9A84C]">
                            <BookOpen size={18} />
                          </div>
                          <div>
                            <p className="font-body text-[0.62rem] uppercase tracking-[0.24em] text-[#8A6E2F]">
                              Commande du{" "}
                              {new Date(order.created_at).toLocaleDateString(
                                "fr-FR",
                                {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                }
                              )}
                            </p>
                            <p className="mt-2 font-body text-[0.94rem] text-[#0A0A0A]/72">
                              {Array.isArray(order.items) ? order.items.length : 0}{" "}
                              article(s) — #
                              {order.id.slice(0, 8).toUpperCase()}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 font-body text-[0.58rem] font-semibold uppercase tracking-[0.2em] ${status.color}`}
                          >
                            <StatusIcon size={12} />
                            {status.label}
                          </span>
                          <span className="font-display text-[1.4rem] tracking-[-0.02em] text-[#0A0A0A]">
                            {order.total?.toFixed(2)} €
                          </span>
                          {isExpanded ? (
                            <ChevronUp size={18} className="text-[#8D877C]" />
                          ) : (
                            <ChevronDown size={18} className="text-[#8D877C]" />
                          )}
                        </div>
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="border-t border-black/6 px-5 pb-6 pt-5 md:px-6">
                        <div className="space-y-3">
                          {Array.isArray(order.items) &&
                            order.items.map((item, idx) => (
                              <div
                                key={idx}
                                className="flex flex-col gap-4 border-b border-black/6 py-3 last:border-0 md:flex-row md:items-center md:justify-between"
                              >
                                <div className="flex items-center gap-3">
                                  {item.image ? (
                                    <img
                                      src={item.image}
                                      alt={item.name}
                                      className="h-12 w-12 object-cover"
                                    />
                                  ) : (
                                    <div className="flex h-12 w-12 items-center justify-center bg-[#F5F0E8] text-[#C9A84C]">
                                      <BookOpen size={16} />
                                    </div>
                                  )}
                                  <div>
                                    <p className="font-body text-sm font-medium text-[#0A0A0A]">
                                      {item.name}
                                    </p>
                                    <p className="mt-1 font-body text-[0.78rem] text-[#0A0A0A]/46">
                                      {item.qty} x {item.price?.toFixed(2)} €
                                      {isDigitalItem(item) && " — Numérique"}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-3">
                                  <span className="font-body text-sm font-semibold text-[#0A0A0A]">
                                    {(item.price * item.qty).toFixed(2)} €
                                  </span>
                                  {isDigitalItem(item) && canDownload(order) && (
                                    <button className="inline-flex items-center gap-2 bg-[#C9A84C] px-3 py-2 font-body text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-[#0A0A0A] transition-colors hover:bg-[#E2C872]">
                                      <Download size={12} />
                                      PDF
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))}

                          {order.shipping_address && (
                            <div className="bg-[#F5F0E8]/70 p-4">
                              <p className="font-body text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-[#8A6E2F]">
                                {order.shipping_address.address
                                  ? "Adresse de livraison"
                                  : "Informations"}
                              </p>
                              <p className="mt-2 font-body text-sm text-[#0A0A0A]/72">
                                {order.shipping_address.full_name}
                                {order.shipping_address.phone &&
                                  ` — ${order.shipping_address.phone}`}
                              </p>
                              {order.shipping_address.address && (
                                <p className="mt-1 font-body text-sm text-[#0A0A0A]/46">
                                  {order.shipping_address.address},{" "}
                                  {order.shipping_address.postal_code}{" "}
                                  {order.shipping_address.city},{" "}
                                  {order.shipping_address.country}
                                </p>
                              )}
                            </div>
                          )}

                          {canDownload(order) &&
                            order.items?.some(isDigitalItem) && (
                              <div className="flex items-start gap-3 border border-emerald-200 bg-emerald-50 p-4">
                                <CheckCircle
                                  size={18}
                                  className="mt-0.5 shrink-0 text-emerald-600"
                                />
                                <p className="font-body text-sm leading-[1.65] text-emerald-700">
                                  Votre paiement a été confirmé. Vos magazines
                                  numériques sont disponibles au téléchargement.
                                </p>
                              </div>
                            )}

                          {order.status === "pending" && (
                            <div className="flex items-start gap-3 border border-yellow-200 bg-yellow-50 p-4">
                              <Package
                                size={18}
                                className="mt-0.5 shrink-0 text-yellow-600"
                              />
                              <p className="font-body text-sm leading-[1.65] text-yellow-700">
                                Votre commande est en cours de traitement. Le
                                téléchargement sera disponible après
                                confirmation du paiement.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </AccountCard>
    </div>
  );
}
