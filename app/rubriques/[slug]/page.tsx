"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import { ArrowLeft, Share2, ChevronRight, Search, Menu } from "lucide-react";

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

interface TocItem {
  id: string;
  text: string;
  level: number;
}

function formatDate(d: string | null): string {
  if (!d) return "";
  return new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" }).replace(/\//g, ".");
}

function readTime(content: string): number {
  return Math.max(1, Math.ceil(content.replace(/<[^>]*>/g, "").split(/\s+/).length / 200));
}

function typeLabel(t: string): string {
  const m: Record<string, string> = { article: "Article", interview: "Interview", portrait: "Portrait", dossier: "Dossier" };
  return m[t] || "Article";
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Process article HTML content to ensure proper paragraph spacing,
 * and inject IDs on H1/H2/H3 for the sidebar TOC.
 */
function processContent(html: string): { html: string; toc: TocItem[] } {
  if (!html || html.trim().length === 0) return { html: "", toc: [] };

  let text = html;

  // If it doesn't have enough <p> tags, rebuild paragraphs
  const pTagCount = (text.match(/<p[\s>]/g) || []).length;
  if (pTagCount <= 3) {
    const singlePMatch = text.match(/^<p>([\s\S]*)<\/p>$/i);
    if (singlePMatch && pTagCount <= 2) text = singlePMatch[1];

    if (text.includes("\n")) {
      const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim());
      if (paragraphs.length > 1) {
        text = paragraphs.map(p => `<p>${p.replace(/\n/g, "<br>")}</p>`).join("");
      } else {
        text = text.replace(/\n/g, "<br>");
      }
    }

    const stripped = text.replace(/<[^>]*>/g, "");
    if (stripped.length > 600 && !text.includes("<br>") && pTagCount <= 1) {
      const sentences = text.split(/(?<=\.)\s+(?=[A-ZÀ-ÿ«"])/g);
      if (sentences.length > 3) {
        const groups: string[] = [];
        let current = "";
        let count = 0;
        for (const s of sentences) {
          current += (current ? " " : "") + s;
          count++;
          if (count >= 3 || current.length > 400) {
            groups.push(current);
            current = "";
            count = 0;
          }
        }
        if (current.trim()) groups.push(current);
        if (groups.length > 1) {
          text = groups.map(g => `<p>${g.trim()}</p>`).join("");
        }
      }
    }

    if (!text.startsWith("<p") && !text.startsWith("<h")) text = `<p>${text}</p>`;
  }

  // Extract headings for TOC and inject IDs
  const toc: TocItem[] = [];
  const usedIds = new Set<string>();

  text = text.replace(
    /<(h[1-3])([^>]*)>([\s\S]*?)<\/\1>/gi,
    (_match, tag, attrs, inner) => {
      const plainText = inner.replace(/<[^>]*>/g, "").trim();
      if (!plainText) return _match;

      let id = slugify(plainText);
      if (!id) id = `section-${toc.length + 1}`;
      let finalId = id;
      let counter = 2;
      while (usedIds.has(finalId)) {
        finalId = `${id}-${counter}`;
        counter++;
      }
      usedIds.add(finalId);

      const level = parseInt(tag.substring(1), 10);
      toc.push({ id: finalId, text: plainText, level });

      // Strip any existing id from attrs and inject ours
      const cleanAttrs = attrs.replace(/\s*id="[^"]*"/gi, "");
      return `<${tag}${cleanAttrs} id="${finalId}">${inner}</${tag}>`;
    }
  );

  return { html: text, toc };
}

export default function ArticleDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [article, setArticle] = useState<Article | null>(null);
  const [related, setRelated] = useState<RelatedArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeToc, setActiveToc] = useState<string>("");
  const [processed, setProcessed] = useState<{ html: string; toc: TocItem[] }>({ html: "", toc: [] });
  const articleRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!slug) return;
    fetchArticle();
  }, [slug]);

  // Scroll spy for TOC
  useEffect(() => {
    if (processed.toc.length === 0) return;
    const handleScroll = () => {
      const offsets = processed.toc.map(t => {
        const el = document.getElementById(t.id);
        if (!el) return { id: t.id, top: Infinity };
        return { id: t.id, top: el.getBoundingClientRect().top };
      });
      const active = offsets.filter(o => o.top < 160).pop() || offsets[0];
      setActiveToc(active.id);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [processed.toc]);

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

      const artData = { ...art, category_name: art.categories?.name || null, source };
      setArticle(artData);

      // Process content with TOC extraction
      const contentText = (art.content || "").trim();
      const excerptText = art.excerpt || "";
      const contentLen = contentText.replace(/<[^>]*>/g, "").length;
      const isExcerptLong = excerptText.length > 500;
      const hasContent = contentLen > 100 && contentLen > excerptText.length * 0.3;
      const bodyHtml = hasContent ? contentText : isExcerptLong ? excerptText : "";
      setProcessed(processContent(bodyHtml));

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
            Cet article n&apos;existe pas ou a été retiré.
          </p>
          <Link href="/rubriques" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "12px 28px", border: "1px solid #1A1A1A", borderRadius: 8,
            color: "#1A1A1A", textDecoration: "none",
            fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600,
          }}>
            <ArrowLeft size={16} /> Retour aux rubriques
          </Link>
        </div>
      </div>
    );
  }

  const mins = readTime(article.content || article.excerpt || "");
  const categoryLabel = article.category_name || typeLabel(article.type);
  const contentText = (article.content || "").trim();
  const excerptText = article.excerpt || "";
  const contentLen = contentText.replace(/<[^>]*>/g, "").length;
  const isExcerptLong = excerptText.length > 500;
  const hasContent = contentLen > 100 && contentLen > excerptText.length * 0.3;
  const showExcerptAsIntro = excerptText && (hasContent || !isExcerptLong);

  // Excerpt formatting for intro
  const formatExcerpt = (text: string) => {
    if (!text) return "";
    let html = text.replace(/\n\s*\n/g, "</p><p>").replace(/\n/g, "<br>");
    if (html.in#ludes("</p><p>")) html = "<p>" + html + "</p>";
    return html;
  };

  return (
    <div style={{ background: "#FAFAF8", minHeight: "100vh" }}>
      {/* Navbar dark band */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 80, background: "#0A0A0A", zIndex: 90 }} />
      <Navbar />

      {/* ── HERO: COVER IMAGE FULL-WIDTH ── */}
      <div style={{ paddingTop: 80 }}>
        {article.cover_image && (
          <div style={{
            width: "100%",
            maxWidth: 1200,
            margin: "24px auto 0",
            padding: "0 24px",
          }}>
            <div style={{
              width: "100%",
              aspectRatio: "16/8",
              overflow: "hidden",
              borderRadius: 4,
              background: "#E8E5DE",
            }}>
              <img
                src={article.cover_image}
                alt={article.title}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          </div>
        )}
      </div>

      {/* ── META ROW + TITLE ── */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px 0" }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap",
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 11, fontWeight: 600,
          textTransform: "uppercase", letterSpacing: "0.12em",
          color: "#9A9A8A",
          marginBottom: 20,
        }}>
          <span style={{ color: "#C9A84C" }}>{categoryLabel}</span>
          <span style={{ width: 3, height: 3, borderRadius: "50%", background: "#D1D1C4" }} />
          <span>{mins} min de lecture</span>
          {article.published_at && (
            <>
              <span style={{ width: 3, height: 3, borderRadius: "50%", background: "#D1D1C4" }} />
              <span>{formatDate(article.published_at)}</span>
            </>
          )}
          <div style={{ marginLeft: "auto", display: "flex", gap: 10 }}>
            <button
              onClick={() => {
                if (navigator.share) navigator.share({ title: article.title, url: window.location.href });
                else { navigator.clipboard.writeText(window.location.href); alert("Lien copié !"); }
              }}
              aria-label="Partager"
              style={{
                width: 28, height: 28, borderRadius: "50%",
                border: "1px solid #E8E5DE", background: "#fff",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", color: "#6B7280",
              }}
            >
              <Share2 size={13} />
            </button>
          </div>
        </div>

        <h1 style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: "clamp(36px, 5.5vw, 64px)",
          fontWeight: 600,
          color: "#0A0A0A",
          lineHeight: 1.08,
          letterSpacing: "-0.01em",
          margin: "0 0 48px",
          maxWidth: 900,
        }}>
          {article.title}
        </h1>
      </div>

      {/* ── FULL-WIDTH CONTENT (aligned with hero image) ── */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px 80px" }}>
        <article ref={articleRef} style={{ width: "100%" }}>
          {/* Italic intro (excerpt) */}
          {showExcerptAsIntro && (
            <div
              dangerouslySetInnerHTML={{ __html: formatExcerpt(excerptText) }}
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 26,
                fontStyle: "italic",
                color: "#1A1A1A",
                lineHeight: 1.5,
                marginBottom: 48,
                letterSpacing: "0.005em",
              }}
            />
          )}

          {/* Main body */}
          <div
            className="article-body"
            dangerouslySetInnerHTML={{ __html: processed.html }}
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 21,
              lineHeight: 1.65,
              color: "#1A1A1A",
            }}
          />
        </article>
      </div>

      {/* Responsive + content styles */}
      <style>{`
        @media (max-width: 768px) {
          .article-body { font-size: 18px !important; }
          .article-body p { font-size: 18px !important; }
          .article-body li { font-size: 18px !important; }
          .article-body h1, .article-body h2 { font-size: 30px !important; }
          .article-body h3 { font-size: 24px !important; }
        }
        .article-body p {
          margin: 0 0 1.2em;
          line-height: 1.65;
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 21px;
          color: #1A1A1A;
        }
        .article-body h1,
        .article-body h2 {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 38px;
          font-weight: 600;
          color: #0A0A0A;
          margin: 64px 0 20px;
          line-height: 1.2;
          padding-bottom: 10px;
          border-bottom: 1px solid #E8E5DE;
          scroll-margin-top: 100px;
        }
        .article-body h3 {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 30px;
          font-weight: 600;
          color: #1A1A1A;
          margin: 44px 0 14px;
          line-height: 1.3;
          scroll-margin-top: 100px;
        }
        .article-body blockquote {
          border-left: 3px solid #C9A84C;
          padding: 8px 0 8px 24px;
          margin: 32px 0;
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-style: italic;
          font-size: 26px;
          color: #1A1A1A;
          line-height: 1.5;
        }
        .article-body blockquote p {
          font-size: 26px;
          font-style: italic;
        }
        .article-body blockquote p { margin: 0 0 0.4em; }
        .article-body blockquote p:last-child { margin-bottom: 0; }
        .article-body img {
          max-width: 100%;
          height: auto;
          border-radius: 4px;
          margin: 40px auto;
          display: block;
        }
        .article-body figure { margin: 40px 0; }
        .article-body figcaption {
          font-size: 13px;
          color: #9A9A8A;
          margin-top: 12px;
          font-style: italic;
          text-align: center;
        }
        .article-body a {
          color: #C9A84C;
          text-decoration: underline;
          text-decoration-thickness: 1px;
          text-underline-offset: 3px;
          transition: color 0.2s;
        }
        .article-body a:hover { color: #B8942F; }
        .article-body ul, .article-body ol { padding-left: 24px; margin: 0 0 1.5em; }
        .article-body li {
          margin-bottom: 10px;
          line-height: 1.65;
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 21px;
          color: #1A1A1A;
        }
        .article-body strong { color: #0A0A0A; font-weight: 600; }
        .article-body em { font-style: italic; }
        .article-body code {
          background: #F5F0E8;
          padding: 2px 6px;
          border-radius: 3px;
          font-size: 0.9em;
          font-family: 'DM Mono', monospace;
        }
        .article-body hr {
          border: none;
          border-top: 1px solid #E8E5DE;
          margin: 48px 0;
        }
        /* Call-out box: any paragraph wrapped as .callout via Tiptap or inline */
        .article-body .callout,
        .article-body aside {
          background: #FDF9EF;
          border-left: 3px solid #C9A84C;
          padding: 24px 28px;
          margin: 36px 0;
          border-radius: 0 4px 4px 0;
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 20px;
          color: #1A1A1A;
        }
        .article-body .callout p,
        .article-body aside p {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 20px;
        }
      `}</style>

      {/* ── RELATED ARTICLES ── */}
      {related.length > 0 && (
        <section style={{
          borderTop: "1px solid #E8E5DE",
          background: "#F5F0E8",
          padding: "80px 24px",
        }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <div style={{
              display: "flex", alignItems: "baseline", justifyContent: "space-between",
              marginBottom: 48, flexWrap: "wrap", gap: 16,
            }}>
              <h2 style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "clamp(28px, 3.5vw, 40px)",
                fontWeight: 600,
                color: "#0A0A0A",
                margin: 0,
                letterSpacing: "-0.01em",
              }}>
                À lire également
              </h2>
              <Link href="/rubriques" style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 12, fontWeight: 600,
                textTransform: "uppercase", letterSpacing: "0.12em",
                color: "#C9A84C", textDecoration: "none",
                display: "flex", alignItems: "center", gap: 6,
              }}>
                Toutes les rubriques <ChevronRight size={14} />
              </Link>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 40 }}>
              {related.map((r) => (
                <Link key={r.id} href={`/rubriques/${r.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                  <div style={{ cursor: "pointer" }}>
                    <div style={{
                      aspectRatio: "4/3", overflow: "hidden", borderRadius: 4,
                      marginBottom: 20, background: "#E8E5DE",
                    }}>
                      {r.cover_image ? (
                        <img src={r.cover_image} alt={r.title} style={{
                          width: "100%", height: "100%", objectFit: "cover",
                          transition: "transform 0.6s",
                        }}
                          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                        />
                      ) : (
                        <div style={{
                          width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center",
                          color: "#9A9A8A", fontFamily: "'Cormorant Garamond', serif", fontSize: 20,
                        }}>AFRIKHER</div>
                      )}
                    </div>

                    <div style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 10, fontWeight: 700,
                      textTransform: "uppercase", letterSpacing: "0.12em",
                      color: "#C9A84C",
                      marginBottom: 10,
                    }}>
                      {typeLabel(r.type)}
                    </div>

                    <h3 style={{
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      fontSize: 24, fontWeight: 600, color: "#0A0A0A",
                      lineHeight: 1.25, margin: "0 0 10px",
                      letterSpacing: "-0.005em",
                    }}>
                      {r.title}
                    </h3>

                    {r.excerpt && (
                      <p style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: 14, color: "#6B7280", lineHeight: 1.65,
                        margin: 0,
                        display: "-webkit-box", WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical", overflow: "hidden",
                      }}>
                        {r.excerpt}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── FOOTER ── */}
      <footer style={{
        padding: "32px 24px", borderTop: "1px solid #E8E5DE",
        textAlign: "center", fontFamily: "'DM Sans', sans-serif",
        fontSize: 13, color: "#9A9A8A", background: "#FAFAF8",
      }}>
        &copy; {new Date().getFullYear()} AFRIKHER. Tous droits réservés.
      </footer>
    </div>
  );
}
