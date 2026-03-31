"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  // Track which items are visible for staggered animation
  const [visibleItems, setVisibleItems] = useState<boolean[]>([]);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Staggered animation for menu items
  useEffect(() => {
    if (isMegaMenuOpen) {
      // Reset all items to hidden
      setVisibleItems(navLinks.map(() => false));
      // Stagger each item appearance
      navLinks.forEach((_, idx) => {
        setTimeout(() => {
          setVisibleItems(prev => {
            const next = [...prev];
            next[idx] = true;
            return next;
          });
        }, 150 + idx * 70); // Start after panel slides in, then stagger
      });
    } else {
      setVisibleItems([]);
    }
  }, [isMegaMenuOpen]);

  // Same for mobile menu
  useEffect(() => {
    if (isMobileMenuOpen) {
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
  }, [isMobileMenuOpen]);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isMegaMenuOpen || isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isMegaMenuOpen, isMobileMenuOpen]);

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

  const closeAll = useCallback(() => {
    setIsMegaMenuOpen(false);
    setIsMobileMenuOpen(false);
  }, []);

  return (
    <>
      {/* ========== HEADER BAR ========== */}
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-[100] transition-all duration-500 px-6 md:px-12 py-6",
          isScrolled ? "bg-black/40 backdrop-blur-sm py-4 border-b border-white/5" : "bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Wordmark Logo */}
          <div className="flex flex-col items-start">
            <span
              className="px-2 py-0.5 text-[#0A0A0A] text-[0.45rem] tracking-[0.2em] uppercase font-body font-bold rounded-[1px] mb-1 shadow-[0_1px_3px_rgba(0,0,0,0.3)] animate-gold-shine"
              style={{
                background: "linear-gradient(135deg, #8A6E2F 0%, #C9A84C 25%, #F5F0E8 50%, #C9A84C 75%, #8A6E2F 100%)",
                backgroundSize: "200% 200%",
              }}
            >
              Magazine
            </span>
            <Link href="/" className="text-[1.5rem] font-display font-light tracking-[0.3em] text-[#F5F0E8] uppercase leading-none">
              AFRIKHER
            </Link>
          </div>

          {/* Right Side: Links & Menu Toggle */}
          <div className="flex items-center space-x-8">
            {/* Desktop Links */}
            <div className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => setIsAboutModalOpen(true)}
                className="text-[0.7rem] font-body font-light tracking-[0.2em] text-[#F5F0E8] uppercase hover:opacity-70 transition-opacity cursor-pointer"
              >
                EN SAVOIR PLUS
              </button>

              <Link
                href="/auth/login"
                className="text-[0.7rem] font-body font-light tracking-[0.2em] text-[#C9A84C] uppercase hover:text-[#E8C97A] transition-colors duration-300 border border-[#C9A84C]/40 px-4 py-2 hover:border-[#C9A84C] hover:bg-[#C9A84C]/10"
              >
                SE CONNECTER
              </Link>

              <button
                onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
                className="group flex items-center space-x-4 text-[#F5F0E8] transition-colors duration-300"
              >
                <span className="text-[0.7rem] font-body font-light tracking-[0.25em] uppercase group-hover:text-[#C9A84C] transition-colors duration-300">
                  {isMegaMenuOpen ? "FERMER" : "MENU"}
                </span>
                <div className="flex flex-col justify-center items-end space-y-[5px] w-[18px]">
                  <span className={cn(
                    "block h-[1px] bg-[#F5F0E8] transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] group-hover:bg-[#C9A84C]",
                    isMegaMenuOpen ? "w-[18px] translate-y-[6px] rotate-45" : "w-[18px]"
                  )} />
                  <span className={cn(
                    "block h-[1px] bg-[#F5F0E8] transition-all duration-300 group-hover:bg-[#C9A84C]",
                    isMegaMenuOpen ? "opacity-0 w-0" : "w-[18px]"
                  )} />
                  <span className={cn(
                    "block h-[1px] bg-[#F5F0E8] transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] group-hover:bg-[#C9A84C]",
                    isMegaMenuOpen ? "w-[18px] -translate-y-[6px] -rotate-45" : "w-[18px]"
                  )} />
                </div>
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden text-[#F5F0E8]"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <div className="flex flex-col justify-center items-end space-y-[5px] w-[24px]">
                <span className={cn(
                  "block h-[1px] w-full bg-[#F5F0E8] transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]",
                  isMobileMenuOpen ? "rotate-45 translate-y-[6px]" : ""
                )} />
                <span className={cn(
                  "block h-[1px] w-full bg-[#F5F0E8] transition-all duration-300",
                  isMobileMenuOpen ? "opacity-0" : ""
                )} />
                <span className={cn(
                  "block h-[1px] w-full bg-[#F5F0E8] transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]",
                  isMobileMenuOpen ? "-rotate-45 -translate-y-[6px]" : ""
                )} />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* ========== ABOUT MODAL ========== */}
      <div
        className={cn(
          "fixed inset-0 z-[200] flex items-center justify-center p-6 transition-all duration-500",
          isAboutModalOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      >
        <div
          onClick={() => setIsAboutModalOpen(false)}
          className={cn(
            "absolute inset-0 bg-black/90 backdrop-blur-md transition-opacity duration-500",
            isAboutModalOpen ? "opacity-100" : "opacity-0"
          )}
        />

        <div
          className={cn(
            "relative w-full max-w-2xl bg-[#0A0A0A] border border-[#C9A84C]/20 p-8 md:p-16 overflow-y-auto max-h-[90vh] transition-all duration-700 ease-[cubic-bezier(0.33,1,0.68,1)]",
            isAboutModalOpen ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"
          )}
        >
          <button
            onClick={() => setIsAboutModalOpen(false)}
            className="absolute top-6 right-6 text-[#F5F0E8]/40 hover:text-[#F5F0E8] transition-colors"
          >
            <X size={24} strokeWidth={1} />
          </button>

          <div className="flex flex-col items-center text-center">
            <h3 className="font-display italic text-[2rem] md:text-[2.5rem] text-[#F5F0E8] mb-8">
              Le Magazine.
            </h3>

            <div className="space-y-6 text-[#F5F0E8]/80 font-display font-light text-[1.1rem] md:text-[1.2rem] leading-relaxed">
              <p>
                AFRIKHER est un magazine éditorial premium dédié à l&apos;entrepreneuriat féminin africain.
                Nous mettons en lumière les femmes qui entreprennent, innovent et transforment l&apos;Afrique d&apos;aujourd&apos;hui et de demain.
              </p>

              <p>
                À travers des portraits inspirants, des récits authentiques et des analyses business,
                AFRIKHER célèbre un leadership féminin audacieux, élégant et visionnaire.
              </p>

              <p className="gold-text-tagline font-normal">
                Plus qu&apos;un média, AFRIKHER est une plateforme d&apos;inspiration, de visibilité et d&apos;influence pour celles qui osent bâtir leur propre avenir.
              </p>
            </div>

            <button
              onClick={() => setIsAboutModalOpen(false)}
              className="mt-12 border border-[#C9A84C] text-[#C9A84C] px-12 py-3 font-body text-[0.7rem] tracking-[0.2em] uppercase hover:bg-[#C9A84C] hover:text-[#0A0A0A] transition-all duration-300"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>

      {/* ========== DESKTOP MEGA MENU — SLIDE DRAWER ========== */}
      {/* Backdrop overlay with blur — always in DOM */}
      <div
        onClick={() => setIsMegaMenuOpen(false)}
        className={cn(
          "fixed inset-0 z-[120] transition-all duration-700 ease-[cubic-bezier(0.33,1,0.68,1)]",
          isMegaMenuOpen
            ? "opacity-100 pointer-events-auto bg-black/60 backdrop-blur-[12px]"
            : "opacity-0 pointer-events-none bg-black/0 backdrop-blur-0"
        )}
      />

      {/* Drawer panel — always in DOM, slides via transform */}
      <div
        className={cn(
          "hidden md:flex fixed top-0 right-0 bottom-0 w-[38%] min-w-[480px] z-[130] shadow-2xl flex-col overflow-hidden border-l border-white/5",
          "bg-[#0D0D0D]",
          "transition-transform duration-700 ease-[cubic-bezier(0.33,1,0.68,1)]",
          isMegaMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-10 pt-10 pb-6">
          <span className="text-white/40 font-body text-[0.6rem] tracking-[0.35em] uppercase">
            Navigation
          </span>
          <button
            onClick={() => setIsMegaMenuOpen(false)}
            className="group relative w-9 h-9 flex items-center justify-center border border-white/15 rounded-full text-[#F5F0E8] hover:border-[#C9A84C] hover:text-[#C9A84C] transition-all duration-500 bg-white/[0.03]"
          >
            <X size={14} strokeWidth={1.5} />
          </button>
        </div>

        {/* Separator under header */}
        <div className="mx-10 h-[1px] bg-white/[0.08]" />

        {/* Navigation Items */}
        <nav className="flex-1 flex flex-col justify-center py-4">
          {navLinks.map((link, idx) => {
            const isActive = pathname === link.href;
            const isVisible = visibleItems[idx] || false;

            return (
              <div
                key={link.id}
                className="group relative"
              >
                {/* Delimiter Line — thin and subtle like afrikher.com */}
                {idx > 0 && (
                  <div className="absolute top-0 left-[4.5rem] right-[2.5rem] h-[1px] bg-white/[0.06] transition-all duration-500 group-hover:bg-white/[0.12]" />
                )}

                <Link
                  href={link.href}
                  onClick={closeAll}
                  className={cn(
                    "flex items-center px-10 py-[0.85rem] transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] group-hover:translate-x-[8px]",
                    isVisible
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 translate-x-[30px]"
                  )}
                >
                  <span className={cn(
                    "font-body text-[0.65rem] tracking-[0.1em] mr-6 w-5 transition-colors duration-500",
                    isActive ? "text-[#C9A84C]" : "text-white/20 group-hover:text-[#C9A84C]/50"
                  )}>
                    {link.id}
                  </span>
                  <span className={cn(
                    "font-display font-normal text-[1.6rem] md:text-[2rem] leading-none tracking-wide transition-colors duration-500",
                    isActive ? "text-[#C9A84C]" : "text-[#F5F0E8] group-hover:text-[#C9A84C]"
                  )}>
                    {link.name}
                  </span>
                  {isActive && (
                    <span className="ml-auto text-[#C9A84C]/60 font-display text-[1rem] leading-none">——</span>
                  )}
                </Link>
              </div>
            );
          })}
          {/* Bottom separator after last item */}
          <div className="mx-10 mt-1 h-[1px] bg-white/[0.06]" />
        </nav>

        {/* Footer tagline */}
        <div className="px-10 py-6">
          <p className={cn(
            "font-display italic text-[0.85rem] text-white/25 text-right transition-all duration-700 delay-[600ms]",
            isMegaMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}>
            L&apos;élégance hors du commun.
          </p>
        </div>
      </div>

      {/* ========== MOBILE MENU — FULL SCREEN SLIDE ========== */}
      {/* Backdrop */}
      <div
        onClick={() => setIsMobileMenuOpen(false)}
        className={cn(
          "md:hidden fixed inset-0 z-[110] transition-all duration-600 ease-[cubic-bezier(0.33,1,0.68,1)]",
          isMobileMenuOpen
            ? "opacity-100 pointer-events-auto bg-black/50 backdrop-blur-[8px]"
            : "opacity-0 pointer-events-none bg-black/0"
        )}
      />

      {/* Mobile panel — slides from right */}
      <div
        className={cn(
          "md:hidden fixed top-0 right-0 bottom-0 w-full z-[115] flex flex-col bg-[#0A0A0A]",
          "transition-transform duration-600 ease-[cubic-bezier(0.33,1,0.68,1)]",
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Mobile header */}
        <div className="flex items-center justify-between px-6 pt-8 pb-4">
          <span className="text-white/40 font-body text-[0.55rem] tracking-[0.35em] uppercase">
            Navigation
          </span>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="w-9 h-9 flex items-center justify-center border border-white/15 rounded-full text-[#F5F0E8] hover:border-[#C9A84C] transition-colors bg-white/[0.03]"
          >
            <X size={14} strokeWidth={1.5} />
          </button>
        </div>

        {/* Separator */}
        <div className="mx-6 h-[1px] bg-white/[0.08]" />

        {/* Mobile nav items */}
        <nav className="flex-1 flex flex-col justify-center px-6 py-2">
          {navLinks.map((link, idx) => {
            const isActive = pathname === link.href;
            const isVisible = visibleItems[idx] || false;

            return (
              <div key={link.id} className="group relative">
                {idx > 0 && (
                  <div className="absolute top-0 left-8 right-4 h-[1px] bg-white/[0.06]" />
                )}
                <Link
                  href={link.href}
                  onClick={closeAll}
                  className={cn(
                    "flex items-center py-[0.7rem] transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]",
                    isVisible
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 translate-x-[20px]"
                  )}
                >
                  <span className={cn(
                    "font-body text-[0.55rem] tracking-[0.1em] mr-4 w-4 transition-colors duration-500",
                    isActive ? "text-[#C9A84C]" : "text-white/20"
                  )}>
                    {link.id}
                  </span>
                  <span className={cn(
                    "font-display font-normal text-[1.4rem] leading-none tracking-wide transition-colors duration-500",
                    isActive ? "text-[#C9A84C]" : "text-[#F5F0E8]"
                  )}>
                    {link.name}
                  </span>
                  {isActive && (
                    <span className="ml-auto text-[#C9A84C]/60 font-display text-[0.85rem]">——</span>
                  )}
                </Link>
              </div>
            );
          })}
          <div className="mx-0 mt-1 h-[1px] bg-white/[0.06]" />
        </nav>

        {/* Mobile login button */}
        <div className="px-6 pb-3">
          <Link
            href="/auth/login"
            onClick={closeAll}
            className="block w-full text-center text-[0.7rem] font-body font-light tracking-[0.2em] text-[#C9A84C] uppercase border border-[#C9A84C]/40 px-4 py-3 hover:border-[#C9A84C] hover:bg-[#C9A84C]/10 transition-all duration-300"
          >
            SE CONNECTER
          </Link>
        </div>

        {/* Mobile footer */}
        <div className="px-6 py-5">
          <p className={cn(
            "font-display italic text-[0.8rem] text-white/25 text-right transition-all duration-700 delay-[600ms]",
            isMobileMenuOpen ? "opacity-100" : "opacity-0"
          )}>
            L&apos;élégance hors du commun.
          </p>
        </div>
      </div>
    </>
  );
}
