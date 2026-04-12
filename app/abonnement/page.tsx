"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Check, Loader2, ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface FaqItem {
  question: string;
  answer: string;
}

interface Plan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  featured: boolean;
  originalPrice?: string;
  discountLabel?: string;
  note?: string;
  enabled: boolean;
}

function SubscriptionCard({
  plan,
  loading,
  onSubscribe,
}: {
  plan: Plan;
  loading: string | null;
  onSubscribe: (planId: string) => void;
}) {
  const isPriceVisible = plan.price && plan.price.trim() !== "";
  const visibleFeatures = plan.features.filter(Boolean).slice(0, 4);

  return (
    <article
      className={`relative flex h-full flex-col border px-7 py-8 md:px-9 md:py-9 ${
        plan.featured
          ? "border-[#C9A84C]/60 bg-[#0A0A0A] text-[#F5F0E8]"
          : "border-black/8 bg-[#FBF7F0] text-[#0A0A0A]"
      }`}
    >
      {plan.featured && (
        <div className="mb-6">
          <span className="inline-flex border border-[#C9A84C]/45 px-3 py-1 font-body text-[0.62rem] font-medium uppercase tracking-[0.22em] text-[#C9A84C]">
            {plan.discountLabel || "Le plus populaire"}
          </span>
        </div>
      )}

      <div className="border-b border-current/10 pb-6">
        <p
          className={`font-body text-[0.66rem] font-medium uppercase tracking-[0.26em] ${
            plan.featured ? "text-[#C9A84C]" : "text-[#8A6E2F]"
          }`}
        >
          {plan.name}
        </p>

        <div className="mt-4 flex items-end gap-2">
          {isPriceVisible ? (
            <>
              <span className="font-display text-[2.9rem] leading-none tracking-[-0.03em] md:text-[3.4rem]">
                {plan.price} €
              </span>
              <span className={`pb-1 font-body text-sm ${plan.featured ? "text-[#F5F0E8]/58" : "text-[#0A0A0A]/50"}`}>
                / {plan.period}
              </span>
            </>
          ) : (
            <span className="font-display text-[2.2rem] leading-none tracking-[-0.02em] md:text-[2.6rem]">
              Bientôt disponible
            </span>
          )}
        </div>

        {plan.note && (
          <p className={`mt-3 font-body text-[0.76rem] uppercase tracking-[0.16em] ${plan.featured ? "text-[#C9A84C]/88" : "text-[#8A6E2F]"}`}>
            {plan.note}
          </p>
        )}

        {plan.originalPrice && (
          <p className={`mt-3 font-body text-sm ${plan.featured ? "text-[#F5F0E8]/44" : "text-[#0A0A0A]/38"}`}>
            <span className="line-through">{plan.originalPrice} €</span>
          </p>
        )}

        <p className={`mt-4 max-w-[24rem] font-body text-[0.95rem] leading-[1.7] ${plan.featured ? "text-[#F5F0E8]/72" : "text-[#0A0A0A]/58"}`}>
          {plan.description}
        </p>
      </div>

      <ul className="flex flex-1 flex-col gap-4 py-6">
        {visibleFeatures.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <Check size={16} className={`mt-0.5 shrink-0 ${plan.featured ? "text-[#C9A84C]" : "text-[#8A6E2F]"}`} />
            <span className={`font-body text-[0.94rem] leading-[1.65] ${plan.featured ? "text-[#F5F0E8]/76" : "text-[#0A0A0A]/62"}`}>
              {feature}
            </span>
          </li>
        ))}
      </ul>

      <button
        onClick={() => onSubscribe(plan.id)}
        disabled={loading !== null || !plan.enabled}
        className={`inline-flex w-full items-center justify-center gap-3 border px-5 py-3.5 font-body text-[0.72rem] font-semibold uppercase tracking-[0.2em] transition-all duration-300 ${
          plan.featured
            ? "border-[#C9A84C] bg-[#C9A84C] text-[#0A0A0A] hover:bg-transparent hover:text-[#C9A84C]"
            : "border-[#0A0A0A] bg-[#0A0A0A] text-[#F5F0E8] hover:border-[#C9A84C] hover:bg-[#C9A84C] hover:text-[#0A0A0A]"
        } ${!plan.enabled ? "cursor-not-allowed opacity-55" : ""}`}
      >
        {loading === plan.id ? (
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : (
          <>
            <span>{plan.cta}</span>
            <ArrowRight size={14} />
          </>
        )}
      </button>
    </article>
  );
}

