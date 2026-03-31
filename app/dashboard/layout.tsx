"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { User, Package, CreditCard, LogOut, Settings, Bell, Home } from "lucide-react";

const sidebarLinks = [
  { href: "/dashboard", label: "Profil", icon: User },
  { href: "/dashboard/commandes", label: "Mes Commandes", icon: Package },
  { href: "/dashboard/abonnement", label: "Abonnement", icon: CreditCard },
  { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
  { href: "/dashboard/parametres", label: "Paramètres", icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth/login");
        return;
      }
      setUser(user);

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileData) {
        setProfile(profileData);
      }
      setLoading(false);
    };
    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#C9A84C] border-t-transparent animate-spin rounded-full" />
      </div>
    );
  }

  const displayName = profile?.full_name || user?.user_metadata?.full_name || "Utilisateur";
  const displayEmail = user?.email || "";
  const avatarLetter = displayName.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-[#F5F0E8] text-[#0A0A0A]">
      {/* Top bar simple */}
      <header className="bg-[#0A0A0A] border-b border-[#C9A84C]/20 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <span className="px-2 py-0.5 text-[#0A0A0A] text-[0.4rem] tracking-[0.2em] uppercase font-bold rounded-[1px]"
              style={{ background: "linear-gradient(135deg, #8A6E2F 0%, #C9A84C 25%, #F5F0E8 50%, #C9A84C 75%, #8A6E2F 100%)" }}>
              Magazine
            </span>
            <span className="text-[1.2rem] font-display font-light tracking-[0.3em] text-[#F5F0E8] uppercase">
              AFRIKHER
            </span>
          </Link>
          <div className="flex items-center space-x-6">
            <Link href="/" className="flex items-center space-x-2 text-[#9A9A8A] hover:text-[#F5F0E8] text-xs uppercase tracking-widest transition-colors">
              <Home size={14} />
              <span className="hidden sm:inline">Accueil</span>
            </Link>
            <span className="text-[#F5F0E8] text-sm">{displayName}</span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row items-start gap-10">

          {/* Sidebar */}
          <aside className="w-full md:w-64 space-y-2 flex-shrink-0">
            <div className="p-6 bg-[#0A0A0A] text-[#F5F0E8] mb-6 border border-[#C9A84C]/20">
              <div className="w-14 h-14 bg-[#C9A84C] rounded-full flex items-center justify-center text-[#0A0A0A] text-xl font-bold mb-3">
                {avatarLetter}
              </div>
              <h3 className="font-display text-lg font-bold truncate">{displayName}</h3>
              <p className="text-[#9A9A8A] text-xs truncate">{displayEmail}</p>
            </div>

            {sidebarLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`w-full flex items-center space-x-3 p-4 text-sm uppercase tracking-widest transition-colors ${
                    isActive
                      ? "bg-[#0A0A0A] text-[#C9A84C] font-bold"
                      : "text-[#9A9A8A] hover:bg-[#2A2A2A]/5"
                  }`}
                >
                  <Icon size={18} />
                  <span>{link.label}</span>
                </Link>
              );
            })}

            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 p-4 hover:bg-red-50 text-red-500 text-sm uppercase tracking-widest transition-colors mt-6"
            >
              <LogOut size={18} />
              <span>Déconnexion</span>
            </button>
          </aside>

          {/* Page content */}
          <div className="flex-1 min-w-0">
            {children}
          </div>

        </div>
      </div>
    </div>
  );
}
