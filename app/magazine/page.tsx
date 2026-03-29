"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Search, ChevronRight, ChevronLeft, Clock } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

const categories = ["Tous", "Business", "Style", "Finance", "Culture", "Lifestyle"];

const articles = [
  {
    id: "1",
    title: "L'ascension de l'entrepreneuriat féminin en Afrique de l'Ouest",
    excerpt: "Comment les femmes redéfinissent les codes du business à Dakar et Abidjan. Des centaines de femmes transforment l'économie locale avec une vision audacieuse.",
    category: "Business",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop",
    date: "24 Mars 2026",
    slug: "entrepreneuriat-feminin-afrique-ouest",
    source: "AFRIKHER News",
    time: "10 mins ago",
    readTime: "5 min read"
  },
  {
    id: "2",
    title: "Mode & Identité : Le retour du pagne tissé dans la haute couture",
    excerpt: "Exploration des racines textiles africaines à travers le prisme du luxe contemporain.",
    category: "Style",
    image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=1974&auto=format&fit=crop",
    date: "20 Mars 2026",
    slug: "mode-identite-pagne-tisse",
    source: "Style Hub",
    time: "1 hour ago",
    readTime: "3 min read"
  },
  {
    id: "3",
    title: "Investir dans la tech : Les secteurs porteurs pour 2026",
    excerpt: "De la fintech à l'agritech, où se cachent les prochaines licornes africaines ?",
    category: "Finance",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
    date: "15 Mars 2026",
    slug: "investir-tech-afrique-2026",
    source: "Tech Africa",
    time: "2 hours ago",
    readTime: "4 min read"
  },
  {
    id: "4",
    title: "Gastronomie : Le renouveau des saveurs ancestrales",
    excerpt: "Portrait de chefs qui subliment le terroir africain avec modernité.",
    category: "Culture",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop",
    date: "10 Mars 2026",
    slug: "gastronomie-saveurs-ancestrales",
    source: "Culture Mag",
    time: "3 hours ago",
    readTime: "6 min read"
  },
  {
    id: "5",
    title: "Leadership : Cultiver son réseau dans la diaspora",
    excerpt: "Les clés pour bâtir des ponts solides entre l'Afrique et le monde.",
    category: "Business",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop",
    date: "05 Mars 2026",
    slug: "leadership-reseau-diaspora",
    source: "AFRIKHER News",
    time: "5 hours ago",
    readTime: "4 min read"
  },
  {
    id: "6",
    title: "Bien-être : La sagesse des rituels de beauté africains",
    excerpt: "Quand les secrets de grand-mère deviennent des tendances mondiales.",
    category: "Lifestyle",
    image: "https://images.unsplash.com/photo-1512438248247-f0f2a5a8b7f0?q=80&w=1964&auto=format&fit=crop",
    date: "01 Mars 2026",
    slug: "bien-etre-rituels-beaute",
    source: "Life & Style",
    time: "10 hours ago",
    readTime: "5 min read"
  }
];

