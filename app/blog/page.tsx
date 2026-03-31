"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Link from "next/link";
import { Clock, ArrowRight, Search, ChevronRight } from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  cover_image: string | null;
  status: string;
  published_at: string | null;
  created_at: string;
  category?: string;
}

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  cover_image: string | null;
  status: string;
  type: string;
  published_at: string | null;
  created_at: string;
  category_id: string | null;
  category_name?: string;
}

// Category tabs for filtering
const CATEGORY_TABS = [
  { label: "TOUT VOIR", value: "all" },
  { label: "ÉDITORIAL", value: "editorial" },
  { label: "BLOG", value: "blog" },
  { label: "INTERVIEWS", value: "interview" },
  { label: "PORTRAITS", value: "portrait" },
  { label: "DOSSIERS", value: "dossier" },
];

// Fallback data if Supabase is empty
const FALLBACK_POSTS = [
  {
    id: "fb-1",
    title: "Pourquoi l'Afrique est le continent de demain pour les femmes entrepreneures",
    slug: "afrique-continent-femmes-entrepreneures",
    excerpt: "Une analyse des opportunités uniques que le continent offre aux femmes ambitieuses qui osent entreprendre.",
    cover_image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop",
    published_at: "2026-03-25T10:00:00Z",
    category: "Inspiration",
    type: "article",
    source: "blog" as const,
  },
  {
    id: "fb-2",
    title: "Les 5 habitudes des femmes leaders africaines qui réussissent",
    slug: "habitudes-femmes-leaders-africaines",
    excerpt: "Découvrez les rituels quotidiens et les stratégies qui distinguent les femmes d'influence sur le continent.",
    cover_image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop",
    published_at: "2026-03-20T10:00:00Z",
    category: "Leadership",
    type: "article",
    source: "editorial" as const,
  },
  {
    id: "fb-3",
    title: "Comment lever des fonds en Afrique : guide pratique",
    slug: "lever-fonds-afrique-guide",
    excerpt: "Du bootstrapping aux investisseurs institutionnels, toutes les options de financement décryptées.",
    cover_image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
    published_at: "2026-03-15T10:00:00Z",
    category: "Finance",
    type: "dossier",
    source: "editorial" as const,
  },
  {
    id: "fb-4",
    title: "Rencontre avec Aminata Diallo, pionnière de la FinTech ouest-africaine",
    slug: "rencontre-aminata-diallo-fintech",
    excerpt: "Portrait d'une femme qui bouleverse les codes de la finance digitale en Afrique de l'Ouest.",
    cover_image: "https://images.unsplash.com/photo-1589561253898-768105ca91a8?q=80&w=2069&auto=format&fit=crop",
    published_at: "2026-03-10T10:00:00Z",
    category: "Tech",
    type: "interview",
    source: "editorial" as const,
  },
  {
    id: "fb-5",
    title: "La mode éthique africaine conquiert le monde",
    slug: "mode-ethique-africaine-monde",
    excerpt: "Comment les créatrices africaines redéfinissent la mode durable à l'échelle internationale.",
    cover_image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?q=80&w=2032&auto=format&fit=crop",
    published_at: "2026-03-05T10:00:00Z",
    category: "Mode",
    type: "article",
    source: "blog" as const,
  },
  {
    id: "fb-6",
    title: "Portrait : Ngozi Okonjo-Iweala, de la Banque Mondiale à l'OMC",
    slug: "portrait-ngozi-okonjo-iweala",
    excerpt: "Le parcours exceptionnel d'une femme qui a brisé tous les plafonds de verre dans les institutions internationales.",
    cover_image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974&auto=format&fit=crop",
    published_at: "2026-02-28T10:00:00Z",
    category: "Leadership",
    type: "portrait",
    source: "editorial" as const,
  },
];

