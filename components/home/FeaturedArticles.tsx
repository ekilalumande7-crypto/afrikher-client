"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Category {
  name: string;
  slug: string;
}

interface ArticleRaw {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  cover_image: string;
  published_at: string;
  categories: Category | Category[] | null;
}

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  cover_image: string;
  published_at: string;
  category_name?: string;
}

export default function FeaturedArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    async function loadArticles() {
      try {
        const { data } = await supabase
          .from("articles")
          .select("id, title, slug, excerpt, cover_image, published_at, categories(name, slug)")
          .eq("status", "published")
          .order("published_at", { ascending: false })
          .limit(4);

        if (data) {
          const mapped: Article[] = (data as ArticleRaw[]).map((a) => {
            const cat = Array.isArray(a.categories) ? a.categories[0] : a.categories;
            return {
              id: a.id,
              title: a.title,
              slug: a.slug,
              excerpt: a.excerpt,
              cover_image: a.cover_image,
              published_at: a.published_at,
              category_name: cat?.name || undefined,
            };
          });
          setArticles(mapped);
        }
      } catch (err) {
        console.error("Featured articles error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadArticles();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Grid layout classes for masonry-like effect
  const gridClasses = [
    "md:col-span-2 aspect-[16/10]",
    "md:col-span-1 aspect-[3/4]",
    "md:col-span-1 aspect-[4/5]",
    "md:col-span-2 aspect-[16/9]",
  ];

  // Placeholder categories for empty state
  const placeholderCategories = [
    "Iconiques",
    "Secteurs d'avenir",
    "Paroles d'expertes",
    "Start-up Stories",
  ];

  return (
    <section
      ref={sectionRef}
      className="py-16 md:py-24 px-6 md:px-10 bg-[#0A0A0A] text-[#F5F0E8]"
    >
      <div className="max-w-[1200px] mx-auto">
        {/* Section Header */}
        <div
          className={`flex flex-col md:flex-row items-start md:items-end justify-between mb-10 gap-4 transition-all duration-1000 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <div>
            <span className="text-[#C9A84C] font-body font-medium uppercase tracking-[0.4em] text-[0.55rem] mb-3 block">
              Éditorial
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-light leading-[0.95] tracking-tight">
              À la une
            </h2>
          </div>
          <Link
            href="/rubriques"
            className="group inline-flex items-center space-x-3 text-[#F5F0E8]/60 font-body font-medium uppercase tracking-[0.2em] text-[0.6rem] hover:text-[#C9A84C] transition-colors duration-300"
          >
            <span>Toutes les rubriques</span>
            <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>

        {/* Separator */}
        <div className="h-[1px] bg-white/[0.06] mb-8" />

        {/* Articles Grid OR Fallback */}
        {!loading && articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {articles.map((article, index) => (
              <div
                key={article.id}
                className={`group relative overflow-hidden bg-[#2A2A2A] ${gridClasses[index] || "aspect-[4/3]"} transition-all duration-1000 ease-out ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                }`}
                style={{ transitionDelay: `${0.1 + index * 0.1}s` }}
              >
                <Link href={`/rubriques/${article.slug}`} className="block w-full h-full">
                  {article.cover_image && (
                    <img
                      src={article.cover_image}
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105 grayscale group-hover:grayscale-0"
                      referrerPolicy="no-referrer"
                    />
                  )}
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-6">
                    {article.category_name && (
                      <span className="text-[#C9A84C] font-body font-medium uppercase tracking-[0.2em] text-[0.5rem] mb-2 block">
                        {article.category_name}
                      </span>
                    )}
                    <h3 className="text-base md:text-xl font-display font-light text-[#F5F0E8] leading-tight group-hover:text-[#C9A84C] transition-colors duration-500">
                      {article.title}
                    </h3>
                    {article.published_at && (
                      <span className="text-[0.5rem] text-[#F5F0E8]/30 font-body tracking-[0.15em] uppercase mt-2">
                        {new Date(article.published_at).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    )}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          /* Fallback: placeholder cards when no articles */
          <div
            className={`grid grid-cols-2 md:grid-cols-4 gap-3 transition-all duration-1000 ease-out ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            {placeholderCategories.map((cat, index) => (
              <div
                key={cat}
                className="relative aspect-[3/4] overflow-hidden bg-[#151515] border border-white/[0.04] flex flex-col items-center justify-center text-center p-6 group hover:border-[#C9A84C]/15 transition-all duration-500"
                style={{ transitionDelay: `${0.1 + index * 0.1}s` }}
              >
                <div className="w-8 h-[1px] bg-[#C9A84C]/20 mb-5" />
                <span className="text-[#C9A84C]/40 font-body font-medium uppercase tracking-[0.2em] text-[0.45rem] mb-3">
                  {cat}
                </span>
                <p className="text-[#F5F0E8]/15 font-display italic text-[0.85rem] leading-snug">
                  Contenu à venir
                </p>
                <div className="w-8 h-[1px] bg-[#C9A84C]/10 mt-5" />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
