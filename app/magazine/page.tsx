"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, ShoppingBag, Eye, BookOpen, Clock, ChevronRight } from "lucide-react";
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

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  cover_image: string;
  published_at: string;
}

interface SiteConfig {
  [key: string]: string;
}

const demoMagazines: Magazine[] = [
  {
    id: "1",
    title: "AFRIKHER N°1 — L'Ascension",
    slug: "afrikher-n1-ascension",
    description: "Premier numero dedie a l'ascension des femmes entrepreneures en Afrique de l'Ouest.",
    cover_image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop",
    price: 9.99,
    currency: "EUR",
    page_count: 28,
    status: "published",
    published_at: "2026-03-24",
  },
  {
    id: "2",
    title: "AFRIKHER N°2 — Mode & Identite",
    slug: "afrikher-n2-mode-identite",
    description: "Le retour du pagne tisse dans la haute couture africaine contemporaine.",
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
    description: "Investir dans la tech africaine : les secteurs porteurs pour 2026.",
    cover_image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
    price: 12.99,
    currency: "EUR",
    page_count: 28,
    status: "published",
    published_at: "2026-01-10",
  },
  {
    id: "4",
    title: "AFRIKHER N°4 — Leadership au Feminin",
    slug: "afrikher-n4-leadership-feminin",
    description: "Les femmes qui faconnent le continent africain.",
    cover_image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop",
    price: 9.99,
    currency: "EUR",
    page_count: 28,
    status: "published",
    published_at: "2025-12-01",
  },
];

