"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import { ArrowLeft, Clock, User, Tag, Share2, ChevronRight } from "lucide-react";

// ══════════════════════════════════════════════
// TYPES
// ══════════════════════════════════════════════

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
  author_name?: string;
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
  source: "editorial" | "blog";
}

// ══════════════════════════════════════════════
// HELPERS
// ══════════════════════════════════════════════

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function readTime(content: string): number {
  const words = content.replace(/<[^>]*>/g, "").split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

function typeLabel(type: string): string {
  const labels: Record<string, string> = {
    article: "Article",
    interview: "Interview",
    portrait: "Portrait",
    dossier: "Dossier",
  };
  return labels[type] || "Article";
}

// ══════════════════════════════════════════════
// COMPONENT
// ══════════════════════════════════════════════

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

      // Try articles table first
      let { data: art } = await supabase
        .from("articles")
        .select("*, categories(name)")
        .eq("slug", slug)
        .eq("status", "published")
        .single();

      let source: "editorial" | "blog" = "editorial";

      // If not found, try blog_posts table
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

      if (!art) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      const categoryName = art.categories?.name || null;

      setArticle({
        ...art,
        category_name: categoryName,
        source,
      });

      // Fetch related articles (same category or recent)
      const { data: relatedData } = await supabase
        .from("articles")
        .select("id, title, slug, excerpt, cover_image, type, published_at")
        .eq("status", "published")
        .neq("slug", slug)
        .order("published_at", { ascending: false })
        .limit(3);

      if (relatedData) {
        setRelated(
          relatedData.map((r: any) => ({ ...r, source: "editorial" as const }))
        );
      }
    } catch (err) {
      console.error("Error fetching article:", err);
      setNotFound(true);
    }
    setLoading(false);
  }

  // ── LOADING STATE ──
  if (loading) {
    return (
      <div style={{ background: "#0A0A0A", minHeight: "100vh" }}>
        <Navbar />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "60vh",
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              border: "3px solid #2A2A2A",
              borderTop: "3px solid #C9A84C",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
            }}
          />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  // ── NOT FOUND ──
  if (notFound || !article) {
    return (
      <div style={{ background: "#0A0A0A", minHeight: "100vh" }}>
        <Navbar />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "60vh",
            color: "#F5F0E8",
            textAlign: "center",
            padding: "0 24px",
          }}
        >
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 48,
              fontWeight: 600,
              color: "#C9A84C",
              marginBottom: 16,
            }}
          >
            Article introuvable
          </h1>
          <p style={{ color: "#9A9A8A", fontSize: 18, marginBottom: 32 }}>
            Cet article n&apos;existe pas ou a ete retire.
          </p>
          <Link
            href="/blog"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "12px 32px",
              border: "1px solid #C9A84C",
              color: "#C9A84C",
              textDecoration: "none",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 14,
              letterSpacing: "0.05em",
              transition: "all 0.3s",
            }}
          >
            <ArrowLeft size={16} />
            RETOUR AU BLOG
          </Link>
        </div>
      </div>
    );
  }

  const reading = readTime(article.content || "");

  return (
    <div style={{ background: "#0A0A0A", minHeight: "100vh" }}>
      <Navbar />

      {/* ── HERO IMAGE ── */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "60vh",
          minHeight: 400,
          maxHeight: 600,
          overflow: "hidden",
        }}
      >
        {article.cover_image ? (
          <img
            src={article.cover_image}
            alt={article.title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              background: "linear-gradient(135deg, #2A2A2A 0%, #0A0A0A 100%)",
            }}
          />
        )}
        {/* Gradient overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, #0A0A0A 0%, rgba(10,10,10,0.4) 50%, rgba(10,10,10,0.2) 100%)",
          }}
        />

        {/* Back button */}
        <Link
          href="/blog"
          style={{
            position: "absolute",
            top: 100,
            left: 40,
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 20px",
            background: "rgba(10,10,10,0.6)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(201,168,76,0.3)",
            color: "#F5F0E8",
            textDecoration: "none",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 13,
            letterSpacing: "0.05em",
            transition: "all 0.3s",
            zIndex: 10,
          }}
        >
          <ArrowLeft size={14} />
          RETOUR
        </Link>

        {/* Title overlay */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "60px 40px 40px",
            zIndex: 5,
          }}
        >
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            {/* Badges */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 20,
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  padding: "4px 14px",
                  background: "#C9A84C",
                  color: "#0A0A0A",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                {article.source === "blog" ? "Blog" : typeLabel(article.type)}
              </span>
              {article.category_name && (
                <span
                  style={{
                    padding: "4px 14px",
                    border: "1px solid rgba(201,168,76,0.4)",
                    color: "#C9A84C",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 11,
                    fontWeight: 500,
                    letterSpacing: "0.05em",
                  }}
                >
                  {article.category_name}
                </span>
              )}
            </div>

            {/* Title */}
            <h1
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "clamp(28px, 5vw, 52px)",
                fontWeight: 600,
                color: "#F5F0E8",
                lineHeight: 1.15,
                margin: 0,
              }}
            >
              {article.title}
            </h1>

            {/* Meta */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 24,
                marginTop: 20,
                color: "#9A9A8A",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 14,
                flexWrap: "wrap",
              }}
            >
              {article.published_at && (
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Clock size={14} />
                  {formatDate(article.published_at)}
                </span>
              )}
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <User size={14} />
                AFRIKHER
              </span>
              <span>{reading} min de lecture</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── ARTICLE CONTENT ── */}
      <article
        style={{
          maxWidth: 780,
          margin: "0 auto",
          padding: "60px 24px 80px",
        }}
      >
        {/* Excerpt / Lead */}
        {article.excerpt && (
          <p
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 22,
              fontStyle: "italic",
              color: "#C9A84C",
              lineHeight: 1.6,
              marginBottom: 40,
              paddingBottom: 40,
              borderBottom: "1px solid rgba(201,168,76,0.2)",
            }}
          >
            {article.excerpt}
          </p>
        )}

        {/* Content */}
        <div
          className="article-content"
          dangerouslySetInnerHTML={{ __html: article.content || "" }}
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 18,
            lineHeight: 1.8,
            color: "#E0DDD5",
          }}
        />

        {/* Content styles */}
        <style>{`
          .article-content p {
            margin-bottom: 24px;
            color: #E0DDD5;
          }
          .article-content h2 {
            font-family: 'Cormorant Garamond', Georgia, serif;
            font-size: 32px;
            font-weight: 600;
            color: #F5F0E8;
            margin: 48px 0 20px;
          }
          .article-content h3 {
            font-family: 'Cormorant Garamond', Georgia, serif;
            font-size: 24px;
            font-weight: 600;
            color: #F5F0E8;
            margin: 36px 0 16px;
          }
          .article-content blockquote {
            border-left: 3px solid #C9A84C;
            padding: 16px 24px;
            margin: 32px 0;
            font-style: italic;
            color: #C9A84C;
            background: rgba(201,168,76,0.05);
          }
          .article-content img {
            width: 100%;
            height: auto;
            margin: 32px 0;
          }
          .article-content a {
            color: #C9A84C;
            text-decoration: underline;
          }
          .article-content ul, .article-content ol {
            padding-left: 24px;
            margin-bottom: 24px;
          }
          .article-content li {
            margin-bottom: 8px;
            color: #E0DDD5;
          }
          .article-content strong {
            color: #F5F0E8;
            font-weight: 600;
          }
        `}</style>

        {/* Share / Tags section */}
        <div
          style={{
            marginTop: 60,
            paddingTop: 40,
            borderTop: "1px solid rgba(201,168,76,0.15)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Tag size={16} color="#9A9A8A" />
            <span
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13,
                color: "#9A9A8A",
              }}
            >
              {article.source === "blog" ? "Blog" : typeLabel(article.type)}
              {article.category_name ? ` / ${article.category_name}` : ""}
            </span>
          </div>
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: article.title,
                  url: window.location.href,
                });
              } else {
                navigator.clipboard.writeText(window.location.href);
                alert("Lien copie !");
              }
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 20px",
              background: "transparent",
              border: "1px solid rgba(201,168,76,0.3)",
              color: "#C9A84C",
              cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 13,
              letterSpacing: "0.05em",
              transition: "all 0.3s",
            }}
          >
            <Share2 size={14} />
            PARTAGER
          </button>
        </div>
      </article>

      {/* ── RELATED ARTICLES ── */}
      {related.length > 0 && (
        <section
          style={{
            background: "#111",
            padding: "80px 24px",
          }}
        >
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 36,
                fontWeight: 600,
                color: "#F5F0E8",
                textAlign: "center",
                marginBottom: 48,
              }}
            >
              Articles{" "}
              <span style={{ color: "#C9A84C", fontStyle: "italic" }}>
                similaires
              </span>
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: 32,
              }}
            >
              {related.map((r) => (
                <Link
                  key={r.id}
                  href={`/rubriques/${r.slug}`}
                  style={{ textDecoration: "none" }}
                >
                  <div
                    style={{
                      background: "#1A1A1A",
                      overflow: "hidden",
                      transition: "transform 0.3s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "translateY(-4px)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "translateY(0)")
                    }
                  >
                    <div
                      style={{
                        height: 200,
                        overflow: "hidden",
                        position: "relative",
                      }}
                    >
                      {r.cover_image ? (
                        <img
                          src={r.cover_image}
                          alt={r.title}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            transition: "transform 0.5s",
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            background:
                              "linear-gradient(135deg, #2A2A2A, #1A1A1A)",
                          }}
                        />
                      )}
                      <span
                        style={{
                          position: "absolute",
                          top: 12,
                          left: 12,
                          padding: "3px 10px",
                          background: "#C9A84C",
                          color: "#0A0A0A",
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: 10,
                          fontWeight: 700,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                        }}
                      >
                        {typeLabel(r.type)}
                      </span>
                    </div>
                    <div style={{ padding: "20px 24px 24px" }}>
                      <h3
                        style={{
                          fontFamily:
                            "'Cormorant Garamond', Georgia, serif",
                          fontSize: 20,
                          fontWeight: 600,
                          color: "#F5F0E8",
                          lineHeight: 1.3,
                          margin: "0 0 12px",
                        }}
                      >
                        {r.title}
                      </h3>
                      {r.excerpt && (
                        <p
                          style={{
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: 14,
                            color: "#9A9A8A",
                            lineHeight: 1.5,
                            margin: 0,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {r.excerpt}
                        </p>
                      )}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          marginTop: 16,
                          color: "#C9A84C",
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: 13,
                          fontWeight: 500,
                          letterSpacing: "0.05em",
                        }}
                      >
                        LIRE LA SUITE
                        <ChevronRight size={14} />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── NEWSLETTER CTA ── */}
      <section
        style={{
          padding: "80px 24px",
          textAlign: "center",
          background: "#0A0A0A",
        }}
      >
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 32,
              fontWeight: 600,
              color: "#F5F0E8",
              marginBottom: 16,
            }}
          >
            Ne manquez aucun article
          </h2>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 16,
              color: "#9A9A8A",
              marginBottom: 32,
            }}
          >
            Inscrivez-vous a notre newsletter pour recevoir nos derniers contenus.
          </p>
          <Link
            href="/blog"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "14px 36px",
              background: "#C9A84C",
              color: "#0A0A0A",
              textDecoration: "none",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 14,
              fontWeight: 600,
              letterSpacing: "0.05em",
              transition: "all 0.3s",
            }}
          >
            DECOUVRIR TOUS LES ARTICLES
            <ChevronRight size={16} />
          </Link>
        </div>
      </section>

      {/* ── MINIMAL FOOTER ── */}
      <footer
        style={{
          padding: "24px 40px",
          borderTop: "1px solid rgba(201,168,76,0.1)",
          textAlign: "center",
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 13,
          color: "#9A9A8A",
        }}
      >
        &copy; {new Date().getFullYear()} AFRIKHER. Tous droits reserves.
      </footer>
    </div>
  );
}
