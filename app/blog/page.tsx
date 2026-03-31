"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Link from "next/link";
import { Clock, Search } from "lucide-react";

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

const CATEGORY_TABS = [
  { label: "Tout voir", value: "all" },
  { label: "Editorial", value: "editorial" },
  { label: "Blog", value: "blog" },
  { label: "Interviews", value: "interview" },
  { label: "Portraits", value: "portrait" },
  { label: "Dossiers", value: "dossier" },
];

const TAG_COLORS: Record<string, { bg: string; text: string }> = {
  editorial: { bg: "#EDE9FE", text: "#7C3AED" },
  blog: { bg: "#DBEAFE", text: "#2563EB" },
  interview: { bg: "#D1FAE5", text: "#059669" },
  portrait: { bg: "#FEF3C7", text: "#D97706" },
  dossier: { bg: "#FCE7F3", text: "#DB2777" },
  article: { bg: "#E0E7FF", text: "#4F46E5" },
};

const FALLBACK_POSTS: ContentItem[] = [
  {
    id: "fb-1",
    title: "Pourquoi l'Afrique est le continent de demain pour les femmes entrepreneures",
    slug: "afrique-continent-femmes-entrepreneures",
    excerpt: "Une analyse des opportunites uniques que le continent offre aux femmes ambitieuses qui osent entreprendre.",
    cover_image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop",
    published_at: "2026-03-25T10:00:00Z",
    category: "Inspiration",
    type: "article",
    source: "blog",
  },
  {
    id: "fb-2",
    title: "Les 5 habitudes des femmes leaders africaines qui reussissent",
    slug: "habitudes-femmes-leaders-africaines",
    excerpt: "Decouvrez les rituels quotidiens et les strategies qui distinguent les femmes d'influence sur le continent.",
    cover_image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop",
    published_at: "2026-03-20T10:00:00Z",
    category: "Leadership",
    type: "article",
    source: "editorial",
  },
  {
    id: "fb-3",
    title: "Comment lever des fonds en Afrique : guide pratique",
    slug: "lever-fonds-afrique-guide",
    excerpt: "Du bootstrapping aux investisseurs institutionnels, toutes les options de financement decryptees.",
    cover_image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
    published_at: "2026-03-15T10:00:00Z",
    category: "Finance",
    type: "dossier",
    source: "editorial",
  },
  {
    id: "fb-4",
    title: "Rencontre avec Aminata Diallo, pionniere de la FinTech ouest-africaine",
    slug: "rencontre-aminata-diallo-fintech",
    excerpt: "Portrait d'une femme qui bouleverse les codes de la finance digitale en Afrique de l'Ouest.",
    cover_image: "https://images.unsplash.com/photo-1589561253898-768105ca91a8?q=80&w=2069&auto=format&fit=crop",
    published_at: "2026-03-10T10:00:00Z",
    category: "Tech",
    type: "interview",
    source: "editorial",
  },
  {
    id: "fb-5",
    title: "La mode ethique africaine conquiert le monde",
    slug: "mode-ethique-africaine-monde",
    excerpt: "Comment les creatrices africaines redefinissent la mode durable a l'echelle internationale.",
    cover_image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?q=80&w=2032&auto=format&fit=crop",
    published_at: "2026-03-05T10:00:00Z",
    category: "Mode",
    type: "article",
    source: "blog",
  },
  {
    id: "fb-6",
    title: "Portrait : Ngozi Okonjo-Iweala, de la Banque Mondiale a l'OMC",
    slug: "portrait-ngozi-okonjo-iweala",
    excerpt: "Le parcours exceptionnel d'une femme qui a brise tous les plafonds de verre.",
    cover_image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974&auto=format&fit=crop",
    published_at: "2026-02-28T10:00:00Z",
    category: "Leadership",
    type: "portrait",
    source: "editorial",
  },
];

