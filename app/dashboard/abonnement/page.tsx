"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { CreditCard, Check } from "lucide-react";

interface Subscription {
  id: string;
  plan: string;
  status: string;
  amount: number;
  currency: string;
  current_period_start: string;
  current_period_end: string;
  created_at: string;
}

export default function AbonnementPage() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscription = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (data && !error) {
        setSubscription(data);
      }
      setLoading(false);
    };
    fetchSubscription();
  }, []);

  if (loading) {
    return (
      <div className="bg-white p-10 border border-[#2A2A2A]/10 shadow-sm">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-[#F5F0E8] rounded w-48" />
          <div className="h-32 bg-[#F5F0E8] rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-white p-8 md:p-10 border border-[#2A2A2A]/10 shadow-sm">
        <h2 className="text-2xl md:text-3xl font-display font-bold mb-8">Mon Abonnement</h2>

        {subscription && subscription.status === "active" ? (
          <div className="space-y-6">
            <div className="p-6 bg-[#0A0A0A] text-[#F5F0E8] border border-[#C9A84C]/30">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs uppercase tracking-widest text-[#C9A84C] font-bold">
                  Plan {subscription.plan === "annual" ? "Annuel" : "Mensuel"}
                </span>
                <span className="px-3 py-1 bg-green-500/20 text-green-400 text-[10px] uppercase tracking-widest font-bold rounded-sm">
                  Actif
                </span>
              </div>
              <p className="text-2xl font-display font-bold text-[#C9A84C]">
                {subscription.amount?.toFixed(2)} {subscription.currency || "EUR"} / {subscription.plan === "annual" ? "an" : "mois"}
              </p>
              {subscription.current_period_end && (
                <p className="text-sm text-[#9A9A8A] mt-3">
                  Prochain renouvellement : {new Date(subscription.current_period_end).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                </p>
              )}
            </div>

            <div className="p-5 bg-[#F5F0E8] border border-[#C9A84C]/20">
              <h4 className="text-sm font-bold uppercase tracking-widest mb-3">Avantages inclus</h4>
              <ul className="space-y-2">
                {["Accès illimité à tous les articles", "Éditions exclusives du magazine", "Newsletters premium", "Accès prioritaire aux événements"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-[#2A2A2A]">
                    <Check size={14} className="text-[#C9A84C]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <CreditCard size={48} className="mx-auto text-[#9A9A8A]/50 mb-4" />
            <p className="text-[#9A9A8A] text-lg mb-2">Aucun abonnement actif</p>
            <p className="text-[#9A9A8A] text-sm mb-8">
              Abonnez-vous pour accéder à tout le contenu premium d&apos;AFRIKHER.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-lg mx-auto">
              <div className="border border-[#C9A84C]/30 p-6 text-center hover:border-[#C9A84C] transition-colors">
                <p className="text-xs uppercase tracking-widest text-[#C9A84C] font-bold mb-2">Mensuel</p>
                <p className="text-3xl font-display font-bold mb-1">9,99 €</p>
                <p className="text-[#9A9A8A] text-xs mb-4">par mois</p>
                <Link
                  href="/abonnement"
                  className="block w-full py-3 bg-[#0A0A0A] text-[#F5F0E8] text-xs uppercase tracking-widest font-bold hover:bg-[#C9A84C] hover:text-[#0A0A0A] transition-all text-center"
                >
                  Choisir
                </Link>
              </div>
              <div className="border-2 border-[#C9A84C] p-6 text-center relative">
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-[#C9A84C] text-[#0A0A0A] text-[9px] uppercase tracking-widest font-bold">
                  Populaire
                </span>
                <p className="text-xs uppercase tracking-widest text-[#C9A84C] font-bold mb-2">Annuel</p>
                <p className="text-3xl font-display font-bold mb-1">89,99 €</p>
                <p className="text-[#9A9A8A] text-xs mb-4">par an (2 mois offerts)</p>
                <Link
                  href="/abonnement"
                  className="block w-full py-3 bg-[#C9A84C] text-[#0A0A0A] text-xs uppercase tracking-widest font-bold hover:bg-[#E8C97A] transition-all text-center"
                >
                  Choisir
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
