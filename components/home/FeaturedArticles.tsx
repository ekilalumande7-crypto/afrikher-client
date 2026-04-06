"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

interface ArticleRaw {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  cover_image: string;
  published_at: string;
  category_id: string;
  categories: { name: string; slug: string } | { name: string; slug: string }[] | null;
}

interface Rubrique {
  name: string;
  slug: string;
  article?: {
    title: string;
    slug: string;
    cover_image: string;
    excerpt: string;
  };
}

export default function FeaturedArticles() {
  const [rubriques, setRubriques] = useState<Rubrique[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function load() {
      try {
        // Load categories
        const { data: cats } = await supabase
          .from("categories")
          .select("id, name, slug, description")
          .order("created_at", { ascending: true })
          .limit(6);

        // Load latest published articles with their category
        const { data: articles } = await supabase
          .from("articles")
          .select("id, title, slug, excerpt, cover_image, published_at, category_id, categories(name, slug)")
          .eq("status", "published")
          .order("published_at", { ascending: false })
          .limit(10);

        // Map: category_id -> latest article
        const articleByCategory: Record<string, ArticleRaw> = {};
        if (articles) {
          for (const a of articles as ArticleRaw[]) {
            if (a.category_id && !articleByCategory[a.category_id]) {
              articleByCategory[a.category_id] = a;
            }
          }
        }

        // Build rubriques: prefer categories that have articles, fill up to 3
        const result: Rubrique[] = [];
        const usedIds = new Set<string>();

        // First pass: categories with articles
        if (cats) {
          for (const cat of cats as Category[]) {
            if (result.length >= 3) break;
            const art = articleByCategory[cat.id];
            if (art) {
              result.push({
                name: cat.name,
                slug: cat.slug,
                article: {
                  title: art.title,
                  slug: art.slug,
                  cover_image: art.cover_image,
                  excerpt: art.excerpt,
                },
              });
              usedIds.add(cat.id);
            }
          }
        }

        // Second pass: categories without articles (fill to 3)
        if (cats) {
          for (const cat of cats as Category[]) {
            if (result.length >= 3) break;
            if (!usedIds.has(cat.id)) {
              result.push({ name: cat.name, slug: cat.slug });
            }
          }
        }

        setRubriques(result);
      } catch (err) {
        console.error("Featured articles error:", err);
      }
    }
    load();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Placeholder images for categories without articles
  const placeholderImages = [
    "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=800&auto=format&fit=crop",
  ];

  return (
    <div
      ref={sectionRef}
      className="min-h-screen flex flex-col justify-center bg-[#0A0A0A] text-[#F5F0E8]"
    >
      <div className="w-full px-6 md:px-10 py-12 md:py-0">
        <div className="max-w-[1200px] mx-auto">
          {/* Header */}
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

          <div className="h-[1px] bg-white/[0.06] mb-8" />

          {/* 3 Rubriques Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {rubriques.map((rub, index) => (
              <Link
                key={rub.slug}
                href={rub.article ? `/rubriques/${rub.article.slug}` : `/rubriques`}
                className={`group relative overflow-hidden bg-[#151515] aspect-[3/4] md:aspect-[2/3] transition-all duration-1000 ease-out ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${0.15 + index * 0.12}s` }}
              >
                {/* Image */}
                <img
                  src={rub.article?.cover_image || placeholderImages[index] || placeholderImages[0]}
                  alt={rub.name}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-[1.5s] group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
                  <span className="text-[#C9A84C] font-body font-medium uppercase tracking-[0.2em] text-[0.5rem] mb-2 block">
                    {rub.name}
                  </span>
                  {rub.article ? (
                    <h3 className="text-lg md:text-xl font-display font-light text-[#F5F0E8] leading-tight group-hover:text-[#C9A84C] transition-colors duration-500">
                      {rub.article.title}
                    </h3>
                  ) : (
                    <h3 className="text-lg md:text-xl font-display italic text-[#F5F0E8]/40 leading-tight">
                      Contenu à venir
                    </h3>
                  )}
                </div>
              </Link>
            ))}

            {/* If less than 3, fill with placeholder cards */}
            {rubriques.length < 3 && Array.from({ length: 3 - rubriques.length }).map((_, i) => (
              <div
                key={`placeholder-${i}`}
                className={`relative overflow-hidden bg-[#151515] border border-white/[0.04] aspect-[3/4] md:aspect-[2/3] flex flex-col items-center justify-center text-center p-6 transition-all duration-1000 ease-out ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${0.4 + i * 0.12}s` }}
              >
                <div className="w-8 h-[1px] bg-[#C9A84C]/20 mb-5" />
                <p className="text-[#F5F0E8]/15 font-display italic text-[0.9rem] leading-snug">
                  Contenu à venir
                </p>
                <div className="w-8 h-[1px] bg-[#C9A84C]/10 mt-5" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
