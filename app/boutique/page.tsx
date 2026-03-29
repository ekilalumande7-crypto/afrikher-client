"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/boutique/ProductCard";
import { Search, ListFilter as Filter } from "lucide-react";

const types = ["Tous", "Livre", "Fleurs", "Accessoire", "Autre"];

const products = [
  {
    id: "1",
    name: "L'Art de l'Ambition",
    price: "45.00",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1974&auto=format&fit=crop",
    type: "Livre"
  },
  {
    id: "2",
    name: "Bouquet 'Souveraine'",
    price: "85.00",
    image: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=2080&auto=format&fit=crop",
    type: "Fleurs"
  },
  {
    id: "3",
    name: "Agenda AFRIKHER 2026",
    price: "35.00",
    image: "https://images.unsplash.com/photo-1506784365847-bbad939e9335?q=80&w=2068&auto=format&fit=crop",
    type: "Accessoire"
  },
  {
    id: "4",
    name: "Stylo Plume 'Or Noir'",
    price: "120.00",
    image: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?q=80&w=1964&auto=format&fit=crop",
    type: "Accessoire"
  },
  {
    id: "5",
    name: "Coffret 'Éclat d'Afrique'",
    price: "150.00",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=2080&auto=format&fit=crop",
    type: "Autre"
  },
  {
    id: "6",
    name: "L'Héritage des Reines",
    price: "55.00",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=1974&auto=format&fit=crop",
    type: "Livre"
  }
];

export default function BoutiquePage() {
  const [activeType, setActiveType] = useState("Tous");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = products.filter(product => {
    const matchesType = activeType === "Tous" || product.type === activeType;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <main className="min-h-screen bg-brand-cream text-brand-dark">
      <Navbar />
      
      {/* Hero */}
      <section className="pt-40 pb-20 px-6 bg-brand-dark text-brand-cream">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-6xl md:text-8xl font-display font-bold mb-8">La Boutique</h1>
          <p className="text-brand-gold italic text-xl font-display max-w-2xl mx-auto">
            L'excellence à portée de main. Une sélection exclusive AFRIKHER.
          </p>
        </div>
      </section>

      {/* Filters & Search */}
      <section className="py-12 px-6 border-b border-brand-charcoal/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-wrap justify-center gap-6">
            {types.map(t => (
              <button
                key={t}
                onClick={() => setActiveType(t)}
                className={`text-sm uppercase tracking-widest pb-1 border-b-2 transition-all ${
                  activeType === t ? "border-brand-gold text-brand-gold" : "border-transparent text-brand-gray hover:text-brand-dark"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-b border-brand-charcoal/30 py-2 pl-2 pr-8 focus:outline-none focus:border-brand-gold transition-colors"
            />
            <Search size={18} className="absolute right-0 top-1/2 -translate-y-1/2 text-brand-gray" />
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-brand-gray italic">Aucun produit ne correspond à votre recherche.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
