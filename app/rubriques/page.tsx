"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

const rubriques = [
  {
    id: "business",
    title: "Business",
    description: "Stratégies, leadership et success stories de femmes entrepreneures africaines.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop",
  },
  {
    id: "style",
    title: "Style",
    description: "Mode, beauté et tendances à travers le prisme de l'élégance africaine.",
    image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=1974&auto=format&fit=crop",
  },
  {
    id: "finance",
    title: "Finance",
    description: "Investissement, épargne et indépendance financière pour les femmes.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: "culture",
    title: "Culture",
    description: "Art, gastronomie et patrimoine culturel du continent africain.",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: "lifestyle",
    title: "Lifestyle",
    description: "Bien-être, voyages et art de vivre à l'africaine.",
    image: "https://images.unsplash.com/photo-1512438248247-f0f2a5a8b7f0?q=80&w=1964&auto=format&fit=crop",
  },
];

export default function RubriquesPage() {
  return (
    <main className="min-h-screen bg-brand-cream text-brand-dark">
      <Navbar />

      <section className="pt-40 pb-20 px-6 bg-brand-dark text-brand-cream">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-6xl md:text-8xl font-display font-bold mb-8">Rubriques</h1>
          <p className="text-brand-gold italic text-xl font-display max-w-2xl mx-auto">
            Explorez nos univers thématiques, pensés pour inspirer et accompagner les femmes d'action.
          </p>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {rubriques.map((rubrique, index) => (
            <div
              key={rubrique.id}
              className="group"
            >
              <Link href={`/magazine?category=${rubrique.id}`}>
                <div className="aspect-[4/5] overflow-hidden mb-6 bg-brand-charcoal relative">
                  <img
                    src={rubrique.image}
                    alt={rubrique.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-brand-dark/40 group-hover:bg-brand-dark/20 transition-colors duration-500" />
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <h3 className="text-3xl font-display font-bold text-brand-cream mb-2">{rubrique.title}</h3>
                  </div>
                </div>
                <p className="text-brand-gray text-sm leading-relaxed">{rubrique.description}</p>
              </Link>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
