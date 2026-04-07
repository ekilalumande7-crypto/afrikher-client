import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { getServiceRoleClient } from "@/lib/supabase";
import { ArrowRight, CheckCircle, CreditCard, RefreshCw, Sparkles } from "lucide-react";

interface MerciPageProps {
  searchParams: Promise<{
    subscription?: string;
  }>;
}

interface SubscriptionRecord {
  id: string;
  plan: string | null;
  status: string | null;
  current_period_end: string | null;
}

function formatPlan(plan: string | null) {
  return plan === "annual" ? "Annuel" : "Mensuel";
}

function formatDate(date: string | null) {
  if (!date) return "A confirmer";

  try {
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return "A confirmer";
  }
}

export default async function MerciAbonnementPage({
  searchParams,
}: MerciPageProps) {
  const { subscription: subscriptionId } = await searchParams;

  let subscription: SubscriptionRecord | null = null;

  if (subscriptionId) {
    try {
      const supabase = getServiceRoleClient();
      const { data } = await supabase
        .from("subscriptions")
        .select("id, plan, status, current_period_end")
        .eq("id", subscriptionId)
        .maybeSingle();

      subscription = data;
    } catch (error) {
      console.error("Failed to load subscription confirmation:", error);
    }
  }

  const isActive = subscription?.status === "active";
  const refreshHref = subscriptionId
    ? `/abonnement/merci?subscription=${encodeURIComponent(subscriptionId)}`
    : "/abonnement/merci";

  return (
    <main className="min-h-screen bg-[#FAFAF8]">
      <div className="fixed top-0 left-0 right-0 h-20 bg-[#0A0A0A] z-[90]" />
      <Navbar />

      <div className="max-w-2xl mx-auto px-6 pt-32 pb-20">
        <div className="text-center">
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8 ${
              isActive ? "bg-green-50" : "bg-[#F5F0E8]"
            }`}
          >
            {isActive ? (
              <CheckCircle size={40} className="text-green-500" />
            ) : (
              <RefreshCw size={36} className="text-[#C9A84C]" />
            )}
          </div>

          <h1 className="text-4xl font-serif font-bold text-[#0A0A0A] mb-3">
            {isActive
              ? "Votre abonnement est actif"
              : "Votre paiement est en cours de validation"}
          </h1>
          <p className="text-[#9A9A8A] text-lg mb-10">
            {isActive
              ? "Merci. Votre acces premium AFRIKHER est maintenant ouvert."
              : "Le webhook FIDEPAY n'a peut-etre pas encore finalise l'activation. Revenez dans un instant pour rafraichir votre statut."}
          </p>

          <div className="bg-white rounded-2xl p-8 border border-gray-100 text-left mb-10">
            <div className="flex items-center space-x-3 mb-6 pb-6 border-b border-gray-100">
              <CreditCard size={20} className="text-[#C9A84C]" />
              <div>
                <p className="text-xs text-[#9A9A8A] uppercase tracking-widest font-bold">
                  Abonnement
                </p>
                <p className="text-sm font-mono text-[#0A0A0A]">
                  {subscription?.id?.slice(0, 8).toUpperCase() || "EN ATTENTE"}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-[#9A9A8A]">Plan souscrit</span>
                <span className="text-sm font-bold text-[#0A0A0A]">
                  {formatPlan(subscription?.plan || null)}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-[#9A9A8A]">Statut</span>
                <span
                  className={`text-xs font-bold uppercase tracking-widest ${
                    isActive ? "text-green-600" : "text-[#C9A84C]"
                  }`}
                >
                  {isActive ? "Actif" : "Validation en cours"}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-[#9A9A8A]">Fin de periode</span>
                <span className="text-sm font-bold text-[#0A0A0A]">
                  {formatDate(subscription?.current_period_end || null)}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 text-left">
              <Sparkles size={20} className="text-[#C9A84C] mb-3" />
              <h3 className="text-sm font-bold text-[#0A0A0A] mb-1">
                Lecture premium
              </h3>
              <p className="text-xs text-[#9A9A8A]">
                Retrouvez vos avantages membres et l'etat de votre abonnement
                depuis votre espace personnel.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-gray-100 text-left">
              <CreditCard size={20} className="text-[#C9A84C] mb-3" />
              <h3 className="text-sm font-bold text-[#0A0A0A] mb-1">
                Activation
              </h3>
              <p className="text-xs text-[#9A9A8A]">
                Si votre acces n'est pas encore visible, utilisez le bouton de
                rafraichissement pour verifier la confirmation du paiement.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {isActive ? (
              <>
                <Link
                  href="/"
                  className="inline-flex items-center px-8 py-3.5 bg-[#0A0A0A] text-white rounded-full font-bold text-sm hover:bg-[#2A2A2A] transition-colors"
                >
                  Commencer a lire
                </Link>
                <Link
                  href="/dashboard/abonnement"
                  className="inline-flex items-center px-8 py-3.5 border-2 border-[#0A0A0A] text-[#0A0A0A] rounded-full font-bold text-sm hover:bg-[#0A0A0A] hover:text-white transition-all"
                >
                  Mon abonnement
                  <ArrowRight size={16} className="ml-2" />
                </Link>
              </>
            ) : (
              <>
                <Link
                  href={refreshHref}
                  className="inline-flex items-center px-8 py-3.5 bg-[#0A0A0A] text-white rounded-full font-bold text-sm hover:bg-[#2A2A2A] transition-colors"
                >
                  <RefreshCw size={16} className="mr-2" />
                  Rafraichir
                </Link>
                <Link
                  href="/dashboard/abonnement"
                  className="inline-flex items-center px-8 py-3.5 border-2 border-[#0A0A0A] text-[#0A0A0A] rounded-full font-bold text-sm hover:bg-[#0A0A0A] hover:text-white transition-all"
                >
                  Voir mon espace membre
                  <ArrowRight size={16} className="ml-2" />
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
