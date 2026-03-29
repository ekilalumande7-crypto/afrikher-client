"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";

const ARTICLES = [
  {
    category: "Entrepreneuriat",
    title: "L'art de bâtir un empire en partant de zéro",
    image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=2069&auto=format&fit=crop",
    date: "24 Mars 2026"
  },
  {
    category: "Lifestyle",
    title: "Retraites de luxe : Les perles cachées du continent",
    image: "https://images.unsplash.com/photo-1544161515-436cefd1f16d?q=80&w=2070&auto=format&fit=crop",
    date: "20 Mars 2026"
  },
  {
    category: "Culture",
    title: "La renaissance de l'art contemporain africain",
    image: "https://images.unsplash.com/photo-1531259683007-016a7b628fc3?q=80&w=1974&auto=format&fit=crop",
    date: "15 Mars 2026"
  }
];

export default function FeaturedSection() {
  return (
    <section className="py-24 px-6 md:px-12 bg-brand-beige">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-2xl">
            <span className="text-brand-gold font-body font-bold uppercase tracking-[0.3em] text-xs mb-4 block">
              À la une
            </span>
            <h2 className="text-4xl md:text-6xl font-display font-medium text-brand-dark leading-tight">
              Dernières parutions du <span className="italic">Journal</span>
            </h2>
          </div>
          <Link 
            href="/magazine" 
            className="text-brand-dark font-body font-bold uppercase tracking-widest text-sm border-b border-brand-dark pb-1 hover:text-brand-gold hover:border-brand-gold transition-all duration-300"
          >
            Voir tout le journal
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {ARTICLES.map((article, i) => (
            <motion.div
              key={article.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.2 }}
              className="group cursor-pointer"
            >
              <div className="relative aspect-[4/5] overflow-hidden mb-6">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover grayscale hover:grayscale-0 transition-all duration-700 scale-100 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 bg-brand-dark text-brand-gold px-3 py-1 text-[10px] font-body font-bold uppercase tracking-widest">
                  {article.category}
                </div>
              </div>
              <p className="text-brand-gray text-xs font-body uppercase tracking-widest mb-3">
                {article.date}
              </p>
              <h3 className="text-2xl font-display font-medium text-brand-dark group-hover:text-brand-gold transition-colors duration-300 leading-snug">
                {article.title}
              </h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
