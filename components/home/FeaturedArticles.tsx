"use client";

import { useState, useEffect } from "react";
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
      }
    }
    loadArticles();
  }, []);

  // Grid layout classes for masonry-like effect
  const gridClasses = [
    "md:col-span-2 aspect-[16/10]",
    "md:col-span-1 aspect-[3/4]",
    "md:col-span-1 aspect-[4/5]",
    "md:col-span-2 aspect-[16/9]",
  ];

  if (articles.length === 0) return null;

  return (
    <section className="py-32 md:py-40 px-6 md:px-12 bg-[#0A0A0A] text-[#F5F0E8]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-[#C9A84C] font-body font-medium uppercase tracking-[0.4em] text-[0.6rem] mb-4 block">
              Éditorial
            </span>
            <h2 className="text-4xl md:text-6xl font-display font-light leading-[0.95] tracking-tight">
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
        <div className="h-[1px] bg-white/[0.06] mb-12" />

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {articles.map((article, index) => (
            <div
              key={article.id}
              className={`group relative overflow-hidden bg-[#2A2A2A] ${gridClasses[index] || "aspect-[4/3]"}`}
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
                <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
                  {article.category_name && (
                    <span className="text-[#C9A84C] font-body font-medium uppercase tracking-[0.2em] text-[0.55rem] mb-3 block">
                      {article.category_name}
                    </span>
                  )}
                  <h3 className="text-lg md:text-2xl font-display font-light text-[#F5F0E8] leading-tight group-hover:text-[#C9A84C] transition-colors duration-500">
                    {article.title}
                  </h3>
                  {article.published_at && (
                    <span className="text-[0.55rem] text-[#F5F0E8]/30 font-body tracking-[0.15em] uppercase mt-3">
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
      </div>
    </section>
  );
}