export default function AbonnementsPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [config, setConfig] = useState<Record<string, string>>({});
  const [plans, setPlans] = useState<Plan[]>([]);
  const [faqItems, setFaqItems] = useState<FaqItem[]>([]);

  useEffect(() => {
    async function loadConfig() {
      try {
        const { data } = await supabase
          .from("site_config")
          .select("key, value")
          .like("key", "sub_%");

        const configMap: Record<string, string> = {};
        data?.forEach((row: { key: string; value: string }) => {
          configMap[row.key] = row.value || "";
        });
        setConfig(configMap);

        const builtPlans: Plan[] = [];

        if (configMap.sub_monthly_name) {
          builtPlans.push({
            id: "monthly",
            name: configMap.sub_monthly_name || "Mensuel",
            price: configMap.sub_monthly_price || "",
            period: configMap.sub_monthly_period || "mois",
            description: configMap.sub_monthly_description || "",
            features: (configMap.sub_monthly_features || "").split("||").filter(Boolean),
            cta: configMap.sub_monthly_cta || "Choisir le mensuel",
            featured: false,
            originalPrice: configMap.sub_monthly_original_price || "",
            discountLabel: configMap.sub_monthly_discount_label || "",
            note: configMap.sub_monthly_note || "",
            enabled: true,
          });
        }

        if (configMap.sub_annual_name) {
          const annualEnabled = configMap.sub_annual_enabled !== "false";
          builtPlans.push({
            id: "annual",
            name: configMap.sub_annual_name || "Annuel",
            price: configMap.sub_annual_price || "",
            period: configMap.sub_annual_period || "an",
            description: configMap.sub_annual_description || "",
            features: (configMap.sub_annual_features || "").split("||").filter(Boolean),
            cta: configMap.sub_annual_cta || "Rejoindre la liste d'attente",
            featured: configMap.sub_annual_featured === "true",
            originalPrice: configMap.sub_annual_original_price || "",
            discountLabel: configMap.sub_annual_badge || configMap.sub_annual_discount_label || "",
            note: configMap.sub_annual_note || "",
            enabled: annualEnabled,
          });
        }

        setPlans(builtPlans);

        const faqRaw = configMap.sub_faq_items || "";
        if (faqRaw) {
          const items = faqRaw
            .split("||||")
            .filter(Boolean)
            .map((pair) => {
              const parts = pair.split("||");
              return { question: parts[0] || "", answer: parts[1] || "" };
            });
          setFaqItems(items.slice(0, 4));
        }
      } catch (err) {
        console.error("Error loading subscription config:", err);
      } finally {
        setPageLoading(false);
      }
    }
    loadConfig();
  }, []);

  const [error, setError] = useState<string | null>(null);

  const handleSubscribe = async (planId: string) => {
    const selectedPlan = plans.find((plan) => plan.id === planId);
    if (!selectedPlan?.enabled) return;

    setLoading(planId);
    setError(null);

    try {
      // Get fresh auth token
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;

      if (!token) {
        // Not logged in — redirect to login with return URL
        window.location.href = `/auth/login?redirect=${encodeURIComponent("/abonnement")}`;
        return;
      }

      const res = await fetch("/api/fidepay/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ plan: planId === "monthly" ? "monthly" : "annual" }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          // Token expired — redirect to login
          window.location.href = `/auth/login?redirect=${encodeURIComponent("/abonnement")}`;
          return;
        }
        setError(data.error || "Une erreur est survenue. Veuillez réessayer.");
        return;
      }

      const paymentUrl = data.checkoutUrl || data.checkout_url || data.paymentUrl;
      if (paymentUrl) {
        window.location.href = paymentUrl;
      } else {
        setError("Le service de paiement est temporairement indisponible.");
      }
    } catch (err) {
      console.error("Subscribe error:", err);
      setError("Impossible de contacter le service de paiement.");
    } finally {
      setLoading(null);
    }
  };

  if (pageLoading) {
    return (
      <main className="min-h-screen bg-[#F5F0E8] text-[#0A0A0A]">
        <Navbar />
        <div className="flex items-center justify-center py-48">
          <Loader2 size={40} className="animate-spin text-[#C9A84C]" />
        </div>
        <Footer />
      </main>
    );
  }

  if (config.sub_enabled === "false") {
    return (
      <main className="min-h-screen bg-[#F5F0E8] text-[#0A0A0A]">
        <Navbar />
        <section className="bg-[#0A0A0A] px-6 pb-28 pt-28 text-[#F5F0E8] md:pb-32 md:pt-32">
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-body text-[0.7rem] uppercase tracking-[0.32em] text-[#C9A84C]">
              Accès privilégié
            </p>
            <h1 className="mt-3 font-display text-[3.4rem] leading-[0.94] md:text-[5.4rem]">
              Abonnements
            </h1>
            <div className="mx-auto mt-6 h-px w-24 bg-[#C9A84C]/75" />
            <p className="mx-auto mt-5 max-w-2xl font-display text-[1.08rem] italic leading-[1.5] text-[#F5F0E8]/64 md:text-[1.24rem]">
              Les abonnements seront bientôt disponibles.
            </p>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F5F0E8] text-[#0A0A0A]">
      <div className="fixed left-0 right-0 top-0 z-[90] h-20 bg-[#0A0A0A]" />
      <Navbar />

      <section className="bg-[#0A0A0A] px-6 pb-16 pt-28 text-[#F5F0E8] md:pb-20 md:pt-32">
        <div className="mx-auto max-w-5xl text-center">
          <p className="font-body text-[0.72rem] uppercase tracking-[0.34em] text-[#C9A84C]">
            {config.sub_hero_label || "Accès privilégié"}
          </p>
          <h1 className="mt-3 font-display text-[3.25rem] leading-[0.94] tracking-[-0.03em] md:text-[5.4rem]">
            {config.sub_hero_title || "Les Abonnements AFRIKHER"}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl font-display text-[1.04rem] italic leading-[1.5] text-[#F5F0E8]/64 md:text-[1.24rem]">
            {config.sub_hero_subtitle || "Choisissez l'accès qui vous ouvre l'univers éditorial AFRIKHER."}
          </p>
          <div className="mx-auto mt-6 h-px w-24 bg-[#C9A84C]/75" />
        </div>
      </section>

      <section className="px-6 pb-16 pt-14 md:pb-18 md:pt-16">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-[34rem]">
            <p className="font-body text-[0.7rem] font-medium uppercase tracking-[0.32em] text-[#C9A84C]">
              {config.sub_section_label || "Les formules"}
            </p>
            <h2 className="mt-3 font-display text-[2.2rem] leading-[0.98] tracking-[-0.02em] md:text-[3rem]">
              {config.sub_section_title || "Deux accès pensés comme une expérience éditoriale"}
            </h2>
            <p className="mt-4 font-body text-[0.96rem] leading-[1.72] text-[#0A0A0A]/60">
              {config.sub_section_intro || "Choisissez la formule qui accompagne votre lecture, avec une présence plus sobre, plus raffinée, plus proche d'un club privé que d'une page tarifaire classique."}
            </p>
          </div>

          {error && (
            <div className="mt-8 border border-red-300/50 bg-red-50 px-5 py-4 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="mt-10 grid grid-cols-1 items-stretch gap-6 md:grid-cols-2 md:gap-8">
            {plans.map((plan) => (
              <SubscriptionCard
                key={plan.id}
                plan={plan}
                loading={loading}
                onSubscribe={handleSubscribe}
              />
            ))}
          </div>
        </div>
      </section>

      {faqItems.length > 0 && (
        <section className="bg-[#0A0A0A] px-6 py-14 text-[#F5F0E8] md:py-16">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-[32rem]">
              <p className="font-body text-[0.7rem] font-medium uppercase tracking-[0.32em] text-[#C9A84C]">
                {config.sub_help_label || "Réassurance"}
              </p>
              <h2 className="mt-3 font-display text-[2.1rem] leading-[1] tracking-[-0.02em] md:text-[2.7rem]">
                {config.sub_faq_title || "Une question ?"}
              </h2>
              <p className="mt-4 font-body text-[0.96rem] leading-[1.72] text-[#F5F0E8]/62">
                {config.sub_faq_text || "Notre équipe vous accompagne pour choisir la formule adaptée."}
              </p>
              {config.sub_faq_email && (
                <p className="mt-4 font-body text-[0.82rem] uppercase tracking-[0.2em] text-[#C9A84C]">
                  {config.sub_faq_email}
                </p>
              )}
            </div>

            <div className={`mt-10 grid grid-cols-1 gap-6 ${faqItems.length > 1 ? "md:grid-cols-2" : ""}`}>
              {faqItems.map((item, i) => (
                <div key={i} className="border border-white/8 bg-white/[0.03] p-5 md:p-6">
                  <h4 className="font-display text-[1.18rem] leading-[1.2] text-[#F5F0E8]">
                    {item.question}
                  </h4>
                  <p className="mt-3 font-body text-[0.92rem] leading-[1.7] text-[#F5F0E8]/58">
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}
