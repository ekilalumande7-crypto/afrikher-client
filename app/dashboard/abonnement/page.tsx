"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Check, CreditCard, Sparkles } from "lucide-react";
import AccountCard from "@/components/account/AccountCard";
import AccountEmptyState from "@/components/account/AccountEmptyState";
import AccountLoadingBlock from "@/components/account/AccountLoadingBlock";
import AccountSectionHeader from "@/components/account/AccountSectionHeader";

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

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

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
        const { data: subByEmail } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("customer_email", user.email)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (subByEmail) {
          setSubscription(subByEmail);
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
    return <AccountLoadingBlock />;
  }

  const planCards = [monthlyPlan, annualPlan];

  return (
    <div className="space-y-8">
      <AccountSectionHeader
        eyebrow="Membre"
        title="Votre abonnement"
        description="Suivez votre statut, vos privilèges et les possibilités d’évolution de votre expérience AFRIKHER."
      />

      <AccountCard
        eyebrow="Statut"
        title="Votre accès actuel"
        description="Une lecture plus claire de votre situation membre, sans mécanique de comparaison trop technique."
      >
        {subscription && subscription.status === "active" ? (
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="border border-[#C9A84C]/22 bg-[#0A0A0A] p-6 text-[#F5F0E8]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-body text-[0.64rem] font-semibold uppercase tracking-[0.28em] text-[#C9A84C]">
                    Plan {subscription.plan === "annual" ? "Annuel" : "Mensuel"}
                  </p>
                  <h3 className="mt-4 font-display text-[2.2rem] leading-[1] tracking-[-0.03em] text-[#C9A84C]">
                    {subscription.amount?.toFixed(2)}{" "}
                    {subscription.currency || "EUR"}
                  </h3>
                  <p className="mt-2 font-body text-[0.82rem] uppercase tracking-[0.2em] text-[#F5F0E8]/42">
                    / {subscription.plan === "annual" ? "an" : "mois"}
                  </p>
                </div>
                <span className="border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 font-body text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-emerald-300">
                  Actif
                </span>
              </div>

              {subscription.current_period_end && (
                <p className="mt-6 font-body text-[0.94rem] leading-[1.72] text-[#F5F0E8]/58">
                  Prochain renouvellement :{" "}
                  {new Date(subscription.current_period_end).toLocaleDateString(
                    "fr-FR",
                    {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    }
                  )}
                </p>
              )}
            </div>

            <div className="border border-black/6 bg-white/45 p-6">
              <p className="font-body text-[0.64rem] font-semibold uppercase tracking-[0.28em] text-[#8A6E2F]">
                Avantages inclus
              </p>
              <ul className="mt-5 space-y-3">
                {[
                  "Accès illimité à tous les articles",
                  "Éditions exclusives du magazine",
                  "Newsletters premium",
                  "Accès prioritaire aux événements",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 font-body text-[0.95rem] leading-[1.68] text-[#0A0A0A]/66"
                  >
                    <Check size={16} className="mt-1 shrink-0 text-[#C9A84C]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <AccountEmptyState
            icon={<CreditCard size={42} />}
            title="Aucun abonnement actif"
            description="Vous n’avez pas encore ouvert votre accès premium. Les offres AFRIKHER restent disponibles pour enrichir votre lecture et vos privilèges."
            ctaHref="/abonnement"
            ctaLabel="Découvrir les offres"
          />
        )}
      </AccountCard>

      {!subscription && (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          {planCards.map((plan, index) => (
            <AccountCard
              key={plan.name}
              eyebrow={index === 0 ? "Essentiel" : "Signature"}
              title={plan.name}
              description="Une formule pensée comme un accès éditorial, plus qu’un simple tarif."
              className={index === 1 ? "border-[#C9A84C]/25" : undefined}
              contentClassName="!space-y-0"
            >
              <div className="border border-black/6 bg-white/45 p-6">
                {plan.price && plan.price.trim() !== "" ? (
                  <>
                    {plan.originalPrice && (
                      <div className="mb-2 flex items-center gap-3">
                        <span className="font-body text-sm text-[#0A0A0A]/34 line-through">
                          {plan.originalPrice} €
                        </span>
                        {plan.discountLabel && (
                          <span className="bg-[#C9A84C] px-2 py-1 font-body text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-[#0A0A0A]">
                            {plan.discountLabel}
                          </span>
                        )}
                      </div>
                    )}
                    <h3 className="font-display text-[2.6rem] leading-[1] tracking-[-0.03em] text-[#0A0A0A]">
                      {plan.price} €
                    </h3>
                    <p className="mt-2 font-body text-[0.8rem] uppercase tracking-[0.22em] text-[#8A6E2F]">
                      par {plan.period}
                    </p>
                  </>
                ) : (
                  <div className="flex items-start gap-3">
                    <Sparkles size={18} className="mt-1 shrink-0 text-[#C9A84C]" />
                    <p className="font-body text-[0.95rem] leading-[1.72] text-[#0A0A0A]/58">
                      Bientôt disponible. Cette formule sera ajoutée à l’espace
                      membre dès son ouverture.
                    </p>
                  </div>
                )}

                <Link
                  href="/abonnement"
                  className={`mt-6 inline-flex items-center justify-center px-6 py-3 font-body text-[0.72rem] font-semibold uppercase tracking-[0.2em] transition-colors ${
                    index === 1
                      ? "bg-[#C9A84C] text-[#0A0A0A] hover:bg-[#E2C872]"
                      : "bg-[#0A0A0A] text-[#F5F0E8] hover:bg-[#C9A84C] hover:text-[#0A0A0A]"
                  }`}
                >
                  Choisir cette formule
                </Link>
              </div>
            </AccountCard>
          ))}
        </div>
      )}
    </div>
  );
}
