"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

const articles = [
  {
    id: "1",
    title: "L'ascension de l'entrepreneuriat féminin en Afrique de l'Ouest",
    excerpt: "Comment les femmes redéfinissent les codes du business à Dakar et Abidjan.",
    category: "Business",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop",
    date: "24 Mars 2026",
    slug: "entrepreneuriat-feminin-afrique-ouest",
    gridClass: "md:col-span-2 aspect-[16/10]"
  },
  {
    id: "2",
    title: "Mode & Identité : Le retour du pagne tissé",
    excerpt: "Exploration des racines textiles africaines.",
    category: "Style",
    image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=1974&auto=format&fit=crop",
    date: "20 Mars 2026",
    slug: "mode-identite-pagne-tisse",
    gridClass: "md:col-span-1 aspect-[3/4]"
  },
  {
    id: "3",
    title: "Investir dans la tech : Les secteurs porteurs",
    excerpt: "Où se cachent les prochaines licornes africaines ?",
    category: "Finance",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
    date: "15 Mars 2026",
    slug: "investir-tech-afrique-2026",
    gridClass: "md:col-span-1 aspect-[8/9]"
  },
  {
    id: "4",
    title: "Gastronomie : Le renouveau des saveurs ancestrales",
    excerpt: "Quand la tradition rencontre la modernité culinaire.",
    category: "Lifestyle",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2070&auto=format&fit=crop",
    date: "12 Mars 2026",
    slug: "gastronomie-saveurs-ancestrales",
    gridClass: "md:col-span-2 aspect-[16/9]"
  }
];

export default function FeaturedArticles() {
  return (
    <section className="py-24 px-6 md:px-12 bg-brand-cream text-brand-dark">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6 border-b border-brand-charcoal/10 pb-8">
          <div className="max-w-2xl">
            <span className="text-brand-gold font-body font-bold uppercase tracking-[0.3em] text-xs mb-4 block">Le Journal</span>
            <h2 className="text-4xl md:text-6xl font-display font-bold leading-tight tracking-tighter">
              À la une cette semaine
            </h2>
          </div>
          <Link href="/magazine" className="text-brand-dark font-body font-bold uppercase tracking-widest text-xs border-b-2 border-brand-gold pb-1 hover:text-brand-gold transition-all">
            Tout le journal
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.8 }}
              className={cn("group relative overflow-hidden bg-brand-charcoal", article.gridClass)}
            >
              <Link href={`/magazine/${article.slug}`} className="block w-full h-full">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                
                {/* Content Overlay */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
                  <span className="text-brand-gold font-body font-bold uppercase tracking-widest text-[10px] mb-2 block">
                    {article.category}
                  </span>
                  <h3 className="text-xl md:text-3xl font-display font-bold text-white leading-tight mb-2 group-hover:underline decoration-brand-gold underline-offset-4 transition-all">
                    {article.title}
                  </h3>
                  <p className="text-white/70 text-xs md:text-sm font-body line-clamp-2 max-w-lg opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                    {article.excerpt}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
