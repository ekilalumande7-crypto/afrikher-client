"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Check } from "lucide-react";
import { motion } from "motion/react";

const plans = [
  {
    id: "mensuel",
    name: "Mensuel",
    price: "15",
    period: "mois",
    description: "L'accès complet à l'univers AFRIKHER, mois après mois.",
    features: [
      "Accès illimité au journal numérique",
      "Édition papier trimestrielle offerte",
      "Newsletter exclusive 'Le Cercle'",
      "Invitations aux webinaires mensuels",
      "10% de réduction sur la boutique"
    ],
    cta: "S'abonner",
    featured: false
  },
  {
    id: "annuel",
    name: "Annuel",
    price: "150",
    period: "an",
    description: "Le choix de l'excellence et de l'engagement durable.",
    features: [
      "Tous les avantages du plan mensuel",
      "2 mois offerts (économie de 30€)",
      "Accès VIP aux événements physiques",
      "Un coffret cadeau de bienvenue",
      "20% de réduction sur la boutique",
      "Accès aux archives historiques"
    ],
    cta: "S'abonner & Économiser",
    featured: true
  }
];

export default function AbonnementsPage() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (planId: string) => {
    setLoading(planId);
    try {
      const res = await fetch("/api/stripe/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });
      const { url } = await res.json();
      if (url) window.location.href = url;
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(null);
    }
  };

  return (
    <main className="min-h-screen bg-brand-cream text-brand-dark">
      <Navbar />
      
      {/* Hero */}
      <section className="pt-40 pb-20 px-6 bg-brand-dark text-brand-cream">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-6xl md:text-8xl font-display font-bold mb-8">Abonnements</h1>
          <p className="text-brand-gold italic text-xl font-display max-w-2xl mx-auto">
            Rejoignez une communauté de femmes visionnaires. Choisissez votre expérience AFRIKHER.
          </p>
        </div>
      </section>

      {/* Plans */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative p-12 border ${
                plan.featured ? "bg-brand-dark text-brand-cream border-brand-gold" : "bg-white text-brand-dark border-brand-charcoal/10"
              } shadow-xl`}
            >
              {plan.featured && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-gold text-brand-dark px-4 py-1 text-[10px] uppercase tracking-widest font-bold">
                  Le plus populaire
                </div>
              )}
              
              <div className="text-center mb-10">
                <h3 className="text-3xl font-display font-bold mb-4">{plan.name}</h3>
                <div className="flex items-end justify-center space-x-1">
                  <span className="text-5xl font-display font-bold">{plan.price} €</span>
                  <span className="text-brand-gray text-sm mb-2">/ {plan.period}</span>
                </div>
                <p className={`mt-6 text-sm ${plan.featured ? "text-brand-gray" : "text-brand-gray"}`}>
                  {plan.description}
                </p>
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
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="py-24 px-6 bg-brand-dark text-brand-cream">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-display font-bold mb-8">Une question ?</h2>
          <p className="text-brand-gray mb-12 font-light">
            Notre équipe est à votre disposition pour vous accompagner dans votre choix. Contactez-nous à <span className="text-brand-gold">support@afrikher.com</span>
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            <div className="space-y-2">
              <h4 className="font-display text-lg text-brand-gold">Puis-je annuler à tout moment ?</h4>
              <p className="text-sm text-brand-gray">Oui, l'abonnement mensuel est sans engagement. L'abonnement annuel est renouvelable à date anniversaire.</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-display text-lg text-brand-gold">Comment recevoir le magazine papier ?</h4>
              <p className="text-sm text-brand-gray">Il est expédié automatiquement à l'adresse renseignée dans votre profil chaque trimestre.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
