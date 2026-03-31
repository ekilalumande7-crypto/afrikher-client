"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Lock, ShoppingBag, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

interface Magazine {
  id: string;
  title: string;
  slug: string;
  description: string;
  cover_image: string;
  price: number;
  currency: string;
  page_count: number;
  status: string;
  published_at: string;
}

/* ── Demo data (used when Supabase is not connected) ── */
const demoMagazines: Magazine[] = [
  {
    id: "1",
    title: "AFRIKHER N°1 — L'Ascension",
    slug: "afrikher-n1-ascension",
    description: "Premier numéro dédié à l'ascension des femmes entrepreneures en Afrique de l'Ouest. Portraits, interviews exclusives et analyses.",
    cover_image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop",
    price: 9.99,
    currency: "EUR",
    page_count: 28,
    status: "published",
    published_at: "2026-03-24",
  },
  {
    id: "2",
    title: "AFRIKHER N°2 — Mode & Identité",
    slug: "afrikher-n2-mode-identite",
    description: "Le retour du pagne tissé dans la haute couture. Exploration des racines textiles africaines à travers le prisme du luxe contemporain.",
    cover_image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=1974&auto=format&fit=crop",
    price: 9.99,
    currency: "EUR",
    page_count: 28,
    status: "published",
    published_at: "2026-02-15",
  },
  {
    id: "3",
    title: "AFRIKHER N°3 — Tech & Innovation",
    slug: "afrikher-n3-tech-innovation",
    description: "Investir dans la tech africaine : les secteurs porteurs pour 2026. De la fintech à l'agritech, où se cachent les prochaines licornes ?",
    cover_image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
    price: 12.99,
    currency: "EUR",
    page_count: 28,
    status: "published",
    published_at: "2026-01-10",
  },
  {
    id: "4",
    title: "AFRIKHER N°4 — Leadership au Féminin",
    slug: "afrikher-n4-leadership-feminin",
    description: "Les femmes qui façonnent le continent. Portraits de dirigeantes, fondatrices et visionnaires qui redéfinissent les codes.",
    cover_image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop",
    price: 9.99,
    currency: "EUR",
    page_count: 28,
    status: "published",
    published_at: "2025-12-01",
  },
];

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

