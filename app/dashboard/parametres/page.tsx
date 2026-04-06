"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Eye, EyeOff, Mail, Shield, Trash2 } from "lucide-react";
import AccountCard from "@/components/account/AccountCard";
import AccountSectionHeader from "@/components/account/AccountSectionHeader";

export default function ParametresPage() {
  const [user, setUser] = useState<any>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUser(user);

        const { data } = await supabase
          .from("newsletter_subscribers")
          .select("active")
          .eq("email", user.email)
          .single();

        if (data) {
          setNewsletterSubscribed(data.active);
        }
      }
    };
    fetchUser();
  }, []);

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      setMessage("Les mots de passe ne correspondent pas.");
      return;
    }
    if (newPassword.length < 6) {
      setMessage("Le mot de passe doit faire au moins 6 caractères.");
      return;
    }

    setSaving(true);
    setMessage("");

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      setMessage("Erreur : " + error.message);
    } else {
      setMessage("Mot de passe modifié avec succès.");
      setNewPassword("");
      setConfirmPassword("");
    }
    setSaving(false);
  };

  const toggleNewsletter = async () => {
    if (!user?.email) return;

    if (newsletterSubscribed) {
      await supabase
        .from("newsletter_subscribers")
        .update({ active: false, unsubscribed_at: new Date().toISOString() })
        .eq("email", user.email);
      setNewsletterSubscribed(false);
    } else {
      await supabase.from("newsletter_subscribers").upsert({
        email: user.email,
        full_name: user.user_metadata?.full_name || "",
        active: true,
        subscribed_at: new Date().toISOString(),
      });
      setNewsletterSubscribed(true);
    }
  };

  return (
    <div className="space-y-8">
      <AccountSectionHeader
        eyebrow="Réglages"
        title="Paramètres du compte"
        description="Gérez votre sécurité, vos préférences éditoriales et les points sensibles de votre espace avec plus de clarté."
      />

      <AccountCard
        eyebrow="Sécurité"
        title="Modifier votre mot de passe"
        description="Un espace plus propre pour renforcer l’accès à votre compte sans friction inutile."
      >
        {message && (
          <div
            className={`px-4 py-3 font-body text-sm ${
              message.includes("Erreur") ||
              message.includes("correspondent") ||
              message.includes("caractères")
                ? "border border-red-200 bg-red-50 text-red-600"
                : "border border-emerald-200 bg-emerald-50 text-emerald-700"
            }`}
          >
            {message}
          </div>
        )}

        <div className="grid max-w-3xl grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2.5 block font-body text-[0.64rem] font-semibold uppercase tracking-[0.24em] text-[#8A6E2F]">
              Nouveau mot de passe
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="h-12 w-full border border-black/10 bg-[#F5F0E8] px-4 pr-11 font-body text-sm text-[#0A0A0A] outline-none transition-colors focus:border-[#C9A84C]"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8D877C] transition-colors hover:text-[#C9A84C]"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label className="mb-2.5 block font-body text-[0.64rem] font-semibold uppercase tracking-[0.24em] text-[#8A6E2F]">
              Confirmer le mot de passe
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-12 w-full border border-black/10 bg-[#F5F0E8] px-4 pr-11 font-body text-sm text-[#0A0A0A] outline-none transition-colors focus:border-[#C9A84C]"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8D877C] transition-colors hover:text-[#C9A84C]"
              >
                {showConfirmPassword ? (
                  <EyeOff size={16} />
                ) : (
                  <Eye size={16} />
                )}
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={handlePasswordChange}
          disabled={saving || !newPassword}
          className="inline-flex items-center justify-center bg-[#0A0A0A] px-6 py-3 font-body text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-[#F5F0E8] transition-colors hover:bg-[#C9A84C] hover:text-[#0A0A0A] disabled:opacity-60"
        >
          {saving ? "Modification..." : "Mettre à jour"}
        </button>
      </AccountCard>

      <AccountCard
        eyebrow="Préférences"
        title="Newsletter AFRIKHER"
        description="Choisissez si vous souhaitez continuer à recevoir nos portraits, interviews et actualités éditoriales."
      >
        <div className="flex flex-col gap-5 border border-black/6 bg-white/45 p-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 items-center justify-center bg-[#F5F0E8] text-[#C9A84C]">
              <Mail size={18} />
            </div>
            <div>
              <p className="font-body text-[0.98rem] font-medium text-[#0A0A0A]">
                Recevoir la newsletter AFRIKHER
              </p>
              <p className="mt-2 max-w-[30rem] font-body text-[0.92rem] leading-[1.72] text-[#0A0A0A]/56">
                Un rendez-vous plus régulier avec les interviews, les sélections
                et les actualités portées par notre univers.
              </p>
            </div>
          </div>

          <button
            onClick={toggleNewsletter}
            className={`relative h-7 w-14 rounded-full transition-colors ${
              newsletterSubscribed ? "bg-[#C9A84C]" : "bg-black/15"
            }`}
          >
            <span
              className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                newsletterSubscribed ? "translate-x-8" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </AccountCard>

      <AccountCard
        eyebrow="Sensibilité"
        title="Zone de vigilance"
        description="Les demandes liées à la suppression du compte nécessitent encore un accompagnement direct pour garantir un traitement sûr."
        className="border-red-200"
      >
        <div className="flex items-start gap-4 border border-red-200 bg-red-50 p-6">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-white text-red-500">
            <Shield size={18} />
          </div>
          <div>
            <h3 className="font-display text-[1.6rem] leading-[1] tracking-[-0.02em] text-red-600">
              Suppression du compte
            </h3>
            <p className="mt-3 font-body text-[0.94rem] leading-[1.72] text-red-700/82">
              Cette action est irréversible. Pour toute demande de suppression,
              écrivez à contact@afrikher.com afin que notre équipe vous accompagne
              avec attention.
            </p>
          </div>
          <Trash2 size={18} className="mt-1 shrink-0 text-red-500" />
        </div>
      </AccountCard>
    </div>
  );
}
