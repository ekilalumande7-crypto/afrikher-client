"use client";

export const dynamic = "force-dynamic";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { motion } from "motion/react";
import { Clock } from "lucide-react";

const posts = [
  {
    id: "1",
    title: "Pourquoi l'Afrique est le continent de demain pour les femmes entrepreneures",
    excerpt: "Une analyse des opportunités uniques que le continent offre aux femmes ambitieuses qui osent entreprendre.",
    date: "25 Mars 2026",
    readTime: "6 min",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop",
    category: "Inspiration",
  },
  {
    id: "2",
    title: "Les 5 habitudes des femmes leaders africaines qui réussissent",
    excerpt: "Découvrez les rituels quotidiens et les stratégies qui distinguent les femmes d'influence sur le continent.",
    date: "20 Mars 2026",
    readTime: "4 min",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop",
    category: "Leadership",
  },
  {
    id: "3",
    title: "Comment lever des fonds en Afrique : guide pratique",
    excerpt: "Du bootstrapping aux investisseurs institutionnels, toutes les options de financement décryptées.",
    date: "15 Mars 2026",
    readTime: "8 min",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
    category: "Finance",
  },
];

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-brand-cream text-brand-dark">
      <Navbar />

      <section className="pt-40 pb-20 px-6 bg-brand-dark text-brand-cream">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-6xl md:text-8xl font-display font-bold mb-8">Blog</h1>
          <p className="text-brand-gold italic text-xl font-display max-w-2xl mx-auto">
            Réflexions, conseils et analyses pour les femmes qui bâtissent l'Afrique de demain.
          </p>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          {posts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <Link href={`/magazine/${post.id}`}>
                <div className="aspect-[4/3] overflow-hidden mb-6 bg-brand-charcoal">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="flex items-center space-x-4 mb-4">
                  <span className="text-brand-gold text-xs font-bold uppercase tracking-widest">{post.category}</span>
                  <span className="text-brand-gray text-xs flex items-center gap-1">
                    <Clock size={12} /> {post.readTime}
                  </span>
                </div>
                <h2 className="text-2xl font-display font-bold mb-4 group-hover:text-brand-gold transition-colors leading-tight">
                  {post.title}
                </h2>
                <p className="text-brand-gray text-sm leading-relaxed line-clamp-3">{post.excerpt}</p>
                <span className="block mt-4 text-xs text-brand-gray uppercase tracking-widest">{post.date}</span>
              </Link>
            </motion.article>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
