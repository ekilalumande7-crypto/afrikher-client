"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [visibleItems, setVisibleItems] = useState<boolean[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    // Scroll happens on <main> (snap container), not window
    const handleScroll = () => {
      const main = document.querySelector("main");
      const scrollTop = main ? main.scrollTop : window.scrollY;
      setIsScrolled(scrollTop > 20);
    };
    const main = document.querySelector("main");
    if (main) main.addEventListener("scroll", handleScroll);
    window.addEventListener("scroll", handleScroll);
    return () => {
      if (main) main.removeEventListener("scroll", handleScroll);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Staggered animation for menu items
  useEffect(() => {
    if (isMenuOpen) {
      setVisibleItems(navLinks.map(() => false));
      navLinks.forEach((_, idx) => {
        setTimeout(() => {
          setVisibleItems(prev => {
            const next = [...prev];
            next[idx] = true;
            return next;
          });
        }, 200 + idx * 60);
      });
    } else {
      setVisibleItems([]);
    }
  }, [isMenuOpen]);

  // Lock body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMenuOpen]);

  useEffect(() => {
    let mounted = true;

    async function loadUser() {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (mounted) {
        setUser(authUser ?? null);
      }
    }

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setUser(session?.user ?? null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const navLinks = [
    { id: "01", name: "Accueil", href: "/" },
    { id: "02", name: "Magazine", href: "/magazine" },
    { id: "03", name: "Les Rubriques", href: "/rubriques" },
    { id: "04", name: "Qui sommes-nous", href: "/qui-sommes-nous" },
    { id: "05", name: "Boutique", href: "/boutique" },
    { id: "06", name: "Abonnement", href: "/abonnement" },
    { id: "07", name: "Contact", href: "/contact" },
    { id: "08", name: "Partenaires", href: "/partenaires" },
  ];

  const closeMenu = useCallback(() => setIsMenuOpen(false), []);
  const userLabel = user?.user_metadata?.full_name?.split(" ")[0] || user?.email || "Mon compte";
  const authHref = user ? "/dashboard" : "/auth/login";

  return (
    <>
      {/* ========== HEADER BAR — Logo with MAGAZINE badge + Menu ========== */}
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-[100] transition-all duration-500 px-6 md:px-[10%]",
          isScrolled ? "bg-black/60 backdrop-blur-md py-4 border-b border-white/5" : "bg-transparent py-8"
        )}
      >
        <div className="flex items-center justify-between">
          {/* Logo with gold MAGAZINE badge — tightly integrated */}
          <Link href="/" className="group flex items-center gap-2">
            <span className="text-[1.3rem] md:text-[1.5rem] font-display font-light tracking-[0.2em] text-[#F5F0E8] uppercase leading-none transition-colors duration-300 group-hover:text-[#C9A84C]">
              AFRIKHER
            </span>
            <span className="text-[0.4rem] font-body font-semibold tracking-[0.15em] uppercase text-[#C9A84C]/80 border border-[#C9A84C]/30 px-[6px] py-[2px] leading-none transition-all duration-300 group-hover:bg-[#C9A84C]/10 group-hover:border-[#C9A84C]/50 self-center">
              Magazine
            </span>
          </Link>

          {/* Right side: Login + Menu */}
          <div className="flex items-center gap-6">
            {/* Auth action — visible on desktop */}
            <Link
              href={authHref}
              className="hidden md:inline-flex items-center border border-[#C9A84C]/40 text-[#C9A84C] px-5 py-2 font-body font-medium text-[0.55rem] tracking-[0.2em] uppercase hover:bg-[#C9A84C]/10 hover:border-[#C9A84C]/60 transition-all duration-300"
            >
              {userLabel}
            </Link>

            {/* Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="group flex items-center space-x-4 text-[#F5F0E8] transition-colors duration-300"
            >
            <span className="text-[0.65rem] font-body font-medium tracking-[0.3em] uppercase group-hover:text-[#C9A84C] transition-colors duration-300">
              {isMenuOpen ? "Fermer" : "Menu"}
            </span>
            <div className="flex flex-col justify-center items-end space-y-[5px] w-[20px]">
              <span className={cn(
                "block h-[1px] bg-[#F5F0E8] transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] group-hover:bg-[#C9A84C]",
                isMenuOpen ? "w-[20px] translate-y-[6px] rotate-45" : "w-[20px]"
              )} />
              <span className={cn(
                "block h-[1px] bg-[#F5F0E8] transition-all duration-300 group-hover:bg-[#C9A84C]",
                isMenuOpen ? "opacity-0 w-0" : "w-[14px]"
              )} />
              <span className={cn(
                "block h-[1px] bg-[#F5F0E8] transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] group-hover:bg-[#C9A84C]",
                isMenuOpen ? "w-[20px] -translate-y-[6px] -rotate-45" : "w-[20px]"
              )} />
            </div>
          </button>
          </div>
        </div>
      </header>

      {/* ========== FULLSCREEN MENU OVERLAY ========== */}
      <div
        onClick={closeMenu}
        className={cn(
          "fixed inset-0 z-[120] transition-all duration-700 ease-[cubic-bezier(0.33,1,0.68,1)]",
          isMenuOpen
            ? "opacity-100 pointer-events-auto bg-black/70 backdrop-blur-[16px]"
            : "opacity-0 pointer-events-none bg-black/0 backdrop-blur-0"
        )}
      />

      {/* Menu Panel — Right Drawer */}
      <div
        className={cn(
          "fixed top-0 right-0 bottom-0 w-full md:w-[42%] md:min-w-[480px] z-[130] flex flex-col overflow-hidden",
          "bg-[#0A0A0A] border-l border-[#C9A84C]/10",
          "transition-transform duration-700 ease-[cubic-bezier(0.33,1,0.68,1)]",
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Menu Header */}
        <div className="flex items-center justify-between px-8 md:px-12 pt-10 pb-6">
          <span className="text-[#C9A84C]/40 font-body text-[0.55rem] tracking-[0.4em] uppercase">
            Navigation
          </span>
          <button
            onClick={closeMenu}
            className="group w-10 h-10 flex items-center justify-center border border-white/10 text-[#F5F0E8]/60 hover:border-[#C9A84C] hover:text-[#C9A84C] transition-all duration-500"
          >
            <X size={14} strokeWidth={1.5} />
          </button>
        </div>

        {/* Gold separator */}
        <div className="mx-8 md:mx-12 h-[1px] bg-gradient-to-r from-[#C9A84C]/30 via-[#C9A84C]/10 to-transparent" />

        {/* Navigation Items */}
        <nav className="flex-1 flex flex-col justify-center py-4 px-8 md:px-12">
          {navLinks.map((link, idx) => {
            const isActive = pathname === link.href;
            const isVisible = visibleItems[idx] || false;

            return (
              <div key={link.id} className="group relative">
                {idx > 0 && (
                  <div className="absolute top-0 left-8 right-0 h-[1px] bg-white/[0.04] transition-all duration-500 group-hover:bg-[#C9A84C]/10" />
                )}
                <Link
                  href={link.href}
                  onClick={closeMenu}
                  className={cn(
                    "flex items-center py-[0.9rem] transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] group-hover:translate-x-[6px]",
                    isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-[30px]"
                  )}
                >
                  <span className={cn(
                    "font-body text-[0.6rem] tracking-[0.15em] mr-6 w-5 transition-colors duration-500",
                    isActive ? "text-[#C9A84C]" : "text-white/15 group-hover:text-[#C9A84C]/40"
                  )}>
                    {link.id}
                  </span>
                  <span className={cn(
                    "font-display font-light text-[1.6rem] md:text-[2rem] leading-none tracking-wide transition-colors duration-500",
                    isActive ? "text-[#C9A84C]" : "text-[#F5F0E8] group-hover:text-[#C9A84C]"
                  )}>
                    {link.name}
                  </span>
                  {isActive && (
                    <span className="ml-auto text-[#C9A84C]/40 font-display text-[0.85rem]">——</span>
                  )}
                </Link>
              </div>
            );
          })}
          <div className="mt-2 h-[1px] bg-white/[0.04]" />
        </nav>

        {/* Auth action — inside menu */}
        <div className="px-8 md:px-12 pb-4">
          <Link
            href={authHref}
            onClick={closeMenu}
            className="block w-full text-center bg-[#C9A84C] text-[#0A0A0A] py-3.5 font-body font-medium text-[0.7rem] tracking-[0.25em] uppercase hover:bg-[#E8C97A] transition-all duration-300"
          >
            {userLabel}
          </Link>
        </div>

        {/* Legal links + Footer tagline */}
        <div className="px-8 md:px-12 py-6 border-t border-white/[0.04]">
          <div className="flex flex-wrap gap-x-5 gap-y-1 mb-4">
            {[
              { name: "Conditions d\u2019utilisation", href: "/conditions-utilisation" },
              { name: "Confidentialit\u00e9", href: "/confidentialite" },
              { name: "Cookies", href: "/cookies" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="text-[0.55rem] text-white/20 font-body tracking-[0.1em] hover:text-[#C9A84C]/60 transition-colors duration-300"
              >
                {link.name}
              </Link>
            ))}
          </div>
          <p className={cn(
            "font-display italic text-[0.8rem] text-white/20 text-right transition-all duration-700 delay-[600ms]",
            isMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}>
            L&apos;\u00e9l\u00e9gance hors du commun.
          </p>
        </div>
      </div>
    </>
  );
}
