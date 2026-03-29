"use client";

import Link from "next/link";
import { ShoppingBag, ArrowRight } from "lucide-react";

const products = [
  {
    id: "1",
    name: "L'Art de l'Ambition",
    price: "45.00",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1974&auto=format&fit=crop",
    type: "Livre",
    isNew: true
  },
  {
    id: "2",
    name: "Bouquet 'Souveraine'",
    price: "85.00",
    image: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=2080&auto=format&fit=crop",
    type: "Fleurs",
    isNew: false
  },
  {
    id: "3",
    name: "Agenda AFRIKHER 2026",
    price: "35.00",
    image: "https://images.unsplash.com/photo-1506784365847-bbad939e9335?q=80&w=2068&auto=format&fit=crop",
    type: "Accessoire",
    isNew: true
  },
  {
    id: "4",
    name: "Coffret 'Éclat d'Afrique'",
    price: "120.00",
    image: "https://images.unsplash.com/photo-1596462502278-27bfad450216?q=80&w=2080&auto=format&fit=crop",
    type: "Beauté",
    isNew: false
  }
];

export default function BoutiquePreview() {
  return (
    <section className="py-32 px-6 md:px-12 bg-white text-brand-dark">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
          <div className="max-w-xl">
            <span className="text-brand-gold font-body font-bold uppercase tracking-[0.4em] text-[10px] mb-4 block">La Boutique Exclusive</span>
            <h2 className="text-5xl md:text-7xl font-display font-bold tracking-tighter leading-none">
              L'Essentiel <br /> <span className="text-brand-gold italic">AFRIKHER</span>
            </h2>
          </div>
          <div className="flex flex-col items-start md:items-end gap-6">
            <p className="text-brand-gray font-body text-sm md:text-right max-w-xs">
              Une sélection exclusive d'objets et d'ouvrages pensés pour accompagner votre quotidien d'entrepreneure.
            </p>
            <Link
              href="/boutique"
              className="group flex items-center space-x-3 text-brand-dark font-bold uppercase tracking-widest text-[10px] border-b border-brand-dark pb-1"
            >
              <span>Voir toute la collection</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="group"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-brand-charcoal/5 mb-6 rounded-sm">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                
                {product.isNew && (
                  <div className="absolute top-4 left-4 bg-brand-gold text-white text-[8px] font-bold uppercase tracking-widest px-2 py-1 rounded-full">
                    Nouveau
                  </div>
                )}

                <div className="absolute inset-0 bg-brand-dark/40 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center backdrop-blur-[2px]">
                  <Link
                    href={`/boutique/${product.id}`}
                    className="bg-white text-brand-dark px-6 py-3 rounded-full font-bold text-[10px] uppercase tracking-widest transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 flex items-center gap-2 hover:bg-brand-gold hover:text-white"
                  >
                    <ShoppingBag size={14} />
                    Ajouter au panier
                  </Link>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] uppercase tracking-[0.2em] text-brand-gold font-bold">{product.type}</span>
                  <span className="text-xs font-body font-bold">{product.price} €</span>
                </div>
                <h3 className="text-xl font-display font-bold group-hover:text-brand-gold transition-colors leading-tight">
                  {product.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
