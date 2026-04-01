"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Package, Download, ChevronDown, ChevronUp, BookOpen, Truck, CheckCircle, ShoppingBag, Newspaper } from "lucide-react";

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

const statusLabels: Record<string, { label: string; color: string; icon: any }> = {
  pending: { label: "En attente", color: "bg-yellow-100 text-yellow-700", icon: Package },
  paid: { label: "Paye", color: "bg-green-100 text-green-700", icon: CheckCircle },
  shipped: { label: "Expedie", color: "bg-blue-100 text-blue-700", icon: Truck },
  delivered: { label: "Livre", color: "bg-green-200 text-green-800", icon: CheckCircle },
  cancelled: { label: "Annule", color: "bg-red-100 text-red-700", icon: Package },
};

export default function CommandesPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Strategy 1: orders linked to user_id
      const { data: userOrders } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      // Strategy 2: also find orders by email (for old orders with NULL user_id)
      const { data: emailOrders } = await supabase
        .from("orders")
        .select("*")
        .eq("customer_email", user.email)
        .is("user_id", null)
        .order("created_at", { ascending: false });

      // Merge and deduplicate
      const allOrders = [...(userOrders || [])];
      const existingIds = new Set(allOrders.map(o => o.id));
      for (const o of (emailOrders || [])) {
        if (!existingIds.has(o.id)) {
          allOrders.push(o);
          // Also link these old orders to the user for future
          supabase.from("orders").update({ user_id: user.id }).eq("id", o.id).then(() => {});
        }
      }

      // Sort by date desc
      allOrders.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setOrders(allOrders);
      setLoading(false);
    };
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="bg-white p-10 border border-[#2A2A2A]/10 shadow-sm">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-[#F5F0E8] rounded w-48" />
          <div className="h-20 bg-[#F5F0E8] rounded" />
          <div className="h-20 bg-[#F5F0E8] rounded" />
        </div>
      </div>
    );
  }

  const isDigitalItem = (item: OrderItem) =>
    item.type === "magazine" || item.type === "digital" || item.type === "book";

  const canDownload = (order: Order) =>
    order.status === "paid" || order.status === "delivered";

  return (
    <div className="space-y-6">
      <div className="bg-white p-8 md:p-10 border border-[#2A2A2A]/10 shadow-sm">
        <h2 className="text-2xl md:text-3xl font-display font-bold mb-2" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
          Mes Commandes
        </h2>
        <p className="text-[#9A9A8A] text-sm mb-8">Retrouvez toutes vos commandes et telechargez vos magazines.</p>

        {orders.length === 0 ? (
          <div className="text-center py-16">
            <Package size={48} className="mx-auto text-[#9A9A8A]/50 mb-4" />
            <p className="text-[#9A9A8A] text-lg mb-2">Aucune commande pour le moment</p>
            <p className="text-[#9A9A8A] text-sm mb-8">Explorez notre boutique ou decouvrez le magazine.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/boutique"
                className="inline-flex items-center gap-2 px-8 py-3 bg-[#C9A84C] text-[#0A0A0A] text-xs uppercase tracking-widest font-bold hover:bg-[#E8C97A] transition-all"
              >
                <ShoppingBag size={16} />
                Visiter la boutique
              </Link>
              <Link
                href="/magazine"
                className="inline-flex items-center gap-2 px-8 py-3 bg-[#0A0A0A] text-white text-xs uppercase tracking-widest font-bold hover:bg-[#2A2A2A] transition-all"
              >
                <Newspaper size={16} />
                Visiter le Magazine
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Quick access buttons */}
            <div className="flex flex-wrap gap-3 mb-6">
              <Link
                href="/boutique"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#F5F0E8] text-[#0A0A0A] text-xs uppercase tracking-widest font-bold hover:bg-[#E8E0D0] transition-all rounded-lg"
              >
                <ShoppingBag size={14} />
                Boutique
              </Link>
              <Link
                href="/magazine"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#F5F0E8] text-[#0A0A0A] text-xs uppercase tracking-widest font-bold hover:bg-[#E8E0D0] transition-all rounded-lg"
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
                  <div key={order.id} className="border border-[#2A2A2A]/10 hover:border-[#C9A84C]/30 transition-colors">
                    {/* Order header */}
                    <button
                      onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                      className="w-full p-6 text-left"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#F5F0E8] rounded-lg flex items-center justify-center">
                            <BookOpen size={18} className="text-[#C9A84C]" />
                          </div>
                          <div>
                            <p className="text-xs text-[#9A9A8A] uppercase tracking-widest mb-1">
                              Commande du {new Date(order.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                            </p>
                            <p className="text-sm text-[#0A0A0A] font-medium">
                              {Array.isArray(order.items) ? order.items.length : 0} article(s) &mdash; #{order.id.slice(0, 8).toUpperCase()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[10px] uppercase tracking-widest font-bold rounded-sm ${status.color}`}>
                            <StatusIcon size={12} />
                            {status.label}
                          </span>
                          <span className="text-lg font-bold text-[#0A0A0A]">{order.total?.toFixed(2)} &euro;</span>
                          {isExpanded ? <ChevronUp size={18} className="text-[#9A9A8A]" /> : <ChevronDown size={18} className="text-[#9A9A8A]" />}
                        </div>
                      </div>
                    </button>

                    {/* Expanded details */}
                    {isExpanded && (
                      <div className="px-6 pb-6 border-t border-[#F5F0E8]">
                        <div className="pt-4 space-y-3">
                          {Array.isArray(order.items) && order.items.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between py-3 border-b border-[#F5F0E8] last:border-0">
                              <div className="flex items-center gap-3">
                                {item.image ? (
                                  <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                                ) : (
                                  <div className="w-12 h-12 bg-[#F5F0E8] rounded flex items-center justify-center">
                                    <BookOpen size={16} className="text-[#C9A84C]" />
                                  </div>
                                )}
                                <div>
                                  <p className="text-sm font-medium text-[#0A0A0A]">{item.name}</p>
                                  <p className="text-xs text-[#9A9A8A]">
                                    {item.qty} x {item.price?.toFixed(2)} &euro;
                                    {isDigitalItem(item) && " — Numerique"}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-sm font-bold text-[#0A0A0A]">
                                  {(item.price * item.qty).toFixed(2)} &euro;
                                </span>
                                {isDigitalItem(item) && canDownload(order) && (
                                  <button
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#C9A84C] text-[#0A0A0A] text-[10px] uppercase tracking-widest font-bold hover:bg-[#E8C97A] transition-all rounded-sm"
                                    title="Telecharger"
                                  >
                                    <Download size={12} />
                                    PDF
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}

                          {/* Shipping info */}
                          {order.shipping_address && (
                            <div className="mt-4 p-4 bg-[#F5F0E8]/50 rounded">
                              <p className="text-xs text-[#9A9A8A] uppercase tracking-widest font-bold mb-2">
                                {order.shipping_address.address ? "Adresse de livraison" : "Informations"}
                              </p>
                              <p className="text-sm text-[#0A0A0A]">
                                {order.shipping_address.full_name}
                                {order.shipping_address.phone && ` — ${order.shipping_address.phone}`}
                              </p>
                              {order.shipping_address.address && (
                                <p className="text-sm text-[#9A9A8A] mt-1">
                                  {order.shipping_address.address}, {order.shipping_address.postal_code} {order.shipping_address.city}, {order.shipping_address.country}
                                </p>
                              )}
                            </div>
                          )}

                          {/* Download notice for paid digital orders */}
                          {canDownload(order) && order.items?.some(isDigitalItem) && (
                            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded flex items-center gap-3">
                              <CheckCircle size={18} className="text-green-600 shrink-0" />
                              <p className="text-sm text-green-700">
                                Votre paiement a ete confirme. Vous pouvez telecharger vos magazines en cliquant sur le bouton PDF.
                              </p>
                            </div>
                          )}

                          {order.status === "pending" && (
                            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded flex items-center gap-3">
                              <Package size={18} className="text-yellow-600 shrink-0" />
                              <p className="text-sm text-yellow-700">
                                Votre commande est en cours de traitement. Le telechargement sera disponible apres confirmation du paiement.
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
      </div>
    </div>
  );
}
