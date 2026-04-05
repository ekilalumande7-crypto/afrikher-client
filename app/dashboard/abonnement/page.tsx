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

interface PlanInfo {
  price: string;
  period: string;
  originalPrice: string;
  discountLabel: string;
  name: string;
}

export default function AbonnementPage() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [monthlyPlan, setMonthlyPlan] = useState<PlanInfo>({
    price: "",
    period: "mois",
    originalPrice: "",
    discountLabel: "",
    name: "Mensuel",
  });
  const [annualPlan, setAnnualPlan] = useState<PlanInfo>({
    price: "",
    period: "an",
    originalPrice: "",
    discountLabel: "",
    name: "Annuel",
  });

  useEffect(() => {
    const fetchData = async () => {
      // Load plan pricing from site_config
      const { data: configData } = await supabase
        .from("site_config")
        .select("key, value")
        .like("key", "sub_%");

      const configMap: Record<string, string> = {};
      configData?.forEach((row: { key: string; value: string }) => {
        configMap[row.key] = row.value || "";
      });

      setMonthlyPlan({
        name: configMap.sub_monthly_name || "Mensuel",
        price: configMap.sub_monthly_price || "",
        period: configMap.sub_monthly_period || "mois",
        originalPrice: configMap.sub_monthly_original_price || "",
        discountLabel: configMap.sub_monthly_discount_label || "",
      });
      setAnnualPlan({
        name: configMap.sub_annual_name || "Annuel",
        price: configMap.sub_annual_price || "",
        period: configMap.sub_annual_period || "an",
        originalPrice: configMap.sub_annual_original_price || "",
        discountLabel: configMap.sub_annual_discount_label || "",
      });

      // Load subscription (by user_id OR customer_email fallback)
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      // Try by user_id first
      const { data: subByUser } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (subByUser) {
        setSubscription(subByUser);
      } else if (user.email) {
        // Fallback : search by customer_email (orphan subscriptions)
        const { data: subByEmail } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("customer_email", user.email)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (subByEmail) {
          setSubscription(subByEmail);
          // Link it to user_id for future lookups
          await supabase
            .from("subscriptions")
            .update({ user_id: user.id })
            .eq("id", subByEmail.id);
        }
      }
      setLoading(false);
    };
    fetchData();
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
                <p className="text-xs uppercase tracking-widest text-[#C9A84C] font-bold mb-2">{monthlyPlan.name}</p>
                {monthlyPlan.price && monthlyPlan.price.trim() !== "" ? (
                  <>
                    {monthlyPlan.originalPrice && (
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <span className="text-[#9A9A8A] line-through text-sm">{monthlyPlan.originalPrice} €</span>
                        {monthlyPlan.discountLabel && (
                          <span className="bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">{monthlyPlan.discountLabel}</span>
                        )}
                      </div>
                    )}
                    <p className="text-3xl font-display font-bold mb-1">{monthlyPlan.price} €</p>
                    <p className="text-[#9A9A8A] text-xs mb-4">par {monthlyPlan.period}</p>
                  </>
                ) : (
                  <p className="text-[#9A9A8A] text-xs mb-4 mt-4">Bientôt disponible</p>
                )}
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
                <p className="text-xs uppercase tracking-widest text-[#C9A84C] font-bold mb-2">{annualPlan.name}</p>
                {annualPlan.price && annualPlan.price.trim() !== "" ? (
                  <>
                    {annualPlan.originalPrice && (
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <span className="text-[#9A9A8A] line-through text-sm">{annualPlan.originalPrice} €</span>
                        {annualPlan.discountLabel && (
                          <span className="bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">{annualPlan.discountLabel}</span>
                        )}
                      </div>
                    )}
                    <p className="text-3xl font-display font-bold mb-1">{annualPlan.price} €</p>
                    <p className="text-[#9A9A8A] text-xs mb-4">par {annualPlan.period}</p>
                  </>
                ) : (
                  <p className="text-[#9A9A8A] text-xs mb-4 mt-4">Bientôt disponible</p>
                )}
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
