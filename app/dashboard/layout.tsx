"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { ChevronRight, Loader2 } from "lucide-react";
import AccountSidebar from "@/components/account/AccountSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

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
      <div className="flex min-h-screen items-center justify-center bg-[#0A0A0A]">
        <Loader2 size={42} className="animate-spin text-[#C9A84C]" />
      </div>
    );
  }

  const displayName =
    profile?.full_name || user?.user_metadata?.full_name || "Membre AFRIKHER";
  const displayEmail = user?.email || "";
  const avatarLetter = displayName.charAt(0).toUpperCase();

  return (
    <main className="min-h-screen bg-[#F5F0E8] text-[#0A0A0A]">
      <div className="border-b border-[#C9A84C]/16 bg-[#0A0A0A] px-6 py-5 text-[#F5F0E8]">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 md:px-10 lg:px-12">
          <div className="flex items-center justify-between gap-6">
            <Link href="/" className="group inline-flex items-center gap-2">
              <span className="font-display text-[1.25rem] font-light uppercase tracking-[0.24em] text-[#F5F0E8] transition-colors group-hover:text-[#C9A84C]">
                AFRIKHER
              </span>
              <span className="border border-[#C9A84C]/30 px-[6px] py-[2px] font-body text-[0.42rem] font-semibold uppercase tracking-[0.18em] text-[#C9A84C]">
                Membre
              </span>
            </Link>

            <div className="hidden items-center gap-3 text-[0.7rem] uppercase tracking-[0.24em] text-[#F5F0E8]/42 md:flex">
              <span>Espace personnel</span>
              <ChevronRight size={13} />
              <span className="text-[#C9A84C]">Tableau de bord</span>
            </div>
          </div>

          <div className="max-w-[32rem]">
            <p className="font-body text-[0.66rem] uppercase tracking-[0.32em] text-[#C9A84C]">
              Espace client
            </p>
            <h1 className="mt-3 font-display text-[2.3rem] leading-[0.98] tracking-[-0.03em] md:text-[3.2rem]">
              Votre univers membre AFRIKHER
            </h1>
            <p className="mt-3 font-body text-[0.95rem] leading-[1.72] text-[#F5F0E8]/56">
              Retrouvez vos informations, vos avantages, vos commandes et vos
              préférences dans un espace plus calme, plus net et plus personnel.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8 md:px-10 lg:px-12 lg:py-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          <AccountSidebar
            displayName={displayName}
            displayEmail={displayEmail}
            avatarLetter={avatarLetter}
            onLogout={handleLogout}
          />

          <div className="min-w-0 flex-1">{children}</div>
        </div>
      </div>
    </main>
  );
}
