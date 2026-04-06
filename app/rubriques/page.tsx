"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { Clock, Search, ArrowRight } from "lucide-react";

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
        const [articlesRes, blogRes, categoriesRes, configRes] = await Promise.all([
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
        ]);

        // Build config
        const config: SiteConfig = {};
        (configRes.data || []).forEach((row: { key: string; value: string }) => {
          config[row.key] = row.value || "";
        });
        setSiteConfig(config);

        // Categories
        setCategories(categoriesRes.data || []);

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

  const hasActiveConstraints =
    activeFilter !== "all" || activeCategory !== "all" || searchQuery.trim() !== "";

  const suggestions = allContent
    .filter((item) => !filtered.some((filteredItem) => filteredItem.id === item.id))
    .slice(0, Math.max(0, 3 - filtered.length));

  const getItemHref = (item: ContentItem) =>
    item.source === "blog" ? `/blog/${item.slug}` : `/rubriques/${item.slug}`;

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
      <div className="fixed top-0 left-0 right-0 h-20 bg-[#0A0A0A] z-[90]" />
      <Navbar />

      <section className="bg-[#F5F0E8] pt-28 pb-10">
        <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-12">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-end">
            <div>
              <p className="mb-3 font-body text-[0.68rem] font-medium uppercase tracking-[0.32em] text-[#C9A84C]">
                {siteConfig["rubriques_editorial_titre"] || "Editorial"}
              </p>
              <h1 className="font-display text-[2.6rem] md:text-[3.8rem] leading-[0.96] tracking-[-0.025em] text-[#0A0A0A]">
                Les Rubriques<span className="text-[#C9A84C]">.</span>
              </h1>
              <p className="mt-3 max-w-[34rem] font-body text-[0.98rem] leading-[1.75] text-[#0A0A0A]/58">
                {siteConfig["rubriques_editorial_sous_titre"] ||
                  "Un sommaire éditorial pensé comme une sélection AFRIKHER : articles, interviews, portraits et dossiers à parcourir avec clarté."}
              </p>
            </div>

            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un article..."
                className="w-full rounded-2xl border border-[#E6DFD2] bg-white/90 py-3 pl-5 pr-11 font-body text-sm text-[#0A0A0A] placeholder-[#8D877C] outline-none transition-colors focus:border-[#C9A84C]"
              />
              <Search
                size={16}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8D877C]"
              />
            </div>
          </div>

          {(editorialImage || editorialCitation) && (
            <div className="mt-8 rounded-[1.75rem] border border-[#EAE2D4] bg-white/58 px-6 py-6 md:px-8">
              <div className="flex flex-col items-start gap-5 md:flex-row md:items-center">
                {editorialImage && (
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full border border-[#C9A84C]/30">
                    <img
                      src={editorialImage}
                      alt="Editorial"
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                {editorialCitation && (
                  <p className="max-w-[52rem] font-display text-[1.02rem] italic leading-[1.85] text-[#2A2A2A]/76 md:text-[1.16rem]">
                    &ldquo;{editorialCitation}&rdquo;
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="bg-[#F5F0E8] pb-8">
        <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-12">
          <div className="border-t border-black/[0.06] pt-8">
            <div className="flex flex-col gap-5">
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  onClick={() => setActiveCategory("all")}
                  className={`rounded-full px-4 py-2 font-body text-[0.68rem] font-medium uppercase tracking-[0.18em] transition-all duration-300 ${
                    activeCategory === "all"
                      ? "border border-[#0A0A0A] bg-[#0A0A0A] text-[#C9A84C]"
                      : "border border-[#E6DFD2] bg-white/90 text-[#2A2A2A]/76 hover:border-[#C9A84C]/35"
                  }`}
                >
                  Toutes les rubriques
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.name)}
                    className={`rounded-full px-4 py-2 font-body text-[0.68rem] font-medium uppercase tracking-[0.18em] transition-all duration-300 ${
                      activeCategory === cat.name
                        ? "border border-[#0A0A0A] bg-[#0A0A0A] text-[#C9A84C]"
                        : "border border-[#E6DFD2] bg-white/90 text-[#2A2A2A]/76 hover:border-[#C9A84C]/35"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-wrap items-center gap-4">
                  {FILTER_TABS.map((tab) => (
                    <button
                      key={tab.value}
                      onClick={() => setActiveFilter(tab.value)}
                      className={`border-b pb-1 font-body text-[0.76rem] font-medium uppercase tracking-[0.16em] transition-all duration-300 ${
                        activeFilter === tab.value
                          ? "border-[#C9A84C] text-[#C9A84C]"
                          : "border-transparent text-[#8D877C] hover:text-[#0A0A0A]"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <p className="font-body text-[0.78rem] text-[#8D877C]">
                  {filtered.length} contenu{filtered.length > 1 ? "s" : ""}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#F5F0E8] pb-20">
        <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-12">
          {loading ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[4/3] rounded-[1.25rem] bg-[#E8E5DE] mb-4" />
                  <div className="h-3 w-1/4 rounded bg-[#E8E5DE] mb-3" />
                  <div className="h-6 w-3/4 rounded bg-[#E8E5DE] mb-3" />
                  <div className="h-4 w-full rounded bg-[#E8E5DE]" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-[1.75rem] border border-[#E6DFD2] bg-white/72 px-8 py-16 text-center">
              <p className="font-display text-[2rem] text-[#0A0A0A]/68">
                Aucun contenu trouvé
              </p>
              <p className="mt-3 font-body text-sm leading-relaxed text-[#8D877C]">
                Essaie une autre recherche ou réinitialise les filtres pour retrouver toute la sélection AFRIKHER.
              </p>
              <button
                onClick={() => {
                  setActiveFilter("all");
                  setActiveCategory("all");
                  setSearchQuery("");
                }}
                className="mt-6 font-body text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[#C9A84C] hover:underline"
              >
                Voir tous les articles
              </button>
            </div>
          ) : (
            <div className="space-y-10">
              <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 xl:grid-cols-3">
                {filtered.map((item) => (
                  <Link
                    key={item.id}
                    href={getItemHref(item)}
                    className="group block h-full no-underline"
                  >
                    <article className="flex h-full flex-col">
                      <div className="aspect-[4/3] overflow-hidden rounded-[1.25rem] bg-[#2A2A2A]">
                        {item.cover_image ? (
                          <img
                            src={item.cover_image}
                            alt={item.title}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <span className="font-display text-xl text-[#C9A84C]/30">
                              AFRIKHER
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-1 flex-col pt-4">
                        <div className="mb-2 flex items-center gap-2">
                          {item.category && (
                            <span className="font-body text-[0.62rem] tracking-[0.22em] uppercase text-[#C9A84C]">
                              {item.category}
                            </span>
                          )}
                          {item.type !== "article" && (
                            <span className="font-body text-[0.62rem] tracking-[0.18em] uppercase text-[#8D877C]">
                              {typeLabel(item.type)}
                            </span>
                          )}
                        </div>

                        <h3 className="line-clamp-3 font-display text-[1.9rem] leading-[1.08] tracking-[-0.015em] text-[#0A0A0A] transition-colors duration-300 group-hover:text-[#C9A84C]">
                          {item.title}
                        </h3>

                        <p className="mt-3 line-clamp-3 font-body text-[0.94rem] leading-[1.8] text-[#0A0A0A]/56">
                          {item.excerpt}
                        </p>

                        <span className="mt-5 inline-flex items-center gap-2 font-body text-[0.64rem] font-semibold uppercase tracking-[0.2em] text-[#0A0A0A]/70 transition-colors duration-300 group-hover:text-[#C9A84C]">
                          Lire l&apos;article
                          <ArrowRight size={13} />
                        </span>

                        <div className="mt-auto pt-4 flex items-center gap-3 font-body text-[0.74rem] text-[#8D877C]">
                          {item.published_at && <span>{formatDate(item.published_at)}</span>}
                          <span className="flex items-center gap-1">
                            <Clock size={11} />
                            {readTime(item.excerpt)} de lecture
                          </span>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>

              {hasActiveConstraints && filtered.length < 3 && suggestions.length > 0 && (
                <div className="border-t border-black/[0.06] pt-8">
                  <div className="mb-6 flex items-center justify-between gap-4">
                    <div>
                      <p className="font-body text-[0.68rem] font-medium uppercase tracking-[0.32em] text-[#C9A84C]">
                        À découvrir aussi
                      </p>
                      <p className="mt-2 font-body text-sm text-[#8D877C]">
                        Une sélection complémentaire pour garder une page vivante même avec peu de résultats.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 xl:grid-cols-3">
                    {suggestions.map((item) => (
                      <Link
                        key={`suggestion-${item.id}`}
                        href={getItemHref(item)}
                        className="group block h-full no-underline"
                      >
                        <article className="flex h-full flex-col opacity-88">
                          <div className="aspect-[4/3] overflow-hidden rounded-[1.25rem] bg-[#2A2A2A]">
                            {item.cover_image ? (
                              <img
                                src={item.cover_image}
                                alt={item.title}
                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center">
                                <span className="font-display text-xl text-[#C9A84C]/30">
                                  AFRIKHER
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="flex flex-1 flex-col pt-4">
                            <div className="mb-2 flex items-center gap-2">
                              {item.category && (
                                <span className="font-body text-[0.62rem] tracking-[0.22em] uppercase text-[#C9A84C]">
                                  {item.category}
                                </span>
                              )}
                            </div>
                            <h3 className="line-clamp-3 font-display text-[1.55rem] leading-[1.14] tracking-[-0.015em] text-[#0A0A0A] transition-colors duration-300 group-hover:text-[#C9A84C]">
                              {item.title}
                            </h3>
                            <p className="mt-3 line-clamp-2 font-body text-[0.9rem] leading-[1.7] text-[#0A0A0A]/56">
                              {item.excerpt}
                            </p>
                            <span className="mt-4 inline-flex items-center gap-2 font-body text-[0.64rem] font-semibold uppercase tracking-[0.2em] text-[#0A0A0A]/70 transition-colors duration-300 group-hover:text-[#C9A84C]">
                              Lire l&apos;article
                              <ArrowRight size={13} />
                            </span>
                            <div className="mt-auto pt-4 flex items-center gap-3 font-body text-[0.74rem] text-[#8D877C]">
                              {item.published_at && <span>{formatDate(item.published_at)}</span>}
                            </div>
                          </div>
                        </article>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}
