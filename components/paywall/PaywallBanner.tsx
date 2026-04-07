"use client";

import { useState } from "react";
import { Lock, ArrowRight, ShoppingBag } from "lucide-react";
import { supabase } from "@/lib/supabase";

type PaywallType = "subscription" | "magazine";

interface PaywallBannerProps {
  type: PaywallType;
  magazineId?: string;
  onSuccess?: () => void;
}

export default function PaywallBanner({
  type,
  magazineId,
  onSuccess,
}: PaywallBannerProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function getFreshAccessToken() {
    const { data: refreshed } = await supabase.auth.refreshSession();
    const refreshedToken = refreshed?.session?.access_token;
    if (refreshedToken) return refreshedToken;

    const {
      data: { session },
    } = await supabase.auth.getSession();

    return session?.access_token || null;
  }

  async function handleAction() {
    setError("");
    setLoading(true);

    try {
      const token = await getFreshAccessToken();

      if (!token) {
        const redirect = window.location.pathname + window.location.search;
        window.location.href = `/auth/login?redirect=${encodeURIComponent(redirect)}`;
        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user?.email) {
        throw new Error("Impossible de récupérer votre session. Veuillez vous reconnecter.");
      }

      let response: Response;

      if (type === "subscription") {
        response = await fetch("/api/fidepay/subscribe", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ plan: "monthly" }),
        });
      } else {
        if (!magazineId) {
          throw new Error("Magazine introuvable pour ce paiement.");
        }

        const { data: magazine, error: magazineError } = await supabase
          .from("magazines")
          .select("id, title, price")
          .eq("id", magazineId)
          .single();

        if (magazineError || !magazine) {
          throw new Error("Impossible de charger ce magazine pour l'achat.");
        }

        response = await fetch("/api/fidepay/checkout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            items: [
              {
                product_id: magazine.id,
                name: magazine.title,
                qty: 1,
                price: Number(magazine.price) || 0,
              },
            ],
            amount: Number(magazine.price) || 0,
            currency: "EUR",
            customer_name: user.user_metadata?.full_name || "",
            customer_email: user.email,
            shipping_address: null,
          }),
        });
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Impossible de lancer le paiement.");
      }

      const paymentUrl = data.paymentUrl || data.checkout_url || data.checkoutUrl || data.payment_url;

      if (!paymentUrl) {
        throw new Error("Aucune URL de paiement n'a été retournée.");
      }

      onSuccess?.();
      window.location.href = paymentUrl;
    } catch (err: any) {
      console.error("[PaywallBanner] payment error:", err);
      setError(err.message || "Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  }

  const isSubscription = type === "subscription";

  return (
    <div className="border border-[#C9A84C]/22 bg-[#0A0A0A] p-6 md:p-8 text-[#F5F0E8]">
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 border border-[#C9A84C]/30 px-3 py-1 text-[0.62rem] font-medium uppercase tracking-[0.24em] text-[#C9A84C]">
            <Lock size={13} />
            Accès premium
          </div>

          <h3 className="mt-5 font-display text-[2rem] leading-[1.02] tracking-[-0.02em] md:text-[2.5rem]">
            {isSubscription
              ? "Abonnez-vous pour accéder à tout le contenu."
              : "Achetez ce magazine pour le lire et le télécharger."}
          </h3>

          <p className="mt-4 max-w-xl font-body text-[0.96rem] leading-[1.75] text-[#F5F0E8]/72">
            {isSubscription
              ? "Débloquez les articles AFRIKHER, les éditions exclusives et l’expérience complète réservée aux membres."
              : "Déverrouillez immédiatement ce numéro pour accéder à l’intégralité de la lecture et à son téléchargement."}
          </p>

          {error ? (
            <p className="mt-4 border border-[#7C2D2D]/30 bg-[#2A1414] px-4 py-3 font-body text-sm text-[#F0C7C7]">
              {error}
            </p>
          ) : null}
        </div>

        <button
          onClick={handleAction}
          disabled={loading}
          className="inline-flex items-center justify-center gap-3 bg-[#C9A84C] px-6 py-3.5 font-body text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-[#0A0A0A] transition-all duration-300 hover:bg-[#E8C97A] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubscription ? <ArrowRight size={15} /> : <ShoppingBag size={15} />}
          {loading ? "Redirection..." : isSubscription ? "S'abonner" : "Acheter"}
        </button>
      </div>
    </div>
  );
}
