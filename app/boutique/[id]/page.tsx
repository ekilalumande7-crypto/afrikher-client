"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/boutique/ProductCard";
import { motion } from "motion/react";
import { ShoppingBag, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const products = [
  {
    id: "1",
    name: "L'Art de l'Ambition",
    price: "45.00",
    description: "Un ouvrage de référence pour toutes les femmes qui souhaitent bâtir un empire avec élégance et détermination. Ce livre explore les stratégies de leadership, la gestion du temps et l'art de la négociation à travers le prisme de l'excellence africaine.",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1974&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1974&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=1974&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=2112&auto=format&fit=crop"
    ],
    type: "Livre",
    stock: 12,
    details: [
      "Format : 15x21 cm",
      "Pages : 240",
      "Papier : Premium 120g",
      "Couverture : Rigide avec dorure à l'or"
    ]
  }
];

export default function ProductDetailPage() {
  const { id } = useParams();
  const product = products.find(p => p.id === id) || products[0];
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id }),
      });
      const { url } = await res.json();
      if (url) window.location.href = url;
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-brand-cream text-brand-dark">
      <Navbar />

      <section className="pt-40 pb-24 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Gallery */}
          <div className="space-y-6">
            <div className="aspect-square overflow-hidden bg-brand-charcoal relative">
              <img
                src={product.gallery[activeImage]}
                alt={product.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-y-0 left-0 flex items-center">
                <button 
                  onClick={() => setActiveImage((prev) => (prev === 0 ? product.gallery.length - 1 : prev - 1))}
                  className="p-2 bg-brand-cream/80 text-brand-dark hover:bg-brand-cream transition-colors"
                >
                  <ChevronLeft size={24} />
                </button>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center">
                <button 
                  onClick={() => setActiveImage((prev) => (prev === product.gallery.length - 1 ? 0 : prev + 1))}
                  className="p-2 bg-brand-cream/80 text-brand-dark hover:bg-brand-cream transition-colors"
                >
                  <ChevronRight size={24} />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {product.gallery.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={cn(
                    "aspect-square overflow-hidden border-2 transition-all",
                    activeImage === i ? "border-brand-gold" : "border-transparent opacity-60 hover:opacity-100"
                  )}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="space-y-10">
            <div>
              <span className="text-brand-gold font-medium uppercase tracking-widest text-sm mb-4 block">
                {product.type}
              </span>
              <h1 className="text-5xl font-display font-bold mb-4">{product.name}</h1>
              <div className="flex items-center space-x-2 text-brand-gold mb-6">
                {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                <span className="text-brand-gray text-xs uppercase tracking-widest ml-2">(12 avis)</span>
              </div>
              <p className="text-3xl font-display text-brand-gold">{product.price} €</p>
            </div>

            <p className="text-brand-gray leading-relaxed font-light text-lg">
              {product.description}
            </p>

            <div className="space-y-4">
              <h4 className="text-xs uppercase tracking-widest font-bold text-brand-dark">Détails du produit</h4>
              <ul className="grid grid-cols-1 gap-2 text-sm text-brand-gray">
                {product.details.map((detail, i) => (
                  <li key={i} className="flex items-center space-x-2">
                    <div className="w-1 h-1 bg-brand-gold rounded-full" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-8 border-t border-brand-charcoal/10 flex flex-col space-y-4">
              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full py-5 bg-brand-dark text-brand-cream font-medium uppercase tracking-widest hover:bg-brand-gold hover:text-brand-dark transition-all duration-300 flex items-center justify-center space-x-3"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-brand-cream border-t-transparent animate-spin rounded-full" />
                ) : (
                  <>
                    <ShoppingBag size={20} />
                    <span>Acheter maintenant</span>
                  </>
                )}
              </button>
              <p className="text-center text-[10px] uppercase tracking-widest text-brand-gray">
                Paiement sécurisé par Stripe. Livraison en 3-5 jours ouvrés.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      <section className="py-24 px-6 border-t border-brand-charcoal/10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-display font-bold mb-12 text-center">Vous aimerez aussi</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {products.slice(0, 3).map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
