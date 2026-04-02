"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { Clock, Search, ArrowRight, Camera } from "lucide-react";

// ââââââââââââââââââââââââââââââââââââââââââââââ
// TYPES
// ââââââââââââââââââââââââââââââââââââââââââââââ

interface ContentItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  cover_image: string | null;
  published_at: string | null;
  category: string;
  type: string;
  source: "editorial" | "blog";
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

interface GalleryItem {
  id: string;
  title: string | null;
  description: string | null;
  image_url: string;
  category: string | null;
  featured: boolean;
}

interface SiteConfig {
  [key: string]: string;
}

// ââââââââââââââââââââââââââââââââââââââââââââââ
// CONSTANTS
// ââââââââââââââââââââââââââââââââââââââââââââââ

const FILTER_TABS = [
  { label: "Tout", value: "all" },
  { label: "Articles", value: "article" },
  { label: "Interviews", value: "interview" },
  { label: "Portraits", value: "portrait" },
  { label: "Dossiers", value: "dossier" },
];

// ââââââââââââââââââââââââââââââââââââââââââââââ
// COMPONENT
// ââââââââââââââââââââââââââââââââââââââââââââââ

export default function RubriquesPage() {
  const [loading, setLoading] = useState(true);
  const [allContent, setAllContent] = useState<ContentItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [siteConfig, setSiteConfig] = useState<SiteConfig>({});
  const [activeFilter, setActiveFilter] = useState("all");
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // ââââââââââââââââââââââââââââââââââââââââââââââ
  // FETCH DATA
  // ââââââââââââââââââââââââââââââââââââââââââââââ

  useEffect(() => {
    async function fetchData() {
      try {
        const { createClient } = await import("@supabase/supabase-js");
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        if (!supabaseUrl || !supabaseKey) throw new Error("No Supabase config");

        const supabase = createClient(supabaseUrl, supabaseKey);

        // Fetch all data in parallel
        const [articlesRes, blogRes, categoriesRes, configRes, galleryRes] = await Promise.all([
          supabase
            .from("articles")
            .select("*, categories(name, slug)")
            .eq("status", "published")
            .order("published_at", { ascending: false }),
          supabase
            .from("blog_posts")
            .select("*")
            .eq("status", "published")
            .order("published_at", { ascending: false }),
          supabase
            .from("categories")
            .select("*")
            .order("name"),
          supabase
            .from("site_config")
            .select("key, value")
            .like("key", "rubriques_%"),
          supabase
            .from("gallery_items")
            .select("*")
            .order("sort_order", { ascending: true })
            .limit(4),
        ]);

        // Build config
        const config: SiteConfig = {};
        (configRes.data || []).forEach((row: { key: string; value: string }) => {
          config[row.key] = row.value || "";
        });
        setSiteConfig(config);

        // Categories
        setCategories(categoriesRes.data || []);

        // Gallery
        setGallery(galleryRes.data || []);

        // Merge articles + blog posts
        const editorialItems: ContentItem[] = (articlesRes.data || []).map((a: any) => ({
          id: a.id,
          title: a.title,
          slug: a.slug,
          excerpt: a.excerpt || "",
          cover_image: a.cover_image,
          published_at: a.published_at,
          category: a.categories?.name || "",
          type: a.type || "article",
          source: "editorial" as const,
        }));

        const blogItems: ContentItem[] = (blogRes.data || []).map((b: any) => ({
          id: b.id,
          title: b.title,
          slug: b.slug,
          excerpt: b.excerpt || "",
          cover_image: b.cover_image,
          published_at: b.published_at,
          category: "Blog",
          type: "article",
          source: "blog" as const,
        }));

        const combined = [...editorialItems, ...blogItems].sort(
          (a, b) =>
            new Date(b.published_at || 0).getTime() -
            new Date(a.published_at || 0).getTime()
        );

        setAllContent(combined);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // ââââââââââââââââââââââââââââââââââââââââââââââ
  // FILTERING
  // ââââââââââââââââââââââââââââââââââââââââââââââ

  const filtered = allContent.filter((item) => {
    const matchSearch =
      !searchQuery ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.excerpt.toLowerCase().includes(searchQuery.toLowerCase());

    const matchType =
      activeFilter === "all" || item.type === activeFilter;

    const matchCategory =
      activeCategory === "all" || item.category === activeCategory;

    return matchSearch && matchType && matchCategory;
  });

  // ââââââââââââââââââââââââââââââââââââââââââââââ
  // HELPERS
  // ââââââââââââââââââââââââââââââââââââââââââââââ

  const formatDate = (d: string | null) => {
    if (!d) return "";
    return new Date(d).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const readTime = (text: string) => {
    const words = text.split(/\s+/).length;
    return `${Math.max(2, Math.ceil(words / 200))} min`;
  };

  const typeLabel = (t: string): string => {
    const m: Record<string, string> = {
      article: "Article",
      interview: "Interview",
      portrait: "Portrait",
      dossier: "Dossier",
    };
    return m[t] || t;
  };

  // ââââââââââââââââââââââââââââââââââââââââââââââ
  // RENDER
  // ââââââââââââââââââââââââââââââââââââââââââââââ

  const editorialImage = siteConfig["rubriques_editorial_image"] || "";
  const editorialCitation = siteConfig["rubriques_editorial_citation"] || "";

  return (
    <main className="min-h-screen bg-[#F5F0E8] text-[#0A0A0A]">
      {/* Bandeau noir pour le header */}
      <div className="fixed top-0 left-0 right-0 h-20 bg-[#0A0A0A] z-[90]" />
      <Navbar />

      {/* ââââââââââââââââââââââââââââââââââââââââââââââ */}
      {/* HEADER COMPACT */}
      {/* ââââââââââââââââââââââââââââââââââââââââââââââ */}
      <section className="pt-28 pb-8 bg-[#F5F0E8]">
        <div className="max-w-6xl mx-auto px-6">
          {/* Titre + recherche */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
            <div>
              <p className="font-body text-xs tracking-[0.3em] uppercase text-[#C9A84C] mb-2">
                {siteConfig["rubriques_editorial_titre"] || "Ãditorial"}
              </p>
              <h1 className="font-display text-3xl md:text-4xl text-[#0A0A0A] leading-tight">
                Les Rubriques<span className="text-[#C9A84C]">.</span>
              </h1>
              <p className="font-body text-sm text-[#9A9A8A] mt-1">
                {siteConfig["rubriques_editorial_sous_titre"] ||
                  "Le Sommaire d'AFRIKHER"}
              </p>
            </div>

            {/* Barre de recherche */}
            <div className="relative w-full md:w-72">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un article..."
                className="w-full py-2.5 pl-4 pr-10 bg-white border border-[#E8E5DE] rounded-lg font-body text-sm text-[#0A0A0A] placeholder-[#9A9A8A] outline-none focus:border-[#C9A84C] transition-colors"
              />
              <Search
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9A9A8A]"
              />
            </div>
          </div>

          {/* SÃ©parateur */}
          <div className="h-[1px] bg-gradient-to-r from-[#C9A84C]/30 via-[#C9A84C]/10 to-transparent" />
        </div>
      </section>

      {/* ââââââââââââââââââââââââââââââââââââââââââââââ */}
      {/* SECTION ÃDITORIALE COMPACTE (image + citation) */}
      {/* ââââââââââââââââââââââââââââââââââââââââââââââ */}
      {(editorialImage || editorialCitation) && (
        <section className="pb-8 bg-[#F5F0E8]">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex flex-col sm:flex-row items-center gap-6 py-6 px-8 bg-white/60 rounded-2xl border border-[#E8E5DE]">
              {/* Image ronde */}
              {editorialImage && (
                <div className="shrink-0">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#C9A84C]/30">
                    <img
                      src={editorialImage}
                      alt="Ãditorial"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
              {/* Citation */}
              {editorialCitation && (
                <div className="flex-1 text-center sm:text-left">
                  <p className="font-display text-base md:text-lg italic text-[#2A2A2A] leading-relaxed">
                    &ldquo;{editorialCitation}&rdquo;
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ââââââââââââââââââââââââââââââââââââââââââââââ */}
      {/* GALERIE PHOTOS (max 4 images) */}
      {/* ââââââââââââââââââââââââââââââââââââââââââââââ */}
      {gallery.length > 0 && (
        <section className="pb-8 bg-[#F5F0E8]">
          <div className="max-w-6xl mx-auto px-6">
            {/* Titre galerie */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Camera size={14} className="text-[#C9A84C]" />
                <p className="font-body text-xs tracking-[0.2em] uppercase text-[#9A9A8A]">
                  Galerie
                </p>
              </div>
            </div>
            {/* Grille photos */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {gallery.map((item) => (
                <div
                  key={item.id}
                  className="group relative aspect-square overflow-hidden rounded-xl bg-[#2A2A2A]"
                >
                  <img
                    src={item.image_url}
                    alt={item.title || "Galerie AFRIKHER"}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {item.title && (
                    <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="font-body text-xs text-white/90 truncate">
                        {item.title}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ââââââââââââââââââââââââââââââââââââââââââââââ */}
      {/* CATEGORIES (petites cartes horizontales) */}
      {/* ââââââââââââââââââââââââââââââââââââââââââââââ */}
      {categories.length > 0 && (
        <section className="pb-6 bg-[#F5F0E8]">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveCategory("all")}
                className={`px-4 py-2 rounded-full font-body text-xs tracking-wide uppercase transition-all duration-300 ${
                  activeCategory === "all"
                    ? "bg-[#0A0A0A] text-[#C9A84C]"
                    : "bg-white text-[#2A2A2A] border border-[#E8E5DE] hover:border-[#C9A84C]/40"
                }`}
              >
                Toutes les rubriques
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.name)}
                  className={`px-4 py-2 rounded-full font-body text-xs tracking-wide uppercase transition-all duration-300 ${
                    activeCategory === cat.name
                      ? "bg-[#0A0A0A] text-[#C9A84C]"
                      : "bg-white text-[#2A2A2A] border border-[#E8E5DE] hover:border-[#C9A84C]/40"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ââââââââââââââââââââââââââââââââââââââââââââââ */}
      {/* FILTRES PAR TYPE */}
      {/* ââââââââââââââââââââââââââââââââââââââââââââââ */}
      <section className="pb-8 bg-[#F5F0E8]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-1 overflow-x-auto pb-2">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveFilter(tab.value)}
                className={`px-3 py-1.5 font-body text-xs transition-all duration-300 whitespace-nowrap ${
                  activeFilter === tab.value
                    ? "text-[#C9A84C] border-b-2 border-[#C9A84C]"
                    : "text-[#9A9A8A] hover:text-[#0A0A0A]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ââââââââââââââââââââââââââââââââââââââââââââââ */}
      {/* GRILLE D'ARTICLES */}
      {/* ââââââââââââââââââââââââââââââââââââââââââââââ */}
      <section className="pb-20 bg-[#F5F0E8]">
        <div className="max-w-6xl mx-auto px-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[4/3] bg-[#E8E5DE] rounded-lg mb-4" />
                  <div className="h-3 bg-[#E8E5DE] rounded w-1/3 mb-3" />
                  <div className="h-5 bg-[#E8E5DE] rounded w-3/4 mb-2" />
                  <div className="h-3 bg-[#E8E5DE] rounded w-full" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-display text-2xl text-[#9A9A8A] mb-4">
                Aucun article trouvÃ©
              </p>
              <button
                onClick={() => {
                  setActiveFilter("all");
                  setActiveCategory("all");
                  setSearchQuery("");
                }}
                className="font-body text-sm text-[#C9A84C] hover:underline"
              >
                Voir tous les articles
              </button>
            </div>
          ) : (
            <>
              {/* Compteur */}
              <p className="font-body text-xs text-[#9A9A8A] mb-6">
                {filtered.length} article{filtered.length > 1 ? "s" : ""}
              </p>

              {/* Grille */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                {filtered.map((item) => (
                  <Link
                    key={item.id}
                    href={`/rubriques/${item.slug}`}
                    className="group block no-underline"
                  >
                    <article>
                      {/* Image */}
                      <div className="aspect-[4/3] overflow-hidden rounded-lg mb-4 bg-[#2A2A2A]">
                        {item.cover_image ? (
                          <img
                            src={item.cover_image}
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="font-display text-xl text-[#C9A84C]/30">
                              AFRIKHER
                            </span>
                          </div>
                        )}
                      </div>

                      {/* CatÃ©gorie + type */}
                      <div className="flex items-center gap-2 mb-2">
                        {item.category && (
                          <span className="font-body text-[10px] tracking-[0.15em] uppercase text-[#C9A84C]">
                            {item.category}
                          </span>
                        )}
                        {item.type !== "article" && (
                          <>
                            <span className="text-[#E8E5DE]">|</span>
                            <span className="font-body text-[10px] tracking-[0.15em] uppercase text-[#9A9A8A]">
                              {typeLabel(item.type)}
                            </span>
                          </>
                        )}
                      </div>

                      {/* Titre */}
                      <h3 className="font-body text-base font-semibold text-[#0A0A0A] leading-snug mb-2 group-hover:text-[#C9A84C] transition-colors duration-300">
                        {item.title}
                      </h3>

                      {/* Extrait */}
                      <p className="font-body text-sm text-[#9A9A8A] leading-relaxed mb-3 line-clamp-2">
                        {item.excerpt}
                      </p>

                      {/* Meta */}
                      <div className="flex items-center gap-3 font-body text-xs text-[#9A9A8A]/70">
                        {item.published_at && (
                          <span>{formatDate(item.published_at)}</span>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock size={11} />
                          {readTime(item.excerpt)} de lecture
                        </span>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
          <Footer />
    </main>
  );
}
