"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, CreditCard, Home, LogOut, Package, Settings, User } from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarLinks = [
  { href: "/dashboard", label: "Profil", icon: User },
  { href: "/dashboard/commandes", label: "Mes commandes", icon: Package },
  { href: "/dashboard/abonnement", label: "Abonnement", icon: CreditCard },
  { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
  { href: "/dashboard/parametres", label: "Paramètres", icon: Settings },
];

interface AccountSidebarProps {
  displayName: string;
  displayEmail: string;
  avatarLetter: string;
  onLogout: () => void;
}

export default function AccountSidebar({
  displayName,
  displayEmail,
  avatarLetter,
  onLogout,
}: AccountSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-full space-y-5 lg:w-[18.5rem] lg:flex-shrink-0">
      <div className="border border-[#C9A84C]/20 bg-[#0A0A0A] p-6 text-[#F5F0E8] shadow-[0_24px_60px_rgba(0,0,0,0.16)]">
        <p className="font-body text-[0.62rem] uppercase tracking-[0.3em] text-[#C9A84C]">
          Espace membre
        </p>
        <div className="mt-5 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#C9A84C] font-display text-xl text-[#0A0A0A]">
            {avatarLetter}
          </div>
          <div className="min-w-0">
            <p className="truncate font-display text-[1.2rem] leading-[1.05] tracking-[-0.02em]">
              {displayName}
            </p>
            <p className="mt-1 truncate font-body text-[0.78rem] text-[#F5F0E8]/52">
              {displayEmail}
            </p>
          </div>
        </div>
      </div>

      <div className="hidden border border-black/8 bg-[#FBF7F0] p-3 shadow-[0_18px_50px_rgba(0,0,0,0.04)] lg:block">
        <nav className="space-y-1">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 font-body text-[0.74rem] uppercase tracking-[0.18em] transition-colors",
                  isActive
                    ? "bg-[#0A0A0A] text-[#C9A84C]"
                    : "text-[#0A0A0A]/56 hover:bg-[#F2EBDF] hover:text-[#0A0A0A]"
                )}
              >
                <Icon size={16} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-4 border-t border-black/8 pt-4">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 font-body text-[0.72rem] uppercase tracking-[0.18em] text-[#0A0A0A]/56 transition-colors hover:text-[#C9A84C]"
          >
            <Home size={16} />
            <span>Accueil</span>
          </Link>
          <button
            onClick={onLogout}
            className="flex w-full items-center gap-3 px-4 py-3 text-left font-body text-[0.72rem] uppercase tracking-[0.18em] text-red-500 transition-colors hover:bg-red-50"
          >
            <LogOut size={16} />
            <span>Déconnexion</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto border border-black/8 bg-[#FBF7F0] p-3 shadow-[0_18px_50px_rgba(0,0,0,0.04)] lg:hidden">
        <nav className="flex gap-2">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "whitespace-nowrap border px-4 py-2.5 font-body text-[0.68rem] uppercase tracking-[0.18em]",
                  isActive
                    ? "border-[#0A0A0A] bg-[#0A0A0A] text-[#C9A84C]"
                    : "border-black/8 bg-white/70 text-[#0A0A0A]/58"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