export default function JournalPage() {
  const [activeCategory, setActiveCategory] = useState("Tous");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredArticles = articles.filter(article => {
    const matchesCategory = activeCategory === "Tous" || article.category === activeCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredMain = articles[0];
  const featuredSide = articles.slice(1, 5);

  return (
    <main className="min-h-screen bg-white text-brand-dark">
      <Navbar />

      {/* News Ticker */}
      <div className="bg-brand-cream/30 border-b border-brand-charcoal/5 py-3 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex items-center overflow-hidden whitespace-nowrap">
          <span className="text-brand-gold font-body font-bold uppercase tracking-widest text-[10px] mr-4 shrink-0">
            News Update:
          </span>
          <div className="flex space-x-8 animate-marquee">
            <span className="text-xs font-body text-brand-dark/70">
              • AFRIKHER redéfinit les codes de l'entrepreneuriat avec audace et raffinement.
            </span>
            <span className="text-xs font-body text-brand-dark/70">
              • L'ascension de l'entrepreneuriat féminin en Afrique de l'Ouest.
            </span>
            <span className="text-xs font-body text-brand-dark/70">
              • Nouveau numéro disponible en boutique.
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        {/* Featured Section */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-20">
          {/* Main Featured */}
          <div className="lg:col-span-2 relative group">
            <div className="aspect-[16/10] overflow-hidden rounded-lg">
              <img
                src={featuredMain.image}
                alt={featuredMain.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            {/* Floating Card */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full max-w-md p-4 hidden md:block">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white p-8 shadow-2xl rounded-lg border border-brand-charcoal/5"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-brand-dark rounded-full flex items-center justify-center text-[10px] text-brand-gold font-bold">
                    AK
                  </div>
                  <span className="text-xs font-body font-bold text-brand-dark">{featuredMain.source}</span>
                  <span className="text-xs text-brand-gray">• {featuredMain.time}</span>
                </div>
                <h2 className="text-3xl font-display font-bold mb-4 leading-tight">
                  {featuredMain.title}
                </h2>
                <p className="text-brand-gray text-sm mb-6 line-clamp-3">
                  {featuredMain.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <Link href={`/magazine/${featuredMain.slug}`} className="text-brand-gold font-bold text-xs uppercase tracking-widest hover:underline">
                    Read More
                  </Link>
                  <div className="flex space-x-2">
                    <button className="p-1 hover:text-brand-gold transition-colors"><ChevronLeft size={16} /></button>
                    <button className="p-1 hover:text-brand-gold transition-colors"><ChevronRight size={16} /></button>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-brand-charcoal/5 text-[10px] text-brand-gray uppercase tracking-widest">
                  {featuredMain.date}
                </div>
              </motion.div>
            </div>
            {/* Mobile Content */}
            <div className="mt-6 md:hidden">
               <div className="flex items-center space-x-3 mb-2">
                  <span className="text-xs font-body font-bold text-brand-dark">{featuredMain.source}</span>
                  <span className="text-xs text-brand-gray">• {featuredMain.time}</span>
                </div>
                <h2 className="text-2xl font-display font-bold mb-3">{featuredMain.title}</h2>
                <Link href={`/magazine/${featuredMain.slug}`} className="text-brand-gold font-bold text-xs uppercase tracking-widest">Read More</Link>
            </div>
          </div>

          {/* Side List */}
          <div className="space-y-8">
            {featuredSide.map((article) => (
              <Link key={article.id} href={`/magazine/${article.slug}`} className="flex gap-4 group">
                <div className="w-24 h-24 shrink-0 overflow-hidden rounded-lg bg-brand-charcoal/5">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <div className="flex items-center space-x-2 mb-1">
                    <div className="w-4 h-4 bg-brand-dark rounded-full flex items-center justify-center text-[6px] text-brand-gold font-bold">AK</div>
                    <span className="text-[10px] font-bold text-brand-dark">{article.source}</span>
                    <span className="text-[10px] text-brand-gray">• {article.time}</span>
                  </div>
                  <h3 className="text-sm font-display font-bold leading-snug group-hover:text-brand-gold transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <div className="mt-2 flex items-center space-x-3">
                    <span className="text-[10px] text-brand-gold font-bold uppercase tracking-tighter">{article.category}</span>
                    <span className="text-[10px] text-brand-gray flex items-center gap-1">
                      <Clock size={10} /> {article.readTime}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Latest News Section */}
        <section className="py-12 border-t border-brand-charcoal/5">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-4xl font-display font-bold tracking-tighter">Latest News</h2>
            <Link href="/magazine" className="flex items-center gap-1 text-brand-gold font-bold text-xs uppercase tracking-widest hover:underline">
              See all <ChevronRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {filteredArticles.slice(0, 3).map((article) => (
              <div key={article.id} className="group">
                <Link href={`/magazine/${article.slug}`}>
                  <div className="aspect-video overflow-hidden rounded-xl mb-6 bg-brand-charcoal/5">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-6 h-6 bg-brand-dark rounded-full flex items-center justify-center text-[8px] text-brand-gold font-bold">AK</div>
                    <span className="text-xs font-body font-bold text-brand-dark">{article.source}</span>
                    <span className="text-xs text-brand-gray">• {article.time}</span>
                  </div>
                  <h3 className="text-2xl font-display font-bold mb-4 leading-tight group-hover:text-brand-gold transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-brand-gray text-sm mb-6 line-clamp-2 leading-relaxed">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center space-x-4">
                    <span className="text-xs text-brand-gold font-bold uppercase tracking-widest">{article.category}</span>
                    <span className="text-xs text-brand-gray flex items-center gap-1 uppercase tracking-widest">
                      <Clock size={12} /> {article.readTime}
                    </span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Categories & Search (Simplified for this layout) */}
        <section className="py-20 mt-12 border-t border-brand-charcoal/5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
            <div className="flex flex-wrap justify-center gap-6">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "text-xs uppercase tracking-widest pb-1 border-b-2 transition-all font-bold",
                    activeCategory === cat ? "border-brand-gold text-brand-gold" : "border-transparent text-brand-gray hover:text-brand-dark"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-b border-brand-charcoal/30 py-2 pl-2 pr-8 focus:outline-none focus:border-brand-gold transition-colors text-sm"
              />
              <Search size={16} className="absolute right-0 top-1/2 -translate-y-1/2 text-brand-gray" />
            </div>
          </div>

          {filteredArticles.length > 3 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {filteredArticles.slice(3).map(article => (
                <div key={article.id} className="group">
                  <Link href={`/magazine/${article.slug}`}>
                    <div className="aspect-[4/3] overflow-hidden rounded-lg mb-4 bg-brand-charcoal/5">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <h4 className="text-lg font-display font-bold group-hover:text-brand-gold transition-colors line-clamp-2">{article.title}</h4>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <Footer />
      
      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </main>
  );
}
