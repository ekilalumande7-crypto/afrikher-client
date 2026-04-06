"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { ArrowRight, CreditCard, Package, UserCircle2 } from "lucide-react";
import AccountCard from "@/components/account/AccountCard";
import AccountLoadingBlock from "@/components/account/AccountLoadingBlock";
import AccountSectionHeader from "@/components/account/AccountSectionHeader";

export default function DashboardProfilPage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        setFullName(user.user_metadata?.full_name || "");

        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        if (profileData) {
          setProfile(profileData);
          setFullName(
            profileData.full_name || user.user_metadata?.full_name || ""
          );
        }
      }
    };
    fetchData();
  }, []);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setMessage("");

    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      full_name: fullName,
      updated_at: new Date().toISOString(),
    });

    await supabase.auth.updateUser({
      data: { full_name: fullName },
    });

    if (error) {
      setMessage("Erreur lors de la sauvegarde.");
    } else {
      setMessage("Profil mis à jour avec succès.");
      setEditing(false);
    }
    setSaving(false);
  };

  const joinedAt = useMemo(() => {
    if (!user?.created_at) return "—";
    return new Date(user.created_at).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }, [user?.created_at]);

  if (!user) {
    return <AccountLoadingBlock />;
  }

  const infoItems = [
    { label: "Nom complet", value: fullName || "Non renseigné" },
    { label: "Adresse email", value: user?.email || "—" },
    { label: "Rôle", value: profile?.role || "reader" },
    { label: "Inscrit depuis", value: joinedAt },
  ];

  return (
    <div className="space-y-8">
      <AccountSectionHeader
        eyebrow="Profil"
        title="Votre espace personnel"
        description="Mettez à jour vos informations essentielles et retrouvez en un regard l’état de votre espace membre."
      />

      <AccountCard
        eyebrow="Identité"
        title="Informations personnelles"
        description="Une fiche plus claire pour garder votre profil AFRIKHER à jour, sans friction."
        actions={
          editing ? (
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center justify-center bg-[#C9A84C] px-5 py-3 font-body text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-[#0A0A0A] transition-colors hover:bg-[#E2C872] disabled:opacity-60"
              >
                {saving ? "Enregistrement..." : "Enregistrer"}
              </button>
              <button
                onClick={() => setEditing(false)}
                className="inline-flex items-center justify-center border border-black/10 px-5 py-3 font-body text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-[#0A0A0A]/64 transition-colors hover:border-[#C9A84C] hover:text-[#C9A84C]"
              >
                Annuler
              </button>
            </div>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="inline-flex items-center justify-center bg-[#0A0A0A] px-5 py-3 font-body text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-[#F5F0E8] transition-colors hover:bg-[#C9A84C] hover:text-[#0A0A0A]"
            >
              Modifier le profil
            </button>
          )
        }
      >
        {message && (
          <div
            className={`px-4 py-3 font-body text-sm ${
              message.includes("Erreur")
                ? "border border-red-200 bg-red-50 text-red-600"
                : "border border-emerald-200 bg-emerald-50 text-emerald-700"
            }`}
          >
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {infoItems.map((item) => (
            <div key={item.label} className="border border-black/6 bg-white/45 p-5">
              <p className="font-body text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-[#8A6E2F]">
                {item.label}
              </p>
              {editing && item.label === "Nom complet" ? (
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="mt-3 h-12 w-full border border-[#C9A84C]/22 bg-[#F5F0E8] px-4 font-body text-sm text-[#0A0A0A] outline-none transition-colors focus:border-[#C9A84C]"
                />
              ) : (
                <p className="mt-3 font-body text-[1rem] leading-[1.65] text-[#0A0A0A]/74">
                  {item.value}
                </p>
              )}
            </div>
          ))}
        </div>
      </AccountCard>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <AccountCard
          eyebrow="Adhésion"
          title="Statut membre"
          description="Votre accès et vos perspectives d’évolution, sans logique de pricing lourde."
          contentClassName="!space-y-0"
        >
          <div className="border border-[#C9A84C]/18 bg-[#F5F0E8] p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-body text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-[#C9A84C]">
                  Plan actuel
                </p>
                <h3 className="mt-3 font-display text-[2rem] leading-[1] tracking-[-0.02em] text-[#0A0A0A]">
                  Gratuit
                </h3>
                <p className="mt-3 max-w-[24rem] font-body text-[0.94rem] leading-[1.72] text-[#0A0A0A]/58">
                  Vous profitez actuellement d’un accès public aux contenus
                  ouverts. Le passage à l’abonnement enrichit votre lecture et vos
                  privilèges.
                </p>
              </div>
              <CreditCard size={24} className="shrink-0 text-[#C9A84C]" />
            </div>

            <Link
              href="/abonnement"
              className="mt-6 inline-flex items-center gap-2 font-body text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-[#0A0A0A] transition-colors hover:text-[#C9A84C]"
            >
              Découvrir les offres
              <ArrowRight size={14} />
            </Link>
          </div>
        </AccountCard>

        <AccountCard
          eyebrow="Boutique"
          title="Dernière commande"
          description="Un accès plus direct à vos achats et à votre univers éditorial."
          contentClassName="!space-y-0"
        >
          <div className="border border-black/6 bg-white/45 p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-body text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-[#8A6E2F]">
                  Historique
                </p>
                <h3 className="mt-3 font-display text-[1.9rem] leading-[1] tracking-[-0.02em] text-[#0A0A0A]">
                  Aucune commande
                </h3>
                <p className="mt-3 max-w-[24rem] font-body text-[0.94rem] leading-[1.72] text-[#0A0A0A]/58">
                  Vous n’avez pas encore passé de commande. La boutique AFRIKHER
                  reste accessible pour découvrir les sélections en cours.
                </p>
              </div>
              <Package size={24} className="shrink-0 text-[#C9A84C]" />
            </div>

            <Link
              href="/boutique"
              className="mt-6 inline-flex items-center gap-2 font-body text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-[#0A0A0A] transition-colors hover:text-[#C9A84C]"
            >
              Visiter la boutique
              <ArrowRight size={14} />
            </Link>
          </div>
        </AccountCard>
      </div>

      <AccountCard
        eyebrow="Rappel"
        title="Une expérience membre plus cohérente"
        description="Votre espace client se restructure pour mieux mettre en valeur vos contenus, vos avantages et votre parcours au sein de l’univers AFRIKHER."
        contentClassName="!space-y-0"
      >
        <div className="flex items-start gap-4 border border-black/6 bg-white/45 p-6">
          <UserCircle2 size={22} className="mt-1 shrink-0 text-[#C9A84C]" />
          <p className="font-body text-[0.95rem] leading-[1.78] text-[#0A0A0A]/62">
            Cet espace devient un véritable point d’ancrage personnel : plus
            calme, plus lisible, plus aligné avec l’identité éditoriale
            AFRIKHER.
          </p>
        </div>
      </AccountCard>
    </div>
  );
}