export default function MagazinePage() {
  const [magazines, setMagazines] = useState<Magazine[]>(demoMagazines);
  const [loading, setLoading] = useState(true);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    async function fetchMagazines() {
      try {
        const { createClient } = await import("@supabase/supabase-js");
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        if (!supabaseUrl || !supabaseKey) throw new Error("No Supabase config");
        const supabase = createClient(supabaseUrl, supabaseKey);
        const { data, error } = await supabase
          .from("magazines")
          .select("*")
          .eq("status", "published")
          .order("published_at", { ascending: false });
        if (error) throw error;
        if (data && data.length > 0) setMagazines(data);
      } catch {
        // Keep demo data
      } finally {
        setLoading(false);
      }
    }
    fetchMagazines();
  }, []);

  const latestMagazine = magazines[0];
  const olderMagazines = magazines.slice(1);

  return (
    <main className="min-h-screen bg-white">

      {/* ══════ NAVBAR ══════ */}
      <header className="sticky top-0 z-[100] bg-[#0A0A0A] border-b border-[#C9A84C]/10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-5 flex items-center justify-between">
          <div className="flex flex-col items-start">
            <span
              className="px-2 py-0.5 text-[#0A0A0A] text-[0.45rem] tracking-[0.2em] uppercase font-body font-bold mb-1 shadow-[0_1px_3px_rgba(0,0,0,0.3)] animate-gold-shine"
              style={{
                background: "linear-gradient(135deg, #8A6E2F 0%, #C9A84C 25%, #F5F0E8 50%, #C9A84C 75%, #8A6E2F 100%)",
                backgroundSize: "200% 200%",
                display: "inline-block",
              }}
            >
              Magazine
            </span>
            <Link href="/" className="text-[1.5rem] font-display font-light tracking-[0.3em] text-[#F5F0E8] uppercase leading-none">
              AFRIKHER
            </Link>
          </div>

          <div className="flex items-center space-x-6">
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/auth/login" className="text-[0.7rem] font-body tracking-[0.15em] text-[#C9A84C] uppercase border border-[#C9A84C]/40 px-5 py-2 hover:bg-[#C9A84C]/10 transition-all">
                Se connecter
              </Link>
              <button onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)} className="group flex items-center space-x-4 text-[#F5F0E8] transition-colors duration-300">
                <span className="text-[0.7rem] font-body font-light tracking-[0.25em] uppercase group-hover:text-[#C9A84C] transition-colors duration-300">
                  {isMegaMenuOpen ? "FERMER" : "MENU"}
                </span>
                <div className="flex flex-col justify-center items-end space-y-[5px] w-[18px]">
                  <span className={cn("block h-[1px] bg-[#F5F0E8] transition-all duration-300 group-hover:bg-[#C9A84C]", isMegaMenuOpen ? "w-[18px] translate-y-[6px] rotate-45" : "w-[18px]")} />
                  <span className={cn("block h-[1px] bg-[#F5F0E8] transition-all duration-300 group-hover:bg-[#C9A84C]", isMegaMenuOpen ? "opacity-0" : "w-[18px]")} />
                  <span className={cn("block h-[1px] bg-[#F5F0E8] transition-all duration-300 group-hover:bg-[#C9A84C]", isMegaMenuOpen ? "w-[18px] -translate-y-[6px] -rotate-45" : "w-[18px]")} />
                </div>
              </button>
            </div>
            <button className="md:hidden text-[#F5F0E8]" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              <div className="flex flex-col justify-center items-end space-y-[5px] w-[24px]">
                <span className={cn("block h-[1px] w-full bg-[#F5F0E8] transition-all", isMobileMenuOpen ? "rotate-45 translate-y-[6px]" : "")} />
                <span className={cn("block h-[1px] w-full bg-[#F5F0E8] transition-all", isMobileMenuOpen ? "opacity-0" : "")} />
                <span className={cn("block h-[1px] w-full bg-[#F5F0E8] transition-all", isMobileMenuOpen ? "-rotate-45 -translate-y-[6px]" : "")} />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Mega Menu */}
      {isMegaMenuOpen && (
        <>
          <div onClick={() => setIsMegaMenuOpen(false)} className="fixed inset-0 bg-black backdrop-blur-[2px] z-[120]" />
          <div className="fixed top-0 right-0 bottom-0 w-full md:w-[38%] bg-[#080808]/97 z-[130] shadow-2xl flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-10 py-12">
              <span className="text-[#9A9A8A] font-body text-[0.65rem] tracking-[0.35em] uppercase">NAVIGATION</span>
              <button onClick={() => setIsMegaMenuOpen(false)} className="group relative w-8 h-8 flex items-center justify-center border border-white/20 rounded-full text-[#F5F0E8] hover:border-[#C9A84C] hover:text-[#C9A84C] transition-all duration-300">
                <span className="text-[1.2rem] leading-none mt-[-2px]">&times;</span>
              </button>
            </div>
            <nav className="flex-1 flex flex-col justify-center">
              {navLinks.map((link) => {
                const isActive = link.href === "/magazine";
                return (
                  <div key={link.id} className="group relative">
                    <div className="absolute top-0 left-[4.5rem] right-[15%] h-[1px] bg-[#9A9A8A]/30 transition-all duration-500 group-hover:bg-[#9A9A8A]/60" />
                    <Link href={link.href} onClick={() => setIsMegaMenuOpen(false)} className="flex items-center px-10 py-5 md:py-6 transition-all duration-500 group-hover:translate-x-[10px]">
                      <span className={cn("font-body text-[0.7rem] tracking-[0.1em] mr-8 transition-colors duration-300", isActive ? "text-[#C9A84C]" : "text-[#9A9A8A] group-hover:text-[#C9A84C]")}>{link.id}</span>
                      <span className={cn("font-display font-light text-[1.8rem] md:text-[2.4rem] leading-none transition-colors duration-300", isActive ? "text-[#C9A84C]" : "text-[#F5F0E8] group-hover:text-[#C9A84C]")}>{link.name}</span>
                      {isActive && <span className="ml-6 text-[#C9A84C] font-display text-[1.5rem] leading-none">&mdash;&mdash;</span>}
                    </Link>
                  </div>
                );
              })}
            </nav>
            <div className="border-t border-white/5 px-10 py-8">
              <p className="font-display italic text-[0.9rem] text-[#9A9A8A]">L&apos;elegance hors du commun.</p>
            </div>
          </div>
        </>
      )}

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[110] bg-[#0A0A0A] p-12 flex flex-col items-center justify-center space-y-8">
          <button className="absolute top-8 right-8 text-[#F5F0E8]" onClick={() => setIsMobileMenuOpen(false)}>
            <span className="text-3xl">&times;</span>
          </button>
          {navLinks.map((link) => (
            <Link key={link.id} href={link.href} onClick={() => setIsMobileMenuOpen(false)}
              className="text-3xl font-display font-light text-[#C9A84C] hover:text-[#F5F0E8] transition-colors uppercase tracking-tight">
              {link.name}
            </Link>
          ))}
          <Link href="/auth/login" className="mt-8 border border-[#C9A84C] text-[#C9A84C] px-8 py-3 text-sm tracking-widest uppercase">
            Se connecter
          </Link>
        </div>
      )}

      {/* ══════ HERO — Latest Magazine ══════ */}
      <section className="relative bg-[#0A0A0A] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Cover Image */}
            <div className="relative group">
              <div className="relative aspect-[3/4] max-w-[420px] mx-auto lg:mx-0 overflow-hidden rounded-sm shadow-2xl shadow-black/50">
                {loading ? (
                  <div className="w-full h-full bg-[#2A2A2A] animate-pulse" />
                ) : (
                  <>
                    <img
                      src={latestMagazine.cover_image}
                      alt={latestMagazine.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                    <div className="absolute top-4 left-4 px-3 py-1.5 bg-[#C9A84C] text-[#0A0A0A] text-[10px] font-bold uppercase tracking-widest">
                      Nouveau
                    </div>
                  </>
                )}
              </div>
              {/* Decorative gold border */}
              <div className="absolute -bottom-3 -right-3 w-full h-full border border-[#C9A84C]/20 rounded-sm pointer-events-none hidden lg:block" />
            </div>

            {/* Magazine Info */}
            <div className="text-center lg:text-left">
              <span className="inline-block text-[#C9A84C] text-[10px] font-body font-bold uppercase tracking-[0.3em] mb-6">
                Dernier numero
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-[#F5F0E8] leading-[1.1] mb-6">
                {latestMagazine.title}
              </h1>
              <p className="text-[#9A9A8A] font-body text-lg leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0">
                {latestMagazine.description}
              </p>
              <div className="flex items-center gap-4 mb-8 justify-center lg:justify-start">
                <span className="text-[#C9A84C] text-3xl font-display font-bold">
                  {latestMagazine.price.toFixed(2)}&euro;
                </span>
                <span className="text-[#9A9A8A] text-sm font-body">
                  {latestMagazine.page_count} pages
                </span>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  href={`/magazine/${latestMagazine.slug}`}
                  className="inline-flex items-center justify-center gap-3 bg-[#C9A84C] text-[#0A0A0A] px-8 py-4 text-sm font-bold uppercase tracking-widest hover:bg-[#E8C97A] transition-colors"
                >
                  <ShoppingBag size={16} />
                  Acheter ce numero
                </Link>
                <Link
                  href={`/magazine/${latestMagazine.slug}`}
                  className="inline-flex items-center justify-center gap-3 border border-[#F5F0E8]/20 text-[#F5F0E8] px-8 py-4 text-sm font-bold uppercase tracking-widest hover:border-[#C9A84C] hover:text-[#C9A84C] transition-colors"
                >
                  <Eye size={16} />
                  Feuilleter
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════ ALL MAGAZINES GRID ══════ */}
      {olderMagazines.length > 0 && (
        <section className="bg-[#F5F0E8] py-20">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="text-center mb-16">
              <span className="text-[#C9A84C] text-[10px] font-body font-bold uppercase tracking-[0.3em] block mb-3">
                Collection
              </span>
              <h2 className="text-4xl font-display font-bold text-[#0A0A0A] tracking-tight">
                Tous nos numeros
              </h2>
              <p className="text-[#9A9A8A] font-body mt-3 max-w-md mx-auto">
                Retrouvez l&apos;ensemble de nos editions et plongez dans l&apos;univers AFRIKHER.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {olderMagazines.map((mag) => (
                <Link
                  key={mag.id}
                  href={`/magazine/${mag.slug}`}
                  className="group"
                >
                  <div className="relative aspect-[3/4] overflow-hidden rounded-sm shadow-lg shadow-black/10 mb-5">
                    <img
                      src={mag.cover_image}
                      alt={mag.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-[#0A0A0A]/0 group-hover:bg-[#0A0A0A]/40 transition-all duration-500 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center gap-3">
                        <div className="w-14 h-14 rounded-full bg-[#C9A84C] flex items-center justify-center">
                          <Eye size={22} className="text-[#0A0A0A]" />
                        </div>
                        <span className="text-white text-xs font-bold uppercase tracking-widest">Decouvrir</span>
                      </div>
                    </div>
                    {/* Price badge */}
                    <div className="absolute bottom-4 right-4 bg-[#0A0A0A]/90 text-[#C9A84C] px-3 py-1.5 text-sm font-bold font-display backdrop-blur-sm">
                      {mag.price.toFixed(2)}&euro;
                    </div>
                  </div>
                  <h3 className="text-xl font-display font-bold text-[#0A0A0A] group-hover:text-[#C9A84C] transition-colors leading-tight mb-2">
                    {mag.title}
                  </h3>
                  <p className="text-sm text-[#9A9A8A] font-body line-clamp-2 mb-3">
                    {mag.description}
                  </p>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-[#9A9A8A] font-body uppercase tracking-widest">
                      {mag.page_count} pages
                    </span>
                    <span className="text-[#C9A84C] text-xs font-bold uppercase tracking-widest flex items-center gap-1 group-hover:gap-2 transition-all">
                      Voir <ArrowRight size={12} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════ CTA Section ══════ */}
      <section className="bg-[#0A0A0A] py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <Lock size={32} className="text-[#C9A84C] mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-display font-bold text-[#F5F0E8] mb-4">
            Acces exclusif
          </h2>
          <p className="text-[#9A9A8A] font-body text-lg mb-8 leading-relaxed">
            Chaque numero est une experience editoriale unique. Achetez vos editions preferees
            et accedez a l&apos;integralite du contenu, page par page.
          </p>
          <Link
            href="/auth/register"
            className="inline-flex items-center gap-3 bg-[#C9A84C] text-[#0A0A0A] px-10 py-4 text-sm font-bold uppercase tracking-widest hover:bg-[#E8C97A] transition-colors"
          >
            Creer un compte gratuit
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ══════ Mini Footer ══════ */}
      <div className="bg-[#0A0A0A] border-t border-[#C9A84C]/10 py-6 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="text-[#9A9A8A] text-xs font-body">&copy; 2026 AFRIKHER. Tous droits reserves.</span>
          <Link href="/" className="text-[#C9A84C] text-xs font-body uppercase tracking-widest hover:underline">
            afrikher.com
          </Link>
        </div>
      </div>
    </main>
  );
}