export default function BlogPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [allContent, setAllContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadContent = async () => {
      setLoading(true);
      try {
        const { createClient } = await import("@supabase/supabase-js");
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL || "https://xykvzzitgmnipscxbhcf.supabase.co",
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5a3Z6eml0Z21uaXBzY3hiaGNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMzNjc1ODAsImV4cCI6MjA1ODk0MzU4MH0.yqOgQhnMKOaAoLkVDwH99jEMVilrp42ckFWPhNGk-Ys"
        );

        const { data: articles } = await supabase
          .from("articles")
          .select("*, categories(name)")
          .eq("status", "published")
          .order("published_at", { ascending: false });

        const { data: blogPosts } = await supabase
          .from("blog_posts")
          .select("*")
          .eq("status", "published")
          .order("published_at", { ascending: false });

        const editorialItems: ContentItem[] = (articles || []).map((a: any) => ({
          id: a.id,
          title: a.title,
          slug: a.slug,
          excerpt: a.excerpt || "",
          cover_image: a.cover_image,
          published_at: a.published_at,
          category: a.categories?.name || "",
          type: a.type || "article",
          source: "editorial",
        }));

        const blogItems: ContentItem[] = (blogPosts || []).map((b: any) => ({
          id: b.id,
          title: b.title,
          slug: b.slug,
          excerpt: b.excerpt || "",
          cover_image: b.cover_image,
          published_at: b.published_at,
          category: "Blog",
          type: "article",
          source: "blog",
        }));

        const combined = [...editorialItems, ...blogItems].sort(
          (a, b) => new Date(b.published_at || 0).getTime() - new Date(a.published_at || 0).getTime()
        );

        setAllContent(combined.length > 0 ? combined : FALLBACK_POSTS);
      } catch {
        setAllContent(FALLBACK_POSTS);
      } finally {
        setLoading(false);
      }
    };
    loadContent();
  }, []);

  const filtered = allContent.filter((item) => {
    const matchSearch = !searchQuery ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeTab === "all") return matchSearch;
    if (activeTab === "editorial") return matchSearch && item.source === "editorial";
    if (activeTab === "blog") return matchSearch && item.source === "blog";
    return matchSearch && item.type === activeTab;
  });

  const formatDate = (d: string | null) => {
    if (!d) return "";
    return new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  };

  const readTime = (text: string) => {
    const words = text.split(/\s+/).length;
    return `${Math.max(2, Math.ceil(words / 200))} min`;
  };

  const getTagStyle = (type: string) => TAG_COLORS[type] || TAG_COLORS.article;
  const typeLabel = (t: string) => {
    const m: Record<string, string> = { article: "Article", interview: "Interview", portrait: "Portrait", dossier: "Dossier", editorial: "Editorial", blog: "Blog" };
    return m[t] || t;
  };

  return (
    <main style={{ minHeight: "100vh", background: "#FAFAF8" }}>
      {/* Navbar dark band */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 80, background: "#0A0A0A", zIndex: 90 }} />
      <Navbar />

      {/* ── PAGE HEADER ── */}
      <section style={{
        paddingTop: 120,
        paddingBottom: 48,
        paddingLeft: 24,
        paddingRight: 24,
        background: "#FAFAF8",
        borderBottom: "1px solid #E8E5DE",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 24 }}>
            <div>
              <h1 style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 42,
                fontWeight: 600,
                color: "#1A1A1A",
                margin: 0,
                lineHeight: 1.1,
              }}>
                Blog, Journal & Insights
              </h1>
            </div>
            {/* Search */}
            <div style={{ position: "relative", width: 280 }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, topic, or story"
                style={{
                  width: "100%",
                  padding: "10px 40px 10px 16px",
                  border: "1px solid #D4D0C8",
                  borderRadius: 8,
                  background: "#fff",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 14,
                  color: "#1A1A1A",
                  outline: "none",
                }}
              />
              <Search size={16} color="#9A9A8A" style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)" }} />
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTENT GRID ── */}
      <section style={{ padding: "48px 24px 80px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          {loading ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32 }}>
              {[...Array(6)].map((_, i) => (
                <div key={i} style={{ animation: "pulse 2s infinite" }}>
                  <div style={{ aspectRatio: "4/3", background: "#E8E5DE", borderRadius: 12, marginBottom: 16 }} />
                  <div style={{ height: 12, background: "#E8E5DE", borderRadius: 6, width: "40%", marginBottom: 10 }} />
                  <div style={{ height: 16, background: "#E8E5DE", borderRadius: 6, width: "80%", marginBottom: 8 }} />
                  <div style={{ height: 12, background: "#E8E5DE", borderRadius: 6, width: "100%" }} />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 24, color: "#9A9A8A" }}>
                Aucun contenu trouve
              </p>
              <button onClick={() => { setActiveTab("all"); setSearchQuery(""); }} style={{
                marginTop: 16, background: "none", border: "none", color: "#C9A84C", fontWeight: 600, fontSize: 14, cursor: "pointer",
              }}>
                Voir tous les contenus
              </button>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 40 }}>
              {filtered.map((item) => (
                <Link
                  key={item.id}
                  href={`/rubriques/${item.slug}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <article style={{ cursor: "pointer" }}>
                    {/* Image */}
                    <div style={{
                      aspectRatio: "4/3",
                      overflow: "hidden",
                      borderRadius: 12,
                      marginBottom: 16,
                      background: "#E8E5DE",
                    }}>
                      {item.cover_image ? (
                        <img
                          src={item.cover_image}
                          alt={item.title}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            transition: "transform 0.5s ease",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                        />
                      ) : (
                        <div style={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontFamily: "'Cormorant Garamond', Georgia, serif",
                          fontSize: 20,
                          color: "#9A9A8A",
                        }}>
                          AFRIKHER
                        </div>
                      )}
                    </div>

                    {/* Tags */}
                    <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
                      <span style={{
                        padding: "4px 12px",
                        borderRadius: 20,
                        fontSize: 11,
                        fontWeight: 600,
                        fontFamily: "'DM Sans', sans-serif",
                        background: getTagStyle(item.source).bg,
                        color: getTagStyle(item.source).text,
                      }}>
                        {typeLabel(item.source)}
                      </span>
                      {item.type !== "article" && (
                        <span style={{
                          padding: "4px 12px",
                          borderRadius: 20,
                          fontSize: 11,
                          fontWeight: 600,
                          fontFamily: "'DM Sans', sans-serif",
                          background: getTagStyle(item.type).bg,
                          color: getTagStyle(item.type).text,
                        }}>
                          {typeLabel(item.type)}
                        </span>
                      )}
                      {item.category && item.category !== "Blog" && (
                        <span style={{
                          padding: "4px 12px",
                          borderRadius: 20,
                          fontSize: 11,
                          fontWeight: 600,
                          fontFamily: "'DM Sans', sans-serif",
                          background: "#F3F4F6",
                          color: "#6B7280",
                        }}>
                          {item.category}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 18,
                      fontWeight: 700,
                      color: "#1A1A1A",
                      lineHeight: 1.35,
                      margin: "0 0 8px",
                    }}>
                      {item.title}
                    </h3>

                    {/* Excerpt */}
                    <p style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 14,
                      color: "#6B7280",
                      lineHeight: 1.6,
                      margin: "0 0 12px",
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}>
                      {item.excerpt}
                    </p>

                    {/* Meta */}
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 12,
                      color: "#9CA3AF",
                    }}>
                      <span>{typeLabel(item.type)}</span>
                      <span style={{ color: "#D1D5DB" }}>&#8226;</span>
                      <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <Clock size={12} />
                        {readTime(item.excerpt)} read
                      </span>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        padding: "32px 24px",
        borderTop: "1px solid #E8E5DE",
        textAlign: "center",
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 13,
        color: "#9A9A8A",
        background: "#FAFAF8",
      }}>
        &copy; {new Date().getFullYear()} AFRIKHER. Tous droits reserves.
      </footer>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </main>
  );
}
