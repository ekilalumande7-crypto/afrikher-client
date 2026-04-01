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

/**
 * Process article HTML content to ensure proper paragraph spacing.
 * Old content saved from plain textarea often has one giant <p> block.
 * This function splits it into proper paragraphs.
 */
function processContent(html: string): string {
  if (!html || html.trim().length === 0) return "";

  // If content already has multiple <p> tags with content, it's from Tiptap — leave it alone
  const pTagCount = (html.match(/<p[\s>]/g) || []).length;
  if (pTagCount > 3) return html;

  // Strip existing <p> wrapper if it's just one big block
  let text = html;
  // If content is wrapped in a single <p>...</p>, extract it
  const singlePMatch = text.match(/^<p>([\s\S]*)<\/p>$/i);
  if (singlePMatch && pTagCount <= 2) {
    text = singlePMatch[1];
  }

  // Convert explicit \n to line breaks
  if (text.includes("\n")) {
    // Split by double newlines first (paragraph breaks)
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim());
    if (paragraphs.length > 1) {
      return paragraphs.map(p => `<p>${p.replace(/\n/g, "<br>")}</p>`).join("");
    }
    // Single newlines → at least add <br>
    text = text.replace(/\n/g, "<br>");
  }

  // If it's a long text block without breaks, try to split at sentence boundaries
  // Look for patterns like ". Uppercase" which indicate new sentences/paragraphs
  const stripped = text.replace(/<[^>]*>/g, "");
  if (stripped.length > 600 && !text.includes("<br>") && pTagCount <= 1) {
    // Split roughly every 2-4 sentences for readability
    const sentences = text.split(/(?<=\.)\s+(?=[A-ZÀ-ÿ«"])/g);
    if (sentences.length > 3) {
      const groups: string[] = [];
      let current = "";
      let count = 0;
      for (const s of sentences) {
        current += (current ? " " : "") + s;
        count++;
        // Create a new paragraph every 2-3 sentences
        if (count >= 3 || current.length > 400) {
          groups.push(current);
          current = "";
          count = 0;
        }
      }
      if (current.trim()) groups.push(current);
      if (groups.length > 1) {
        return groups.map(g => `<p>${g.trim()}</p>`).join("");
      }
    }
  }

  // Wrap in <p> if not already
  if (!text.startsWith("<p")) {
    text = `<p>${text}</p>`;
  }

  return text;
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
          maxWidth: 780, margin: "0 auto", padding: "32px 24px 0",
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
      <div style={{ maxWidth: 780, margin: "0 auto", padding: "0 24px" }}>
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

        {/* Excerpt + Content logic:
            - If content exists → show excerpt as intro + content as body
            - If content is empty but excerpt is long → treat excerpt as the full article body
            - If content is empty and excerpt is short → just show excerpt as intro
        */}
        {(() => {
          const contentText = (article.content || "").trim();
          const excerptText = article.excerpt || "";
          const contentLen = contentText.replace(/<[^>]*>/g, "").length;
          const isExcerptLong = excerptText.length > 500;
          // Content is "real" only if it exists AND is longer than a short stub
          // If excerpt is much longer than content, excerpt IS the article body
          const hasContent = contentLen > 100 && contentLen > excerptText.length * 0.3;

          // Process excerpt: convert \n to <br> for HTML rendering
          const processExcerpt = (text: string) => {
            if (!text) return "";
            // Convert double newlines to paragraph breaks, single \n to <br>
            let html = text
              .replace(/\n\s*\n/g, '</p><p>')
              .replace(/\n/g, '<br>');
            // Wrap in <p> tags if we created paragraph breaks
            if (html.includes('</p><p>')) {
              html = '<p>' + html + '</p>';
            }
            return html;
          };

          return (
            <>
              {/* Show excerpt as styled intro ONLY if we also have content, or excerpt is short */}
              {excerptText && (hasContent || !isExcerptLong) && (
                <div
                  dangerouslySetInnerHTML={{ __html: processExcerpt(excerptText) }}
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 18,
                    fontStyle: "italic",
                    color: "#6B7280",
                    lineHeight: 1.8,
                    marginBottom: 40,
                    paddingBottom: 32,
                    borderBottom: "1px solid #E8E5DE",
                  }}
                />
              )}

              {/* Main article body */}
              <div
                className="article-body"
                dangerouslySetInnerHTML={{
                  __html: hasContent
                    ? processContent(contentText)
                    : isExcerptLong
                      ? processContent(excerptText)
                      : ""
                }}
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 18,
                  lineHeight: 1.9,
                  color: "#374151",
                  letterSpacing: "0.01em",
                }}
              />
            </>
          );
        })()}

        <style>{`
          .article-body p {
            margin-bottom: 1.6em;
            line-height: 1.9;
          }
          .article-body > p:first-child::first-letter {
            font-family: 'Cormorant Garamond', Georgia, serif;
            font-size: 3.5em;
            float: left;
            line-height: 0.8;
            margin: 0.05em 0.12em 0 0;
            color: #C9A84C;
            font-weight: 600;
          }
          .article-body p:empty,
          .article-body p > br:only-child {
            margin-bottom: 0.75em;
            min-height: 1em;
          }
          .article-body h1 {
            font-family: 'Cormorant Garamond', Georgia, serif;
            font-size: 36px;
            font-weight: 700;
            color: #0A0A0A;
            margin: 56px 0 20px;
            line-height: 1.2;
          }
          .article-body h2 {
            font-family: 'Cormorant Garamond', Georgia, serif;
            font-size: 30px;
            font-weight: 600;
            color: #1A1A1A;
            margin: 48px 0 16px;
            line-height: 1.3;
          }
          .article-body h3 {
            font-family: 'Cormorant Garamond', Georgia, serif;
            font-size: 24px;
            font-weight: 600;
            color: #1A1A1A;
            margin: 36px 0 12px;
            line-height: 1.3;
          }
          .article-body blockquote {
            border-left: 4px solid #C9A84C;
            padding: 20px 28px;
            margin: 36px 0;
            font-style: italic;
            color: #6B7280;
            background: #FDF9EF;
            border-radius: 0 12px 12px 0;
            font-size: 1.05em;
          }
          .article-body blockquote p {
            margin-bottom: 0.5em;
          }
          .article-body blockquote p:last-child {
            margin-bottom: 0;
          }
          .article-body img {
            max-width: 100%;
            height: auto;
            border-radius: 12px;
            margin: 36px auto;
            display: block;
          }
          .article-body a {
            color: #C9A84C;
            text-decoration: underline;
            transition: color 0.2s;
          }
          .article-body a:hover {
            color: #B8942F;
          }
          .article-body ul, .article-body ol {
            padding-left: 28px;
            margin-bottom: 24px;
          }
          .article-body li {
            margin-bottom: 10px;
            line-height: 1.7;
          }
          .article-body strong {
            color: #1A1A1A;
            font-weight: 600;
          }
          .article-body em {
            font-style: italic;
          }
          .article-body u {
            text-decoration: underline;
          }
          .article-body code {
            background: #F5F0E8;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 0.9em;
            font-family: 'DM Mono', monospace;
          }
          .article-body pre {
            background: #1A1A1A;
            color: #E8E5DE;
            padding: 24px;
            border-radius: 12px;
            margin: 32px 0;
            overflow-x: auto;
            font-size: 14px;
            line-height: 1.6;
          }
          .article-body pre code {
            background: none;
            padding: 0;
            color: inherit;
          }
          .article-body hr {
            border: none;
            border-top: 2px solid #E8E5DE;
            margin: 40px 0;
          }
          .article-body figure {
            margin: 36px 0;
            text-align: center;
          }
          .article-body figcaption {
            font-size: 14px;
            color: #9A9A8A;
            margin-top: 12px;
            font-style: italic;
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
