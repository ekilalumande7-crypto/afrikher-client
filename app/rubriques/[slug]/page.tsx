"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import { ArrowLeft, Clock, User, Share2, ChevronRight } from "lucide-react";

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string | null;
  category_id: string | null;
  category_name?: string;
  type: string;
  status: string;
  featured: boolean;
  published_at: string | null;
  created_at: string;
  source: "editorial" | "blog";
}

interface RelatedArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  cover_image: string | null;
  type: string;
  published_at: string | null;
}

function formatDate(d: string | null): string {
  if (!d) return "";
  return new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

function readTime(content: string): number {
  return Math.max(1, Math.ceil(content.replace(/<[^>]*>/g, "").split(/\s+/).length / 200));
}

function typeLabel(t: string): string {
  const m: Record<string, string> = { article: "Article", interview: "Interview", portrait: "Portrait", dossier: "Dossier" };
  return m[t] || "Article";
}

const TAG_COLORS: Record<string, { bg: string; text: string }> = {
  editorial: { bg: "#EDE9FE", text: "#7C3AED" },
  blog: { bg: "#DBEAFE", text: "#2563EB" },
  interview: { bg: "#D1FAE5", text: "#059669" },
  portrait: { bg: "#FEF3C7", text: "#D97706" },
  dossier: { bg: "#FCE7F3", text: "#DB2777" },
  article: { bg: "#E0E7FF", text: "#4F46E5" },
};

export default function ArticleDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [article, setArticle] = useState<Article | null>(null);
  const [related, setRelated] = useState<RelatedArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    fetchArticle();
  }, [slug]);

  async function fetchArticle() {
    setLoading(true);
    try {
      const { createClient } = await import("@supabase/supabase-js");
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || "https://xykvzzitgmnipscxbhcf.supabase.co",
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5a3Z6eml0Z21uaXBzY3hiaGNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMzNjc1ODAsImV4cCI6MjA1ODk0MzU4MH0.yqOgQhnMKOaAoLkVDwH99jEMVilrp42ckFWPhNGk-Ys"
      );

      let { data: art } = await supabase
        .from("articles")
        .select("*, categories(name)")
        .eq("slug", slug)
        .eq("status", "published")
        .single();

      let source: "editorial" | "blog" = "editorial";

      if (!art) {
        const { data: blog } = await supabase
          .from("blog_posts")
          .select("*")
          .eq("slug", slug)
          .eq("status", "published")
          .single();
        if (blog) {
          art = { ...blog, type: "article", category_id: null, featured: false };
          source = "blog";
        }
      }

      if (!art) { setNotFound(true); setLoading(false); return; }

      setArticle({ ...art, category_name: art.categories?.name || null, source });

      const { data: relatedData } = await supabase
        .from("articles")
        .select("id, title, slug, excerpt, cover_image, type, published_at")
        .eq("status", "published")
        .neq("slug", slug)
        .order("published_at", { ascending: false })
        .limit(3);

      if (relatedData) setRelated(relatedData);
    } catch {
      setNotFound(true);
    }
    setLoading(false);
  }

  // ── LOADING ──
  if (loading) {
    return (
      <div style={{ background: "#FAFAF8", minHeight: "100vh" }}>
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 80, background: "#0A0A0A", zIndex: 90 }} />
        <Navbar />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}>
          <div style={{
            width: 36, height: 36,
            border: "3px solid #E8E5DE", borderTop: "3px solid #C9A84C",
            borderRadius: "50%", animation: "spin 1s linear infinite",
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  // ── NOT FOUND ──
  if (notFound || !article) {
    return (
      <div style={{ background: "#FAFAF8", minHeight: "100vh" }}>
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 80, background: "#0A0A0A", zIndex: 90 }} />
        <Navbar />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "60vh", padding: "0 24px" }}>
          <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 42, fontWeight: 600, color: "#1A1A1A", marginBottom: 12 }}>
            Article introuvable
          </h1>
          <p style={{ color: "#9A9A8A", fontSize: 16, marginBottom: 32, fontFamily: "'DM Sans', sans-serif" }}>
            Cet article n&apos;existe pas ou a ete retire.
          </p>
          <Link href="/blog" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "12px 28px", border: "1px solid #1A1A1A", borderRadius: 8,
            color: "#1A1A1A", textDecoration: "none",
            fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600,
          }}>
            <ArrowLeft size={16} /> Retour au blog
          </Link>
        </div>
      </div>
    );
  }

  const mins = readTime(article.content || "");
  const tagStyle = TAG_COLORS[article.source] || TAG_COLORS.article;
  const typeTagStyle = TAG_COLORS[article.type] || TAG_COLORS.article;

  return (
    <div style={{ background: "#FAFAF8", minHeight: "100vh" }}>
      {/* Navbar dark band */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 80, background: "#0A0A0A", zIndex: 90 }} />
      <Navbar />

      {/* ── COVER IMAGE ── */}
      <div style={{ paddingTop: 80 }}>
        <div style={{
          maxWidth: 1000, margin: "0 auto", padding: "32px 24px 0",
        }}>
          {/* Back link */}
          <Link href="/blog" style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            color: "#6B7280", textDecoration: "none",
            fontFamily: "'DM Sans', sans-serif", fontSize: 14,
            marginBottom: 24,
          }}>
            <ArrowLeft size={16} /> Retour au blog
          </Link>

          {/* Cover image */}
          {article.cover_image && (
            <div style={{
              width: "100%",
              aspectRatio: "16/8",
              overflow: "hidden",
              borderRadius: 16,
              marginBottom: 40,
              background: "#E8E5DE",
            }}>
              <img
                src={article.cover_image}
                alt={article.title}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          )}
        </div>
      </div>

      {/* ── ARTICLE HEADER ── */}
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 24px" }}>
        {/* Tags */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
          <span style={{
            padding: "5px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600,
            fontFamily: "'DM Sans', sans-serif",
            background: tagStyle.bg, color: tagStyle.text,
          }}>
            {article.source === "blog" ? "Blog" : "Editorial"}
          </span>
          {article.type !== "article" && (
            <span style={{
              padding: "5px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600,
              fontFamily: "'DM Sans', sans-serif",
              background: typeTagStyle.bg, color: typeTagStyle.text,
            }}>
              {typeLabel(article.type)}
            </span>
          )}
          {article.category_name && (
            <span style={{
              padding: "5px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600,
              fontFamily: "'DM Sans', sans-serif",
              background: "#F3F4F6", color: "#6B7280",
            }}>
              {article.category_name}
            </span>
          )}
        </div>

        {/* Title */}
        <h1 style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: "clamp(32px, 5vw, 48px)",
          fontWeight: 600,
          color: "#1A1A1A",
          lineHeight: 1.15,
          margin: "0 0 20px",
        }}>
          {article.title}
        </h1>

        {/* Meta row */}
        <div style={{
          display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap",
          paddingBottom: 32, marginBottom: 32,
          borderBottom: "1px solid #E8E5DE",
          fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#9A9A8A",
        }}>
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <User size={15} /> AFRIKHER
          </span>
          {article.published_at && (
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Clock size={15} /> {formatDate(article.published_at)}
            </span>
          )}
          <span>{mins} min de lecture</span>
        </div>

        {/* Excerpt */}
        {article.excerpt && (
          <p style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 22,
            fontStyle: "italic",
            color: "#4B5563",
            lineHeight: 1.6,
            marginBottom: 40,
          }}>
            {article.excerpt}
          </p>
        )}

        {/* ── CONTENT ── */}
        <div
          className="article-body"
          dangerouslySetInnerHTML={{ __html: article.content || "" }}
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 17,
            lineHeight: 1.85,
            color: "#374151",
          }}
        />

        <style>{`
          .article-body p {
            margin-bottom: 24px;
          }
          .article-body h2 {
            font-family: 'Cormorant Garamond', Georgia, serif;
            font-size: 30px;
            font-weight: 600;
            color: #1A1A1A;
            margin: 48px 0 16px;
          }
          .article-body h3 {
            font-family: 'Cormorant Garamond', Georgia, serif;
            font-size: 24px;
            font-weight: 600;
            color: #1A1A1A;
            margin: 36px 0 12px;
          }
          .article-body blockquote {
            border-left: 3px solid #C9A84C;
            padding: 16px 24px;
            margin: 32px 0;
            font-style: italic;
            color: #6B7280;
            background: #FDF9EF;
            border-radius: 0 8px 8px 0;
          }
          .article-body img {
            width: 100%;
            height: auto;
            border-radius: 12px;
            margin: 32px 0;
          }
          .article-body a {
            color: #C9A84C;
            text-decoration: underline;
          }
          .article-body ul, .article-body ol {
            padding-left: 24px;
            margin-bottom: 24px;
          }
          .article-body li {
            margin-bottom: 8px;
          }
          .article-body strong {
            color: #1A1A1A;
            font-weight: 600;
          }
        `}</style>

        {/* ── SHARE BAR ── */}
        <div style={{
          marginTop: 48, paddingTop: 24,
          borderTop: "1px solid #E8E5DE",
          display: "flex", justifyContent: "flex-end",
        }}>
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: article.title, url: window.location.href });
              } else {
                navigator.clipboard.writeText(window.location.href);
                alert("Lien copie !");
              }
            }}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "10px 24px", background: "#1A1A1A",
              color: "#fff", border: "none", borderRadius: 8,
              cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
              fontSize: 13, fontWeight: 600,
            }}
          >
            <Share2 size={14} /> Partager
          </button>
        </div>
      </div>

      {/* ── RELATED ARTICLES ── */}
      {related.length > 0 && (
        <section style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 24px" }}>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 32, fontWeight: 600, color: "#1A1A1A",
            marginBottom: 40,
          }}>
            Articles similaires
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 32 }}>
            {related.map((r) => (
              <Link key={r.id} href={`/rubriques/${r.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                <div style={{ cursor: "pointer" }}>
                  <div style={{
                    aspectRatio: "4/3", overflow: "hidden", borderRadius: 12,
                    marginBottom: 16, background: "#E8E5DE",
                  }}>
                    {r.cover_image ? (
                      <img src={r.cover_image} alt={r.title} style={{
                        width: "100%", height: "100%", objectFit: "cover",
                        transition: "transform 0.5s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                      />
                    ) : (
                      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#9A9A8A" }}>
                        AFRIKHER
                      </div>
                    )}
                  </div>

                  <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                    {r.type !== "article" && (
                      <span style={{
                        padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600,
                        fontFamily: "'DM Sans', sans-serif",
                        background: (TAG_COLORS[r.type] || TAG_COLORS.article).bg,
                        color: (TAG_COLORS[r.type] || TAG_COLORS.article).text,
                      }}>
                        {typeLabel(r.type)}
                      </span>
                    )}
                  </div>

                  <h3 style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 17, fontWeight: 700, color: "#1A1A1A",
                    lineHeight: 1.35, margin: "0 0 8px",
                  }}>
                    {r.title}
                  </h3>

                  {r.excerpt && (
                    <p style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 14, color: "#6B7280", lineHeight: 1.6,
                      margin: 0,
                      display: "-webkit-box", WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical", overflow: "hidden",
                    }}>
                      {r.excerpt}
                    </p>
                  )}

                  <div style={{
                    display: "flex", alignItems: "center", gap: 4,
                    marginTop: 14, color: "#C9A84C",
                    fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600,
                  }}>
                    Lire la suite <ChevronRight size={14} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── FOOTER ── */}
      <footer style={{
        padding: "32px 24px", borderTop: "1px solid #E8E5DE",
        textAlign: "center", fontFamily: "'DM Sans', sans-serif",
        fontSize: 13, color: "#9A9A8A", background: "#FAFAF8",
      }}>
        &copy; {new Date().getFullYear()} AFRIKHER. Tous droits reserves.
      </footer>
    </div>
  );
}