export default function BlogPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [allContent, setAllContent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const loadContent = async () => {
      setLoading(true);
      try {
        const { createClient } = await import("@supabase/supabase-js");
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL || "https://xykvzzitgmnipscxbhcf.supabase.co",
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5a3Z6eml0Z21uaXBzY3hiaGNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMzNjc1ODAsImV4cCI6MjA1ODk0MzU4MH0.yqOgQhnMKOaAoLkVDwH99jEMVilrp42ckFWPhNGk-Ys"
        );

        // Fetch published articles
        const { data: articles } = await supabase
          .from("articles")
          .select("*, categories(name)")
          .eq("status", "published")
          .order("published_at", { ascending: false });

        // Fetch published blog posts
        const { data: blogPosts } = await supabase
          .from("blog_posts")
          .select("*")
          .eq("status", "published")
          .order("published_at", { ascending: false });

        const editorialItems = (articles || []).map((a: any) => ({
          id: a.id,
          title: a.title,
          slug: a.slug,
          excerpt: a.excerpt,
          cover_image: a.cover_image,
          published_at: a.published_at,
          category: a.categories?.name || "",
          type: a.type || "article",
          source: "editorial" as const,
        }));

        const blogItems = (blogPosts || []).map((b: any) => ({
          id: b.id,
          title: b.title,
          slug: b.slug,
          excerpt: b.excerpt,
          cover_image: b.cover_image,
          published_at: b.published_at,
          category: "Blog",
          type: "article",
          source: "blog" as const,
        }));

        const combined = [...editorialItems, ...blogItems].sort(
          (a, b) => new Date(b.published_at || 0).getTime() - new Date(a.published_at || 0).getTime()
        );

        if (combined.length > 0) {
          setAllContent(combined);
        } else {
          setAllContent(FALLBACK_POSTS);
        }
      } catch (e) {
        console.error("Error loading content:", e);
        setAllContent(FALLBACK_POSTS);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, []);

  // Filtered content
  const filteredContent = allContent.filter((item) => {
    const matchSearch = !searchQuery ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.excerpt || "").toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === "all") return matchSearch;
    if (activeTab === "editorial") return matchSearch && item.source === "editorial";
    if (activeTab === "blog") return matchSearch && item.source === "blog";
    if (activeTab === "interview") return matchSearch && item.type === "interview";
    if (activeTab === "portrait") return matchSearch && item.type === "portrait";
    if (activeTab === "dossier") return matchSearch && item.type === "dossier";
    return matchSearch;
  });

  const displayedContent = showMore ? filteredContent : filteredContent.slice(0, 9);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const estimateReadTime = (content: string | null) => {
    if (!content) return "3 min";
    const words = content.split(/\s+/).length;
    return `${Math.max(2, Math.ceil(words / 200))} min`;
  };

  return (
    <main className="min-h-screen bg-[#F5F0E8] text-[#0A0A0A]">
      {/* Black header banner */}
      <div className="fixed top-0 left-0 right-0 h-20 bg-[#0A0A0A] z-[90]" />
      <Navbar />

      {/* ── HERO SECTION ── */}
      <section className="relative pt-32 pb-16 px-6 bg-[#0A0A0A] text-[#F5F0E8] overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-[#C9A84C] blur-[150px]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-[#C9A84C] blur-[150px]" />
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center gap-2 text-xs text-[#9A9A8A] mb-8 uppercase tracking-widest">
            <Link href="/" className="hover:text-[#C9A84C] transition-colors">Accueil</Link>
            <ChevronRight size={12} />
            <span className="text-[#C9A84C]">Blog & Éditorial</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold mb-6 tracking-tight leading-[0.9]">
            Nos
            <span className="block text-[#C9A84C] italic">Publications</span>
          </h1>
          <p className="text-[#9A9A8A] text-lg md:text-xl max-w-2xl font-light leading-relaxed">
            Réflexions, conseils et analyses pour les femmes qui bâtissent l&apos;Afrique de demain.
          </p>

          {/* Search */}
          <div className="mt-10 max-w-lg relative">
            <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-[#9A9A8A]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un article..."
              className="w-full pl-14 pr-6 py-4 bg-[#2A2A2A] border border-[#333] rounded-full text-sm text-white placeholder:text-[#666] outline-none focus:border-[#C9A84C] transition-colors"
            />
          </div>
        </div>
      </section>

      {/* ── CATEGORY TABS ── */}
      <section className="sticky top-20 z-50 bg-[#0A0A0A] border-b border-[#2A2A2A]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center overflow-x-auto no-scrollbar">
            {CATEGORY_TABS.map((tab) => {
              const count = tab.value === "all"
                ? allContent.length
                : tab.value === "editorial"
                ? allContent.filter((i) => i.source === "editorial").length
                : tab.value === "blog"
                ? allContent.filter((i) => i.source === "blog").length
                : allContent.filter((i) => i.type === tab.value).length;

              return (
                <button
                  key={tab.value}
                  onClick={() => { setActiveTab(tab.value); setShowMore(false); }}
                  className={`relative px-6 py-5 text-xs font-bold tracking-[0.2em] whitespace-nowrap transition-all ${
                    activeTab === tab.value
                      ? "text-[#C9A84C]"
                      : "text-[#9A9A8A] hover:text-white"
                  }`}
                >
                  {tab.label}
                  {count > 0 && (
                    <span className={`ml-2 text-[10px] px-1.5 py-0.5 rounded-full ${
                      activeTab === tab.value ? "bg-[#C9A84C]/20 text-[#C9A84C]" : "bg-[#2A2A2A] text-[#666]"
                    }`}>
                      {count}
                    </span>
                  )}
                  {activeTab === tab.value && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C9A84C]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CONTENT GRID ── */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[4/3] bg-[#E5DDD0] rounded-2xl mb-5" />
                  <div className="h-3 bg-[#E5DDD0] rounded w-1/4 mb-3" />
                  <div className="h-5 bg-[#E5DDD0] rounded w-3/4 mb-2" />
                  <div className="h-5 bg-[#E5DDD0] rounded w-1/2 mb-3" />
                  <div className="h-3 bg-[#E5DDD0] rounded w-full" />
                </div>
              ))}
            </div>
          ) : filteredContent.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-[#9A9A8A] text-xl font-serif">Aucun contenu trouvé</p>
              <button
                onClick={() => { setActiveTab("all"); setSearchQuery(""); }}
                className="mt-4 text-[#C9A84C] font-bold text-sm hover:underline"
              >
                Voir tous les contenus
              </button>
            </div>
          ) : (
            <>
              {/* Featured article (first one, big) */}
              {displayedContent.length > 0 && activeTab === "all" && !searchQuery && (
                <Link
                  href={displayedContent[0].source === "blog" ? `/blog/${displayedContent[0].slug}` : `/rubriques/${displayedContent[0].slug}`}
                  className="block mb-16 group"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-[#2A2A2A]">
                      {displayedContent[0].cover_image ? (
                        <img
                          src={displayedContent[0].cover_image}
                          alt={displayedContent[0].title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#9A9A8A] font-serif text-2xl">
                          AFRIKHER
                        </div>
                      )}
                    </div>
                    <div className="space-y-5">
                      <div className="flex items-center gap-4">
                        <span className="text-[#C9A84C] text-xs font-bold uppercase tracking-[0.2em]">
                          {displayedContent[0].category || displayedContent[0].type}
                        </span>
                        <span className="text-[#9A9A8A] text-xs flex items-center gap-1">
                          <Clock size={12} /> {estimateReadTime(displayedContent[0].excerpt)}
                        </span>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          displayedContent[0].source === "blog"
                            ? "bg-purple-100 text-purple-600"
                            : "bg-blue-100 text-blue-600"
                        }`}>
                          {displayedContent[0].source === "blog" ? "Blog" : "Éditorial"}
                        </span>
                      </div>
                      <h2 className="text-3xl md:text-4xl font-serif font-bold leading-tight group-hover:text-[#C9A84C] transition-colors">
                        {displayedContent[0].title}
                      </h2>
                      <p className="text-[#9A9A8A] text-base leading-relaxed line-clamp-3">
                        {displayedContent[0].excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[#9A9A8A] uppercase tracking-widest">
                          {formatDate(displayedContent[0].published_at)}
                        </span>
                        <span className="flex items-center text-[#C9A84C] text-sm font-bold group-hover:gap-3 gap-2 transition-all">
                          Lire l&apos;article <ArrowRight size={16} />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              )}

              {/* Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                {(activeTab === "all" && !searchQuery ? displayedContent.slice(1) : displayedContent).map((item, index) => (
                  <Link
                    key={item.id}
                    href={item.source === "blog" ? `/blog/${item.slug}` : `/rubriques/${item.slug}`}
                    className="group block"
                  >
                    <article>
                      <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-[#2A2A2A] mb-5 relative">
                        {item.cover_image ? (
                          <img
                            src={item.cover_image}
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#9A9A8A] font-serif text-lg">
                            AFRIKHER
                          </div>
                        )}

                        {/* Source badge */}
                        <div className={`absolute top-4 left-4 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full backdrop-blur-sm ${
                          item.source === "blog"
                            ? "bg-purple-500/80 text-white"
                            : "bg-blue-500/80 text-white"
                        }`}>
                          {item.source === "blog" ? "Blog" : "Éditorial"}
                        </div>

                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-[#0A0A0A]/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="bg-white/90 text-[#0A0A0A] px-6 py-2 rounded-full text-xs font-bold flex items-center gap-2">
                            Lire <ArrowRight size={14} />
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-[#C9A84C] text-[11px] font-bold uppercase tracking-[0.15em]">
                          {item.category || item.type}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-[#9A9A8A]" />
                        <span className="text-[#9A9A8A] text-[11px] flex items-center gap-1">
                          <Clock size={11} /> {estimateReadTime(item.excerpt)}
                        </span>
                      </div>

                      <h3 className="text-xl font-serif font-bold leading-snug mb-3 group-hover:text-[#C9A84C] transition-colors line-clamp-2">
                        {item.title}
                      </h3>

                      <p className="text-[#9A9A8A] text-sm leading-relaxed line-clamp-2 mb-4">
                        {item.excerpt}
                      </p>

                      <span className="text-[11px] text-[#9A9A8A] uppercase tracking-widest">
                        {formatDate(item.published_at)}
                      </span>
                    </article>
                  </Link>
                ))}
              </div>

              {/* Load more */}
              {!showMore && filteredContent.length > 9 && (
                <div className="text-center mt-16">
                  <button
                    onClick={() => setShowMore(true)}
                    className="px-10 py-4 border-2 border-[#0A0A0A] text-[#0A0A0A] rounded-full font-bold text-sm tracking-wider hover:bg-[#0A0A0A] hover:text-[#C9A84C] transition-all"
                  >
                    VOIR PLUS D&apos;ARTICLES ({filteredContent.length - 9} restants)
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* ── NEWSLETTER SECTION ── */}
      <section className="py-20 px-6 bg-[#0A0A0A]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
            Restez informée
          </h2>
          <p className="text-[#9A9A8A] mb-8 text-lg">
            Recevez nos meilleurs articles et inspirations directement dans votre boîte mail.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <input
              type="email"
              placeholder="Votre adresse email"
              className="flex-1 px-6 py-4 bg-[#2A2A2A] border border-[#333] rounded-full text-white placeholder:text-[#666] outline-none focus:border-[#C9A84C] transition-colors text-sm"
            />
            <button className="px-8 py-4 bg-[#C9A84C] text-[#0A0A0A] rounded-full font-bold text-sm tracking-wider hover:bg-[#E8C97A] transition-colors whitespace-nowrap">
              S&apos;ABONNER
            </button>
          </div>
        </div>
      </section>

      {/* Minimal footer */}
      <footer className="py-8 px-6 bg-[#0A0A0A] border-t border-[#2A2A2A]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-[#9A9A8A] uppercase tracking-widest">
            &copy; {new Date().getFullYear()} AFRIKHER. Tous droits réservés.
          </p>
          <div className="flex items-center gap-8">
            <Link href="/" className="text-[11px] text-[#9A9A8A] hover:text-[#C9A84C] uppercase tracking-widest transition-colors">
              Accueil
            </Link>
            <Link href="/rubriques" className="text-[11px] text-[#9A9A8A] hover:text-[#C9A84C] uppercase tracking-widest transition-colors">
              Rubriques
            </Link>
            <Link href="/boutique" className="text-[11px] text-[#9A9A8A] hover:text-[#C9A84C] uppercase tracking-widest transition-colors">
              Boutique
            </Link>
            <Link href="/contact" className="text-[11px] text-[#9A9A8A] hover:text-[#C9A84C] uppercase tracking-widest transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
