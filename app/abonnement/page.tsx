"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Check, Loader2 } from "lucide-react";
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
        // supabase imported from lib/supabase
        const { data } = await supabase
          .from("site_config")
          .select("key, value")
          .like("key", "sub_%");

        const configMap: Record<string, string> = {};
        data?.forEach((row: { key: string; value: string }) => {
          configMap[row.key] = row.value || "";
        });
        setConfig(configMap);

        // Build plans from config
        const builtPlans: Plan[] = [];

        if (configMap.sub_monthly_name) {
          builtPlans.push({
            id: "monthly",
            name: configMap.sub_monthly_name || "Mensuel",
            price: configMap.sub_monthly_price || "15",
            period: configMap.sub_monthly_period || "mois",
            description: configMap.sub_monthly_description || "",
            features: (configMap.sub_monthly_features || "").split("||").filter(Boolean),
            cta: configMap.sub_monthly_cta || "S'abonner",
            featured: false,
            originalPrice: configMap.sub_monthly_original_price || "",
            discountLabel: configMap.sub_monthly_discount_label || "",
          });
        }

        if (configMap.sub_annual_name) {
          builtPlans.push({
            id: "annual",
            name: configMap.sub_annual_name || "Annuel",
            price: configMap.sub_annual_price || "",
            period: configMap.sub_annual_period || "an",
            description: configMap.sub_annual_description || "",
            features: (configMap.sub_annual_features || "").split("||").filter(Boolean),
            cta: configMap.sub_annual_cta || "S'abonner",
            featured: configMap.sub_annual_featured === "true",
            originalPrice: configMap.sub_annual_original_price || "",
            discountLabel: configMap.sub_annual_discount_label || "",
          });
        }

        setPlans(builtPlans);

        // Build FAQ items
        const faqRaw = configMap.sub_faq_items || "";
        if (faqRaw) {
          const items = faqRaw.split("||||").filter(Boolean).map((pair) => {
            const parts = pair.split("||");
            return { question: parts[0] || "", answer: parts[1] || "" };
          });
          setFaqItems(items);
        }
      } catch (err) {
        console.error("Error loading subscription config:", err);
      } finally {
        setPageLoading(false);
      }
    }
    loadConfig();
  }, []);

  const handleSubscribe = async (planId: string) => {
    setLoading(planId);
    try {
      const res = await fetch("/api/fidepay/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planId === "monthly" ? "monthly" : "annual" }),
      });
      const data = await res.json();
      if (data.checkoutUrl || data.checkout_url) {
        window.location.href = data.checkoutUrl || data.checkout_url;
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(null);
    }
  };

  if (pageLoading) {
    return (
      <main className="min-h-screen bg-brand-cream text-brand-dark">
        <Navbar />
        <div className="flex items-center justify-center py-60">
          <Loader2 size={40} className="animate-spin text-brand-gold" />
        </div>
        <Footer />
      </main>
    );
  }

  // If subscriptions are disabled
  if (config.sub_enabled === "false") {
    return (
      <main className="min-h-screen bg-brand-cream text-brand-dark">
        <Navbar />
        <section className="pt-40 pb-40 px-6 bg-brand-dark text-brand-cream">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-6xl md:text-8xl font-display font-bold mb-8">Abonnements</h1>
            <p className="text-brand-gold italic text-xl font-display mb-12">
              Les abonnements seront bientôt disponibles.
            </p>
            <p className="text-brand-gray text-lg">
              Nous préparons quelque chose d'exceptionnel pour vous. Restez connectée.
            </p>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-brand-cream text-brand-dark">
      <Navbar />

      {/* Hero */}
      <section className="pt-40 pb-20 px-6 bg-brand-dark text-brand-cream">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-6xl md:text-8xl font-display font-bold mb-8">
            {config.sub_hero_title || "Abonnements"}
          </h1>
          <p className="text-brand-gold italic text-xl font-display max-w-2xl mx-auto">
            {config.sub_hero_subtitle || "Rejoignez une communauté de femmes visionnaires."}
          </p>
        </div>
      </section>

      {/* Plans */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative p-12 border ${
                plan.featured
                  ? "bg-brand-dark text-brand-cream border-brand-gold"
                  : "bg-white text-brand-dark border-brand-charcoal/10"
              } shadow-xl`}
            >
              {plan.featured && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-gold text-brand-dark px-4 py-1 text-[10px] uppercase tracking-widest font-bold">
                  Le plus populaire
                </div>
              )}

              <div className="text-center mb-10">
                <h3 className="text-3xl font-display font-bold mb-4">{plan.name}</h3>
                {plan.price && plan.price.trim() !== "" && (
                  <div className="flex flex-col items-center">
                    {plan.originalPrice && (
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-brand-gray line-through text-xl font-display">{plan.originalPrice} €</span>
                        {plan.discountLabel && (
                          <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded">{plan.discountLabel}</span>
                        )}
                      </div>
                    )}
                    <div className="flex items-end justify-center space-x-1">
                      <span className="text-5xl font-display font-bold">{plan.price} €</span>
                      <span className="text-brand-gray text-sm mb-2">/ {plan.period}</span>
                    </div>
                  </div>
                )}
                <p className="mt-6 text-sm text-brand-gray">{plan.description}</p>
              </div>

              <ul className="space-y-4 mb-12">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start space-x-3 text-sm">
                    <Check size={18} className="text-brand-gold shrink-0 mt-0.5" />
                    <span className={plan.featured ? "text-brand-cream/80" : "text-brand-charcoal/80"}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(plan.id)}
                disabled={loading !== null}
                className={`w-full py-4 font-medium uppercase tracking-widest transition-all duration-300 ${
                  plan.featured
                    ? "bg-brand-gold text-brand-dark hover:bg-brand-cream"
                    : "bg-brand-dark text-brand-cream hover:bg-brand-gold hover:text-brand-dark"
                }`}
              >
                {loading === plan.id ? (
                  <div className="w-5 h-5 border-2 border-current border-t-transparent animate-spin rounded-full mx-auto" />
                ) : (
                  plan.cta
                )}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      {faqItems.length > 0 && (
        <section className="py-24 px-6 bg-brand-dark text-brand-cream">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-display font-bold mb-8">
              {config.sub_faq_title || "Une question ?"}
            </h2>
            <p className="text-brand-gray mb-12 font-light">
              {config.sub_faq_text || "Notre équipe est à votre disposition."}
              {config.sub_faq_email && (
                <>
                  {" "}Contactez-nous à{" "}
                  <span className="text-brand-gold">{config.sub_faq_email}</span>
                </>
              )}
            </p>
            <div className={`grid grid-cols-1 ${faqItems.length > 1 ? "md:grid-cols-2" : ""} gap-8 text-left`}>
              {faqItems.map((item, i) => (
                <div key={i} className="space-y-2">
                  <h4 className="font-display text-lg text-brand-gold">{item.question}</h4>
                  <p className="text-sm text-brand-gray">{item.answer}</p>
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
