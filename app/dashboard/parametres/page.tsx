"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Shield, Mail, Trash2 } from "lucide-react";

export default function ParametresPage() {
  const [user, setUser] = useState<any>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);

        // Check newsletter subscription
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
      setMessage("Mot de passe modifié avec succès !");
      setCurrentPassword("");
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
      await supabase
        .from("newsletter_subscribers")
        .upsert({
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
      {/* Change Password */}
      <div className="bg-white p-8 md:p-10 border border-[#2A2A2A]/10 shadow-sm">
        <div className="flex items-center gap-3 mb-8">
          <Shield size={20} className="text-[#C9A84C]" />
          <h2 className="text-2xl font-display font-bold">Sécurité</h2>
        </div>

        {message && (
          <div className={`mb-6 p-4 text-sm ${message.includes("Erreur") || message.includes("correspondent") || message.includes("caractères") ? "bg-red-50 text-red-600 border border-red-200" : "bg-green-50 text-green-700 border border-green-200"}`}>
            {message}
          </div>
        )}

        <div className="space-y-4 max-w-md">
          <div>
            <label className="text-[10px] uppercase tracking-widest text-[#9A9A8A] font-bold block mb-2">
              Nouveau mot de passe
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border border-[#2A2A2A]/20 bg-[#F5F0E8] py-3 px-4 text-[#0A0A0A] focus:outline-none focus:border-[#C9A84C]"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-widest text-[#9A9A8A] font-bold block mb-2">
              Confirmer le mot de passe
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border border-[#2A2A2A]/20 bg-[#F5F0E8] py-3 px-4 text-[#0A0A0A] focus:outline-none focus:border-[#C9A84C]"
              placeholder="••••••••"
            />
          </div>
          <button
            onClick={handlePasswordChange}
            disabled={saving || !newPassword}
            className="px-8 py-3 bg-[#0A0A0A] text-[#F5F0E8] text-xs uppercase tracking-widest font-bold hover:bg-[#C9A84C] hover:text-[#0A0A0A] transition-all disabled:opacity-50"
          >
            {saving ? "Modification..." : "Changer le mot de passe"}
          </button>
        </div>
      </div>

      {/* Newsletter */}
      <div className="bg-white p-8 md:p-10 border border-[#2A2A2A]/10 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <Mail size={20} className="text-[#C9A84C]" />
          <h2 className="text-2xl font-display font-bold">Newsletter</h2>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-[#0A0A0A]">Recevoir la newsletter AFRIKHER</p>
            <p className="text-xs text-[#9A9A8A] mt-1">Portraits, interviews et actualités business.</p>
          </div>
          <button
            onClick={toggleNewsletter}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              newsletterSubscribed ? "bg-[#C9A84C]" : "bg-[#2A2A2A]/20"
            }`}
          >
            <span
              className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                newsletterSubscribed ? "translate-x-6" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white p-8 md:p-10 border border-red-200 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <Trash2 size={20} className="text-red-500" />
          <h2 className="text-2xl font-display font-bold text-red-600">Zone de danger</h2>
        </div>
        <p className="text-sm text-[#9A9A8A] mb-4">
          La suppression du compte est irréversible. Contactez-nous à contact@afrikher.com pour demander la suppression de votre compte.
        </p>
      </div>
    </div>
  );
}
