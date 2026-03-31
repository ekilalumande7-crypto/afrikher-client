"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function DashboardProfilPage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
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
          setFullName(profileData.full_name || user.user_metadata?.full_name || "");
        }
      }
    };
    fetchData();
  }, []);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setMessage("");

    // Update profiles table
    const { error } = await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        full_name: fullName,
        updated_at: new Date().toISOString(),
      });

    // Also update auth metadata
    await supabase.auth.updateUser({
      data: { full_name: fullName }
    });

    if (error) {
      setMessage("Erreur lors de la sauvegarde.");
    } else {
      setMessage("Profil mis à jour avec succès !");
      setEditing(false);
    }
    setSaving(false);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-8 md:p-10 border border-[#2A2A2A]/10 shadow-sm">
        <h2 className="text-2xl md:text-3xl font-display font-bold mb-8">Informations Personnelles</h2>

        {message && (
          <div className={`mb-6 p-4 text-sm ${message.includes("Erreur") ? "bg-red-50 text-red-600 border border-red-200" : "bg-green-50 text-green-700 border border-green-200"}`}>
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-[#9A9A8A] font-bold">Nom complet</label>
            {editing ? (
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full border border-[#C9A84C]/40 bg-[#F5F0E8] py-2 px-3 text-[#0A0A0A] focus:outline-none focus:border-[#C9A84C]"
              />
            ) : (
              <p className="border-b border-[#2A2A2A]/10 py-2 text-[#0A0A0A]">{fullName || "Non renseigné"}</p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-[#9A9A8A] font-bold">Email</label>
            <p className="border-b border-[#2A2A2A]/10 py-2 text-[#0A0A0A]">{user?.email}</p>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-[#9A9A8A] font-bold">Rôle</label>
            <p className="border-b border-[#2A2A2A]/10 py-2 text-[#0A0A0A] capitalize">{profile?.role || "reader"}</p>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-[#9A9A8A] font-bold">Inscrit depuis</label>
            <p className="border-b border-[#2A2A2A]/10 py-2 text-[#0A0A0A]">
              {user?.created_at ? new Date(user.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }) : "—"}
            </p>
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          {editing ? (
            <>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-8 py-3 bg-[#C9A84C] text-[#0A0A0A] text-xs uppercase tracking-widest font-bold hover:bg-[#E8C97A] transition-all disabled:opacity-50"
              >
                {saving ? "Enregistrement..." : "Enregistrer"}
              </button>
              <button
                onClick={() => setEditing(false)}
                className="px-8 py-3 border border-[#2A2A2A]/20 text-[#9A9A8A] text-xs uppercase tracking-widest hover:bg-[#2A2A2A]/5 transition-all"
              >
                Annuler
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="px-8 py-3 bg-[#0A0A0A] text-[#F5F0E8] text-xs uppercase tracking-widest hover:bg-[#C9A84C] hover:text-[#0A0A0A] transition-all"
            >
              Modifier le profil
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 border border-[#2A2A2A]/10 shadow-sm">
          <h3 className="text-xl font-display font-bold mb-6">Abonnement Actuel</h3>
          <div className="p-5 bg-[#F5F0E8] border border-[#C9A84C]/20">
            <p className="text-xs uppercase tracking-widest text-[#C9A84C] font-bold mb-2">Plan Gratuit</p>
            <p className="text-[#9A9A8A] text-sm mb-4">Accès limité aux articles publics.</p>
            <Link href="/abonnement" className="text-xs uppercase tracking-widest text-[#0A0A0A] font-bold border-b border-[#0A0A0A] pb-1">
              Passer au Premium
            </Link>
          </div>
        </div>

        <div className="bg-white p-8 border border-[#2A2A2A]/10 shadow-sm">
          <h3 className="text-xl font-display font-bold mb-6">Dernière Commande</h3>
          <div className="text-center py-6">
            <p className="text-[#9A9A8A] text-sm italic">Vous n&apos;avez pas encore passé de commande.</p>
            <Link href="/boutique" className="inline-block mt-4 text-xs uppercase tracking-widest text-[#C9A84C] font-bold border-b border-[#C9A84C] pb-1">
              Visiter la boutique
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
