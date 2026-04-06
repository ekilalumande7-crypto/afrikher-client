"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Clock, Play, Search } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

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

type ActiveTab = "articles" | "gallery" | "photos" | "videos";

const CONTENT_TABS: Array<{ label: string; value: ActiveTab }> = [
  { label: "Articles", value: "articles" },
  { label: "Galerie", value: "gallery" },
  { label: "Photos", value: "photos" },
  { label: "Vidéos", value: "videos" },
];

function extractYouTubeId(url: string) {
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

function getVideoThumbnail(url: string, fallback = "") {
  const ytId = extractYouTubeId(url);
  if (ytId) {
    return `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
  }
  return fallback;
}

export default function RubriquesPage() {
  const [loading, setLoading] = useState(true);
  const [allContent, setAllContent] = useState<ContentItem[]>([]);
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [siteConfig, setSiteConfig] = useState<SiteConfig>({});
  const [activeTab, setActiveTab] = useState<ActiveTab>("articles");
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

        const config: SiteConfig = {};
        (configRes.data || []).forEach((row: { key: string; value: string }) => {
          config[row.key] = row.value || "";
        });
        setSiteConfig(config);

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

        let parsedPhotos: PhotoItem[] = [];
        try {
          const rawPhotos = config.rubriques_galerie ? JSON.parse(config.rubriques_galerie) : [];
          if (Array.isArray(rawPhotos) && rawPhotos.length > 0) {
            parsedPhotos = rawPhotos
              .filter(
                (item) =>
                  item &&
                  typeof item === "object" &&
                  (item.url || item.image_url)
              )
              .map((item: any, index: number) => ({
                id: String(item.id || `photo-${index}`),
                title:
                  item.title || item.titre || item.legende || item.caption || "",
                description:
                  item.description || item.legende || item.caption || "",
                image_url: item.url || item.image_url,
                category: item.category || "",
                featured: Boolean(item.featured),
                sort_order: Number.isFinite(item.ordre)
                  ? item.ordre
                  : Number.isFinite(item.sort_order)
                    ? item.sort_order
                    : index,
              }))
              .sort((a, b) => a.sort_order - b.sort_order);
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
              .sort((a, b) => a.sort_order - b.sort_order);
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
            .sort((a, b) => a.sort_order - b.sort_order);
        }
        setPhotos(parsedPhotos);

        let parsedVideos: VideoItem[] = [];
        try {
          const rawVideos = config.rubriques_videos ? JSON.parse(config.rubriques_videos) : [];
          if (Array.isArray(rawVideos)) {
            parsedVideos = rawVideos
              .filter((item) => item && typeof item === "object" && item.url)
              .map((item: any, index: number) => ({
                id: String(item.id || `video-${index}`),
                title: item.title || item.titre || "Vidéo AFRIKHER",
                description: item.description || "",
                url: item.url,
                thumbnail: item.thumbnail || item.image || getVideoThumbnail(item.url, ""),
              }));
          }
        } catch {
          parsedVideos = [];
        }
        setVideos(parsedVideos);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

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
      (item.description || "").toLowerCase().includes(normalizedSearch) ||
      (item.category || "").toLowerCase().includes(normalizedSearch)
    );
  });

  const filteredVideos = videos.filter((item) => {
    if (!normalizedSearch) return true;
    return (
      item.title.toLowerCase().includes(normalizedSearch) ||
      item.description.toLowerCase().includes(normalizedSearch)
    );
  });

  const galleryItems = [
    ...filteredPhotos.map((item) => ({ ...item, mediaType: "photo" as const })),
    ...filteredVideos.map((item) => ({ ...item, mediaType: "video" as const })),
  ];

  const articleSuggestions =
    activeTab === "articles" && normalizedSearch && filteredArticles.length < 3
      ? allContent
          .filter((item) => !filteredArticles.some((filteredItem) => filteredItem.id === item.id))
          .slice(0, Math.max(0, 3 - filteredArticles.length))
      : [];

  const activeCount =
    activeTab === "articles"
      ? filteredArticles.length
      : activeTab === "gallery"
        ? galleryItems.length
        : activeTab === "photos"
          ? filteredPhotos.length
          : filteredVideos.length;

  const getItemHref = (item: ContentItem) =>
    item.source === "blog" ? `/blog/${item.slug}` : `/rubriques/${item.slug}`;

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

  const editorialImage = siteConfig.rubriques_editorial_image || "";
  const editorialCitation = siteConfig.rubriques_editorial_citation || "";
  const editorialTexte =
    siteConfig.rubriques_editorial_texte ||
    "Une sélection pensée comme une traversée éditoriale : articles, images et vidéos qui donnent du relief à l’univers AFRIKHER.";

  const renderArticleCard = (item: ContentItem, compact = false) => (
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
              <span className="font-display text-xl text-[#C9A84C]/30">AFRIKHER</span>
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col pt-4">
          <div className="mb-2 flex items-center gap-2">
            {item.category && (
              <span className="font-body text-[0.62rem] uppercase tracking-[0.22em] text-[#C9A84C]">
                {item.category}
              </span>
            )}
          </div>

          <div className={compact ? "min-h-[5.4rem]" : "min-h-[6.5rem]"}>
            <h3
              className={`line-clamp-3 font-display tracking-[-0.015em] text-[#0A0A0A] transition-colors duration-300 group-hover:text-[#C9A84C] ${
                compact
                  ? "text-[1.55rem] leading-[1.14]"
                  : "text-[1.9rem] leading-[1.08]"
              }`}
            >
              {item.title}
            </h3>
          </div>

          <div className={compact ? "min-h-[4.2rem]" : "min-h-[5.75rem]"}>
            <p
              className={`mt-3 font-body text-[#0A0A0A]/56 ${
                compact
                  ? "line-clamp-2 text-[0.9rem] leading-[1.7]"
                  : "line-clamp-3 text-[0.94rem] leading-[1.8]"
              }`}
            >
              {item.excerpt}
            </p>
          </div>

          <div className="mt-auto pt-5">
            <span className="inline-flex items-center gap-2 font-body text-[0.64rem] font-semibold uppercase tracking-[0.2em] text-[#0A0A0A]/70 transition-colors duration-300 group-hover:text-[#C9A84C]">
              Lire l&apos;article
              <ArrowRight size={13} />
            </span>

            <div className="flex items-center gap-3 pt-4 font-body text-[0.74rem] text-[#8D877C]">
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
      className="group block h-full no-underline"
    >
      <article className="flex h-full flex-col">
        <div className="aspect-[4/3] overflow-hidden rounded-[1.25rem] bg-[#2A2A2A]">
          <img
            src={item.image_url}
            alt={item.title || "Photo AFRIKHER"}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>

        <div className="flex flex-1 flex-col pt-4">
          <div className="mb-2 flex items-center gap-2">
            <span className="font-body text-[0.62rem] uppercase tracking-[0.22em] text-[#C9A84C]">
              Photo
            </span>
            {item.category && (
              <span className="font-body text-[0.62rem] uppercase tracking-[0.18em] text-[#8D877C]">
                {item.category}
              </span>
            )}
          </div>

          <div className="min-h-[4.3rem]">
            <h3 className="line-clamp-2 font-display text-[1.8rem] leading-[1.08] tracking-[-0.015em] text-[#0A0A0A] transition-colors duration-300 group-hover:text-[#C9A84C]">
              {item.title || "Instant AFRIKHER"}
            </h3>
          </div>

          <div className="min-h-[5.75rem]">
            <p className="mt-3 line-clamp-3 font-body text-[0.94rem] leading-[1.8] text-[#0A0A0A]/56">
              {item.description || "Une image issue de l’univers éditorial AFRIKHER."}
            </p>
          </div>

          <div className="mt-auto pt-5">
            <span className="inline-flex items-center gap-2 font-body text-[0.64rem] font-semibold uppercase tracking-[0.2em] text-[#0A0A0A]/70 transition-colors duration-300 group-hover:text-[#C9A84C]">
              Voir la photo
              <ArrowRight size={13} />
            </span>
          </div>
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
      className="group block h-full no-underline"
    >
      <article className="flex h-full flex-col">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[1.25rem] bg-[#2A2A2A]">
          {item.thumbnail ? (
            <img
              src={item.thumbnail}
              alt={item.title}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[#111111]">
              <Play size={32} className="text-[#C9A84C]" />
            </div>
          )}
          <div className="absolute inset-0 bg-black/25 transition-colors duration-300 group-hover:bg-black/15" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-black/45 text-white backdrop-blur-sm">
              <Play size={18} className="translate-x-[1px]" />
            </span>
          </div>
        </div>

        <div className="flex flex-1 flex-col pt-4">
          <div className="mb-2 flex items-center gap-2">
            <span className="font-body text-[0.62rem] uppercase tracking-[0.22em] text-[#C9A84C]">
              Vidéo
            </span>
          </div>

          <div className="min-h-[4.3rem]">
            <h3 className="line-clamp-2 font-display text-[1.8rem] leading-[1.08] tracking-[-0.015em] text-[#0A0A0A] transition-colors duration-300 group-hover:text-[#C9A84C]">
              {item.title}
            </h3>
          </div>

          <div className="min-h-[5.75rem]">
            <p className="mt-3 line-clamp-3 font-body text-[0.94rem] leading-[1.8] text-[#0A0A0A]/56">
              {item.description || "Une vidéo issue de l’univers éditorial AFRIKHER."}
            </p>
          </div>

          <div className="mt-auto pt-5">
            <span className="inline-flex items-center gap-2 font-body text-[0.64rem] font-semibold uppercase tracking-[0.2em] text-[#0A0A0A]/70 transition-colors duration-300 group-hover:text-[#C9A84C]">
              Regarder
              <ArrowRight size={13} />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );

  const renderEmptyState = (tab: ActiveTab) => {
    const labels: Record<ActiveTab, string> = {
      articles: "Aucun article trouvé",
      gallery: "La galerie arrive bientôt",
      photos: "Aucune photo disponible",
      videos: "Aucune vidéo disponible",
    };

    const descriptions: Record<ActiveTab, string> = {
      articles:
        "Essaie une autre recherche pour retrouver la sélection éditoriale AFRIKHER.",
      gallery:
        "Les photos et vidéos éditoriales apparaîtront ici dès que le contenu sera alimenté.",
      photos:
        "Les visuels éditoriaux apparaîtront ici dès que la galerie photos sera alimentée.",
      videos:
        "Les vidéos éditoriales apparaîtront ici dès que la section vidéos sera alimentée.",
    };

    return (
      <div className="rounded-[1.75rem] border border-[#E6DFD2] bg-white/72 px-8 py-16 text-center">
        <p className="font-display text-[2rem] text-[#0A0A0A]/68">{labels[tab]}</p>
        <p className="mt-3 font-body text-sm leading-relaxed text-[#8D877C]">
          {descriptions[tab]}
        </p>
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="mt-6 font-body text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[#C9A84C] hover:underline"
          >
            Effacer la recherche
          </button>
        )}
      </div>
    );
  };

  return (
    <main className="bg-[#F5F0E8] text-[#0A0A0A]">
      <div className="fixed left-0 right-0 top-0 z-[90] h-20 bg-[#0A0A0A]" />
      <Navbar />

      <section className="bg-[#F5F0E8] pb-8 pt-24">
        <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-12">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-end">
            <div>
              <p className="mb-3 font-body text-[0.68rem] font-medium uppercase tracking-[0.32em] text-[#C9A84C]">
                {siteConfig.rubriques_editorial_titre || "Editorial"}
              </p>
              <h1 className="font-display text-[2.6rem] leading-[0.96] tracking-[-0.025em] text-[#0A0A0A] md:text-[3.8rem]">
                Les Rubriques<span className="text-[#C9A84C]">.</span>
              </h1>
              <p className="mt-2.5 max-w-[34rem] font-body text-[0.98rem] leading-[1.72] text-[#0A0A0A]/58">
                {siteConfig.rubriques_editorial_sous_titre ||
                  "Un sommaire éditorial pensé comme une sélection AFRIKHER : articles, galerie, photos et vidéos à parcourir avec clarté."}
              </p>
              <p className="mt-3.5 max-w-[38rem] font-body text-[0.95rem] leading-[1.72] text-[#0A0A0A]/66">
                {editorialTexte}
              </p>
            </div>

            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  activeTab === "articles"
                    ? "Rechercher un article..."
                    : activeTab === "gallery"
                      ? "Rechercher dans la galerie..."
                      : activeTab === "photos"
                        ? "Rechercher une photo..."
                        : activeTab === "videos"
                          ? "Rechercher une vidéo..."
                          : "Rechercher un contenu..."
                }
                className="w-full rounded-2xl border border-[#E6DFD2] bg-white/90 py-3 pl-5 pr-11 font-body text-sm text-[#0A0A0A] outline-none transition-colors placeholder:text-[#8D877C] focus:border-[#C9A84C]"
              />
              <Search
                size={16}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8D877C]"
              />
            </div>
          </div>

          {(editorialImage || editorialCitation) && (
            <div className="mt-5 rounded-[1.75rem] border border-[#EAE2D4] bg-white/56 px-6 py-4.5 md:px-8">
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

      <section className="bg-[#F5F0E8] pb-6">
        <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-12">
          <div className="border-t border-black/[0.06] pt-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-wrap items-center gap-4">
                {CONTENT_TABS.map((tab) => (
                  <button
                    key={tab.value}
                    onClick={() => setActiveTab(tab.value)}
                    className={`border-b pb-1 font-body text-[0.76rem] font-medium uppercase tracking-[0.16em] transition-all duration-300 ${
                      activeTab === tab.value
                        ? "border-[#C9A84C] text-[#C9A84C]"
                        : "border-transparent text-[#8D877C] hover:text-[#0A0A0A]"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <p className="font-body text-[0.78rem] text-[#8D877C]">
                {activeCount} contenu{activeCount > 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#F5F0E8] pb-16">
        <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-12">
          {loading ? (
            <div className="grid w-full grid-cols-1 items-stretch gap-8 md:grid-cols-2 xl:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="mb-4 aspect-[4/3] rounded-[1.25rem] bg-[#E8E5DE]" />
                  <div className="mb-3 h-3 w-1/4 rounded bg-[#E8E5DE]" />
                  <div className="mb-3 h-6 w-3/4 rounded bg-[#E8E5DE]" />
                  <div className="h-4 w-full rounded bg-[#E8E5DE]" />
                </div>
              ))}
            </div>
          ) : activeTab === "articles" ? (
            filteredArticles.length === 0 ? (
              renderEmptyState("articles")
            ) : (
              <div className="space-y-8">
                <div>
                  <p className="font-body text-[0.68rem] font-medium uppercase tracking-[0.32em] text-[#C9A84C]">
                    Sélection éditoriale
                  </p>
                  <h2 className="mt-3 font-display text-[2.35rem] leading-[0.98] tracking-[-0.02em] text-[#0A0A0A] md:text-[3rem]">
                    Articles AFRIKHER
                  </h2>
                </div>

                <div className="grid grid-cols-1 items-stretch gap-x-8 gap-y-10 md:grid-cols-2 xl:grid-cols-3">
                  {filteredArticles.map((item) => renderArticleCard(item))}
                </div>

                {searchQuery.trim() !== "" &&
                  filteredArticles.length < 3 &&
                  articleSuggestions.length > 0 && (
                    <div className="border-t border-black/[0.06] pt-8">
                      <div className="mb-6">
                        <p className="font-body text-[0.68rem] font-medium uppercase tracking-[0.32em] text-[#C9A84C]">
                          À découvrir aussi
                        </p>
                        <p className="mt-2 font-body text-sm text-[#8D877C]">
                          Une sélection complémentaire pour garder une page vivante même avec peu de résultats.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 items-stretch gap-x-8 gap-y-10 md:grid-cols-2 xl:grid-cols-3">
                        {articleSuggestions.map((item) => renderArticleCard(item, true))}
                      </div>
                    </div>
                  )}
              </div>
            )
          ) : activeTab === "gallery" ? (
            galleryItems.length === 0 ? (
              renderEmptyState("gallery")
            ) : (
              <div className="space-y-8">
                <div>
                  <p className="font-body text-[0.68rem] font-medium uppercase tracking-[0.32em] text-[#C9A84C]">
                    Galerie éditoriale
                  </p>
                  <h2 className="mt-3 font-display text-[2.35rem] leading-[0.98] tracking-[-0.02em] text-[#0A0A0A] md:text-[3rem]">
                    Photos &amp; vidéos
                  </h2>
                </div>

                <div className="grid grid-cols-1 items-stretch gap-x-8 gap-y-10 md:grid-cols-2 xl:grid-cols-3">
                  {galleryItems.map((item) =>
                    item.mediaType === "photo"
                      ? renderPhotoCard(item)
                      : renderVideoCard(item)
                  )}
                </div>
              </div>
            )
          ) : activeTab === "photos" ? (
            filteredPhotos.length === 0 ? (
              renderEmptyState("photos")
            ) : (
              <div className="space-y-8">
                <div>
                  <p className="font-body text-[0.68rem] font-medium uppercase tracking-[0.32em] text-[#C9A84C]">
                    Galerie photos
                  </p>
                  <h2 className="mt-3 font-display text-[2.35rem] leading-[0.98] tracking-[-0.02em] text-[#0A0A0A] md:text-[3rem]">
                    Photos AFRIKHER
                  </h2>
                </div>

                <div className="grid grid-cols-1 items-stretch gap-x-8 gap-y-10 md:grid-cols-2 xl:grid-cols-3">
                  {filteredPhotos.map((item) => renderPhotoCard(item))}
                </div>
              </div>
            )
          ) : filteredVideos.length === 0 ? (
            renderEmptyState("videos")
          ) : (
            <div className="space-y-8">
              <div>
                <p className="font-body text-[0.68rem] font-medium uppercase tracking-[0.32em] text-[#C9A84C]">
                  Sélection vidéo
                </p>
                <h2 className="mt-3 font-display text-[2.35rem] leading-[0.98] tracking-[-0.02em] text-[#0A0A0A] md:text-[3rem]">
                  Vidéos AFRIKHER
                </h2>
              </div>

              <div className="grid grid-cols-1 items-stretch gap-x-8 gap-y-10 md:grid-cols-2 xl:grid-cols-3">
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
