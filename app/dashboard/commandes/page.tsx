"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Package, ExternalLink } from "lucide-react";

interface Order {
  id: string;
  items: any[];
  total: number;
  status: string;
  created_at: string;
}

const statusLabels: Record<string, { label: string; color: string }> = {
  pending: { label: "En attente", color: "bg-yellow-100 text-yellow-700" },
  paid: { label: "Payé", color: "bg-green-100 text-green-700" },
  shipped: { label: "Expédié", color: "bg-blue-100 text-blue-700" },
  delivered: { label: "Livré", color: "bg-green-200 text-green-800" },
  cancelled: { label: "Annulé", color: "bg-red-100 text-red-700" },
};

export default function CommandesPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (data && !error) {
        setOrders(data);
      }
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

  return (
    <div className="space-y-6">
      <div className="bg-white p-8 md:p-10 border border-[#2A2A2A]/10 shadow-sm">
        <h2 className="text-2xl md:text-3xl font-display font-bold mb-8">Mes Commandes</h2>

        {orders.length === 0 ? (
          <div className="text-center py-16">
            <Package size={48} className="mx-auto text-[#9A9A8A]/50 mb-4" />
            <p className="text-[#9A9A8A] text-lg mb-2">Aucune commande pour le moment</p>
            <p className="text-[#9A9A8A] text-sm mb-8">Explorez notre boutique pour découvrir nos produits.</p>
            <Link
              href="/boutique"
              className="inline-block px-8 py-3 bg-[#C9A84C] text-[#0A0A0A] text-xs uppercase tracking-widest font-bold hover:bg-[#E8C97A] transition-all"
            >
              Visiter la boutique
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const status = statusLabels[order.status] || statusLabels.pending;
              return (
                <div key={order.id} className="border border-[#2A2A2A]/10 p-6 hover:border-[#C9A84C]/30 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <p className="text-xs text-[#9A9A8A] uppercase tracking-widest mb-1">
                        Commande du {new Date(order.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                      </p>
                      <p className="text-sm text-[#0A0A0A]">
                        {Array.isArray(order.items) ? order.items.length : 0} article(s)
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 text-[10px] uppercase tracking-widest font-bold rounded-sm ${status.color}`}>
                        {status.label}
                      </span>
                      <span className="text-lg font-bold text-[#0A0A0A]">{order.total?.toFixed(2)} €</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