const demoBlogPosts: BlogPost[] = [
  {
    id: "1",
    title: "5 femmes qui transforment la FinTech africaine",
    slug: "femmes-fintech-africaine",
    excerpt: "Decouvrez les entrepreneures qui revolutionnent les services financiers sur le continent.",
    cover_image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop",
    published_at: "2026-03-28",
  },
  {
    id: "2",
    title: "Le style africain s'impose dans la mode internationale",
    slug: "style-africain-mode",
    excerpt: "Comment les createurs africains redefinissent les codes de la haute couture mondiale.",
    cover_image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=400&auto=format&fit=crop",
    published_at: "2026-03-25",
  },
  {
    id: "3",
    title: "Entreprendre en Afrique : guide pratique 2026",
    slug: "entreprendre-afrique-guide",
    excerpt: "Les etapes cles pour lancer son business en Afrique de l'Ouest cette annee.",
    cover_image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=400&auto=format&fit=crop",
    published_at: "2026-03-20",
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
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(demoBlogPosts);
  const [siteConfig, setSiteConfig] = useState<SiteConfig>({});
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isMegaMenuOpen || isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isMegaMenuOpen, isMobileMenuOpen]);

  useEffect(() => {
    async function fetchData() {
      try {
        const { createClient } = await import("@supabase/supabase-js");
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        if (!supabaseUrl || !supabaseKey) throw new Error("No Supabase config");
        const supabase = createClient(supabaseUrl, supabaseKey);

        // Check auth
        const { data: { user: authUser } } = await supabase.auth.getUser();
        setUser(authUser);

        // Fetch site_config for hero
        const { data: configData } = await supabase.from("site_config").select("key, value");
        if (configData) {
          const config: SiteConfig = {};
          configData.forEach((row: any) => { config[row.key] = row.value; });
          setSiteConfig(config);
        }

        // Fetch magazines
        const { data: magData } = await supabase
          .from("magazines")
          .select("*")
          .eq("status", "published")
          .order("published_at", { ascending: false });
        if (magData && magData.length > 0) setMagazines(magData);

        // Fetch blog posts
        const { data: blogData } = await supabase
          .from("blog_posts")
          .select("*")
          .eq("status", "published")
          .order("published_at", { ascending: false })
          .limit(3);
        if (blogData && blogData.length > 0) setBlogPosts(blogData);
      } catch {
        // Keep demo data
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const latestMagazine = magazines[0];
  const allMagazines = magazines;

  // Hero image from admin CMS or fallback
  const heroImage = siteConfig.magazine_hero_image || latestMagazine?.cover_image || "";
  const heroTitle = siteConfig.magazine_hero_title || "Le magazine qui celebre la femme africaine entrepreneure";
  const heroSubtitle = siteConfig.magazine_hero_subtitle || "Portraits, interviews exclusives et analyses pour celles qui batissent l'Afrique de demain.";

  return (
    <main className="min-h-screen bg-[#F5F0E8]">

      {/* ══════ NAVBAR ══════ */}
      <header className="sticky top-0 z-[100] bg-[#0A0A0A] border-b border-[#C9A84C]/10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-5 flex items-center justify-between">
          <div className="flex flex-col items-start">
            <span
              className="px-2 py-0.5 text-[#0A0A0A] text-[0.45rem] tracking-[0.2em] uppercase font-sans font-bold mb-1"
              style={{
                background: "linear-gradient(135deg, #8A6E2F 0%, #C9A84C 25%, #F5F0E8 50%, #C9A84C 75%, #8A6E2F 100%)",
                backgroundSize: "200% 200%",
                display: "inline-block",
              }}
            >
              Magazine
            </span>
            <Link href="/" className="text-[1.5rem] font-serif font-light tracking-[0.3em] text-[#F5F0E8] uppercase leading-none">
              AFRIKHER
            </Link>
          </div>

          <div className="flex items-center space-x-6">
            <div className="hidden md:flex items-center space-x-6">
              {user ? (
                <Link href="/dashboard" className="text-[0.7rem] font-sans tracking-[0.15em] text-[#C9A84C] uppercase border border-[#C9A84C]/40 px-5 py-2 hover:bg-[#C9A84C]/10 transition-all">
                  Mon espace
                </Link>
              ) : (
                <Link href="/auth/login" className="text-[0.7rem] font-sans tracking-[0.15em] text-[#C9A84C] uppercase border border-[#C9A84C]/40 px-5 py-2 hover:bg-[#C9A84C]/10 transition-all">
                  Se connecter
                </Link>
              )}
              <button onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)} className="group flex items-center space-x-4 text-[#F5F0E8] transition-colors duration-300">
                <span className="text-[0.7rem] font-sans font-light tracking-[0.25em] uppercase group-hover:text-[#C9A84C] transition-colors duration-300">
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
          <div onClick={() => setIsMegaMenuOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-[12px] z-[120]" />
          <div className="fixed top-0 right-0 bottom-0 w-full md:w-[38%] md:min-w-[480px] bg-[#0D0D0D] z-[130] shadow-2xl flex flex-col overflow-hidden border-l border-white/5">
            <div className="flex items-center justify-between px-10 pt-10 pb-6">
              <span className="text-white/40 font-sans text-[0.6rem] tracking-[0.35em] uppercase">Navigation</span>
              <button onClick={() => setIsMegaMenuOpen(false)} className="group w-9 h-9 flex items-center justify-center border border-white/15 rounded-full text-[#F5F0E8] hover:border-[#C9A84C] hover:text-[#C9A84C] transition-all duration-500 bg-white/[0.03]">
                <span className="text-[1rem] leading-none">&times;</span>
              </button>
            </div>
            <div className="mx-10 h-[1px] bg-white/[0.08]" />
            <nav className="flex-1 flex flex-col justify-center py-4">
              {navLinks.map((link, idx) => {
                const isActive = link.href === "/magazine";
                return (
                  <div key={link.id} className="group relative">
                    {idx > 0 && (
                      <div className="absolute top-0 left-[4.5rem] right-[2.5rem] h-[1px] bg-white/[0.06] group-hover:bg-white/[0.12] transition-all duration-500" />
                    )}
                    <Link href={link.href} onClick={() => setIsMegaMenuOpen(false)} className="flex items-center px-10 py-[0.85rem] transition-all duration-500 group-hover:translate-x-[8px]">
                      <span className={cn("font-sans text-[0.65rem] tracking-[0.1em] mr-6 w-5", isActive ? "text-[#C9A84C]" : "text-white/20 group-hover:text-[#C9A84C]/50")}>{link.id}</span>
                      <span className={cn("font-serif font-normal text-[1.6rem] md:text-[2rem] leading-none tracking-wide", isActive ? "text-[#C9A84C]" : "text-[#F5F0E8] group-hover:text-[#C9A84C]")}>{link.name}</span>
                      {isActive && <span className="ml-auto text-[#C9A84C]/60 font-serif text-[1rem] leading-none">——</span>}
                    </Link>
                  </div>
                );
              })}
              <div className="mx-10 mt-1 h-[1px] bg-white/[0.06]" />
            </nav>
            <div className="px-10 py-6">
              <p className="font-serif italic text-[0.85rem] text-white/25 text-right">L&apos;elegance hors du commun.</p>
            </div>
          </div>
        </>
      )}

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[110] bg-[#0A0A0A]/85 backdrop-blur-xl p-12 flex flex-col items-center justify-center space-y-8">
          <button className="absolute top-8 right-8 text-[#F5F0E8]" onClick={() => setIsMobileMenuOpen(false)}>
            <span className="text-3xl">&times;</span>
          </button>
          {navLinks.map((link) => (
            <Link key={link.id} href={link.href} onClick={() => setIsMobileMenuOpen(false)}
              className="text-3xl font-serif font-light text-[#C9A84C] hover:text-[#F5F0E8] transition-colors uppercase tracking-tight">
              {link.name}
            </Link>
          ))}
          {user ? (
            <Link href="/dashboard" className="mt-8 border border-[#C9A84C] text-[#C9A84C] px-8 py-3 text-sm tracking-widest uppercase">
              Mon espace
            </Link>
          ) : (
            <Link href="/auth/login" className="mt-8 border border-[#C9A84C] text-[#C9A84C] px-8 py-3 text-sm tracking-widest uppercase">
              Se connecter
            </Link>
          )}
        </div>
      )}

      {/* ══════ HERO — Full-width image configurable par admin ══════ */}
      <section className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden">
        {loading ? (
          <div className="w-full h-full bg-[#2A2A2A] animate-pulse" />
        ) : (
          <>
            <img
              src={heroImage}
              alt="AFRIKHER Magazine"
              className="w-full h-full object-cover"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/80 via-[#0A0A0A]/30 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A]/50 to-transparent" />

            {/* Hero text */}
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 max-w-7xl mx-auto">
              <span className="inline-block text-[#C9A84C] text-[10px] font-sans font-bold uppercase tracking-[0.3em] mb-4">
                AFRIKHER Magazine
              </span>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold text-white leading-[1.1] mb-4 max-w-3xl">
                {heroTitle}
              </h1>
              <p className="text-white/70 font-sans text-base md:text-lg max-w-xl mb-6">
                {heroSubtitle}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href={`/magazine/${latestMagazine?.slug || ""}`}
                  className="inline-flex items-center gap-2 bg-[#C9A84C] text-[#0A0A0A] px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#E8C97A] transition-colors"
                >
                  <BookOpen size={14} />
                  Dernier numero
                </Link>
                <Link
                  href="/abonnement"
                  className="inline-flex items-center gap-2 border border-white/30 text-white px-6 py-3 text-xs font-bold uppercase tracking-widest hover:border-[#C9A84C] hover:text-[#C9A84C] transition-colors"
                >
                  S&apos;abonner
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </>
        )}
      </section>

      {/* ══════ ALL MAGAZINES — Grille 3 colonnes ══════ */}
      <section className="bg-[#F5F0E8] py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex items-center justify-between mb-12">
            <div>
              <span className="text-[#C9A84C] text-[10px] font-sans font-bold uppercase tracking-[0.3em] block mb-2">
                Collection
              </span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#0A0A0A] tracking-tight">
                Nos numeros
              </h2>
            </div>
            <Link href="/boutique" className="hidden md:flex items-center gap-2 text-[#C9A84C] text-xs font-bold uppercase tracking-widest hover:gap-3 transition-all">
              Voir la boutique <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {allMagazines.map((mag) => (
              <Link
                key={mag.id}
                href={`/magazine/${mag.slug}`}
                className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
              >
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img
                    src={mag.cover_image}
                    alt={mag.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Price badge */}
                  <div className="absolute top-4 right-4 bg-[#C9A84C] text-[#0A0A0A] px-3 py-1.5 text-xs font-bold">
                    {mag.price.toFixed(2)}&euro;
                  </div>
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-[#0A0A0A]/0 group-hover:bg-[#0A0A0A]/30 transition-all duration-500 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                        <Eye size={20} className="text-[#0A0A0A]" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-serif font-bold text-[#0A0A0A] group-hover:text-[#C9A84C] transition-colors leading-tight mb-2">
                    {mag.title}
                  </h3>
                  <p className="text-sm text-[#9A9A8A] font-sans line-clamp-2 mb-3">
                    {mag.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-[#9A9A8A] font-sans uppercase tracking-widest">
                      {mag.page_count} pages
                    </span>
                    <span className="text-[#C9A84C] text-xs font-bold uppercase tracking-widest flex items-center gap-1 group-hover:gap-2 transition-all">
                      Voir <ChevronRight size={12} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ BLOG SECTION ══════ */}
      <section className="bg-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex items-center justify-between mb-12">
            <div>
              <span className="text-[#C9A84C] text-[10px] font-sans font-bold uppercase tracking-[0.3em] block mb-2">
                Editorial
              </span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#0A0A0A] tracking-tight">
                Le blog
              </h2>
            </div>
            <Link href="/blog" className="hidden md:flex items-center gap-2 text-[#C9A84C] text-xs font-bold uppercase tracking-widest hover:gap-3 transition-all">
              Tous les articles <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group"
              >
                <div className="relative aspect-[16/10] overflow-hidden rounded-lg mb-4">
                  <img
                    src={post.cover_image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <Clock size={12} className="text-[#9A9A8A]" />
                  <span className="text-[10px] text-[#9A9A8A] font-sans uppercase tracking-widest">
                    {new Date(post.published_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                  </span>
                </div>
                <h3 className="text-lg font-serif font-bold text-[#0A0A0A] group-hover:text-[#C9A84C] transition-colors leading-tight mb-2">
                  {post.title}
                </h3>
                <p className="text-sm text-[#9A9A8A] font-sans line-clamp-2">
                  {post.excerpt}
                </p>
              </Link>
            ))}
          </div>

          <div className="md:hidden mt-8 text-center">
            <Link href="/blog" className="inline-flex items-center gap-2 text-[#C9A84C] text-xs font-bold uppercase tracking-widest">
              Tous les articles <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════ CTA ABONNEMENT ══════ */}
      <section className="bg-[#0A0A0A] py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <span className="text-[#C9A84C] text-[10px] font-sans font-bold uppercase tracking-[0.3em] block mb-4">
            Acces premium
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#F5F0E8] mb-4">
            Ne manquez aucun numero
          </h2>
          <p className="text-[#9A9A8A] font-sans text-lg mb-8 leading-relaxed">
            Abonnez-vous et recevez chaque edition directement dans votre espace personnel.
            Acces illimite a tous les contenus, interviews exclusives et analyses.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/abonnement"
              className="inline-flex items-center justify-center gap-3 bg-[#C9A84C] text-[#0A0A0A] px-10 py-4 text-sm font-bold uppercase tracking-widest hover:bg-[#E8C97A] transition-colors"
            >
              Decouvrir les offres
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/auth/register"
              className="inline-flex items-center justify-center gap-3 border border-[#F5F0E8]/20 text-[#F5F0E8] px-10 py-4 text-sm font-bold uppercase tracking-widest hover:border-[#C9A84C] hover:text-[#C9A84C] transition-colors"
            >
              Creer un compte gratuit
            </Link>
          </div>
        </div>
      </section>

      {/* ══════ Mini Footer ══════ */}
      <div className="bg-[#0A0A0A] border-t border-[#C9A84C]/10 py-6 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="text-[#9A9A8A] text-xs font-sans">&copy; 2026 AFRIKHER. Tous droits reserves.</span>
          <Link href="/" className="text-[#C9A84C] text-xs font-sans uppercase tracking-widest hover:underline">
            afrikher.com
          </Link>
        </div>
      </div>
    </main>
  );
}
