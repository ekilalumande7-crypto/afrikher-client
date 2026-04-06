"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ShoppingBag, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";

// ══════════════════════════════════════════════
// TYPES
// ══════════════════════════════════════════════

interface Product {
  id: string;
  name: string;
  description: string;
  price: number | null;
  external_url: string | null;
  images: string[];
  type: string;
  stock: number;
  unlimited: boolean;
  status: string;
}

const readTime = (text: string) => {
  const words = text.split(/\s+/).filter(Boolean).length;
  return `${Math.max(2, Math.ceil(words / 180))} min`;
};

export default function ProductDetailPage({ id: idParam }: { id: string }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  // ══════════════════════════════════════════════
  // FETCH
  // ══════════════════════════════════════════════

  useEffect(() => {
    async function fetchProduct() {
      try {
        const { createClient } = await import("@supabase/supabase-js");
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        if (!supabaseUrl || !supabaseKey) throw new Error("No Supabase config");

        const supabase = createClient(supabaseUrl, supabaseKey);

        // Fetch product
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("id", idParam)
          .single();

        if (error || !data) {
          setProduct(null);
          setLoading(false);
          return;
        }

        const prod: Product = { ...data, images: data.images || [] };
        setProduct(prod);

        // Fetch related (same type, max 3, exclude current)
        const { data: relatedData } = await supabase
          .from("products")
          .select("*")
          .eq("status", "active")
          .eq("type", prod.type)
          .neq("id", prod.id)
          .limit(3);

        if (relatedData) {
          setRelated(relatedData.map((p: any) => ({ ...p, images: p.images || [] })));
        }
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [idParam]);

  // ══════════════════════════════════════════════
  // EXTERNAL LINK
  // ══════════════════════════════════════════════

  const handleVisitPartner = () => {
    if (!product?.external_url) return;
    window.open(product.external_url, "_blank", "noopener,noreferrer");
  };

  // ══════════════════════════════════════════════
  // LOADING
  // ══════════════════════════════════════════════

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F5F0E8]">
        <div className="fixed top-0 left-0 right-0 h-20 bg-[#0A0A0A] z-[90]" />
        <Navbar />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="w-10 h-10 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin" />
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-[#F5F0E8]">
        <div className="fixed top-0 left-0 right-0 h-20 bg-[#0A0A0A] z-[90]" />
        <Navbar />
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <ShoppingBag size={48} className="text-[#9A9A8A]/30 mb-4" />
          <p className="font-body text-[#9A9A8A] font-medium">Produit introuvable</p>
          <Link href="/boutique" className="font-body text-sm text-[#C9A84C] hover:underline mt-3">
            Retour à la boutique
          </Link>
        </div>
      </main>
    );
  }

  const images = product.images.length > 0 ? product.images : [];

  return (
    <main className="min-h-screen bg-[#F5F0E8] text-[#0A0A0A]">
      <div className="fixed top-0 left-0 right-0 h-20 bg-[#0A0A0A] z-[90]" />
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 pt-28 pb-4 md:px-10 lg:px-12">
        <div className="flex items-center font-body text-xs text-[#9A9A8A]">
          <Link href="/" className="hover:text-[#C9A84C] transition-colors">Accueil</Link>
          <span className="mx-2">›</span>
          <Link href="/boutique" className="hover:text-[#C9A84C] transition-colors">Boutique</Link>
          <span className="mx-2">›</span>
          <span className="text-[#0A0A0A] line-clamp-1">{product.name}</span>
        </div>
      </div>

      <section className="pb-16 md:pb-20">
        <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-12">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] md:gap-12 lg:gap-16">
            <div className="space-y-4">
              {images.length > 0 ? (
                <div className="relative aspect-[4/5] overflow-hidden bg-white">
                  <img
                    src={images[activeImage]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={() => setActiveImage(prev => prev === 0 ? images.length - 1 : prev - 1)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center bg-white/85 text-[#0A0A0A] transition-colors hover:bg-white"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button
                        onClick={() => setActiveImage(prev => prev === images.length - 1 ? 0 : prev + 1)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center bg-white/85 text-[#0A0A0A] transition-colors hover:bg-white"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </>
                  )}
                </div>
              ) : (
                <div className="flex aspect-[4/5] items-center justify-center bg-white">
                  <ShoppingBag size={64} className="text-[#9A9A8A]/20" />
                </div>
              )}

              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`aspect-[4/5] overflow-hidden border transition-all ${
                        activeImage === i ? 'border-[#C9A84C]' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col justify-center">
              <p className="font-body text-[0.68rem] font-medium uppercase tracking-[0.32em] text-[#C9A84C]">
                Sélection AFRIKHER
              </p>
              <h1 className="mt-4 font-display text-[2.6rem] leading-[0.96] tracking-[-0.025em] text-[#0A0A0A] md:text-[4rem]">
                {product.name}
              </h1>
              {product.description && (
                <p className="mt-5 font-body text-[0.96rem] leading-[1.8] text-[#2A2A2A]/78 whitespace-pre-line">
                  {product.description}
                </p>
              )}

              <div className="mt-8 border-t border-[#0A0A0A]/6 pt-6">
                <p className="max-w-[32rem] font-body text-sm leading-[1.75] text-[#0A0A0A]/58">
                  Une fiche pensée comme une note éditoriale : le produit est présenté avec sobriété, puis renvoie vers sa destination d’origine lorsque le lien partenaire est disponible.
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Link
                    href="/boutique"
                    className="inline-flex items-center justify-center border border-[#0A0A0A]/12 px-6 py-3 font-body text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-[#0A0A0A] transition-colors hover:border-[#C9A84C] hover:text-[#C9A84C]"
                  >
                    Retour boutique
                  </Link>
                  {product.external_url ? (
                    <button
                      onClick={handleVisitPartner}
                      className="inline-flex items-center justify-center gap-3 bg-[#0A0A0A] px-6 py-3 font-body text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-[#F5F0E8] transition-colors hover:bg-[#C9A84C] hover:text-[#0A0A0A]"
                    >
                      <span>Voir le produit</span>
                      <ExternalLink size={15} />
                    </button>
                  ) : null}
                </div>
                {product.external_url ? (
                  <p className="mt-4 font-body text-[0.72rem] uppercase tracking-[0.16em] text-[#8D877C]">
                    Vous serez redirigée vers la boutique partenaire
                  </p>
                ) : (
                  <p className="mt-4 font-body text-sm italic text-[#8D877C]">
                    Le lien partenaire n&apos;est pas encore disponible.
                  </p>
                )}
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4 border-t border-[#0A0A0A]/6 pt-6 md:max-w-[26rem]">
                <div>
                  <p className="font-body text-[0.66rem] uppercase tracking-[0.24em] text-[#C9A84C]">
                    Lecture
                  </p>
                  <p className="mt-2 font-body text-sm text-[#0A0A0A]/72">
                    {readTime(product.description || product.name)}
                  </p>
                </div>
                <div>
                  <p className="font-body text-[0.66rem] uppercase tracking-[0.24em] text-[#C9A84C]">
                    Format
                  </p>
                  <p className="mt-2 font-body text-sm text-[#0A0A0A]/72">
                    Sélection produit
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="border-t border-[#0A0A0A]/5 py-16 md:py-18">
          <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-12">
            <div className="mb-10 max-w-[32rem]">
              <p className="mb-2 font-body text-xs tracking-[0.35em] uppercase text-[#C9A84C]">
                Découvrir aussi
              </p>
              <h2 className="font-display text-[2.2rem] leading-[0.98] tracking-[-0.02em] text-[#0A0A0A] md:text-[2.8rem]">
                D&apos;autres pièces dans la sélection
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-x-6 gap-y-10 md:grid-cols-2 xl:grid-cols-3">
              {related.map(p => (
                <Link key={p.id} href={`/boutique/${p.id}`} className="group block h-full no-underline">
                  <article className="flex h-full flex-col">
                  <div className="relative aspect-[4/5] overflow-hidden bg-white">
                    {p.images?.[0] ? (
                      <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#F5F0E8]">
                        <ShoppingBag size={24} className="text-[#9A9A8A]/20" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col pt-4">
                    <div className="min-h-[2.8rem]">
                      <h3 className="line-clamp-2 font-display text-[1.1rem] leading-[1.15] text-[#0A0A0A] transition-colors duration-300 group-hover:text-[#C9A84C]">
                        {p.name}
                      </h3>
                    </div>
                    <div className="min-h-[3.2rem]">
                      <p className="mt-2 line-clamp-2 font-body text-sm leading-[1.6] text-[#0A0A0A]/58">
                        {p.description || "Une autre pièce à explorer dans la sélection AFRIKHER."}
                      </p>
                    </div>
                    <span className="mt-4 inline-flex items-center gap-2 font-body text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-[#C9A84C]">
                      Découvrir
                      <ExternalLink size={12} />
                    </span>
                  </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}
