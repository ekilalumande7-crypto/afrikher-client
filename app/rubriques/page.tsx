"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Clock, Play, Search, Camera, Video as VideoIcon, BookOpen } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

/* ─── Types ─── */
interface ChapterItem {
  id: string;
  titre: string;
  description: string;
  image: string;
  link: string;
  ordre: number;
}

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

interface PhotoItem {
  id: string;
  title: string | null;
  description: string | null;
  image_url: string;
  category: string | null;
  featured: boolean;
  sort_order: number;
}

interface VideoItem {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnail: string;
}

interface SiteConfig {
  [key: string]: string;
}

type ActiveTab = "chapitres" | "articles" | "photos" | "videos";

/* ─── Helpers ─── */
function extractYouTubeId(url: string) {
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

function getVideoThumbnail(url: string, fallback = "") {
  const ytId = extractYouTubeId(url);
  if (ytId) return `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
  return fallback;
}

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

/* ─── Main ─── */
export default function RubriquesPage() {
  const [loading, setLoading] = useState(true);
  const [chapters, setChapters] = useState<ChapterItem[]>([]);
  const [allContent, setAllContent] = useState<ContentItem[]>([]);
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [siteConfig, setSiteConfig] = useState<SiteConfig>({});
  const [activeTab, setActiveTab] = useState<ActiveTab>("chapitres");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const { createClient } = await import("@supabase/supabase-js");
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        if (!supabaseUrl || !supabaseKey) throw new Error("No Supabase config");

        const supabase = createClient(supabaseUrl, supabaseKey);

        const [articlesRes, blogRes, configRes, galleryRes] = await Promise.all([
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
          supabase.from("site_config").select("key, value").like("key", "rubriques_%"),
          supabase
            .from("gallery_items")
            .select("*")
            .order("sort_order", { ascending: true }),
        ]);

        /* Config map */
        const config: SiteConfig = {};
        (configRes.data || []).forEach((row: { key: string; value: string }) => {
          config[row.key] = row.value || "";
        });
        setSiteConfig(config);

        /* Chapters from site_config */
        let parsedChapters: ChapterItem[] = [];
        try {
          const raw = config.rubriques_chapitres ? JSON.parse(config.rubriques_chapitres) : [];
          if (Array.isArray(raw)) {
            parsedChapters = raw
              .filter((c: any) => c && typeof c === "object" && c.titre)
              .map((c: any, i: number) => ({
                id: String(c.id || `ch-${i}`),
                titre: c.titre || "",
                description: c.description || "",
                image: c.image || "",
                link: c.link || "",
                ordre: Number.isFinite(c.ordre) ? c.ordre : i,
              }))
              .sort((a: ChapterItem, b: ChapterItem) => a.ordre - b.ordre);
          }
        } catch {
          parsedChapters = [];
        }
        setChapters(parsedChapters);

        /* Articles */
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
            new Date(b.published_at || 0).getTime() - new Date(a.published_at || 0).getTime()
        );
        setAllContent(combined);

        /* Photos */
        let parsedPhotos: PhotoItem[] = [];
        try {
          const rawPhotos = config.rubriques_galerie ? JSON.parse(config.rubriques_galerie) : [];
          if (Array.isArray(rawPhotos) && rawPhotos.length > 0) {
            parsedPhotos = rawPhotos
              .filter((item: any) => item && typeof item === "object" && (item.url || item.image_url))
              .map((item: any, index: number) => ({
                id: String(item.id || `photo-${index}`),
                title: item.title || item.titre || item.legende || item.caption || "",
                description: item.description || item.legende || item.caption || "",
                image_url: item.url || item.image_url,
                category: item.category || "",
                featured: Boolean(item.featured),
                sort_order: Number.isFinite(item.ordre) ? item.ordre : Number.isFinite(item.sort_order) ? item.sort_order : index,
              }))
              .sort((a: PhotoItem, b: PhotoItem) => a.sort_order - b.sort_order);
          } else {
            parsedPhotos = (galleryRes.data || [])
              .filter((item: any) => Boolean(item.image_url))
              .map((item: any, index: number) => ({
                id: item.id,
                title: item.title || "",
                description: item.description || "",
                image_url: item.image_url,
                category: item.category || "",
                featured: Boolean(item.featured),
                sort_order: Number.isFinite(item.sort_order) ? item.sort_order : index,
              }))
              .sort((a: PhotoItem, b: PhotoItem) => a.sort_order - b.sort_order);
          }
        } catch {
          parsedPhotos = (galleryRes.data || [])
            .filter((item: any) => Boolean(item.image_url))
            .map((item: any, index: number) => ({
              id: item.id,
              title: item.title || "",
              description: item.description || "",
              image_url: item.image_url,
              category: item.category || "",
              featured: Boolean(item.featured),
              sort_order: Number.isFinite(item.sort_order) ? item.sort_order : index,
            }))
            .sort((a: PhotoItem, b: PhotoItem) => a.sort_order - b.sort_order);
        }
        setPhotos(parsedPhotos);

        /* Videos */
        let parsedVideos: VideoItem[] = [];
        try {
          const rawVideos = config.rubriques_videos ? JSON.parse(config.rubriques_videos) : [];
          if (Array.isArray(rawVideos)) {
            parsedVideos = rawVideos
              .filter((item: any) => item && typeof item === "object" && item.url)
              .map((item: any, index: number) => ({
                id: String(item.id || `video-${index}`),
                title: item.title || item.titre || "Video AFRIKHER",
                description: item.description || "",
                url: item.url,
                thumbnail: item.thumbnail || item.image || getVideoThumbnail(item.url, ""),
              }));
          }
        } catch {
          parsedVideos = [];
        }
        setVideos(parsedVideos);

        /* Default to first tab that has content */
        if (parsedChapters.length > 0) {
          // chapters is default
        } else if (combined.length > 0) {
          setActiveTab("articles");
        } else if (parsedPhotos.length > 0) {
          setActiveTab("photos");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  /* ─── Search & Filters ─── */
  const normalizedSearch = searchQuery.trim().toLowerCase();

  const filteredArticles = allContent.filter((item) => {
    if (!normalizedSearch) return true;
    return (
      item.title.toLowerCase().includes(normalizedSearch) ||
      item.excerpt.toLowerCase().includes(normalizedSearch) ||
      item.category.toLowerCase().includes(normalizedSearch)
    );
  });

  const filteredPhotos = photos.filter((item) => {
    if (!normalizedSearch) return true;
    return (
      (item.title || "").toLowerCase().includes(normalizedSearch) ||
      (item.description || "").toLowerCase().includes(normalizedSearch)
    );
  });

  const filteredVideos = videos.filter((item) => {
    if (!normalizedSearch) return true;
    return (
      item.title.toLowerCase().includes(normalizedSearch) ||
      item.description.toLowerCase().includes(normalizedSearch)
    );
  });

  const tabCounts: Record<ActiveTab, number> = {
    chapitres: chapters.length,
    articles: filteredArticles.length,
    photos: filteredPhotos.length,
    videos: filteredVideos.length,
  };

  const CONTENT_TABS: Array<{ label: string; value: ActiveTab; icon: any }> = [
    { label: "Chapitres", value: "chapitres", icon: BookOpen },
    { label: "Articles", value: "articles", icon: BookOpen },
    { label: "Photos", value: "photos", icon: Camera },
    { label: "Videos", value: "videos", icon: VideoIcon },
  ];

  /* Only show tabs that have content */
  const visibleTabs = CONTENT_TABS.filter((tab) => tabCounts[tab.value] > 0);

  const editorialImage = siteConfig.rubriques_editorial_image || "";
  const editorialCitation = siteConfig.rubriques_editorial_citation || "";
  const editorialTexte =
    siteConfig.rubriques_editorial_texte ||
    "AFRIKHER porte la vision d'une Afrique ou les femmes ne sont plus seulement les gardiennes de traditions, mais les architectes d'un avenir puissant, creatif et prospere.";

  const getItemHref = (item: ContentItem) => `/rubriques/${item.slug}`;

  /* ─── Render Functions ─── */

  const renderChapterCard = (chapter: ChapterItem, index: number) => {
    const href = chapter.link || "#";
    const isInternal = href.startsWith("/");

    return (
      <Link
        key={chapter.id}
        href={href}
        {...(!isInternal ? { target: "_blank", rel: "noreferrer" } : {})}
        className="group block no-underline"
      >
        <article className="relative overflow-hidden rounded-2xl bg-[#0A0A0A]">
          {/* Image */}
          <div className="aspect-[3/4] sm:aspect-[4/5] overflow-hidden">
            {chapter.image ? (
              <img
                src={chapter.image}
                alt={chapter.titre}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-[#1A1A1A]">
                <span className="font-display text-3xl text-[#C9A84C]/20">{index + 1}</span>
              </div>
            )}
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
          </div>

          {/* Content overlay */}
          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
            <span className="mb-2 inline-block font-body text-[0.58rem] font-semibold uppercase tracking-[0.28em] text-[#C9A84C]">
              Chapitre {index + 1}
            </span>
            <h3 className="font-display text-[1.5rem] leading-[1.08] tracking-[-0.01em] text-white sm:text-[1.75rem]">
              {chapter.titre}
            </h3>
            {chapter.description && (
              <p className="mt-2 line-clamp-3 font-body text-[0.82rem] leading-[1.6] text-white/65">
                {chapter.description}
              </p>
            )}
            <span className="mt-4 inline-flex items-center gap-2 font-body text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-[#C9A84C] transition-colors duration-300 group-hover:text-[#E8C97A]">
              Explorer
              <ArrowRight size={12} />
            </span>
          </div>
        </article>
      </Link>
    );
  };

  const renderArticleCard = (item: ContentItem) => (
    <Link key={item.id} href={getItemHref(item)} className="group block h-full no-underline">
      <article className="flex h-full flex-col">
        <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-[#2A2A2A]">
          {item.cover_image ? (
            <img
              src={item.cover_image}
              alt={item.title}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="font-display text-xl text-[#C9A84C]/30">AFRIKHER</span>
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col pt-4">
          {item.category && (
            <span className="mb-2 font-body text-[0.6rem] uppercase tracking-[0.22em] text-[#C9A84C]">
              {item.category}
            </span>
          )}
          <h3 className="line-clamp-3 font-display text-[1.6rem] leading-[1.1] tracking-[-0.015em] text-[#0A0A0A] transition-colors duration-300 group-hover:text-[#C9A84C]">
            {item.title}
          </h3>
          <p className="mt-2.5 line-clamp-2 font-body text-[0.88rem] leading-[1.7] text-[#0A0A0A]/55">
            {item.excerpt}
          </p>
          <div className="mt-auto pt-4">
            <span className="inline-flex items-center gap-2 font-body text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-[#0A0A0A]/65 transition-colors duration-300 group-hover:text-[#C9A84C]">
              Lire l&apos;article
              <ArrowRight size={12} />
            </span>
            <div className="flex items-center gap-3 pt-3 font-body text-[0.72rem] text-[#8D877C]">
              {item.published_at && <span>{formatDate(item.published_at)}</span>}
              <span className="flex items-center gap-1">
                <Clock size={11} />
                {readTime(item.excerpt)} de lecture
              </span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );

  const renderPhotoCard = (item: PhotoItem) => (
    <Link
      key={item.id}
      href={item.image_url}
      target="_blank"
      rel="noreferrer"
      className="group block no-underline"
    >
      <article>
        <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-[#2A2A2A]">
          <img
            src={item.image_url}
            alt={item.title || "Photo AFRIKHER"}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
        <div className="pt-3.5">
          <span className="font-body text-[0.58rem] uppercase tracking-[0.22em] text-[#C9A84C]">
            Photo
          </span>
          <h3 className="mt-1.5 line-clamp-2 font-display text-[1.4rem] leading-[1.1] text-[#0A0A0A] transition-colors duration-300 group-hover:text-[#C9A84C]">
            {item.title || "Instant AFRIKHER"}
          </h3>
          {item.description && (
            <p className="mt-2 line-clamp-2 font-body text-[0.85rem] leading-[1.65] text-[#0A0A0A]/50">
              {item.description}
            </p>
          )}
        </div>
      </article>
    </Link>
  );

  const renderVideoCard = (item: VideoItem) => (
    <Link
      key={item.id}
      href={item.url}
      target="_blank"
      rel="noreferrer"
      className="group block no-underline"
    >
      <article>
        <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-[#111]">
          {item.thumbnail ? (
            <img
              src={item.thumbnail}
              alt={item.title}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Play size={28} className="text-[#C9A84C]" />
            </div>
          )}
          <div className="absolute inset-0 bg-black/25 transition-colors duration-300 group-hover:bg-black/10" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-black/45 text-white backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
              <Play size={18} className="translate-x-[1px]" />
            </span>
          </div>
        </div>
        <div className="pt-3.5">
          <span className="font-body text-[0.58rem] uppercase tracking-[0.22em] text-[#C9A84C]">
            Video
          </span>
          <h3 className="mt-1.5 line-clamp-2 font-display text-[1.4rem] leading-[1.1] text-[#0A0A0A] transition-colors duration-300 group-hover:text-[#C9A84C]">
            {item.title}
          </h3>
          {item.description && (
            <p className="mt-2 line-clamp-2 font-body text-[0.85rem] leading-[1.65] text-[#0A0A0A]/50">
              {item.description}
            </p>
          )}
        </div>
      </article>
    </Link>
  );

  const renderEmptyState = (tab: ActiveTab) => {
    const labels: Record<ActiveTab, string> = {
      chapitres: "Aucun chapitre configure",
      articles: "Aucun article trouve",
      photos: "Aucune photo disponible",
      videos: "Aucune video disponible",
    };

    return (
      <div className="rounded-2xl border border-[#E6DFD2] bg-white/72 px-8 py-16 text-center">
        <p className="font-display text-[1.8rem] text-[#0A0A0A]/65">{labels[tab]}</p>
        <p className="mt-3 font-body text-sm leading-relaxed text-[#8D877C]">
          Le contenu apparaitra ici des qu&apos;il sera publie depuis l&apos;administration.
        </p>
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="mt-5 font-body text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-[#C9A84C] hover:underline"
          >
            Effacer la recherche
          </button>
        )}
      </div>
    );
  };

  /* ─── Layout ─── */
  return (
    <main className="bg-[#F5F0E8] text-[#0A0A0A]">
      <div className="fixed left-0 right-0 top-0 z-[90] h-20 bg-[#0A0A0A]" />
      <Navbar />

      {/* ─── Hero ─── */}
      <section className="bg-[#F5F0E8] pb-6 pt-24">
        <div className="mx-auto max-w-7xl px-6 md:px-10 lg:px-12">
          <div className="grid gap-6 lg:grid-cols-[1fr_22rem] lg:items-end">
            <div>
              <p className="mb-2 font-body text-[0.65rem] font-medium uppercase tracking-[0.32em] text-[#C9A84C]">
                {siteConfig.rubriques_badge || "Editorial"}
              </p>
              <h1 className="font-display text-[2.5rem] leading-[0.96] tracking-[-0.025em] text-[#0A0A0A] md:text-[3.6rem]">
                {siteConfig.rubriques_titre || "Les Rubriques"}
                <span className="text-[#C9A84C]">.</span>
              </h1>
              <p className="mt-2 max-w-[34rem] font-body text-[0.92rem] leading-[1.72] text-[#0A0A0A]/55">
                {siteConfig.rubriques_soustitre || "Le Sommaire d'AFRIKHER"}
              </p>
              <p className="mt-3 max-w-[38rem] font-body text-[0.92rem] leading-[1.72] text-[#0A0A0A]/65">
                {editorialTexte}
              </p>
            </div>

            {/* Search */}
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un contenu..."
                className="w-full rounded-xl border border-[#E6DFD2] bg-white/90 py-3 pl-5 pr-11 font-body text-sm text-[#0A0A0A] outline-none transition-colors placeholder:text-[#8D877C] focus:border-[#C9A84C]"
              />
              <Search size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8D877C]" />
            </div>
          </div>

          {/* Citation block */}
          {(editorialImage || editorialCitation) && (
            <div className="mt-5 rounded-2xl border border-[#EAE2D4] bg-white/56 px-6 py-4 md:px-8">
              <div className="flex flex-col items-start gap-4 md:flex-row md:items-center">
                {editorialImage && (
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full border border-[#C9A84C]/30">
                    <img src={editorialImage} alt="Editorial" className="h-full w-full object-cover" />
                  </div>
                )}
                {editorialCitation && (
                  <p className="max-w-[50rem] font-display text-[1rem] italic leading-[1.8] text-[#2A2A2A]/72 md:text-[1.1rem]">
                    &ldquo;{editorialCitation}&rdquo;
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ─── Tabs ─── */}
      <section className="bg-[#F5F0E8] pb-4">
        <div className="mx-auto max-w-7xl px-6 md:px-10 lg:px-12">
          <div className="border-t border-black/[0.06] pt-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-wrap items-center gap-5">
                {visibleTabs.map((tab) => (
                  <button
                    key={tab.value}
                    onClick={() => setActiveTab(tab.value)}
                    className={`flex items-center gap-2 border-b-2 pb-1.5 font-body text-[0.72rem] font-medium uppercase tracking-[0.14em] transition-all duration-300 ${
                      activeTab === tab.value
                        ? "border-[#C9A84C] text-[#C9A84C]"
                        : "border-transparent text-[#8D877C] hover:text-[#0A0A0A]"
                    }`}
                  >
                    {tab.label}
                    <span className={`rounded-full px-1.5 py-0.5 text-[0.58rem] ${
                      activeTab === tab.value
                        ? "bg-[#C9A84C]/10 text-[#C9A84C]"
                        : "bg-black/5 text-[#8D877C]"
                    }`}>
                      {tabCounts[tab.value]}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Content ─── */}
      <section className="bg-[#F5F0E8] pb-20">
        <div className="mx-auto max-w-7xl px-6 md:px-10 lg:px-12">
          {loading ? (
            <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="mb-4 aspect-[3/4] rounded-2xl bg-[#E8E5DE]" />
                  <div className="mb-3 h-3 w-1/4 rounded bg-[#E8E5DE]" />
                  <div className="mb-2 h-5 w-3/4 rounded bg-[#E8E5DE]" />
                  <div className="h-4 w-full rounded bg-[#E8E5DE]" />
                </div>
              ))}
            </div>
          ) : activeTab === "chapitres" ? (
            chapters.length === 0 ? (
              renderEmptyState("chapitres")
            ) : (
              <div className="space-y-6">
                <div>
                  <p className="font-body text-[0.65rem] font-medium uppercase tracking-[0.32em] text-[#C9A84C]">
                    Structure
                  </p>
                  <h2 className="mt-2 font-display text-[2.2rem] leading-[0.98] tracking-[-0.02em] text-[#0A0A0A] md:text-[2.8rem]">
                    Chapitres
                  </h2>
                  <p className="mt-2 max-w-[32rem] font-body text-[0.88rem] leading-[1.7] text-[#0A0A0A]/50">
                    Les blocs editoriaux ou rubriques affiches sur la page.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {chapters.map((chapter, index) => renderChapterCard(chapter, index))}
                </div>
              </div>
            )
          ) : activeTab === "articles" ? (
            filteredArticles.length === 0 ? (
              renderEmptyState("articles")
            ) : (
              <div className="space-y-6">
                <div>
                  <p className="font-body text-[0.65rem] font-medium uppercase tracking-[0.32em] text-[#C9A84C]">
                    Selection editoriale
                  </p>
                  <h2 className="mt-2 font-display text-[2.2rem] leading-[0.98] tracking-[-0.02em] text-[#0A0A0A] md:text-[2.8rem]">
                    Articles AFRIKHER
                  </h2>
                </div>

                <div className="grid grid-cols-1 gap-x-7 gap-y-10 md:grid-cols-2 xl:grid-cols-3">
                  {filteredArticles.map((item) => renderArticleCard(item))}
                </div>
              </div>
            )
          ) : activeTab === "photos" ? (
            filteredPhotos.length === 0 ? (
              renderEmptyState("photos")
            ) : (
              <div className="space-y-6">
                <div>
                  <p className="font-body text-[0.65rem] font-medium uppercase tracking-[0.32em] text-[#C9A84C]">
                    Galerie
                  </p>
                  <h2 className="mt-2 font-display text-[2.2rem] leading-[0.98] tracking-[-0.02em] text-[#0A0A0A] md:text-[2.8rem]">
                    Photos AFRIKHER
                  </h2>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredPhotos.map((item) => renderPhotoCard(item))}
                </div>
              </div>
            )
          ) : filteredVideos.length === 0 ? (
            renderEmptyState("videos")
          ) : (
            <div className="space-y-6">
              <div>
                <p className="font-body text-[0.65rem] font-medium uppercase tracking-[0.32em] text-[#C9A84C]">
                  Selection video
                </p>
                <h2 className="mt-2 font-display text-[2.2rem] leading-[0.98] tracking-[-0.02em] text-[#0A0A0A] md:text-[2.8rem]">
                  Videos AFRIKHER
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {filteredVideos.map((item) => renderVideoCard(item))}
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
