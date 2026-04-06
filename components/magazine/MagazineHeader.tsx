"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { id: "01", name: "Accueil", href: "/" },
  { id: "02", name: "Magazine", href: "/magazine" },
  { id: "03", name: "Les Rubriques", href: "/rubriques" },
  { id: "04", name: "Qui sommes-nous", href: "/qui-sommes-nous" },
  { id: "05", name: "Boutique", href: "/boutique" },
  { id: "06", name: "Blog", href: "/blog" },
  { id: "07", name: "Abonnement", href: "/abonnement" },
  { id: "08", name: "Contact", href: "/contact" },
  { id: "09", name: "Partenaires", href: "/partenaires" },
];

interface MagazineHeaderProps {
  isAuthenticated: boolean;
}

export default function MagazineHeader({
  isAuthenticated,
}: MagazineHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [visibleItems, setVisibleItems] = useState<boolean[]>([]);

  useEffect(() => {
    if (!isMenuOpen) {
      setVisibleItems([]);
      return;
    }

    setVisibleItems(navLinks.map(() => false));
    navLinks.forEach((_, idx) => {
      setTimeout(() => {
        setVisibleItems((prev) => {
          const next = [...prev];
          next[idx] = true;
          return next;
        });
      }, 120 + idx * 55);
    });
  }, [isMenuOpen]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const closeMenu = useCallback(() => setIsMenuOpen(false), []);

  return (
    <>
      <header className="sticky top-0 z-[100] h-20 border-b border-[#C9A84C]/10 bg-[#0A0A0A]/94 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-12 h-full flex items-center justify-between">
          <Link href="/" className="group flex items-center gap-2">
            <span className="font-display text-[1.45rem] md:text-[1.6rem] font-light tracking-[0.18em] text-[#F5F0E8] uppercase transition-colors duration-300 group-hover:text-[#C9A84C]">
              AFRIKHER
            </span>
            <span className="border border-[#C9A84C]/30 px-2.5 py-[0.34rem] font-body text-[0.48rem] font-semibold tracking-[0.18em] uppercase leading-none text-[#C9A84C] transition-all duration-300 group-hover:border-[#C9A84C]/60 group-hover:bg-[#C9A84C]/10">
              Magazine
            </span>
          </Link>

          <div className="flex items-center gap-4 md:gap-6">
            <Link
              href={isAuthenticated ? "/dashboard" : "/auth/login"}
              className="hidden sm:inline-flex items-center border border-[#C9A84C]/28 px-[1.125rem] py-2.5 font-body text-[0.58rem] font-medium uppercase tracking-[0.22em] text-[#C9A84C] transition-all duration-300 hover:border-[#C9A84C]/55 hover:bg-[#C9A84C]/10"
            >
              {isAuthenticated ? "Mon espace" : "Se connecter"}
            </Link>

            <button
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="group flex items-center gap-3 text-[#F5F0E8]"
            >
              <span className="font-body text-[0.58rem] font-medium uppercase tracking-[0.28em] transition-colors duration-300 group-hover:text-[#C9A84C]">
                {isMenuOpen ? "Fermer" : "Menu"}
              </span>
              <div className="flex w-5 flex-col items-end justify-center space-y-[5px]">
                <span
                  className={cn(
                    "block h-px bg-[#F5F0E8] transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] group-hover:bg-[#C9A84C]",
                    isMenuOpen ? "w-5 translate-y-[6px] rotate-45" : "w-5"
                  )}
                />
                <span
                  className={cn(
                    "block h-px bg-[#F5F0E8] transition-all duration-300 group-hover:bg-[#C9A84C]",
                    isMenuOpen ? "w-0 opacity-0" : "w-3.5"
                  )}
                />
                <span
                  className={cn(
                    "block h-px bg-[#F5F0E8] transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] group-hover:bg-[#C9A84C]",
                    isMenuOpen ? "w-5 -translate-y-[6px] -rotate-45" : "w-5"
                  )}
                />
              </div>
            </button>
          </div>
        </div>
      </header>

      <div
        onClick={closeMenu}
        className={cn(
          "fixed inset-0 z-[120] transition-all duration-700 ease-[cubic-bezier(0.33,1,0.68,1)]",
          isMenuOpen
            ? "pointer-events-auto bg-black/65 opacity-100 backdrop-blur-[12px]"
            : "pointer-events-none bg-black/0 opacity-0"
        )}
      />

      <div
        className={cn(
          "fixed top-0 right-0 bottom-0 z-[130] w-full md:w-[36rem] max-w-full overflow-hidden border-l border-[#C9A84C]/10 bg-[#0A0A0A] transition-transform duration-700 ease-[cubic-bezier(0.33,1,0.68,1)]",
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between px-8 md:px-10 pt-8 pb-5">
            <span className="font-body text-[0.58rem] uppercase tracking-[0.36em] text-[#C9A84C]/45">
              Navigation
            </span>
            <button
              onClick={closeMenu}
              className="flex h-10 w-10 items-center justify-center border border-white/10 text-[#F5F0E8]/60 transition-all duration-300 hover:border-[#C9A84C] hover:text-[#C9A84C]"
            >
              <X size={14} strokeWidth={1.5} />
            </button>
          </div>

          <div className="mx-8 md:mx-10 h-px bg-gradient-to-r from-[#C9A84C]/30 via-[#C9A84C]/10 to-transparent" />

          <nav className="flex flex-1 flex-col justify-center px-8 md:px-10 py-4">
            {navLinks.map((link, idx) => (
              <div key={link.id} className="group relative">
                {idx > 0 && (
                  <div className="absolute top-0 left-8 right-0 h-px bg-white/[0.04] transition-all duration-300 group-hover:bg-[#C9A84C]/12" />
                )}
                <Link
                  href={link.href}
                  onClick={closeMenu}
                  className={cn(
                    "flex items-center py-3.5 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] group-hover:translate-x-1.5",
                    visibleItems[idx] ? "translate-x-0 opacity-100" : "translate-x-6 opacity-0"
                  )}
                >
                  <span
                    className={cn(
                      "mr-6 w-5 font-body text-[0.6rem] tracking-[0.16em] transition-colors duration-300",
                      link.href === "/magazine"
                        ? "text-[#C9A84C]"
                        : "text-white/20 group-hover:text-[#C9A84C]/55"
                    )}
                  >
                    {link.id}
                  </span>
                  <span
                    className={cn(
                      "font-display text-[1.55rem] md:text-[1.8rem] font-light leading-none tracking-wide transition-colors duration-300",
                      link.href === "/magazine"
                        ? "text-[#C9A84C]"
                        : "text-[#F5F0E8] group-hover:text-[#C9A84C]"
                    )}
                  >
                    {link.name}
                  </span>
                </Link>
              </div>
            ))}
            <div className="mt-2 h-px bg-white/[0.04]" />
          </nav>

          <div className="px-8 md:px-10 pb-4">
            <Link
              href={isAuthenticated ? "/dashboard" : "/auth/login"}
              onClick={closeMenu}
              className="block w-full bg-[#C9A84C] py-[0.8125rem] text-center font-body text-[0.64rem] font-medium uppercase tracking-[0.22em] text-[#0A0A0A] transition-colors duration-300 hover:bg-[#E8C97A]"
            >
              {isAuthenticated ? "Mon espace" : "Se connecter"}
            </Link>
          </div>

          <div className="border-t border-white/[0.04] px-8 md:px-10 py-6">
            <p className="font-display text-[0.92rem] italic text-right text-white/30">
              L&apos;élégance hors du commun.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
