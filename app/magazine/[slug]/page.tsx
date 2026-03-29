"use client";

export const dynamic = "force-dynamic";

import { useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ArticleCard from "@/components/articles/ArticleCard";
import { motion } from "motion/react";
import { Share2, Facebook, Twitter, Linkedin } from "lucide-react";

const articles = [
  {
    id: "1",
    title: "L'ascension de l'entrepreneuriat féminin en Afrique de l'Ouest",
    excerpt: "Comment les femmes redéfinissent les codes du business à Dakar et Abidjan.",
    content: `
      <p>L'entrepreneuriat féminin en Afrique de l'Ouest connaît une mutation sans précédent. Loin des clichés de l'économie informelle, une nouvelle génération de femmes d'affaires émerge, armée de diplômes internationaux et d'une vision globale.</p>
      <p>À Dakar, Abidjan ou Lagos, ces leaders transforment des secteurs traditionnels comme l'agriculture ou le textile en industries de pointe, tout en investissant massivement dans la technologie et les services financiers.</p>
      <p>Ce mouvement n'est pas seulement économique ; il est culturel. Ces femmes redéfinissent ce que signifie "réussir" sur le continent, en alliant performance financière et impact social durable.</p>
      <h3>L'éducation comme levier</h3>
      <p>L'accès à une formation de qualité reste le principal moteur de cette ascension. De plus en plus de programmes d'incubation dédiés aux femmes voient le jour, offrant non seulement du capital, mais aussi du mentorat et un réseau précieux.</p>
      <p>La diaspora joue également un rôle crucial, apportant expertise et investissements, créant ainsi un pont solide entre le continent et le reste du monde.</p>
    `,
    category: "Business",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop",
    date: "24 Mars 2026",
    slug: "entrepreneuriat-feminin-afrique-ouest",
    author: "Fatou Diallo"
  }
];

export default function ArticleDetailPage() {
  const { slug } = useParams();
  const article = articles.find(a => a.slug === slug) || articles[0];

  return (
    <main className="min-h-screen bg-brand-cream text-brand-dark">
      <Navbar />

      {/* Hero Image */}
      <div className="w-full h-[70vh] relative">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-brand-dark/30" />
      </div>

      <article className="max-w-4xl mx-auto px-6 -mt-32 relative z-10">
        <div className="bg-brand-cream p-12 md:p-20 shadow-2xl border border-brand-charcoal/5">
          <div className="text-center mb-12">
            <span className="text-brand-gold font-medium uppercase tracking-widest text-sm mb-4 block">
              {article.category}
            </span>
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-8 leading-tight">
              {article.title}
            </h1>
            <div className="flex items-center justify-center space-x-4 text-brand-gray text-sm uppercase tracking-widest">
              <span>Par {article.author}</span>
              <span className="w-1 h-1 bg-brand-gold rounded-full" />
              <span>{article.date}</span>
            </div>
          </div>

          <div 
            className="prose prose-lg max-w-none font-light leading-relaxed text-brand-charcoal space-y-6"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          <div className="mt-20 pt-12 border-t border-brand-charcoal/10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center space-x-6">
              <span className="text-xs uppercase tracking-widest text-brand-gray">Partager</span>
              <div className="flex space-x-4">
                <button className="text-brand-charcoal hover:text-brand-gold transition-colors"><Facebook size={20} /></button>
                <button className="text-brand-charcoal hover:text-brand-gold transition-colors"><Twitter size={20} /></button>
                <button className="text-brand-charcoal hover:text-brand-gold transition-colors"><Linkedin size={20} /></button>
                <button className="text-brand-charcoal hover:text-brand-gold transition-colors"><Share2 size={20} /></button>
              </div>
            </div>
            <Link href="/magazine" className="text-sm uppercase tracking-widest text-brand-gold border-b border-brand-gold pb-1">
              Retour au journal
            </Link>
          </div>
        </div>
      </article>

      {/* Related Articles */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-display font-bold mb-12 text-center">Articles Similaires</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {articles.slice(0, 3).map(a => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
